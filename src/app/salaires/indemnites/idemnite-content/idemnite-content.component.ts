import { Component, Inject, Input, OnInit } from '@angular/core';
import { IndemniteModel } from '../models/indemnite.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdemniteContentService } from '../idemnite-content.service';
import { ToastrService } from 'ngx-toastr';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { IndemniteContentModel } from '../models/indemnite-content.model';

@Component({
  selector: 'app-idemnite-content',
  templateUrl: './idemnite-content.component.html',
  styleUrls: ['./idemnite-content.component.scss']
})
export class IdemniteContentComponent implements OnInit {
  @Input('indemnite') indemnite: IndemniteModel;
  @Input('currentUser') currentUser: PersonnelModel;

  formContentGroup: FormGroup;

  isLoadingContent = false;
 
  idemniteContentList: IndemniteContentModel[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private idemniteContentService: IdemniteContentService,
    private toastr: ToastrService
  ) {}

  
  ngOnInit(): void {
    this.formContentGroup = this._formBuilder.group({
      nom: ['', Validators.required],
      montant: ['', Validators.required], 
    });
  }
 
  onSubmitContent() {
    try {
      if (this.formContentGroup.valid) {
        this.isLoadingContent = true; 
        var body = {
          nom: this.capitalizeText(this.formContentGroup.value.nom),
          montant: this.formContentGroup.value.montant, 
          signature: this.currentUser.matricule, 
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise,
          indemnite: this.indemnite.id, 
        };
        this.idemniteContentService.create(body).subscribe({
          next: () => {
            this.isLoadingContent = false;
            this.formContentGroup.reset();
            // this.indemnite.content ;
            // window.location.reload(); 
          },
          error: (err) => {
            this.isLoadingContent = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      } 
    } catch (error) {
      this.isLoadingContent = false;
      console.log(error);
    }
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { 
      this.idemniteContentService.delete(id).subscribe({
        next:  res => {
          this.toastr.info('Retiré avec succès!', 'Supprimée!');
        },
        error: err => { 
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err);
        }
      });
    }
  }

  capitalizeText(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }
}


@Component({
  selector: 'edit-indemnite-dialog',
  templateUrl: './indemnite-edit.html',
})
export class EditIndemniteDialogBox implements OnInit{
  isLoadingContent = false;

  formContentGroup!: FormGroup;
 

  currentUser: PersonnelModel | any; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditIndemniteDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private idemniteContentService: IdemniteContentService,
  ) {}
  


  ngOnInit(): void {
    this.formContentGroup = this.formBuilder.group({
      nom: [''], 
      montant: [''],
    }); 
    console.log('id', this.data['id'])
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.idemniteContentService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formContentGroup.patchValue({
            nom: this.capitalizeText(item.nom),
            montant: item.montant, 
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


  onSubmitContent() {
    try {
      this.isLoadingContent = true;
      this.idemniteContentService.update(parseInt(this.data['id']), this.formContentGroup.getRawValue())
      .subscribe({
        next: () => {
          this.isLoadingContent = false;
          this.toastr.success('Modification effectuée!', 'Success!');
          this.close();
          // window.location.reload();
        },
        error: err => {
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          this.isLoadingContent = false;
        }
      });
    } catch (error) {
      this.isLoadingContent = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

  capitalizeText(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}