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
import { PenaliteModel } from './models/penalite-model';
import { PenaliteService } from './penalite.service';
import { monnaieDataList } from '../shared/tools/monnaie-list';
import { CorporateModel } from '../preferences/corporates/models/corporate.model';
import { CorporateService } from '../preferences/corporates/corporate.service';


@Component({
  selector: 'app-penalites',
  templateUrl: './penalites.component.html',
  styleUrls: ['./penalites.component.scss']
})
export class PenalitesComponent implements OnInit {
  displayedColumns: string[] = ['matricule','fullname', 'intitule', 'montant', 'created', 'id'];
  
  ELEMENT_DATA: PenaliteModel[] = [];
  
  dataSource = new MatTableDataSource<PenaliteModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PenaliteModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any;

  corporate: CorporateModel; 
  
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router, 
      private route: ActivatedRoute,
      private corporateService: CorporateService,
      private penaliteService: PenaliteService,
      public dialog: MatDialog,
  ) {
  } 

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  ngOnInit() { 
    this.route.params.subscribe(routeParams => { 
      this.penaliteService.refreshDataList$.subscribe(() => {
        this.loadData(routeParams['id']);
      })
      this.loadData(routeParams['id']);
    });
  }

    public loadData(id: any): void {
      this.isLoading = true;
      this.corporateService.getOne(Number(id)).subscribe(res => {
        this.corporate = res;
        this.penaliteService.getAllByCorporate(this.corporate.id).subscribe((penalites) => {
          this.ELEMENT_DATA = penalites;  
          this.dataSource = new MatTableDataSource<PenaliteModel>(this.ELEMENT_DATA);
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
    this.router.navigate(['/layouts/salaires/penalites', id, 'detail'])
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, corporate: any): void {
    this.dialog.open(PenaliteAddDialogBox, {
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
  selector: 'penalite-dialog',
  templateUrl: './penalite-add.html',
})
export class PenaliteAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: PersonnelModel | any;

  personneList: PersonnelModel[] = [];

  monnaieList = monnaieDataList;

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<PenaliteAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private penaliteService: PenaliteService,
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
      intitule: ['', Validators.required],
      monnaie: ['', Validators.required],
      montant: ['', Validators.required], 
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
          montant: this.formGroup.value.montant,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.data.corporate.code_corporate,
          corporate: this.data.corporate.id
        };
        this.penaliteService.create(body).subscribe({
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
