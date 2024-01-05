import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-syndicat-view',
  templateUrl: './syndicat-view.component.html',
  styleUrls: ['./syndicat-view.component.scss']
})
export class SyndicatViewComponent implements OnInit {
  isLoading = false;

  personne: PersonnelModel;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private personnelService: PersonnelService) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
      this.personnelService.get(Number(id)).subscribe(res => {
        this.personne = res;
        this.isLoading = false; 
      });
    }
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
