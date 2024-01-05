import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { HeureSuppModel } from '../models/heure-supp-model';
import { HeureSuppService } from '../heure-supp.service';

@Component({
  selector: 'app-heure-supp-detail',
  templateUrl: './heure-supp-detail.component.html',
  styleUrls: ['./heure-supp-detail.component.scss']
})
export class HeureSuppDetailComponent implements OnInit {
  isLoading = false;

  currentUser: PersonnelModel | any;
  
  heureSupp: HeureSuppModel;

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
    private heureSuppService: HeureSuppService, 
    public dialog: MatDialog,
    private toastr: ToastrService) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id'); 
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.heureSuppService.get(Number(id)).subscribe(res => {
            this.heureSupp = res;
            const created = new Date(this.heureSupp.created);
            const moisSuivant = created.getMonth() + 1;
            const annee = created.getFullYear();
            this.isMoisSuivantValid = moisSuivant > this.dateMonth  && annee === this.dateAN; // Mois suivant pour payer
            this.isMoisSuivantANValid = moisSuivant > this.dateMonth && annee < this.dateAN;
            this.isValid = moisSuivant === this.dateMonth  && annee === this.dateAN; // Mois actual pour payer
            this.isMoisPrecedentValid  = created.getMonth() < this.dateMonth && annee === this.dateAN; // Deja bouffé!  

            // Cette ligne ne prend pas en compte +1
            this.isMoisPrecedent  = created.getMonth() +1 < new Date().getMonth() + 1 && created.getFullYear() === new Date().getFullYear();
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
        this.heureSuppService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Success!', 'Supprimé avec succès!');
              this.router.navigate(['layouts/presences/heures-supp']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          });
      }
    }

    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditHeureSuppDialogBox, {
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
  selector: 'edit-Heure-supp-dialog',
  templateUrl: './Heure-supp-edit.html',
})
export class EditHeureSuppDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  personneList: PersonnelModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditHeureSuppDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private personnelService: PersonnelService,
      private heureSuppService: HeureSuppService,
  ) {}
  

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ 
      personnel: [''],
      motif: [''],
      nbr_heures: [''],
    });
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.personneList = res;
        });
        this.heureSuppService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            personnel: item.personnel,
            motif: item.motif,
            nbr_heures: item.nbr_heures,
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
      this.heureSuppService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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

  compareFn(c1: PersonnelModel, c2: PersonnelModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
