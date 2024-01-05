import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router'; 
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { SelectionModel } from '@angular/cdk/collections'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';  
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { HeureSuppModel } from './models/heure-supp-model';
import { HeureSuppService } from './heure-supp.service';
import { CorporateModel } from '../preferences/corporates/models/corporate.model';
import { CorporateService } from '../preferences/corporates/corporate.service';

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
  corporate: CorporateModel;
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router, 
      private route: ActivatedRoute,
      private corporateService: CorporateService,
      private heureSuppService: HeureSuppService,
      public dialog: MatDialog,
  ) {} 
  toggleTheme() {
    this.themeService.toggleTheme();
  }


  ngOnInit() { 
    this.route.params.subscribe(routeParams => { 
      this.heureSuppService.refreshDataList$.subscribe(() => {
        this.loadData(routeParams['id']);
      })
      this.loadData(routeParams['id']);
    });
  }

  public loadData(id: any): void {
    this.isLoading = true;
    this.corporateService.getOne(Number(id)).subscribe(res => {
      this.corporate = res;
      this.heureSuppService.getAllByCorporate(this.corporate.id).subscribe((heures_supp) => {
        this.ELEMENT_DATA = heures_supp; 
        this.dataSource = new MatTableDataSource<HeureSuppModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
        this.isLoading = false;
      });
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

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, corporate: any): void {
    this.dialog.open(HeureSuppAddDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        corporate: corporate
      }
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
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<HeureSuppAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private heureSuppService: HeureSuppService,
  ) {}


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personneList = this.data.corporate.personnels;
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
          code_entreprise: this.data.corporate.code_corporate,
          corporate: this.data.corporate.id
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
