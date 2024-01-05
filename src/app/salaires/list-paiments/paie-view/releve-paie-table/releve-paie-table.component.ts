import { Component, Input } from '@angular/core'; 
import { PersonnelModel } from 'src/app/personnels/models/personnel-model'; 
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
@Component({
  selector: 'app-releve-paie-table',
  templateUrl: './releve-paie-table.component.html',
  styleUrls: ['./releve-paie-table.component.scss']
})
export class RelevePaieTableComponent { 
  @Input('personne') personne: PersonnelModel;
  @Input('preference') preference: PreferenceModel;
}
