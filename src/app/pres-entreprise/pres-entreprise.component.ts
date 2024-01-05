import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PresentrepriseModel } from './models/pres-entreprise-model';
import { PersonnelModel } from '../personnels/models/personnel-model';
import { PreferenceModel } from '../preferences/reglages/models/reglage-model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PresEntrepriseService } from './pres-entreprise.service';
import { ReglageService } from '../preferences/reglages/reglage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PersonnelService } from '../personnels/personnel.service';
import { monnaieDataList } from '../shared/tools/monnaie-list';

@Component({
  selector: 'app-pres-entreprise',
  templateUrl: './pres-entreprise.component.html',
  styleUrls: ['./pres-entreprise.component.scss']
})
export class PresEntrepriseComponent implements OnInit {
  displayedColumns: string[] = ['matricule','fullname', 'intitule', 'date_limit', 'created', 'id'];
  
  ELEMENT_DATA: PresentrepriseModel[] = [];
  
  dataSource = new MatTableDataSource<PresentrepriseModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PresentrepriseModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any;

  preference: PreferenceModel;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private presEntrepriseService: PresEntrepriseService,
      private reglageService: ReglageService,
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
                this.presEntrepriseService.getAll(this.currentUser.code_entreprise).subscribe(res => {
                  this.ELEMENT_DATA = res; 
                  this.dataSource = new MatTableDataSource<PresentrepriseModel>(this.ELEMENT_DATA);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator; 
              });
              this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
                this.preference = res; 
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
    this.router.navigate(['/layouts/salaires/pres-entreprise', id, 'detail'])
  }

 

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PresEntrepriseAddDialogBox, {
      width: '600px',
      height: '100%',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 
}



@Component({
  selector: 'pres-entreprise-dialog',
  templateUrl: './pres-entreprise-add.html',
})
export class PresEntrepriseAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: PersonnelModel | any;

  personneList: PersonnelModel[] = [];

  monnaieList = monnaieDataList;

  constructor( 
      public dialogRef: MatDialogRef<PresEntrepriseAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService,
      private personnelService: PersonnelService,
      private presEntrepriseService: PresEntrepriseService,
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
      intitule: ['', Validators.required],
      monnaie: ['', Validators.required],
      total_empreints: ['', Validators.required],
      deboursement: ['', Validators.required], 
      date_debut: ['', Validators.required],
      date_limit: ['', Validators.required], 
    });
  } 


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          personnel: this.formGroup.value.personnel,
          intitule: this.formGroup.value.intitule,
          monnaie: this.formGroup.value.monnaie,
          total_empreints: this.formGroup.value.total_empreints,
          deboursement: this.formGroup.value.deboursement,
          remboursement: '0',
          date_debut: this.formGroup.value.date_debut,
          date_limit: this.formGroup.value.date_limit,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.presEntrepriseService.create(body).subscribe({
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
