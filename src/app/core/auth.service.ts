import { Injectable } from "@angular/core";
//import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';

import { User } from '../core/interfaces';
import { resolve } from 'url';
import { reject } from 'q';

import { ORDER_STATUS } from '../core/const';

@Injectable()
export class AuthService {

  // db: firebase.database.Database ;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public storage: AngularFireStorage
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
              contact: contact,
              userType: 1
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

  /**
   * create plans
   */
  createPlans(plans: any){
    
    //return new Promise<any>((resolve, reject) => {
      plans.forEach((plan, index)=>{
        this.db.database.ref('plans/' + index).set({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          per_meal_info: plan.per_meal_info
        })
      })
    }

    /**
     * create a subscription based on user
     *
     * Subscriptions
        ------
        Subscription ID
        Client ID
        Plan ID
        Subscription_start_timestamp
        Subscription_end_timestamp
     */
    addSubscription(planId: any, startDate: any, endDate: any, meals_avalilable: number){
      const userId = firebase.auth().currentUser.uid;
      return new Promise<any>((resolve, reject) => {
        this.db.database.ref('subscription/' + userId).set({
          subscription_id: userId,
          user_id: userId,
          plan_id: planId,
          subscription_start_timestamp: startDate,
          subscription_end_timestamp: endDate,
          meals_avalilable
        }).then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
      });
    }

    /**
     * 
     * @param userId 
     * checks if the user is subscribed
     *
     */
    isSubscribed(userId: string){
      return new Promise<any>((resolve, reject) => {
        const userRef = this.db.database.ref('subscription');
        userRef.on('value', (snapshot) =>{
          snapshot.forEach((childSnapshot) => {
            console.log(childSnapshot);
            if(childSnapshot.key === userId){
              resolve(true);
            }
          });
          resolve(false);
      }, (error) => {
        reject(error);
      });
      })
    }

    createRecipes(recipes: any[]){
        recipes.forEach((recipe, index)=>{
            this.db.database.ref('recipes/' + recipe.recipe_id).set({
              "publisher": recipe.publisher,
              "f2f_url": recipe.f2f_url,
              "title": recipe.title,
              "source_url": recipe.source_url,
              "recipe_id": recipe.recipe_id,
              "image_url": recipe.image_url,
              "social_rank": recipe.social_rank,
              "publisher_url": recipe.publisher_url
            });
        });
    }

    /**
     * Gets the recipes for searched term
     * @param searchTerm 
     */
    getRecipesBySearchTerm(searchTerm: string){
      const matchedRecipes = [];
      return new Promise<any>((resolve, reject) => {
        const recipesRef = this.db.database.ref('recipes');
        recipesRef.on('value', (snapshot) =>{
          snapshot.forEach((childSnapshot) => {
            // console.log(childSnapshot.val()["title"].toUpperCase());
            const title = childSnapshot.val()["title"].toUpperCase();
            if(title.indexOf(searchTerm.toUpperCase()) > -1){
              matchedRecipes.push(childSnapshot.val());
            }
          });
          resolve(matchedRecipes);
      }, (error) => {
        reject(error);
      });
      });
    }

    /**
     * Gets the download url for images stored in firebase storage
     * @param imgId 
     */
    getStorageUrl(imgId: string){

      return new Promise<any>((resolve, reject) => {
        this.storage.storage.ref('recipe_images/'+imgId+'.jpg').getDownloadURL().then( url =>{
          // console.log(url);
          resolve(url);
        }).catch((error)=> {
          // If anything goes wrong while getting the download URL, log the error
          console.error(error);
          reject("");
        });
      });
    }

    addOrder(receipe_id: string){
      const userId = firebase.auth().currentUser.uid;
      const timestamp = new Date().valueOf();
      return new Promise<any>((resolve, reject) => {
        this.db.database.ref('orders/' + timestamp).set({
            order_id: timestamp,
            order_date: timestamp,
            receipe_id,
            ordered_by: userId,
            delivery_address: "",
            status: 0,
            updated_timestamp: timestamp
        }).then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
      });
    }

    updateAvailableMeals(){
      // const updates = {};
      const userId = firebase.auth().currentUser.uid;
      // updates['/subscription/' + userId] = {meals_avalilable: 2};

      

      return new Promise<any>((resolve, reject) => {

        this.db.database.ref('/subscription/' + userId).once('value', (snapshot) =>{
         // snapshot.forEach((childSnapshot) => {
            let meals_available = snapshot.val()["meals_avalilable"];
            if(meals_available > 0){
              meals_available = meals_available - 1;
              
              this.db.database.ref('/subscription/' + userId).update({meals_avalilable: meals_available})
              .then(res=>{
                resolve(res);
              })
              .catch(err=>{
                reject(err);
              });
  
  
            }
            //});
          }, (error) => {
          });
      })
    }

    /**
     * get the order history for user
     * @param count 
     */
    getOrderHistory(count : number, status = null){
      const ordersRef = this.db.database.ref('orders');
      const recipeRef = this.db.database.ref('recipes');
      const userId = firebase.auth().currentUser.uid;
      const orderHistory = [];


      return new Promise<any>((resolve, reject) => {

        ordersRef.orderByChild("ordered_by").equalTo(userId).on("child_added", (snapshot)=> {
          const recipe_id = snapshot.val().receipe_id;
          const orderDetails = snapshot.val();
          recipeRef.child(recipe_id).child('title').once('value', (mediaSnap) =>{
            if(status != null){
              if(status === orderDetails.status){
                orderHistory.push({
                  ...orderDetails,
                  recipeName: mediaSnap.val()
                });
              }
            }else{
              orderHistory.push({
                ...orderDetails,
                recipeName: mediaSnap.val()
              });
            }
              
            if(count === orderHistory.length){
              resolve(orderHistory);
            }
          });
        });

      });
    }

