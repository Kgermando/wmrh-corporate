import { Component, Input, OnInit } from '@angular/core';
import { PrimeModel } from '../models/prime-model';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';

@Component({
  selector: 'app-prime-filter',
  templateUrl: './prime-filter.component.html',
  styleUrls: ['./prime-filter.component.scss']
})
export class PrimeFilterComponent implements OnInit { 
  @Input('element') element: PrimeModel; 
 

  isValid = false; 
  isMoisSuivantValid = false;
  isMoisSuivantANValid = false;
  isMoisPrecedentValid = false;

  isMoisPrecedent = false;

  dateNow = new Date();  
  dateMonth = this.dateNow.getMonth();
  dateAN = this.dateNow.getFullYear(); 
 
   
  ngOnInit(): void {
    const created = new Date(this.element.created);
    const moisSuivant = created.getMonth() + 1;
    const annee = created.getFullYear();
    this.isMoisSuivantValid = moisSuivant > this.dateMonth  && annee === this.dateAN; // Mois suivant pour payer
    this.isMoisSuivantANValid = moisSuivant > this.dateMonth && annee < this.dateAN;
    this.isValid = moisSuivant === this.dateMonth  && annee === this.dateAN; // Mois actual pour payer
    this.isMoisPrecedentValid  = created.getMonth() < this.dateMonth && annee === this.dateAN; // Deja bouffé!  



    // Cette ligne ne prend pas en compte +1
    this.isMoisPrecedent = created.getMonth() +1 < new Date().getMonth() + 1 && created.getFullYear() === new Date().getFullYear();
  }
}
