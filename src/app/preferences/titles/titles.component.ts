import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleModel } from './models/title-model';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TitleService } from './title.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CorporateModel } from '../corporates/models/corporate.model';
import { CorporateService } from '../corporates/corporate.service';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss']
})
export class TitlesComponent implements OnInit{

  isLoadingCorporate = false;
  isLoading = false;

  formGroup!: FormGroup;

  corporate: CorporateModel;

  titleList: TitleModel[] = [];

  currentUser: PersonnelModel | any;


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
      public themeService: CustomizerSettingsService, 
      private _formBuilder: FormBuilder,
      private titleService: TitleService,
      private corporateService: CorporateService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      title: ['', Validators.required], 
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.route.params.subscribe(routeParams => { 
          this.titleService.refreshDataList$.subscribe(() => {
            this.loadData(routeParams['id']);
          });
          this.loadData(routeParams['id']);
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

  
  }


  public loadData(id: any): void {
    this.isLoadingCorporate = true;
    this.corporateService.get(Number(id)).subscribe(res => {
      this.corporate = res;
      this.titleService.findGetAll(this.corporate.id).subscribe((v) => {
        this.titleList = v;
        this.isLoadingCorporate = false;
      });
    });
  }



  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          corporate: this.corporate.id,
          title: this.formGroup.value.title, 
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.corporate.corporate_name,
          code_entreprise: this.corporate.code_corporate
        };
        this.titleService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Success!', 'Ajouté avec succès!');
            // window.location.reload();
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

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.titleService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!'); 
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        });
    }
  } 

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditTitleDialogBox, {
      width: '600px', 
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
  selector: 'edit-title-dialog',
  templateUrl: './title-edit.html',
})
export class EditTitleDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditTitleDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private titleService: TitleService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      title: ''
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.titleService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            title: item.title, 
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
      this.titleService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Modification enregistré!', 'Success!'); 
          this.close();
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
