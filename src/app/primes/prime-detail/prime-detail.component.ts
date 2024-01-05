import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { PrimeModel } from '../models/prime-model';
import { PrimeService } from '../prime.service';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';

@Component({
  selector: 'app-prime-detail',
  templateUrl: './prime-detail.component.html',
  styleUrls: ['./prime-detail.component.scss']
})
export class PrimeDetailComponent implements OnInit {
  isLoading = false;

  currentUser: PersonnelModel | any;
  
  prime: PrimeModel;

  preference: PreferenceModel;

  isValid = false; 
  isMoisSuivantValid = false;
  isMoisSuivantANValid = false;
  isMoisPrecedentValid = false;


  isMoisPrecedent = false;

  dateNow = new Date();  
  dateMonth = this.dateNow.getMonth();
  dateAN = this.dateNow.getFullYear(); 

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
      private authService: AuthService,
    private primeService: PrimeService,
    private reglageService: ReglageService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
      
      this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
            this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
              this.preference = res; 
            });
            this.primeService.get(Number(id)).subscribe(res => {
              this.prime = res;
              const created = new Date(this.prime.created);
              const moisSuivant = created.getMonth() + 1;
              const annee = created.getFullYear();
              this.isMoisSuivantValid = moisSuivant > this.dateMonth  && annee === this.dateAN; // Mois suivant pour payer
              this.isMoisSuivantANValid = moisSuivant > this.dateMonth && annee < this.dateAN;
              this.isValid = moisSuivant === this.dateMonth  && annee === this.dateAN; // Mois actual pour payer
              this.isMoisPrecedentValid  = created.getMonth() < this.dateMonth && annee === this.dateAN; // Deja bouffé!  

                 // Cette ligne ne prend pas en compte +1
              this.isMoisPrecedent = created.getMonth() + 1 < new Date().getMonth() + 1 && created.getFullYear() === new Date().getFullYear();
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
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.primeService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Success!', 'Supprimé avec succès!');
              this.router.navigate(['layouts/salaires/primes']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          });
      }
    }

    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditPrimeDialogBox, {
        width: '600px', 
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          id: id
        }
      }); 
    } 
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
}


@Component({
  selector: 'edit-prime-dialog',
  templateUrl: './prime-edit.html',
})
export class EditPrimeDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  personneList: PersonnelModel[] = [];


  monnaieList = monnaieDataList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditPrimeDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private personnelService: PersonnelService,
      private primeService: PrimeService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ 
      // personnel: [''],  // On ne modifie pas l'employé
      intitule: [''],
      monnaie: [''],
      montant: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.personneList = res;
        });
        this.primeService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            personnel: item.personnel,
            intitule: item.intitule,
            monnaie: item.monnaie,
            montant: item.montant,
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        });
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
      this.primeService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Modification enregistré!', 'Success!');
          window.location.reload(); 
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
