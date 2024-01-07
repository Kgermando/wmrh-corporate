import { Component, Inject, OnInit } from '@angular/core';
import { PreferenceModel } from './models/reglage-model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ReglageService } from './reglage.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EditEntrepriseDialogBox } from 'src/app/admin/entreprise/entreprise-view/entreprise-view.component';
import { EditCorporateDialogBox } from '../corporates/corporate-view/corporate-view.component';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.component.html',
  styleUrls: ['./reglages.component.scss']
})
export class ReglagesComponent implements OnInit {
  isLoading = false;

  preference: PreferenceModel;

  currentUser: PersonnelModel | any;


  constructor(
    public themeService: CustomizerSettingsService, 
    private router: Router,
    private authService: AuthService,
    private reglageService: ReglageService,
    public dialog: MatDialog,
    private toastr: ToastrService
    ) {}


    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          console.log('code_entreprise', this.currentUser.code_entreprise); 
          this.reglageService.preference(this.currentUser.code_entreprise).subscribe({
            next: res => {
              this.preference = res; 
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              console.log('err', err);
              this.toastr.error('Oups!', 'Pas de réglage pour cet utilisateur.'); 
            }
          });
          
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });  
    }


    openEditEntrepriseDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditCorporateDialogBox, { 
        width: '600px',
        height: '100%',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          id: id
        }
      }); 
    }


    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, reglage: string, valeur: any): void {
      this.dialog.open(EditReglageDialogBox, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          reglage: reglage,
          valeur: valeur,
        }
      }); 
    } 
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
}



