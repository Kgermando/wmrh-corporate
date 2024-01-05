import { Component, OnInit } from '@angular/core';
import { PersonnelModel } from '../models/personnel-model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonnelService } from '../personnel.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-personnel-view',
  templateUrl: './personnel-view.component.html',
  styleUrls: ['./personnel-view.component.scss']
})
export class PersonnelViewComponent implements OnInit {
  isLoading = false;

  personne: PersonnelModel;

  currentUser: PersonnelModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private personnelService: PersonnelService,
    private toastr: ToastrService) {}


    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.personnelService.get(Number(id)).subscribe(res => {
            this.personne = res;
            this.isLoading = false;
          });
          
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir mettre cet enregistrement dans le corbeil?')) {
        var personnel = { 
          is_delete: true, 
          signature: this.currentUser.matricule,
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.personnelService.update(this.personne.id, personnel).subscribe({
              next: () => {
              this.toastr.info('Mise en corbeil avec succès!', 'Success!');
              this.router.navigate(['/layouts/personnels/personnel-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
        });
        this.toastr.success('Mise en corbeil avec succès!', 'Success!');
        // this.personnelService
        //   .delete(id)
        //   .subscribe({
        //     next: () => {
        //       this.toastr.info('Supprimé avec succès!', 'Success!');
        //       this.router.navigate(['/layouts/personnels/personnel-list']);
        //     },
        //     error: err => {
        //       this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        //       console.log(err);
        //     }
        //   });
      }
    }

    resetStatutPaie(id: number) {
      this.isLoading = true;
      this.personnelService.resetStatutPaie(this.currentUser.code_entreprise, id).subscribe(() => {
        this.toastr.show('Reinitialisation effectuéé!', 'Success!');
        this.isLoading = false;
      })
    }
   
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
