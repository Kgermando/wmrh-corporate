import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { EntrepriseService } from '../../entreprise/entreprise.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { RoleDataList } from 'src/app/shared/tools/role-list';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-reglage-admin-add',
  templateUrl: './reglage-admin-add.component.html',
  styleUrls: ['./reglage-admin-add.component.scss']
})
export class ReglageAdminAddComponent implements OnInit {

  isLoading: boolean = false; 

  isLoadingFormGroup: boolean = false; 
  formGroup!: FormGroup; 

  currentUser: PersonnelModel | any;
  

  roleList = RoleDataList;


  constructor( public themeService: CustomizerSettingsService, 
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private reglageService: ReglageService,
    private entrepriseService: EntrepriseService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.formGroup = this._formBuilder.group({
        company_name: ['', Validators.required],
        nbre_employe: ['', Validators.required],
        numero_cnss: ['', Validators.required],
        rccm: ['', Validators.required],
        id_nat: ['', Validators.required],
        numero_impot: ['', Validators.required],
        responsable: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', Validators.required],
        adresse: ['', Validators.required],
      });

      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }
    
    
    onSubmit() {
      try {
        if (this.formGroup.valid) {
          this.isLoadingFormGroup = true;
          var code = Math.floor(1000 + Math.random() * 9000);
          var data = {
            company_name: this.formGroup.value.company_name,
            nbre_employe: this.formGroup.value.nbre_employe,
            rccm: this.formGroup.value.rccm,
            id_nat: this.formGroup.value.id_nat,
            numero_impot: this.formGroup.value.numero_impot,
            numero_cnss: this.formGroup.value.numero_cnss,
            responsable: this.formGroup.value.responsable,
            telephone: this.formGroup.value.telephone,
            email: this.formGroup.value.email,
            adresse: this.formGroup.value.adresse,
            code_entreprise: code,
            statut: true,
            signature: this.currentUser.matricule,
            created: new Date(),
            update_created: new Date()
          };
          this.entrepriseService.create(data).subscribe({
            next: (company) => {
              var identifiant = `admin-${company.code_entreprise}`;
              var body = {
                nom: 'admin',
                postnom: 'admin',
                prenom: 'admin',
                email: 'admin@admin.com',
                telephone: '0000000000',
                sexe: 'Homme',
                adresse: '-', 
                matricule: identifiant.toLowerCase(),
                category: '-',
                roles: this.roleList,
                permission: 'CRUD',
                monnaie: 'USD',
                signature: this.currentUser.matricule,
                created: new Date(),
                update_created: new Date(),
                password: '1234',
                password_confirm: '1234',
                entreprise: company.company_name,
                code_entreprise: company.code_entreprise,
              };
              this.authService.register(body).subscribe({
                next: () => {
                  this.isLoadingFormGroup = false;
                  this.formGroup.reset();
                  this.toastr.success('Création de l\'entreprise reussi!', 'Success!');
                  this.router.navigate(['/layouts/support/entreprises']);
                },
                error: (err) => {
                  this.isLoadingFormGroup = false;
                  this.toastr.error('Une erreur de création admin!', 'Oupss!');
                  console.log(err);
                }
              }); 
            },
            error: (err) => {
              this.isLoadingFormGroup = false;
              this.toastr.error('Une erreur reglage!', 'Oupss!');
              console.log(err);
            }
          });
        } 
      } catch (error) {
        this.isLoadingFormGroup = false;
        console.log(error, 'Une erreur entreprise');
      }
    } 
  
}
