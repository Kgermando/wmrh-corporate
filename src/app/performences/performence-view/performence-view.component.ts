import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model'; 
import { PerformenceService } from '../performence.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-performence-view',
  templateUrl: './performence-view.component.html',
  styleUrls: ['./performence-view.component.scss']
})
export class PerformenceViewComponent implements OnInit {
  isLoading = false;

  currentUser: PersonnelModel | any;
  
  personne: PersonnelModel;

  cumuls = 0;

  hospitaliteTotal = 0;
  ponctualiteTotal = 0;
  travailTotal = 0;
 

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
      private authService: AuthService,
    private personnelService: PersonnelService,
    private performenceService: PerformenceService,
    public dialog: MatDialog ) {}


    ngOnInit(): void {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.personnelService.get(Number(id)).subscribe(res => {
            this.personne = res;
            this.performenceService.hospitaliteTotal(this.currentUser.code_entreprise, this.personne.id).subscribe(
              res => {
                var performences = res; 
                performences.map((item: any) => this.hospitaliteTotal = parseFloat(item.sum));
                performences.map((item: any) => this.ponctualiteTotal = parseFloat(item.sum)); 
                performences.map((item: any) => this.travailTotal = parseFloat(item.sum));
  
                this.cumuls = this.hospitaliteTotal + this.ponctualiteTotal + this.travailTotal;
              }
            );
          });
          
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });  
    }
 
    openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
      this.dialog.open(PerformenceAddDialogBox, {
        width: '600px',
        // height: '100%',
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
  selector: 'performence-dialog',
  templateUrl: './performence-add.html',
})
export class PerformenceAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<PerformenceAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private performenceService: PerformenceService,
  ) {}
  


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
    this.formGroup = this.formBuilder.group({  
      ponctualite: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'), 
        this.defaultValueOrRangeValidator(
          0,
          Validators.min(0),
          Validators.max(10)
        ),
      ]),
      hospitalite: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'), 
        this.defaultValueOrRangeValidator(
          0,
          Validators.min(0),
          Validators.max(10)
        ),
      ]),
      travail: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'), 
        this.defaultValueOrRangeValidator(
          0,
          Validators.min(0),
          Validators.max(10)
        ),
      ]),
      observation: new FormControl('', [Validators.required]),  

    }); 
 
  } 

  defaultValueOrRangeValidator(
    defaultValue: number,
    ...rangeValidators: ValidatorFn[]
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | any => {
      if (control.value == defaultValue) return null;

      for (let validator of rangeValidators) {
        if (validator(control)) return validator(control);
      }
    };
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          personnel: this.data['id'],
          ponctualite: this.formGroup.value.ponctualite,
          hospitalite: this.formGroup.value.hospitalite,
          travail: this.formGroup.value.travail,
          observation: this.formGroup.value.observation,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.performenceService.create(body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Success!', 'Ajouté avec succès!'); 
            window.location.reload();
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

  close(){
      this.dialogRef.close(true);
  } 

}



