import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteLocationModel } from './models/site-location-model';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SiteLocationService } from './site-location.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CorporateModel } from '../corporates/models/corporate.model';
import { CorporateService } from '../corporates/corporate.service';

@Component({
  selector: 'app-site-location',
  templateUrl: './site-location.component.html',
  styleUrls: ['./site-location.component.scss']
})
export class SiteLocationComponent implements OnInit{
  isLoadingCorporate = false;

  isLoading = false;

  formGroup!: FormGroup;

  corporate: CorporateModel;

  siteLocationList: SiteLocationModel[] = [];

  currentUser: PersonnelModel | any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
      public themeService: CustomizerSettingsService,
      private authService: AuthService,
      private _formBuilder: FormBuilder,
      private corporateService: CorporateService,
      private siteLocationService: SiteLocationService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      site_location: ['', Validators.required],
      manager: ['', Validators.required],
      adresse: ['', Validators.required],
    });
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.route.params.subscribe(routeParams => {  
          this.siteLocationService.refreshDataList$.subscribe(() => {
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
      this.siteLocationService.findGetAll(this.corporate.id).subscribe((v) => {
        this.siteLocationList = v;
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
          site_location: this.formGroup.value.site_location,
          manager: this.formGroup.value.manager,
          adresse: this.formGroup.value.adresse,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.corporate.corporate_name,
          code_entreprise: this.corporate.code_corporate
        }; 
        this.siteLocationService.create(body).subscribe({
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
      this.siteLocationService
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
    this.dialog.open(EditSiteLocationDialogBox, {
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
  selector: 'edit-site-location-dialog',
  templateUrl: './site-location-edit.html',
})
export class EditSiteLocationDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditSiteLocationDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private siteLocationService: SiteLocationService,
  ) {}
  


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      site_location: '',
      manager: '',
      adresse: '',
    });
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.siteLocationService.get(parseInt(this.data['id'])).subscribe(item => {
          this.formGroup.patchValue({
            site_location: item.site_location,
            manager: item.manager,
            adresse: item.adresse,
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
      this.siteLocationService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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
