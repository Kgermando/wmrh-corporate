import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';

@Component({
  selector: 'app-reglage-admin',
  templateUrl: './reglage-admin.component.html',
  styleUrls: ['./reglage-admin.component.scss']
})
export class ReglageAdminComponent implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;

  preferenceList: PreferenceModel[] = [];
 

  constructor( 
      public themeService: CustomizerSettingsService,
      private reglageService: ReglageService,
      private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.reglageService.getAllReglage().subscribe(res => {
      this.preferenceList = res;
      this.isLoading = false;
    });
  }


 

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.reglageService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!');
            window.location.reload();
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        });
    }
  }
 

  toggleTheme() {
      this.themeService.toggleTheme();
  }
}

 