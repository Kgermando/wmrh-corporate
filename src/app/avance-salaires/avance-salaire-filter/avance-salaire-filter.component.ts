import { Component, Input, OnInit } from '@angular/core';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { AvanceSalaireModel } from '../models/avance-salaire-model';

@Component({
  selector: 'app-avance-salaire-filter',
  templateUrl: './avance-salaire-filter.component.html',
  styleUrls: ['./avance-salaire-filter.component.scss']
})
export class AvanceSalaireFilterComponent implements OnInit {
  @Input('element') element: AvanceSalaireModel; 

  isValid = false; 
  isMoisSuivantValid = false;
  isMoisSuivantANValid = false;
  isMoisPrecedentValid = false;

  dateNow = new Date();  
  dateMonth = this.dateNow.getMonth();
  dateAN = this.dateNow.getFullYear(); 
 
   
  ngOnInit(): void {
    const created = new Date(this.element.created);
    const moisSuivant = created.getMonth() + 1;
    const annee = created.getFullYear();
    this.isMoisSuivantValid = moisSuivant > this.dateMonth  && annee === this.dateAN; // Mois suivant pour payer
    this.isMoisSuivantANValid = moisSuivant > this.dateMonth && annee < this.dateAN;
    // this.isValid = moisSuivant === this.dateMonth && annee === this.dateAN; // Mois actual pour payer

    this.isValid = created.getMonth() === this.dateMonth && annee === this.dateAN
    this.isMoisPrecedentValid  = created.getMonth() < this.dateMonth && annee === this.dateAN; // Deja bouffé!  
  }
}
