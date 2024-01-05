import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HoraireService } from '../horaire.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { HoraireModel } from '../models/horaire-model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horaire-view',
  templateUrl: './horaire-view.component.html',
  styleUrls: ['./horaire-view.component.scss']
})
export class HoraireViewComponent {
  @Input('currentUser') currentUser: PersonnelModel;
  @Input('horaireList') horaireList: HoraireModel[];

  // isLoading = false; 

  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router, 
    private horairervice: HoraireService,
    private toastr: ToastrService
  ) {}


  edit(id: number): void {
    this.router.navigate(['/layouts/horaires', id, 'horaire-edit']);
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.horairervice
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!');
            this.router.navigate(['layouts/horaires']);
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        }
      );
    }
  }


  toggleTheme() {
    this.themeService.toggleTheme();
  } 
}
