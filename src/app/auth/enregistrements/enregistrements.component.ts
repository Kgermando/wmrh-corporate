import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriepersonnelDataList } from 'src/app/shared/tools/categorie_personnel'; 
import { RoleSupportDataList } from 'src/app/shared/tools/role-list';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enregistrements',
  templateUrl: './enregistrements.component.html',
  styleUrls: ['./enregistrements.component.scss']
})
export class EnregistrementsComponent implements OnInit {

  isLoading: boolean = false; 
  formGroup!: FormGroup; 

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];
  
  roleList: string[] = RoleSupportDataList;

  categoriList = CategoriepersonnelDataList;


  constructor( public themeService: CustomizerSettingsService, 
    private _formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      nom: ['', Validators.required],
      postnom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: [''],
      telephone: ['', Validators.required],
      sexe: ['', Validators.required],
      adresse: ['', Validators.required],
      // matricule: ['admin', Validators.required],
      // category: ['', Validators.required],
      // roles: ['', Validators.required],
      // entreprise: ['', Validators.required], 
    });
  }
  
  
  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var val = Math.floor(1000 + Math.random() * 9000);
        console.log(val);
        var codeEntreprise = 'et015'; 
        var identifiant = `support-${codeEntreprise}`;
        var body = {
          nom: this.formGroup.value.nom,
          postnom: this.formGroup.value.postnom,
          prenom: this.formGroup.value.prenom,
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          sexe: this.formGroup.value.sexe,
          adresse: this.formGroup.value.adresse, 
          matricule: identifiant.toLowerCase(),
          category: 'Cadres supérieurs',
          roles: this.roleList,
          permission: 'CRUD',
          signature: '-',
          created: new Date(),
          update_created: new Date(),
          password: '1234',
          password_confirm: '1234',
          entreprise: 'Support',
          code_entreprise: codeEntreprise
        };
        this.authService.register(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/auth/login']);
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

}

