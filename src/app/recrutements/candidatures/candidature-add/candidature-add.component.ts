import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PostesService } from '../../postes.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { CandidaturesService } from '../../candidatures.service';
import { PosteModel } from '../../postes/models/poste-model';
import { DepartementService } from 'src/app/preferences/departements/departement.service';
import { DepartementModel } from 'src/app/preferences/departements/model/departement-model';

@Component({
  selector: 'app-candidature-add',
  templateUrl: './candidature-add.component.html',
  styleUrls: ['./candidature-add.component.scss']
})
export class CandidatureAddComponent implements OnInit{
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: PersonnelModel | any;

  poste: PosteModel;
  
  departementList: DepartementModel[] = [];
 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];

  statutList: string[] = [
    'Postulant', 'Recrue'
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
    private route: ActivatedRoute,
    private authService: AuthService, 
    private postesService: PostesService,
    private candidaturesService: CandidaturesService,
    private departementService: DepartementService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.departementService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.departementList = res;  
        }); 
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
    this.formGroup = this._formBuilder.group({
      scan_url: ['-'],
      full_name: ['', Validators.required],
      sexe: ['', Validators.required],
      departement: ['', Validators.required],
      statut: ['', Validators.required]
    });
    let id = this.route.snapshot.paramMap.get('id'); 
      this.postesService.get(Number(id)).subscribe(res => {
        this.poste = res; 
      });

      
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          search_profil: this.poste.search_profil,
          scan_url: this.formGroup.value.scan_url,
          full_name: this.formGroup.value.full_name,
          sexe: this.formGroup.value.sexe,
          departement: this.formGroup.value.departement,
          statut: this.formGroup.value.statut,  
          signature: this.currentUser.matricule,
          post: this.poste.id,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.candidaturesService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/recrutements/candidatures']);
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
