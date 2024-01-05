import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-profil-presences-view',
  templateUrl: './profil-presences-view.component.html',
  styleUrls: ['./profil-presences-view.component.scss']
})
export class ProfilPresencesViewComponent implements OnInit {
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
