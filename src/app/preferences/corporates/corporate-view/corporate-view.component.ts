import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { CorporateService } from '../corporate.service';
import { CorporateModel } from '../models/corporate.model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
 

@Component({
  selector: 'app-corporate-view',
  templateUrl: './corporate-view.component.html',
  styleUrls: ['./corporate-view.component.scss']
})
export class CorporateViewComponent implements OnInit {
  isLoading = false;

  currentUser: PersonnelModel | any;
  
  corporate: CorporateModel;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService,
    private corporateService: CorporateService,
    public dialog: MatDialog,
    private toastr: ToastrService) {} 


  ngOnInit(): void {
    this.isLoading = true;
    let id = this.route.snapshot.paramMap.get('id');
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.corporateService.getOne(Number(id)).subscribe((res) => {
          this.corporate = res;
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
    if (confirm('Êtes-vous sûr de vouloir mettre en corbeil cet enregistrement ?')) {
      this.corporateService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Mise en corbeil avec succès!');
            this.router.navigate(['layouts/preferences/corporates']);
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        });
    }
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: any): void {
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

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}


@Component({
  selector: 'edit-corporate-dialog',
  templateUrl: './corporate-edit.html',
})
export class EditCorporateDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: PersonnelModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditCorporateDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private corporateService: CorporateService,
  ) {}
  
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      logo: '',
      corporate_name: '', // Nom de la corporate  
      nbre_employe: '', 
      rccm: '', 
      id_nat: '', 
      numero_impot: '', 
      numero_cnss: '', 
      responsable: '', 
      telephone: '',
      email: '', 
      adresse: '',
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.corporateService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            logo: item.logo,
            corporate_name: item.corporate_name, // Nom de la corporate
            nbre_employe: item.nbre_employe,
            rccm: item.rccm, 
            id_nat: item.id_nat, 
            numero_impot: item.numero_impot, 
            numero_cnss: item.numero_cnss, 
            responsable: item.responsable, 
            telephone: item.telephone,
            email: item.email, 
            adresse: item.adresse,
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
      this.corporateService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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
