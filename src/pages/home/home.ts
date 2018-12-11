import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController,ToastController } from 'ionic-angular';
import { AngularFireDatabase } from "@angular/fire/database";
import { Item } from '../../models/item/item.model';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
    
  items: Array<Object>;
  item : Item;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB: AngularFireDatabase, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl : ToastController) {
    afDB
      .list("/wishlist")
      .valueChanges()
      .subscribe((data) => {
        this.items = data;
        console.log("items",this.items);
      });

    this.item = navParams.get("data");
    console.log("item",this.item);
  }
   
  supprimer(key: number) {
    const toRemove = this.afDB.object(`/wishlist/${key}`);
    toRemove.remove();
    this.navCtrl.push(HomePage);
  }

  modifierTitre(item) {

    this.item = item;
    const alert = this.alertCtrl.create({
      title: "Modifier le titre",
      inputs: [{
        name: "titre",
        placeholder: "Titre"
      }],
      buttons: [{
          text: "Annuler",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Enregistrer",
          handler: data => {
            this.item.titre = data.titre;
            console.log(data.titre);
            this.updateToFirebase(this.item.key);
            console.log(data);
          }
        }
      ]
    });
    alert.present();
  }

  modifierDescription(item) {

    this.item = item;
    const alert = this.alertCtrl.create({
      title: "Modifier la description",
      inputs: [{
        name: "description",
        placeholder: "Description"
      }],
      buttons: [{
          text: "Annuler",
          handler: data => {
            console.log("Modification canceled");
          }
        },
        {
          text: "Enregistrer",
          handler: data => {
            this.item.description = data.description;
            this.updateToFirebase(this.item.key);
            console.log(data);
          }
        }
      ]
    });
    alert.present();
  }
  
  updateToFirebase(key: string) {
    const toUpdate = this.afDB.object(`/wishlist/${key}`);
    toUpdate.update(this.item);
  }
}
