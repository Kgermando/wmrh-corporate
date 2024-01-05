import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { ApointementModel } from '../../../models/presence-model';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PresenceService } from '../../../presence.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pointage-table',
  templateUrl: './pointage-table.component.html',
  styleUrls: ['./pointage-table.component.scss']
})
export class PointageTableComponent implements OnInit {
  @Input('personne') personne: PersonnelModel; 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  
  displayedColumns: string[] = ['matricule', 'apointement', 'prestation', 'date_entree', 'date_sortie', 'observation', 'action'];
  
  ELEMENT_DATA: ApointementModel[] = []; 
  
  dataSource = new MatTableDataSource<ApointementModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<ApointementModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel;
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService, 
      private router: Router, 
      private authService: AuthService,
      private presenceService: PresenceService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}
 



  ngOnInit() { 
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user;
            this.presenceService.getMatricule(this.currentUser.code_entreprise, this.personne.matricule).subscribe(res => {
              this.ELEMENT_DATA = res;
              this.dataSource = new MatTableDataSource<ApointementModel>(this.ELEMENT_DATA);
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

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.presenceService
        .delete(id)
        .subscribe({
          next: () => { 
            window.location.reload(); 
            this.toastr.success('Success!', 'Suppression effectuée!'); 
          },
          error: (err) => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        }
      );
    }
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditPresenceDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  }  

}




@Component({
  selector: 'edit-presence-dialog',
  templateUrl: './edit-presence.html',
})
export class EditPresenceDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  isAbsense = false;

  apointementList: string[] = [
    'P',
    'A',
    'AA',
    'AM',
    'CC',
    'CA',
    'CO',
    'S', 
    'O',
    'M'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditPresenceDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private presenceService: PresenceService,
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
      apointement: [''],
      // date_entree: [''],
      date_sortie: [''],
      observation: [''] 
    });

    this.presenceService.get(parseInt(this.data['id'])).subscribe(item => {
      if (
        item.apointement === 'AM' || item.apointement === 'CC' || 
        item.apointement === 'CA' || item.apointement === 'CO' || 
        item.apointement === 'S' || item.apointement === 'O' || item.apointement === 'M') { 
        this.isAbsense = true;
      } else if(item.apointement === 'P' || item.apointement === 'A' || 
      item.apointement === 'AA') {
        this.isAbsense = false;
      }
      this.formGroup.patchValue({
        apointement: item.apointement, 
        date_entree: item.date_entree, 
        date_sortie: item.date_sortie,
        observation: item.observation, 
        signature: this.currentUser.matricule, 
        update_created: new Date(),
      });
    });
  } 

  onPresenceChange(event: any) {
    console.log(event.value);
    if (
      event.value === 'AM' || event.value === 'CC' || 
      event.value === 'CA' || event.value === 'CO' || 
      event.value === 'S' || event.value === 'O' || event.value === 'M') { 
      this.isAbsense = true;
    } else if(event.value === 'P' || event.value === 'A' || 
      event.value === 'AA') {
      this.isAbsense = false;
    }
  }



  onSubmit() {
    try {
      this.isLoading = true;
      this.presenceService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
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
