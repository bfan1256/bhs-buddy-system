import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const databaseUrl = 'https://bhs-buddy-system.firebaseio.com';
const adminAccount = require('./admin_key.json');

admin.initializeApp({
    credential: admin.credential.cert(adminAccount),
    databaseURL: databaseUrl
});
const db = admin.firestore();

export const questionsAssigned = functions.firestore.document('users/{userId}/questions/{questionId}')
    .onWrite(async (snap, context) => {
        const uid = context.params.userId;
        let numQuestions = 0;
        const ref = db.collection('users').doc(uid);
        await ref.collection('questions').get()
            .then(questions => numQuestions = questions.docs.length);
        ref.update({ 'questionsAssigned': numQuestions });
    });


export const assignQuestion = functions.firestore
    .document('questions/{questionId}')
    .onCreate(async (snap, context) => {
        const qid = context.params.questionId;
        const data = snap.data();
        const ref = db.collection('users');
        let assignedUserID: string;
        await ref.orderBy('questionsAssigned').limit(1).get()
            .then(users => {
                assignedUserID = users[ 0 ].uid;
            });
        return ref.doc(assignedUserID)
            .collection('questions')
            .doc(qid)
            .set({ 'qid': qid, 'creatorID': data.creatorID });
    });