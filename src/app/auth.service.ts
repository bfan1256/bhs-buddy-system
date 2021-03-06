import { switchMap } from 'rxjs/internal/operators';
import { firebase } from '@firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { EmailPasswordCredentials } from './interfaces/email-password.interface';
import { User } from './interfaces/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { questionsAssigned } from '../../functions/src/index';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = authState(afAuth.auth).pipe(
      switchMap(user => {
        if (user) {
          this.router.navigateByUrl('/dashboard');
          return this.afs.doc<User>(`users/${ user.uid }`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  private updateUserData(user): Promise<void> {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${ user.uid }`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      grade: user.grade,
      questionsAssigned: user.questionsAssigned,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });

  }

  emailSignUp(credentials: EmailPasswordCredentials, userData) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then((credential) => {
        userData.uid = credential.user.uid;
        this.updateUserData(userData);
      })
      .catch(error => console.log(error));
  }

  emailLogin(credentials: EmailPasswordCredentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        this.router.navigate([ '/dashboard' ]);
      })
      .catch(error => console.log(error));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate([ '/' ]);
    });
  }
}
