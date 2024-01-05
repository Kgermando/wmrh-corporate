import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-pointage-view',
  templateUrl: './pointage-view.component.html',
  styleUrls: ['./pointage-view.component.scss']
})
export class PointageViewComponent implements OnInit {
  isLoading = false;

  personne: PersonnelModel;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private personnelService: PersonnelService
    ) {}

 
  ngOnInit(): void {
    this.isLoading = true;
    let matricule = this.route.snapshot.paramMap.get('matricule');  // this.route.snapshot.params['id'];
    this.personnelService.getMatricule(matricule).subscribe(pers => {
      this.personne = pers;
      this.isLoading = false; 
    }); 
  }
 
}
