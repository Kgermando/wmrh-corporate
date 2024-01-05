import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { AbonnementAdminService } from '../abonnement-admin.service';
import { AbonnementAdminModel } from '../models/abonnement.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';
import { bouquetDataList } from 'src/app/shared/tools/bouquet';

@Component({
  selector: 'app-abonnement-admin-view',
  templateUrl: './abonnement-admin-view.component.html',
  styleUrls: ['./abonnement-admin-view.component.scss']
})
export class AbonnementAdminViewComponent implements OnInit {
  isLoading = false;

  abonnement: AbonnementAdminModel;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private AbonnementAdminService: AbonnementAdminService,
    public dialog: MatDialog,) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
      this.AbonnementAdminService.get(Number(id)).subscribe(res => {
        this.abonnement = res;
        this.isLoading = false; 
      });
    }


    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditAbonnementAdminDialogBox, {
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
  selector: 'edit-abonnement-dialog',
  templateUrl: './abonnement-edit.html',
})
export class EditAbonnementAdminDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  monnaieList = monnaieDataList;
  bouquetList = bouquetDataList ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditAbonnementAdminDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private AbonnementAdminService: AbonnementAdminService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      devise: '',
      taux_devise: '',
      montant: '',
      reference: '',
      responsable: '',
      bouquet: '',
      dure_paiement: '',
      bordereau: '',
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.AbonnementAdminService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            devise: item.devise,
            taux_devise: item.taux_devise,
            montant: item.montant,
            reference: item.reference,
            responsable: item.responsable,
            bouquet: item.bouquet,
            dure_paiement: item.dure_paiement,
            bordereau: item.bordereau,
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
      this.AbonnementAdminService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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

