
import {  
  Alert
} from 'react-native';

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

export default class notificaciones{ 

  static async getToken() {
    var token = await FCM.getFCMToken();  // fcm token may not be available on first load, catch it here
    //console.log('Token: ' + token);
    return token;
  }

  static async requestPermissionsNotification() {
     var permiso= await FCM.requestPermissions();
     //console.log('Permissions:' + permiso);
     return permiso;
  }

  static async localNotification(notif) { // This method display the notification on mobile screen.
    if (notif.fcm && notif.fcm.body) {
      this.getBadgeNumber().then((num)=>{
        this.setBadgeNumber(num+1);
      });
      await FCM.presentLocalNotification({
          title: notif.fcm.title || "Parking"  ,
          body: notif.fcm.body,
          priority: "high",
          show_in_foreground: true,
          large_icon: "logoipartek",
          icon: "logoipartek",       
          vibrate: 300,
          local: true,
          lights: true, 
          color:'red'      ,
          status: notif.status,
          wake_screen: true,  
      });
    }
  }

  static async listenerNotification() {

    this.setBadgeNumber(0); // Incializamos

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {

      if (notif.local_notification) {    //this is a local notification generada desde sendRemote --> local Notificacion         
        //console.log('(IN) local_notification...');
      } else { // recive notification in foreground 
        //console.log('(IN) foreground_notification...');
        //console.log(notif);       
        this.localNotification(notif); // Create local notification for showing in a foreground
      }     

    });

  }

  static async getInitialNotification(){
    var notif= await FCM.getInitialNotification(); // clicked banner or tapped app icon: from begin or foregroung 
    //console.log('(IN) getInitialNotification...');
    //console.log(notif);
  }

  static async subscribeToTopic(topic){
    topic = topic || '/topics/avisos';
    await FCM.subscribeToTopic(topic); // si no existe crea el tema en FCM (2 horas)   
  } 

  static async deleteListenerNotification() {
    await this.notificationListener.remove(); // stop listening for events
  }

  static async setBadgeNumber(number) {
    await FCM.setBadgeNumber(number);
  }

  static async getBadgeNumber() {
    var number = await FCM.getBadgeNumber();   
    return number;
  }

}