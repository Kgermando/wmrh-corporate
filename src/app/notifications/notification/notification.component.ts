import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  isEnabled = this.swPush.isEnabled;
  isGranted = Notification.permission === 'granted';
  
  constructor(private swPush: SwPush,
            // private webNotificationService: WebNotificationService
            ) {}
            
  submitNotification(): void {
    // this.webNotificationService.subscribeToNotification();
  }
}
