import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { vapidKeys } from '../shared/tools/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService { 
  baseUrl: string = `${environment.apiURL}/notifications`;
  swPushpayload: any;

  constructor (private swPush: SwPush, private http: HttpClient,) {}

  subscribeToNotifications(): void {

      this.swPush.requestSubscription({
        serverPublicKey: vapidKeys.publicKey
      }).then((sub: PushSubscription) => {

        // Save the subscription object to your server
        this.saveSubscription(sub);

        // Store the subscription in local storage or any other storage mechanisme
        this.storeSubscription(sub);

        console.log('Display', JSON.stringify(sub)); // This will be required for the Nest.js backend to send notifications
      }).catch((err: any) => console.log('could not subscription to notification', err));

  }

  // subscribeToNotifications(): void {
  //   if (this.swPush.isEnabled) {
  //     this.swPush.requestSubscription({
  //       serverPublicKey: vapidKeys.publicKey
  //     }).then((sub: PushSubscription) => {

  //       // Save the subscription object to your server
  //       this.saveSubscription(sub);

  //       // Store the subscription in local storage or any other storage mechanisme
  //       this.storeSubscription(sub);

  //       console.log('Display', JSON.stringify(sub)); // This will be required for the Nest.js backend to send notifications
  //     }).catch((err: any) => console.log('could not subscription to notification', err));
  //   }
  // }

  unsubscribeFromPushNotification(): void {
    this.swPush.unsubscribe()
    .then(() => {
      console.log('Unsubscribed from push notifications.');
    })
    .catch((error) => {
      console.log('Error unsubscripting fro mpush notification', error); 
    });
  }

  subscribeMessage(): void {
    this.swPush.messages.subscribe((res: any) => {
      console.log('Received push notification', res);
    });
  }


  private saveSubscription(sub: PushSubscription): void {
    // Send the subscription object to your server for storing
    // You can make en HTTP request or use any other method to send the subscription data to your server
    this.http.post(this.baseUrl, { payload : sub }).subscribe((res) => console.log('Sent', res));
  }

  private storeSubscription(sub: PushSubscription): void {
    // Store the subscription in local storage or any other storage mechanism

    console.log('storeSubscription', sub);
  }



  // readonly VAPID_PUBLIC_KEY = '<VAPID-PUBLIC-KEY-HERE>';
  // private baseUrl = 'http://localhost:5000/notifications';
  
  // constructor(private http: HttpClient,
  //             private swPush: SwPush) {}  
              
              
  //   subscribeToNotification() {

  //     this.swPush.requestSubscription({
  //       serverPublicKey: this.VAPID_PUBLIC_KEY
  //   })
  //     .then(sub => this.sendToServer(sub))
  //     .catch(err => console.error('Could not subscribe to notifications', err));
  //   } 



  //  sendToServer(params: any) {
  //     this.http.post(this.baseUrl, { notification : params }).subscribe();
  //   }
}
