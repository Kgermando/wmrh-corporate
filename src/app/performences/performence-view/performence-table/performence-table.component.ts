import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { PerformenceModel } from '../../models/performence-model';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PerformenceService } from '../../performence.service';

@Component({
  selector: 'app-performence-table',
  templateUrl: './performence-table.component.html',
  styleUrls: ['./performence-table.component.scss']
})
export class PerformenceTableComponent implements OnInit{
  @Input('personne') personne: PersonnelModel; 

  displayedColumns: string[] = ['created', 'ponctualite', 'hospitalite', 'travail', 'observation',  'update_created', 'edit'];
  
  ELEMENT_DATA: PerformenceModel[] = [];
  
  dataSource = new MatTableDataSource<PerformenceModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PerformenceModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any; 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
 
 

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private personnelService: PersonnelService,
    public dialog: MatDialog
) {}

  ngOnInit(): void {
    this.isLoading = true;
      this.authService.user().subscribe({
          next: (user) => {
              this.currentUser = user;
              this.personnelService.get(this.personne.id).subscribe(res => {
                this.personne = res;
                  this.ELEMENT_DATA = this.personne.performences;
                  this.dataSource = new MatTableDataSource<PerformenceModel>(this.ELEMENT_DATA);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator; 
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

toggleTheme() {
  this.themeService.toggleTheme();
}




applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

/** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) { 
      if (sortState.direction) {
          this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
          this._liveAnnouncer.announce('Sorting cleared');
      }
  } 


  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditPerformenceDialogBox, {
      width: '600px',
        height: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.personnelService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!');
            this.router.navigate(['/layouts/performences']);
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
    }
  }

}



@Component({
  selector: 'edit-performence-dialog',
  templateUrl: './performence-edit.html',
})
export class EditPerformenceDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditPerformenceDialogBox>,
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
    
    this.performenceService.get(parseInt(this.data['id'])).subscribe(item => {
      this.formGroup.patchValue({
        personnel: this.data['id'],
        ponctualite: item.ponctualite,
        hospitalite: item.hospitalite,
        travail: item.travail,
        observation: item.observation,
        signature: this.currentUser.matricule,
        update_created: new Date(),
      });
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
      this.isLoading = true;
      this.performenceService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Modification enregistré!', 'Success!');
          window.location.reload(); 
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