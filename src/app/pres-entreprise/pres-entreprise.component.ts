import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PresEntrepriseModel } from './models/pres-entreprise-model';
import { PersonnelModel } from '../personnels/models/personnel-model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PresEntrepriseService } from './pres-entreprise.service';
import { ReglageService } from '../preferences/reglages/reglage.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { monnaieDataList } from '../shared/tools/monnaie-list';
import { CorporateService } from '../preferences/corporates/corporate.service';
import { CorporateModel } from '../preferences/corporates/models/corporate.model';

@Component({
  selector: 'app-pres-entreprise',
  templateUrl: './pres-entreprise.component.html',
  styleUrls: ['./pres-entreprise.component.scss']
})
export class PresEntrepriseComponent implements OnInit {
  displayedColumns: string[] = ['matricule','fullname', 'intitule', 'date_limit', 'created', 'id'];
  
  ELEMENT_DATA: PresEntrepriseModel[] = [];
  
  dataSource = new MatTableDataSource<PresEntrepriseModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PresEntrepriseModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any;

  corporate: CorporateModel;

  // preference: PreferenceModel;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router, 
      private route: ActivatedRoute,
      private corporateService: CorporateService,
      private presEntrepriseService: PresEntrepriseService,
      public dialog: MatDialog,
  ) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  } 

  ngOnInit() { 
    this.route.params.subscribe(routeParams => { 
      this.presEntrepriseService.refreshDataList$.subscribe(() => {
        this.loadData(routeParams['id']);
      })
      this.loadData(routeParams['id']);
    });
  }

    public loadData(id: any): void {
      this.isLoading = true;
      this.corporateService.getOne(Number(id)).subscribe(res => {
        this.corporate = res;
        this.presEntrepriseService.getAllByCorporate(this.corporate.id).subscribe((pres_entreprises) => {
          this.ELEMENT_DATA = pres_entreprises;  
          this.dataSource = new MatTableDataSource<PresEntrepriseModel>(this.ELEMENT_DATA);
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
    this.router.navigate(['/layouts/salaires/pres-entreprise', id, 'detail'])
  }

 

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, corporate: any): void {
    this.dialog.open(PresEntrepriseAddDialogBox, {
      width: '600px',
      height: '100%',
      enterAnimationDuration,
      exitAnimationDuration, 
      data: {
        corporate: corporate
      }
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
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<PresEntrepriseAddDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private presEntrepriseService: PresEntrepriseService,
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
          code_entreprise: this.data.corporate.code_corporate,
          corporate: this.data.corporate.id
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
