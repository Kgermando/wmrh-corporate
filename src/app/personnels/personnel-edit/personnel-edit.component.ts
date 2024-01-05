import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonnelModel } from '../models/personnel-model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelService } from '../personnel.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { DepartementService } from 'src/app/preferences/departements/departement.service';
import { FonctionService } from 'src/app/preferences/fonction/fonction.service';
import { TitleService } from 'src/app/preferences/titles/title.service';
import { ServiceService } from 'src/app/preferences/services/service.service';
import { SiteLocationService } from 'src/app/preferences/site-location/site-location.service';
import { DepartementModel } from 'src/app/preferences/departements/model/departement-model';
import { FonctionModel } from 'src/app/preferences/fonction/models/fonction-model';
import { TitleModel } from 'src/app/preferences/titles/models/title-model';
import { ServicePrefModel } from 'src/app/preferences/services/models/service-models';
import { SiteLocationModel } from 'src/app/preferences/site-location/models/site-location-model';
import { permissionDataList } from 'src/app/shared/tools/permission-list';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';
import { CategoriepersonnelDataList } from 'src/app/shared/tools/categorie_personnel';
import { RoleDataList } from 'src/app/shared/tools/role-list';

@Component({
  selector: 'app-personnel-edit',
  templateUrl: './personnel-edit.component.html',
  styleUrls: ['./personnel-edit.component.scss']
})
export class PersonnelEditComponent implements OnInit {
  isLoading: boolean = false;

  formGroup!: FormGroup;
  formGroup2!: FormGroup;
  formGroup3!: FormGroup;
  formGroup4!: FormGroup;
  formGroup5!: FormGroup;

  currentUser: PersonnelModel | any;

  personne: PersonnelModel;

