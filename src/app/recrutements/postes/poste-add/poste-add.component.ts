import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PostesService } from '../../postes.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

@Component({
  selector: 'app-poste-add',
  templateUrl: './poste-add.component.html',
  styleUrls: ['./poste-add.component.scss']
})
export class PosteAddComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: PersonnelModel | any;

  typeContratList: string[] = [
    'CDD', 'CDI'
  ];

  statutList: string[] = [
    'Disponible', 'Cloturé'
  ];

  blurred = false
  focused = false
 
  changedEditor(event: EditorChangeContent | EditorChangeSelection) {}

  focus($event:any) {
      this.focused = true
      this.blurred = false
  }

  blur($event:any) {
      this.focused = false
      this.blurred = true
  }

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private postesService: PostesService,
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
      search_profil: ['', Validators.required],
      resume: ['', Validators.required],
      type_contrat: ['', Validators.required],
      statut: ['', Validators.required],
      echeance: ['', Validators.required]
    });
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          search_profil: this.formGroup.value.search_profil,
          resume: this.formGroup.value.resume, 
          type_contrat: this.formGroup.value.type_contrat,
          statut: this.formGroup.value.statut,
          echeance: this.formGroup.value.echeance,  
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.postesService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/recrutements/postes']);
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
