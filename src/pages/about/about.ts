import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Item } from "../../models/item/item.model";
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  item: Item = {
    titre:"",
    description:"",
    src:"",
    type:"",
    key:""
  };

  types = [
    {
      value: "alimentation",
      text: "Alimentation"
    },
    {
      value: "hygiène",
      text: "Hygiène"
    },
    {
      value: "multimédia",
      text: "Multimédia"
    }
  ];
   
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public afDB: AngularFireDatabase) {
  }

  ionViewDidLeave(){
   this.item.titre = "";
   this.item.description="";
   this.item.src="";
   this.item.type="";
  }

  confirmation () {
      let alert = this.alertCtrl.create({
        title: 'L\'article a été ajouté à votre liste',
        subTitle: this.item.titre,
        buttons: ['OK']
      });
      alert.present();
  }

  ajouter(item: Item) {
    console.log('hello world');
    console.log('fff' + item.type);
    switch (item.type) {
      case "alimentation":
        item.src = "../../assets/imgs/food1.png";
        console.log(item.src);
        break;
      case "hygiène":
        item.src = "../../assets/imgs/hygiene1.png";
        break;
      case "multimédia":
        item.src = "../../assets/imgs/multimedia1.png";
        break;
      default:
        item.src = "../../assets/imgs/panier1.png";
    }
    item.key = this.generatePushID();
    //setting custom key
    const toSend = this.afDB.object(`/wishlist/${item.key}`);
    //set item into firebase
    toSend.set(item);
    //go back to home page
    this.confirmation();
    this.navCtrl.push(AboutPage); 
   }


  generatePushID = (function () {
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    var lastPushTime = 0;

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    var lastRandChars = [];

    return function () {
      var now = new Date().getTime();
      var duplicateTime = (now === lastPushTime);
      lastPushTime = now;

      var timeStampChars = new Array(8);
      for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
        // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
        now = Math.floor(now / 64);
      }
      if (now !== 0) throw new Error('We should have converted the entire timestamp.');

      var id = timeStampChars.join('');

      if (!duplicateTime) {
        for (i = 0; i < 12; i++) {
          lastRandChars[i] = Math.floor(Math.random() * 64);
        }
      } else {
        // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
        for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
          lastRandChars[i] = 0;
        }
        lastRandChars[i]++;
      }
      for (i = 0; i < 12; i++) {
        id += PUSH_CHARS.charAt(lastRandChars[i]);
      }
      if (id.length != 20) throw new Error('Length should be 20.');

      return id;
    };
  })();
}