  typeContrat: string = 'CDD';

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];
  etatCivileList: string[] = [
    'Marié(e)', 'Celibataire', 'Divorcé(e)'
  ];

  roleList: string[] = RoleDataList;

  typeContratList: string[] = [
    'CDD', 'CDI'
  ];
 
  permissionList = permissionDataList;
  monnaieList = monnaieDataList;

  id: number;

  departementList: DepartementModel[] = [];
  fonctionList: FonctionModel[] = [];
  titleList: TitleModel[] = [];
  serviceList: ServicePrefModel[] = [];
  siteLocationList: SiteLocationModel[] = [];

  categoriList = CategoriepersonnelDataList;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private personnelService: PersonnelService,
    private departementService: DepartementService,
    private fonctionService: FonctionService,
    private titleService: TitleService,
    private serviceService: ServiceService,
    private siteLocation: SiteLocationService,
    private toastr: ToastrService) {}


  public onChange(event: MatSelectChange) { 
    this.typeContrat =  event.value;
    console.log(this.typeContrat ); 
  }


  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      nom: [''],
      postnom: [''],
      prenom: [''],
      email: [''],
      telephone: [''],
      sexe: [''],
      adresse: [''], 
      category: [''], 
    });

    this.formGroup2 = this._formBuilder.group({
      numero_cnss: [''],
      date_naissance: [''],
      lieu_naissance: [''],
      nationalite: [''],
      etat_civile: [''],
      nbr_dependants: [''],
    }); 

    this.formGroup3 = this._formBuilder.group({
      departements: [''],
      titles: [''],
      fonctions: [''],
      services: [''],
      site_locations: [''],
      type_contrat: [''],
      date_debut_contrat: [''],
      date_fin_contrat: ['2099-06-27 15:45:59.632'],
    });

    this.formGroup4 = this._formBuilder.group({
      monnaie: [''],
      salaire_base: [''],
      alloc_logement: [''],
      alloc_transport: [''],
      alloc_familliale: [''],
      soins_medicaux: [''],
      compte_bancaire: [''],
      nom_banque: [''],
      frais_bancaire: [''],  
      syndicat: [''],
      cv_url: [''], 
    });

    this.formGroup5 = this._formBuilder.group({
      statut_personnel: [''],
      roles: [''],
      permission: [''],
    });

    this.id = this.route.snapshot.params['id']; 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 

        this.departementService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.departementList = res; 
        });
        this.fonctionService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.fonctionList = res; 
        });
        this.titleService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.titleList = res; 
        });
        this.serviceService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.serviceList = res;
        });
        this.siteLocation.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.siteLocationList = res;
        });

        this.personnelService.get(this.id).subscribe(item => { 
          this.personne = item; 
          this.formGroup.patchValue({
            nom: this.capitalizeTest(item.nom),
            postnom: this.capitalizeTest(item.postnom),
            prenom: this.capitalizeTest(item.prenom),
            email: this.capitalizeTest(item.email),
            telephone: item.telephone,
            sexe: item.sexe,
            adresse: this.capitalizeTest(item.adresse),
            category: item.category,
            signature: this.currentUser.matricule, 
            update_created: new Date()
          });
          this.formGroup2.patchValue({ 
            numero_cnss: item.numero_cnss,
            date_naissance: item.date_naissance,
            lieu_naissance: item.lieu_naissance,
            nationalite: this.capitalizeTest(item.nationalite),
            etat_civile: item.etat_civile,
            nbr_dependants: item.nbr_dependants,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
          this.formGroup3.patchValue({
            departements: item.departements,
            titles: item.titles,
            fonctions: item.fonctions,
            services: item.services,
            site_locations: item.site_locations,
            type_contrat: item.type_contrat,
            date_debut_contrat: item.date_debut_contrat,
            date_fin_contrat: (this.typeContrat === 'CDI') ? '2099-01-01' : item.date_fin_contrat,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
          this.formGroup4.patchValue({ 
            monnaie: item.monnaie,
            salaire_base: (item.salaire_base) ? item.salaire_base : '0',
            alloc_logement: (item.alloc_logement) ? item.alloc_logement : '0',
            alloc_transport: (item.alloc_transport) ? item.alloc_transport : '0',
            alloc_familliale: (item.alloc_familliale) ? item.alloc_familliale : '0',
            soins_medicaux: (item.soins_medicaux) ? item.soins_medicaux : '0',
            compte_bancaire: item.compte_bancaire,
            nom_banque: this.capitalizeTest(item.nom_banque),
            frais_bancaire: (item.frais_bancaire) ? item.frais_bancaire : '0',
            syndicat: item.syndicat,
            cv_url: item.cv_url,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
          this.formGroup5.patchValue({ 
            statut_personnel: item.statut_personnel,
            roles: item.roles, 
            permission: item.permission,
            signature: this.currentUser.matricule,
            update_created: new Date()
          });
        }
      );
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
      this.personnelService.update(this.id, this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          // this.router.navigate(['/layouts/personnels/personnel-list']);
          this.isLoading = false;
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

  onSubmit2() {
    try {
      this.isLoading = true;
      this.personnelService.update(this.id, this.formGroup2.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          // this.router.navigate(['/layouts/personnels/personnel-list']);
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      });
       // this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit3() {
    try {
      this.isLoading = true;
      this.personnelService.update(this.id, this.formGroup3.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          // this.router.navigate(['/layouts/personnels/personnel-list']);
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      });

       // this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit4() {
    try {
      this.isLoading = true;
      this.personnelService.update(this.id, this.formGroup4.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          // this.router.navigate(['/layouts/personnels/personnel-list']);
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      });

       // this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit5() {
    try {
      this.isLoading = true;
      this.personnelService.update(this.id, this.formGroup5.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/layouts/personnels/personnel-list']);
          this.isLoading = false;
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoading = false;
        }
      });

       // this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }
  
  
  compareFn(c1: DepartementModel, c2: DepartementModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  compareFnSiteLocation(c1: SiteLocationModel, c2: SiteLocationModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  compareFnServicePref(c1: ServicePrefModel, c2: ServicePrefModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  compareFnFonction(c1: FonctionModel, c2: FonctionModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  compareFnTitle(c1: TitleModel, c2: TitleModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  
  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }
}
