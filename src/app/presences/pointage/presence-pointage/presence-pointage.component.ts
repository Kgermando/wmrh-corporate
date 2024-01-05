import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ApointementModel } from 'src/app/presences/models/presence-model';
import { PresenceService } from 'src/app/presences/presence.service';

@Component({
  selector: 'app-presence-pointage',
  templateUrl: './presence-pointage.component.html',
  styleUrls: ['./presence-pointage.component.scss']
})
export class PresencePointageComponent implements OnInit{
  @Input('item') item: PersonnelModel;

  presenceList: ApointementModel[] = [];
  presenceFilterDate: ApointementModel[] = [];
  presence: ApointementModel;

  isPToday = false;
  isAToday = false;
  isAAToday = false; 
  isAMToday = false;
  isCCToday = false;
  isCAToday = false;
  isCOToday = false;
  isSToday = false;
  isOToday = false;
  isMToday = false;

    constructor(
      public themeService: CustomizerSettingsService,
      private presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.presenceService.getLastItem(this.item.code_entreprise, this.item.matricule).subscribe(
      res => {
        this.presenceList = res; 
        this.presence = this.presenceList[0];


        const dateToday = new Date();
        const day = dateToday.getDate();
        const dayMonth = dateToday.getMonth();
        const dayYear = dateToday.getFullYear(); 
        // Date d'entree 
        const dateEntree = new Date(this.presence.date_entree);
        const dateEntreeDay = dateEntree.getDate();
        const dateEntreeMonth = dateEntree.getMonth();
        const dateEntreeYear = dateEntree.getFullYear(); 

        var datePresenceSortie = new Date(this.presence.date_sortie);
  
 
        if (this.presence.apointement === 'P') {
          if (dateEntreeDay === day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
            this.isPToday = true;
          }
        } else if(this.presence.apointement === 'A'){
          if (dateEntreeDay === day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
            this.isAToday = true;
          }
        } else if(this.presence.apointement === 'AA'){
          if (dateEntreeDay === day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
            this.isAAToday = true;
          }
        }
        
        
        else if(this.presence.apointement === 'AM'){
          if (datePresenceSortie > dateToday) {
            this.isAMToday = true;
          }
        } else if(this.presence.apointement === 'CC'){
          if (datePresenceSortie > dateToday) {
            this.isCCToday = true;
          } 
        } else if(this.presence.apointement === 'CA'){
          if (datePresenceSortie > dateToday) {
            this.isCAToday = true;
          }
        } else if(this.presence.apointement === 'CO'){
          if (datePresenceSortie > dateToday) {
            this.isCOToday = true;
          }
        } else if(this.presence.apointement === 'S'){
          if (datePresenceSortie > dateToday) {
            this.isSToday = true;
          }
        } else if(this.presence.apointement === 'O'){
          if (datePresenceSortie > dateToday) {
            this.isOToday = true;
          }
        } else if(this.presence.apointement === 'M'){
          if (datePresenceSortie > dateToday) {
            this.isMToday = true;
          }
        }
      }
    );
  }


}
