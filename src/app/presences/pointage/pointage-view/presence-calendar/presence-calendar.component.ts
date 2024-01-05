import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker'; 
import { PersonnelModel } from 'src/app/personnels/models/personnel-model'; 
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ApointementModel } from 'src/app/presences/models/presence-model';
@Component({
  selector: 'app-presence-calendar',
  templateUrl: './presence-calendar.component.html',
  styleUrls: ['./presence-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PresenceCalendarComponent implements OnInit {
  @Input('personne') personne: PersonnelModel; 
 
  apointementList: ApointementModel[] = [];

  appList: ApointementModel[] = [];

  constructor(
    public themeService: CustomizerSettingsService) { }


  ngOnInit(): void { }


  dateClass: MatCalendarCellClassFunction<Date>  = (cellDate, view) => {  
    let dataCSS = '';
      if(view == 'month') {
        for (let index of this.personne.presences) {
          const date = cellDate.getDate();
          const dateMonth = cellDate.getMonth();
          const dateYear = cellDate.getFullYear(); 
          const dy = new Date(index.date_entree);
          const day = dy.getDate();
          const dayMonth = dy.getMonth();
          const dayYear = dy.getFullYear(); 
          if (date === day && dateMonth === dayMonth && dateYear === dayYear) {
            if (index.apointement === 'P') {
              dataCSS = "present";
            } else if (index.apointement === 'A') {
              dataCSS = "absence-sans-autorisation";
            } else if (index.apointement === 'AA') {
              dataCSS = "absence-autorisee";
            } else if (index.apointement === 'AM') {
              dataCSS = "absent-maladie";
            } else if (index.apointement === 'CC') {
              dataCSS = "conge-circonstanciel";
            } else if (index.apointement === 'CA') {
              dataCSS = "conge-annuel";
            } else if (index.apointement === 'S') {
              dataCSS = "suspension";
            } else if (index.apointement === 'O') {
              dataCSS = "service-off";
            }else if (index.apointement === 'M') {
              dataCSS = "mission";
            }
          }
        } 
        return dataCSS;
      } 
    return '';
  } 
  
 
}
 

