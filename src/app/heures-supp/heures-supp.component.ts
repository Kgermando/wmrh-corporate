import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'; 
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { SelectionModel } from '@angular/cdk/collections'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelService } from 'src/app/personnels/personnel.service'; 
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';  
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { HeureSuppModel } from './models/heure-supp-model';
import { HeureSuppService } from './heure-supp.service';

@Component({
  selector: 'app-heures-supp',
  templateUrl: './heures-supp.component.html',
  styleUrls: ['./heures-supp.component.scss']
})
export class HeuresSuppComponent implements OnInit {
  displayedColumns: string[] = ['matricule','fullname', 'nbr_heures', 'created', 'id'];
  
  ELEMENT_DATA: HeureSuppModel[] = [];
  
  dataSource = new MatTableDataSource<HeureSuppModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<HeureSuppModel>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 


  isLoading = false;
  currentUser: PersonnelModel | any; 
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private heureSuppService: HeureSuppService, 
      public dialog: MatDialog,
  ) {} 
  toggleTheme() {
    this.themeService.toggleTheme();
  }


  ngOnInit() { 
        this.isLoading = true;
        this.authService.user().subscribe({
            next: (user) => {
                this.currentUser = user;
                this.heureSuppService.getAll(this.currentUser.code_entreprise).subscribe(res => {
                  this.ELEMENT_DATA = res; 
                  this.dataSource = new MatTableDataSource<HeureSuppModel>(this.ELEMENT_DATA);
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

  detail(id: number) {
    this.router.navigate(['/layouts/presences/heures-supp', id, 'detail'])
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(HeureSuppAddDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 
}



@Component({
  selector: 'heure-supp-dialog',
  templateUrl: './heure-supp-add.html',
})
export class HeureSuppAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  personneList: PersonnelModel[] = [];

  constructor( 
      public dialogRef: MatDialogRef<HeureSuppAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private personnelService: PersonnelService,
      private heureSuppService: HeureSuppService,
  ) {}
  


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
          this.personneList = res;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
    this.formGroup = this.formBuilder.group({ 
      personnel: ['', Validators.required],
      motif: ['', Validators.required],
      nbr_heures: ['', Validators.required], 
    }); 
 
  } 


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          personnel: this.formGroup.value.personnel,
          motif: this.formGroup.value.motif,
          nbr_heures: this.formGroup.value.nbr_heures,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.heureSuppService.create(body).subscribe({
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
