import { Injectable } from "@angular/core";
//import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';

import { User } from '../core/interfaces';

@Injectable()
export class AuthService {

  // db: firebase.database.Database ;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) { 

   // this.db = firebase.database();

    
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
      // .then(() => {
      //   // this.router.navigate(['<!-- enter your route name here -->']);
      //   console.log("in...");

      // })
  }

  // doFacebookLogin(){
  //   return new Promise<any>((resolve, reject) => {
  //     let provider = new firebase.auth.FacebookAuthProvider();
  //     this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(res => {
  //       resolve(res);
  //     }, err => {
  //       console.log(err);
  //       reject(err);
  //     })
  //   })
  // }

  // doTwitterLogin(){
  //   return new Promise<any>((resolve, reject) => {
  //     let provider = new firebase.auth.TwitterAuthProvider();
  //     this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(res => {
  //       resolve(res);
  //     }, err => {
  //       console.log(err);
  //       reject(err);
  //     })
  //   })
  // }

  // doGoogleLogin(){
  //   return new Promise<any>((resolve, reject) => {
  //     let provider = new firebase.auth.GoogleAuthProvider();
  //     provider.addScope('profile');
  //     provider.addScope('email');
  //     this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(res => {
  //       resolve(res);
  //     }, err => {
  //       console.log(err);
  //       reject(err);
  //     })
  //   })
  // }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          this.SendVerificationMail()
            .then(() => {
              resolve(res);
            })
            .catch(err => {
              reject({
                "message": "Sending verification email failed"
              });
            });
          //resolve(res);
        }, err => reject(err))
    })
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          if (res.user.emailVerified !== true) {
            console.log("Please verify your email");
            //this.SendVerificationMail();
            reject({
              "message": "Please verify your email"
            });
          } else {
            resolve(res);
          }

        }, err => reject(err))
    })
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut()
        .then(()=>{
          resolve();
        })
        .catch(()=>{
          reject();
        });
      } else {
        reject();
      }
    });
  }

  createUser(userId: string, name: string, email: string, addresss: string, contact: string){

      return new Promise<any>((resolve, reject) => {
          this.db.database.ref('users/' + userId).set({
              fullName: name,
              email: email,
              address: addresss,
              contact: contact
          }).then((res) => {
            resolve(res);
          })
            .catch((err) => {
                reject(err);
            });
      })
  }

  getUserDetailsById(userId: string) {
    return new Promise<any>((resolve, reject) => {
      const userRef = this.db.database.ref('users');
      userRef.on('value', (snapshot) =>{
        snapshot.forEach((childSnapshot) => {
          console.log(childSnapshot);
          if(childSnapshot.key === userId){
            resolve(childSnapshot.val());
          }
        });
    }, (error) => {
      reject(error);
    });
    })
  }

  updateUserDetails(userId: string, updateData: Object){
    const updates = {};
    updates['/users/' + userId] = updateData;

    return new Promise<any>((resolve, reject) => {
      this.db.database.ref().update(updates)
      .then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      });
    })

  }

  /**
   * Checks if the user is logged in
   */
  isLoggedIn(): boolean{
    if(firebase.auth().currentUser){
      return true;
    }
    return false;
  }

  signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();

    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        resolve(user);

        // ...
      }).catch((error)=> {
        // Handle Errors here.
        //var errorCode = error.code;
        // var errorMessage = error.message;
        reject(error.message);
        // The email of the user's account used.
        //var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        //var credential = error.credential;
        // ...
      });
    })
  }

}
