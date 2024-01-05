import { Component, Inject, OnInit } from '@angular/core';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PresentrepriseModel } from '../models/pres-entreprise-model';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PresEntrepriseService } from '../pres-entreprise.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';

@Component({
  selector: 'app-pres-entreprise-view',
  templateUrl: './pres-entreprise-view.component.html',
  styleUrls: ['./pres-entreprise-view.component.scss']
})
export class PresEntrepriseViewComponent implements OnInit {
  isLoading = false;

  currentUser: PersonnelModel | any;
  
  presEntreprise: PresentrepriseModel;

  preference: PreferenceModel;

  totalDejaPayE = 0;
  reste = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
      private authService: AuthService,
    private presEntrepriseService: PresEntrepriseService,
    private reglageService: ReglageService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
      
      this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
            this.presEntrepriseService.get(Number(id)).subscribe(res => {
              this.presEntreprise = res; 

              var moisDejaPayE = 0;

              moisDejaPayE = new Date().getMonth() - new Date(this.presEntreprise.date_debut).getMonth();

              this.totalDejaPayE = +this.presEntreprise.deboursement * moisDejaPayE;
              
              this.reste = +this.presEntreprise.total_empreints - this.totalDejaPayE;

            });
            this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
              this.preference = res; 
            });
        
          this.isLoading = false;
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
        this.presEntrepriseService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Success!', 'Supprimé avec succès!');
              this.router.navigate(['layouts/salaires/pres-entreprise']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          });
      }
    }

    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditPresEntrepriseDialogBox, {
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
  selector: 'edit-pres-entreprise-dialog',
  templateUrl: './pres-entreprise-edit.html',
})
export class EditPresEntrepriseDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  personneList: PersonnelModel[] = [];

  monnaieList = monnaieDataList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditPresEntrepriseDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private personnelService: PersonnelService,
      private presEntrepriseService: PresEntrepriseService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      intitule: [''],
      monnaie: [''],
      total_empreints: [''],
      deboursement: [''], 
      date_limit: [''], 
    }); 

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.personneList = res;
        });
        this.presEntrepriseService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            personnel: item.personnel,
            intitule: item.intitule,
            monnaie: item.monnaie,
            total_empreints: item.total_empreints,
            deboursement: item.deboursement,
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
      this.presEntrepriseService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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