    /**
     * gets the count of orders for user
     */
    getCount(status = null){
      const ordersRef = this.db.database.ref('orders');
      const userId = firebase.auth().currentUser.uid;
      let count = 0;
      return new Promise<any>((resolve, reject) => {
       
        const ordersRef = this.db.database.ref('orders');
        ordersRef.once('value', (snapshot) =>{
          snapshot.forEach((childSnapshot) => {
            const ordered_by = childSnapshot.val()["ordered_by"];
            if(status != null){
              if( ordered_by === userId && status === childSnapshot.val()["status"]){
                count++;
              }
            }else {
              if( ordered_by === userId ){
                count++;
              }
            }
          });
          resolve(count);
      }, (error) => {
        reject(error);
      });


      });
    }

    postFeedback(recipe_id, feedback){
      const userId = firebase.auth().currentUser.uid;
      const timestamp = new Date().valueOf();
      return new Promise<any>((resolve, reject) => {

        this.db.database.ref('users').orderByKey().equalTo(userId).once('value', snapshot =>{
          const user_name = snapshot.val()[userId].fullName;

          this.db.database.ref('feedbacks/' + timestamp).set({
            feedback_id: timestamp,
            recipe_id: recipe_id,
            feedback: feedback,
            user_id: userId,
            user_name: user_name,
            date: timestamp
          }).then((data) => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
        });
      });
    }

    getOpenOrders(status: number = 0, isAdmin: boolean = false){
      const userId = firebase.auth().currentUser.uid;

      const orders = [];
      return new Promise<any>((resolve, reject) => {
        const ordersRef = this.db.database.ref('orders');
        ordersRef.orderByChild('status').equalTo(status).once('value', (snapshot) =>{
          snapshot.forEach((childSnapshot) => {
            if(isAdmin){
              orders.push(childSnapshot.val());
            }else{
              if(userId === childSnapshot.val()["ordered_by"]){
                orders.push(childSnapshot.val());
              }
            }
          });
          resolve(orders);
      }, (error) => {
        reject(error);
      });
    });
  }

  getUsers(userType: number = 1){
    const users = [];
    return new Promise<any>((resolve, reject) => {
      const ordersRef = this.db.database.ref('users');
      ordersRef.orderByChild('userType').equalTo(userType).once('value', (snapshot) =>{
        snapshot.forEach((childSnapshot) => {
         users.push(childSnapshot.val());
        });
        resolve(users);
    }, (error) => {
      reject(error);
    });
  });

  
}


  updateOrderStatus(order_id: any, status, timestamp?: any){
    return new Promise<any>((resolve, reject) => {   
      this.db.database.ref('/orders/' + order_id).update({status: status, updated_timestamp: timestamp})
      .then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      });
    })
  }

  getSubscriptionDetails(){
     const userId = firebase.auth().currentUser.uid;
    // const userId = "CrflNbyBolUHhToOm7FOvdV5nSy1";
    return new Promise<any>((resolve, reject) => {
      const subscriptionRef = this.db.database.ref('subscription');
      subscriptionRef.orderByChild('user_id').equalTo(userId).once('value', (snapshot) =>{
        snapshot.forEach((childSnapshot) => {
         resolve(childSnapshot.val());
        });
    }, (error) => {
      reject(error);
    });
  });
  }

  cancelSubscription(){
    const userId = firebase.auth().currentUser.uid;
    return new Promise<any>((resolve, reject) => {
      const ref = this.db.database.ref('subscription');
      ref.child(userId).remove()
      .then(data => resolve())
      .catch(err => reject());
    });
  }

  /**
   * Delete a user account
   */
  deleteUserAccount(){
    this.deleteUserFromUserTable();
    const user = firebase.auth().currentUser;
    return new Promise<any>((resolve, reject) => {
      user.delete().then(()=> {
        // User deleted.
        resolve();
      }).catch((error)=> {
        // An error happened.
        reject();
      });
    });
  }

  deleteUserFromUserTable(){
    const userId = firebase.auth().currentUser.uid;
    return new Promise<any>((resolve, reject) => {
      const ref = this.db.database.ref('users');
      ref.child(userId).remove()
      .then(data => resolve())
      .catch(err => reject());
    });
  }

  /**
   * Get order details by id
   * @param orderId 
   */
  getOrderDetailsById(orderId: string){
    console.log("order id is... ", orderId);
    return new Promise<any>((resolve, reject) => {
      const orderRef = this.db.database.ref('orders');
      orderRef.child(orderId).once('value', (snapshot) =>{
        resolve(snapshot.val());
      }, (error) => {
        reject(error);
    });
  });
  }

  getRecipeDetailsById(recipeId: string){
    return new Promise<any>((resolve, reject) => {
      const reecipeRef = this.db.database.ref('recipes');
      reecipeRef.child(recipeId).once('value', (snapshot) =>{
        resolve(snapshot.val());
      }, (error) => {
        reject(error);
    });
  });
  }

  /**
   * Returns the available meals for user
   * @param subscriptionId 
   */
  getAvailableMeals(){
    const userId = firebase.auth().currentUser.uid;

    return new Promise<any>((resolve, reject) => {
      const subRef = this.db.database.ref('subscription');
      subRef.child(userId).once('value', (snapshot) =>{
        resolve(snapshot.val()["meals_avalilable"]);
      }, (error) => {
        reject(error);
      });
    });
  }

}
