import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { SalaireService } from '../salaire.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SalaireExportXLSXDialogBox } from '../releve-paie/releve-paie.component';
import { MatDialog } from '@angular/material/dialog';
import { ReleveSalaireModel } from '../models/releve-salaire-model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';
import { CorporateService } from 'src/app/preferences/corporates/corporate.service';

@Component({
  selector: 'app-statuts-paie',
  templateUrl: './statuts-paie.component.html',
  styleUrls: ['./statuts-paie.component.scss']
})
export class StatutsPaieComponent implements OnInit {
  displayedColumns: string[] = [ 'site_locations', 'statut', 'matricule', 'fullname', 'departements', 'created'];
  
  ELEMENT_DATA: ReleveSalaireModel[] = [];
  
  dataSource = new MatTableDataSource<ReleveSalaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<ReleveSalaireModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  isLoading = false;
  isLoad = false;
  currentUser: PersonnelModel | any;

  classerList: any[] = [];
  corporateList: CorporateModel[] = []; 

  mois = '';
  dateNow = new Date();
  dateMonth = 0;
  dateYear = 0; 

  formGroup!: FormGroup;

  corporate: CorporateModel;
  
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      private formBuilder: FormBuilder,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private corporateService: CorporateService,
      private salaireService: SalaireService, 
      public dialog: MatDialog,
  ) {}


  ngOnInit(): void {
    this.isLoading = true;

    this.formGroup = this.formBuilder.group({
      entreprise: new FormControl(''),
      classeur: new FormControl(''),
    });


    this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.corporateService.getAll(this.currentUser.code_entreprise).subscribe(value => {
            this.corporateList = value; 
            this.isLoading = false;
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
  }


  onChangeCorporate(event: any) {
    this.isLoad = true;
    this.corporate = event.value; 
    this.salaireService.classer(this.currentUser.code_entreprise, this.corporate.id).subscribe(classer => {
      this.classerList = classer;
      this.isLoad = false;
    });

    console.log('corporate', this.corporate);
  }

  onChangeClasser(event: any) {
    this.isLoad = true;
    var month = event.value.month;
    var year = event.value.year;
    this.salaireService.statutPaie(
      this.currentUser.code_entreprise,
      this.corporate.code_corporate, month, year).subscribe(res => { 
        this.ELEMENT_DATA = res;
        this.dataSource = new MatTableDataSource<ReleveSalaireModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
        this.isLoad = false;
      }
    ); 
    // this.onFilter(); 
  }

  // onFilter() {
  //   var body = {
  //     entreprise:  this.formGroup.value.entreprise,
  //     classeur:  this.formGroup.value.classeur,
  //   };
    
  //   if (body.classeur.month == undefined && body.classeur.year == undefined) { 
  //     var date = new Date();
  //     var month = date.getMonth() + 1;
  //     var year = date.getFullYear(); 
  //     this.salaireService.statutPaie(this.currentUser.code_entreprise, body.entreprise, 
  //         month.toString(), year.toString()).subscribe(res => {
  //         this.ELEMENT_DATA = res;
  //         this.dataSource = new MatTableDataSource<ReleveSalaireModel>(this.ELEMENT_DATA);
  //         this.dataSource.sort = this.sort;
  //         this.dataSource.paginator = this.paginator;
  //       }
  //     );
  //   }
  //   if (body.classeur.month != undefined && body.classeur.year != undefined) { 
  //     this.salaireService.statutPaie(this.currentUser.code_entreprise, body.entreprise, 
  //       body.classeur.month, body.classeur.year).subscribe(res => { 
  //         this.ELEMENT_DATA = res;
  //         this.dataSource = new MatTableDataSource<ReleveSalaireModel>(this.ELEMENT_DATA);
  //         this.dataSource.sort = this.sort;
  //         this.dataSource.paginator = this.paginator; 
  //       }
  //     );
  //   } 
  // }  



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

 
 
  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SalaireExportXLSXDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 



  toggleTheme() {
    this.themeService.toggleTheme();
  } 

}
