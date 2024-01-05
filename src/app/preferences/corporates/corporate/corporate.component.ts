import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CorporateModel } from '../models/corporate.model';
import { CorporateService } from '../corporate.service';
import { ReglageService } from '../../reglages/reglage.service';
import { PreferenceModel } from '../../reglages/models/reglage-model'; 

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent implements OnInit {

  isLoading = false;

  formGroup!: FormGroup;

  corporateList: CorporateModel[] = [];

  currentUser: PersonnelModel | any;
  
  preference: PreferenceModel;

  constructor(
    private router: Router,
      public themeService: CustomizerSettingsService,
      private authService: AuthService,
      private corporateService: CorporateService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.corporateService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.corporateList = res; 
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.corporateService
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

  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CoporateAddDialogBox, {
      width: '600px',
      height: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
    }); 
  }

  // openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
  //   this.dialog.open(EditCorporateDialogBox, {
  //     width: '600px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //     data: {
  //       id: id
  //     }
  //   }); 
  // } 


  toggleTheme() {
      this.themeService.toggleTheme();
  }
}



@Component({
  selector: 'coperate-dialog',
  templateUrl: './coperate-add.html',
})
export class CoporateAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  corporateList: CorporateModel[] = [];

  currentUser: PersonnelModel | any;
  
  preference: PreferenceModel;

  constructor( 
      public dialogRef: MatDialogRef<CoporateAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private corporateService: CorporateService,
      private reglageService: ReglageService
  ) {}
  


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
          this.preference = res; 
          this.corporateService.getAll(this.currentUser.code_entreprise).subscribe(res => {
            this.corporateList = res; 
            this.isLoading = false;
          });
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
    this.formGroup = this.formBuilder.group({ 
      // logo: ['', Validators.required],
      corporate_name: ['', Validators.required],  
      nbre_employe: ['', Validators.required],
      rccm: ['', Validators.required],
      id_nat: ['', Validators.required],
      numero_impot: ['', Validators.required],
      numero_cnss: ['', Validators.required],
      responsable: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', Validators.required],
      adresse: ['', Validators.required],
    }); 
 
  } 


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var code_corporate = '';
        var code = this.corporateList.length + 1;
        if (code <= 9) {
          code_corporate = `${ this.preference.company.code_entreprise}-00${code}`;
        } else if (code > 9 && code >= 99) {
          code_corporate = `${ this.preference.company.code_entreprise}-0${code}`;
        } else if (code > 99 && code >= 999) {
          code_corporate = `${ this.preference.company.code_entreprise}-${code}`;
        } 
        var body = {
          entreprise_id: this.preference.company.id,
          logo: '-',
          corporate_name: this.capitalizeText(this.formGroup.value.corporate_name), // Nom de la corporate 
          statut: true, // statut entreprise sous traitant
          code_corporate: code_corporate,
          nbre_employe: this.formGroup.value.nbre_employe, 
          rccm: this.formGroup.value.rccm, 
          id_nat: this.formGroup.value.id_nat, 
          numero_impot: this.formGroup.value.numero_impot, 
          numero_cnss: this.formGroup.value.numero_cnss, 
          responsable: this.formGroup.value.responsable, 
          telephone: this.formGroup.value.telephone,
          email: this.formGroup.value.email, 
          adresse: this.formGroup.value.adresse,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.corporateService.create(body).subscribe({ 
          next: (res) => { 
            var body = {
              company: res.id,
              date_paie: "2023-10-27 15:45:59.632",
              cnss_qpp: "13",
              inpp: "2",
              onem: "0.2",
              cotisation_syndicale: "1",
              cnss_qpo: "5",
              monnaie: "USD",
              nbre_heure_travail: "45",
              taux_dollard: "2500",
              new_year: "2024-01-01 15:45:59.632",
              noel: "2023-12-25 15:45:59.632",
              martyr_day: "2024-01-04 15:45:59.632",
              kabila_day: "2024-01-16 15:45:59.632",
              lumumba_day: "2024-01-17 15:45:59.632",
              labour_day: "2024-06-01 15:45:59.632",
              liberation_day: "2024-05-17 15:45:59.632", 
              indepence_day: "2024-06-30 15:45:59.632", 
              parent_day: "2023-08-01 15:45:59.632",
              kimbangu_day: "2024-05-06 15:45:59.632", 
              prime_ancien_0: 0,
              prime_ancien_5: 2,
              prime_ancien_10: 4,
              prime_ancien_15: 6,
              prime_ancien_20: 8,
              prime_ancien_25: 10,
              categorie_mo: 10,
              categorie_ts: 10,
              categorie_tsq: 10,
              categorie_tq: 10,
              categorie_thq: 10,
              smig: 267,
              prise_en_charge_frais_bancaire: 0,
              courses_transport: 6,
              montant_travailler_quadre: 2000,
              montant_travailler_non_quadre: 1500,
              bareme_3: 162000,
              bareme_15: 1800000,
              bareme_30: 3600000,
              nbr_course: 6,
              contre_valeur_logement: 30,
              signature: this.currentUser.matricule,
              created: "2023-10-12 08:45:59.632", 
              update_created: "2023-10-12 08:45:59.632", 
              entreprise: this.currentUser.entreprise,
              code_entreprise: res.code_corporate
            };
            this.reglageService.create(body).subscribe({
              next: (r) => {
                this.isLoading = false;
                this.formGroup.reset();
                this.toastr.success('Success!', 'Ajouté avec succès!'); 
                window.location.reload();
                // this.close();
              }
            });
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      } 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

  capitalizeText(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}



