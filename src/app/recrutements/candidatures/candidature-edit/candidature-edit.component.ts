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
  selector: 'app-candidature-edit',
  templateUrl: './candidature-edit.component.html',
  styleUrls: ['./candidature-edit.component.scss']
})
export class CandidatureEditComponent implements OnInit{
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: PersonnelModel | any; 
  
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

  id: number;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,  
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
      full_name: [''],
      sexe: [''],
      departement: [''],
      statut: ['']
    });

    this.id = this.route.snapshot.params['id'];
    this.candidaturesService.get(this.id).subscribe(item => {
      this.formGroup.patchValue({
        search_profil: item.search_profil,
        scan_url: item.scan_url,
        full_name: item.full_name,
        sexe: item.sexe,
        departement: item.departement,
        statut: item.statut,
        signature: this.currentUser.matricule,
        update_created: new Date()
      });
    });
  }

  onSubmit() {
    try {
      this.isLoading = true;
      this.candidaturesService.update(this.id, this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.toastr.success('Modification enregistré!', 'Success!');
          this.router.navigate(['/layouts/recrutements/candidatures']);
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
}
