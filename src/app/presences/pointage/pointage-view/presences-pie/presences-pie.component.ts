import { Component, Input, OnInit } from '@angular/core';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';  

@Component({
  selector: 'app-presences-pie',
  templateUrl: './presences-pie.component.html',
  styleUrls: ['./presences-pie.component.scss']
})
export class PresencesPieComponent {
  @Input('personne') personne: PersonnelModel; 

  isSelect = 'Mois';
  
    onSelectChange(event: any) {
      console.log(event.value);
      if (event.value === 'Mois') {
        this.isSelect = 'Mois';
      } else if(event.value === 'Année') {
        this.isSelect = 'Année';
      } else if(event.value === 'All') {
        this.isSelect = 'All';
      }
       
    }
 

}