@Component({
  selector: 'edit-reglage-dialog',
  templateUrl: './reglage-edit.html',
})
export class EditReglageDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;

  formGroupEntreprise!: FormGroup;
 

  currentUser: PersonnelModel | any; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditReglageDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private reglageService: ReglageService,
  ) {}
  

  ngOnInit(): void {

    if (this.data['reglage'] == 'Date de paie') {
      this.formGroup = this.formBuilder.group({  
        date_paie: '', 
      });
    }
    if (this.data['reglage'] == 'CNSS QPP') {
      this.formGroup = this.formBuilder.group({  
        cnss_qpp: '',
      });
    }
    if (this.data['reglage'] == 'INPP') {
        this.formGroup = this.formBuilder.group({  
        inpp: '', 
      });
    }
    if (this.data['reglage'] == 'ONEM') {
      this.formGroup = this.formBuilder.group({  
        onem: '', 
      });
    }
    if (this.data['reglage'] == 'Cotisation syndicale') {
      this.formGroup = this.formBuilder.group({  
        cotisation_syndicale: '', 
      });
    } 
    if (this.data['reglage'] == 'CNSS QPO') {
      this.formGroup = this.formBuilder.group({  
        cnss_qpo: '', 
      });
    }
    if (this.data['reglage'] == 'Nbre max d\'enfants courverts') {
      this.formGroup = this.formBuilder.group({  
        nbr_max_enfant_courvert: '', 
      });
    }
    // if (this.data['reglage'] == 'Monnaie') {
    //   this.formGroup = this.formBuilder.group({  
    //     monnaie: '', 
    //   });
    // }
    if (this.data['reglage'] == 'Nbre d\'heures de travail') {
      this.formGroup = this.formBuilder.group({  
        nbre_heure_travail: '', 
      });
    }
    if (this.data['reglage'] == 'Taux dollard USD/CDF') {
      this.formGroup = this.formBuilder.group({  
        taux_dollard: '', 
      });
    }

    if (this.data['reglage'] == 'Prise en charge frais bancaire') {
      this.formGroup = this.formBuilder.group({  
        prise_en_charge_frais_bancaire: '', 
      });
    }

    if (this.data['reglage'] == 'Total des jours à prester') {
      this.formGroup = this.formBuilder.group({  
        total_jours_a_prester: '',
      });
    }
    
    if (this.data['reglage'] == 'Jour de l\'AN') {
      this.formGroup = this.formBuilder.group({  
        new_year: '', 
      });
    }
    if (this.data['reglage'] == 'Jour de Noêl') {
      this.formGroup = this.formBuilder.group({  
        noel: '', 
      });
    }
    if (this.data['reglage'] == 'Jour de Martyr') {
      this.formGroup = this.formBuilder.group({  
        martyr_day: '', 
      });
    }
    if (this.data['reglage'] == 'Jour de L.D. Kabila') {
      this.formGroup = this.formBuilder.group({  
        kabila_day: '', 
      });
    }
    if (this.data['reglage'] == 'Jour de P. Lumumba') {
      this.formGroup = this.formBuilder.group({  
        lumumba_day: '', 
      });
    }
    if (this.data['reglage'] == 'Jour de traval') {
      this.formGroup = this.formBuilder.group({  
        labour_day: '',
      });
    }
    if (this.data['reglage'] == 'Jour de liberation') {
      this.formGroup = this.formBuilder.group({  
        liberation_day: '',
      });
    }
    if (this.data['reglage'] == 'Jour de l\'independance') {
      this.formGroup = this.formBuilder.group({  
        indepence_day: '',
      });
    }
    if (this.data['reglage'] == 'Jour des parents')  {
      this.formGroup = this.formBuilder.group({  
        parent_day: '',
      });
    }
    if (this.data['reglage'] == 'Jour de S. kimbangu') {
      this.formGroup = this.formBuilder.group({  
        kimbangu_day: '',
      });
    }

    if (this.data['reglage'] == 'Prime de plus de 5 ans') {
      this.formGroup = this.formBuilder.group({  
        prime_ancien_5: '',
      });
    }

    if (this.data['reglage'] == 'Prime de plus de 10 ans') {
      this.formGroup = this.formBuilder.group({  
        prime_ancien_10: '',
      });
    }

    if (this.data['reglage'] == 'Prime de plus de 15 ans') {
      this.formGroup = this.formBuilder.group({  
        prime_ancien_15: '',
      });
    }

    if (this.data['reglage'] == 'Prime de plus de 20 ans') {
      this.formGroup = this.formBuilder.group({  
        prime_ancien_20: '',
      });
    }

    if (this.data['reglage'] == 'Prime de plus de 25 ans') {
      this.formGroup = this.formBuilder.group({  
        prime_ancien_25: '',
      });
    }


    if (this.data['reglage'] == 'Taux Barèmique de 3%') {
      this.formGroup = this.formBuilder.group({  
        bareme_3: '',
      });
    }

    if (this.data['reglage'] == 'Taux Barèmique de 15%') {
      this.formGroup = this.formBuilder.group({  
        bareme_15: '',
      });
    }

    if (this.data['reglage'] == 'Taux Barèmique de 30%') {
      this.formGroup = this.formBuilder.group({  
        bareme_30: '',
      });
    }

    if (this.data['reglage'] == 'SMIG') {
      this.formGroup = this.formBuilder.group({  
        smig: '',
      });
    }

    if (this.data['reglage'] == 'Courses transport') {
      this.formGroup = this.formBuilder.group({  
        courses_transport: '',
      });
    }

    if (this.data['reglage'] == 'Montant pour travailleur quadre') {
      this.formGroup = this.formBuilder.group({  
        montant_travailler_quadre: '',
      });
    }

    if (this.data['reglage'] == 'Montant pour travailleur non quadre') {
      this.formGroup = this.formBuilder.group({  
        montant_travailler_non_quadre: '',
      });
    }

    if (this.data['reglage'] == 'Prise en Compte paiement ce mois') {
      this.formGroup = this.formBuilder.group({
        pris_en_compte_mois_plus_1: '',
      });
    }

    if (this.data['reglage'] == 'Delai édition du bulletin') {
      this.formGroup = this.formBuilder.group({
        delai_edit_bulletin: '',
      });
    }
    

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
         

        if (this.data['reglage'] == 'Date de paie') {
          this.formGroup.patchValue({
            date_paie: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'CNSS QPP') {
          this.formGroup.patchValue({
            cnss_qpp: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'INPP') {
          this.formGroup.patchValue({
            inpp: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'ONEM') {
         
          this.formGroup.patchValue({
            onem: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Cotisation syndicale') {
          this.formGroup.patchValue({
            cotisation_syndicale: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'CNSS QPO') {
          this.formGroup.patchValue({
            cnss_qpo: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        } 

        if (this.data['reglage'] == 'Nbre max d\'enfants courverts') {
          this.formGroup.patchValue({
            nbr_max_enfant_courvert: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        // if (this.data['reglage'] == 'Monnaie') {
        //   this.formGroup.patchValue({
        //     monnaie: this.data['valeur'],
        //     signature: this.currentUser.matricule, 
        //     update_created: new Date(),
        //   });
        // }
        if (this.data['reglage'] == 'Nbre d\'heures de travail') {
          this.formGroup.patchValue({
            nbre_heure_travail: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Taux dollard USD/CDF') {
          this.formGroup.patchValue({
            taux_dollard: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Prise en charge frais bancaire') {
          this.formGroup.patchValue({
            prise_en_charge_frais_bancaire: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Total des jours à prester') { 
          this.formGroup.patchValue({
            total_jours_a_prester: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de l\'AN') {
          this.formGroup.patchValue({
            new_year: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de Noêl') {
          this.formGroup.patchValue({
            noel: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de Martyr') {
          this.formGroup.patchValue({
            martyr_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de L.D. Kabila') {
          this.formGroup.patchValue({
            kabila_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de P. Lumumba') {
          this.formGroup.patchValue({
            lumumba_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de traval') {
          this.formGroup.patchValue({
            labour_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de liberation') {
          this.formGroup.patchValue({
            liberation_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de l\'independance') {
          this.formGroup.patchValue({
            indepence_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour des parents') {
          this.formGroup.patchValue({
            parent_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }
        if (this.data['reglage'] == 'Jour de S. kimbangu') {
          this.formGroup.patchValue({
            kimbangu_day: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Prime de plus de 5 ans') {
          this.formGroup.patchValue({
            prime_ancien_5: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Prime de plus de 10 ans') {
          this.formGroup.patchValue({
            prime_ancien_10: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Prime de plus de 15 ans') {
          this.formGroup.patchValue({
            prime_ancien_15: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Prime de plus de 20 ans') {
          this.formGroup.patchValue({
            prime_ancien_20: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Prime de plus de 25 ans') {
          this.formGroup.patchValue({
            prime_ancien_25: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Taux Barèmique de 3%') {
          this.formGroup.patchValue({
            bareme_3: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          }); 
        }
    
        if (this.data['reglage'] == 'Taux Barèmique de 15%') {
          this.formGroup.patchValue({
            bareme_15: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          }); 
        }
    
        if (this.data['reglage'] == 'Taux Barèmique de 30%') {
          this.formGroup.patchValue({
            bareme_30: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'SMIG') {
          this.formGroup.patchValue({
            smig: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Courses transport') {
          this.formGroup.patchValue({
            courses_transport: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Montant pour travailleur quadre') {
          this.formGroup.patchValue({
            montant_travailler_quadre: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          }); 
        }
    
        if (this.data['reglage'] == 'Montant pour travailleur non quadre') {
          this.formGroup.patchValue({
            montant_travailler_non_quadre: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Prise en Compte paiement ce mois') {
          this.formGroup.patchValue({
            pris_en_compte_mois_plus_1: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        }

        if (this.data['reglage'] == 'Delai édition du bulletin') {
          this.formGroup.patchValue({
            delai_edit_bulletin: this.data['valeur'],
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        } 

      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  } 


  onSubmit() {
    try {
      this.isLoading = true;
      this.reglageService.updatePref(this.currentUser.code_entreprise, this.currentUser.matricule, this.formGroup.getRawValue())
      .subscribe({ 
        next: () => {
          this.isLoading = false;
          window.location.reload(); 
          this.toastr.success('Reglage enregistré!', 'Success!');
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      }); 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

}
