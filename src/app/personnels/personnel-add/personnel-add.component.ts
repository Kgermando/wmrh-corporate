import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelService } from '../personnel.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonnelModel } from '../models/personnel-model';
import { ToastrService } from 'ngx-toastr';
import { CategoriepersonnelDataList } from 'src/app/shared/tools/categorie_personnel';
import { SalaireService } from 'src/app/salaires/salaire.service';

@Component({
  selector: 'app-personnel-add',
  templateUrl: './personnel-add.component.html',
  styleUrls: ['./personnel-add.component.scss']
})
export class PersonnelAddComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: PersonnelModel | any; 

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];
 

  categoriList = CategoriepersonnelDataList;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private personnelService: PersonnelService, 
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      nom: ['', Validators.required],
      postnom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      sexe: ['', Validators.required],
      adresse: ['', Validators.required],
      matricule: ['', Validators.required],  
      category: ['', Validators.required], 
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var codeEntreprise = this.currentUser.code_entreprise;
        var mat = this.formGroup.value.matricule;
        var identifiant = `${mat}-${codeEntreprise}`;
        
        var body = {
          nom: this.capitalizeTest(this.formGroup.value.nom),
          postnom: this.capitalizeTest(this.formGroup.value.postnom),
          prenom: this.capitalizeTest(this.formGroup.value.prenom),
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          sexe: this.formGroup.value.sexe,
          adresse: this.formGroup.value.adresse, 
          matricule: identifiant.toLowerCase(),  
          category: this.formGroup.value.category,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.personnelService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/personnels/personnel-list']);
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


  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}
