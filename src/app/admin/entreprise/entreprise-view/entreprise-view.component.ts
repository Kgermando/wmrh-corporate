import { Component, Inject, OnInit } from '@angular/core';
import { EntrepriseModel } from '../models/entreprise.model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from '../entreprise.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PersonnelService } from 'src/app/personnels/personnel.service'; 
import { RoleDataList } from 'src/app/shared/tools/role-list';
import { AbonnementAdminService } from '../../abonnement-admin/abonnement-admin.service';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';
import { bouquetDataList } from 'src/app/shared/tools/bouquet';

@Component({
  selector: 'app-entreprise-view',
  templateUrl: './entreprise-view.component.html',
  styleUrls: ['./entreprise-view.component.scss']
})
export class EntrepriseViewComponent implements OnInit {
  isLoading = false;
  currentUser: PersonnelModel | any;

  entreprise: EntrepriseModel;

  personnelsList: PersonnelModel[] = [];

  nbrEmploye = 0;

  roleList = RoleDataList;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private entrepriseService: EntrepriseService,
    private personnelService: PersonnelService,
    public dialog: MatDialog,
    private toastr: ToastrService,) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.entrepriseService.get(Number(id)).subscribe(res => {
            this.entreprise = res;
            this.personnelService.getAll(this.entreprise.code_entreprise).subscribe(personne => {
              this.personnelsList = personne;
              this.nbrEmploye = this.personnelsList.length; 
            });
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

    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(EditEntrepriseDialogBox, {
        width: '600px',
        height: '100%',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          id: id
        }
      }); 
    }

    openAddAbonnementDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(AddAbonnementDialogBox, {
        width: '600px',
        height: '100%',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          id: id
        }
      }); 
    }  


    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.entrepriseService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Success!', 'Supprimé avec succès!');
              this.router.navigate(['/layouts/personnels/personnel-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          });
      }
    }
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
}





@Component({
  selector: 'edit-entreprise-dialog',
  templateUrl: './entreprise-edit.html',
})
export class EditEntrepriseDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditEntrepriseDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private entrepriseService: EntrepriseService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      logo: '',
      company_name: '',
      nbre_employe: '',
      numero_cnss: '',
      rccm: '',
      id_nat: '',
      numero_impot: '',
      responsable: '',
      telephone: '',
      email: '',
      adresse: '',
      statut: '',
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.entrepriseService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            logo: item.logo,
            company_name: item.company_name,
            nbre_employe: item.nbre_employe,
            numero_cnss: item.numero_cnss,
            rccm: item.rccm,
            id_nat: item.id_nat,
            numero_impot: item.numero_impot,
            responsable: item.responsable,
            telephone: item.telephone,
            email: item.email,
            adresse: item.adresse,
            statut: item.statut,
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
      this.entrepriseService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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



@Component({
  selector: 'add-abonnement-dialog',
  templateUrl: './abonnement-add.html', 
})
export class AddAbonnementDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  monnaieList = monnaieDataList;
  bouquetList = bouquetDataList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddAbonnementDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private abonnementAdminService: AbonnementAdminService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      devise: ['', Validators.required],
      taux_devise: ['', Validators.required],
      montant: ['', Validators.required],
      reference: ['', Validators.required],
      responsable: ['', Validators.required],
      bouquet: ['', Validators.required],
      dure_paiement: ['', Validators.required],
      bordereau: [''],
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
  } 


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          entreprise: parseInt(this.data['id']),
          devise: this.formGroup.value.devise,
          taux_devise: this.formGroup.value.taux_devise,
          montant: this.formGroup.value.montant,
          reference: this.formGroup.value.reference,
          responsable: this.formGroup.value.responsable,
          bouquet: this.formGroup.value.bouquet,
          dure_paiement: this.formGroup.value.dure_paiement,
          bordereau: this.formGroup.value.bordereau,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date()
        };
        this.abonnementAdminService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Success!', 'Ajouté avec succès!'); 
            window.location.reload();
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

}
