import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from '../models/personnel-model';
import { PersonnelService } from '../personnel.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { CorporateService } from 'src/app/preferences/corporates/corporate.service';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'matricule', 'fullname', 'email', 'telephone', 'sexe', 'id'];
  
  ELEMENT_DATA: PersonnelModel[] = [];
  
  dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PersonnelModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  isLoading = false;

  isLoadModel = false;

  currentUser: PersonnelModel | any;
  corporate: CorporateModel;
  
  isActive = false;

 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private route: ActivatedRoute,
      private authService: AuthService,
    private router: Router,
      private corporateService: CorporateService,
      private personnelService: PersonnelService, 
      public dialog: MatDialog,
      private toastr: ToastrService,
  ) {}


  toggleTheme() {
    this.themeService.toggleTheme();
  }


  ngOnInit() {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.route.params.subscribe(routeParams => { 
          this.personnelService.refreshDataList$.subscribe(() => {
            this.loadData(routeParams['id']);
          })
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
    this.isLoading = true;
    this.corporateService.getOne(Number(id)).subscribe(res => {
      this.corporate = res; 
      this.personnelService.getPersennelByCorporate(this.corporate.id).subscribe((personnels) => {
        this.ELEMENT_DATA = personnels;
        this.dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
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


  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PersonnelUploadCSVDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 


  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PersonnelExportXLSXDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }

  downloadModelReport() { 
    try {
      this.isLoadModel = true; 
      this.personnelService.downloadModelReport(this.currentUser.code_entreprise).subscribe({
      next: (res) => {
        const downloadUrl = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Votre_model_employes.xlsx`;
        link.click(); 
        this.toastr.info('Extraction effectuée!', 'Info!');
        this.isLoadModel = false;
      },
      error: (err) => {
        this.isLoadModel = false;
        this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        console.log(err);
      }
    });
    } catch (error) {
      this.isLoadModel = false;
      this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
    }
  }

  // downloadModelReport() {
  //   this.isLoading = true;
  //   this.httpClient.get("assets/files/personnel_model.xlsx",{responseType: "blob"}).subscribe((res:any) => { 
  //     const downloadUrl= window.URL.createObjectURL(res);
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = `Votre_model_employes.xlsx`;
  //     link.click();
  //     this.isLoading = false;
  //   });
  // } 

}




@Component({
  selector: 'personnel-upload-csv-dialog',
  templateUrl: './personnel-upload-csv.html',
})
export class PersonnelUploadCSVDialogBox implements OnInit {
  isLoading = false; 

  currentUser: PersonnelModel | any; 
  personnel: PersonnelModel;

  constructor( 
      public dialogRef: MatDialogRef<PersonnelUploadCSVDialogBox>, 
      private toastr: ToastrService,
      private authService: AuthService,
      private router: Router,
      private papa: Papa,
      private personnelService: PersonnelService, 
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
  }
  

  upload(event: any) {
    this.isLoading = true;
    const file = event.target.files[0];
    if (this.isValidCSVFile(file)) {
      this.papa.parse(file, {
        worker: true,
        header: true, 
        delimiter: ';',
        dynamicTyping: true,
        encoding: 'utf-8',
        skipEmptyLines: true,
        step: (row) => {
          this.personnel = row.data;
          var codeEntreprise = this.personnel.corporates.code_corporate;
          var mat = this.personnel.matricule;
          var identifiant = `${mat}-${codeEntreprise}`;
          var body = {
            nom: this.capitalizeText(this.personnel.nom),
            postnom: this.capitalizeText(this.personnel.postnom),
            prenom: this.capitalizeText(this.personnel.prenom),
            email: this.personnel.email,
            telephone: this.personnel.telephone,
            sexe: this.personnel.sexe,
            adresse: this.personnel.adresse, 
            matricule: identifiant.toLowerCase(),  
            category: this.personnel.category,
            statut_paie: 'En attente',
            signature: this.currentUser.matricule, 
            created: new Date(),
            update_created: new Date(),
            corporates: this.personnel.corporates.id,
            entreprise: this.personnel.entreprise,
            code_entreprise: this.personnel.corporates.code_corporate
          };
          this.personnelService.create(body).subscribe({
            next: () => {},
            error: (err) => {
              this.isLoading = false;
              this.toastr.error(`${err.error.message}`, 'Oupss!');
              console.log(err);
              this.close();
            }
          });
        },
        complete: () => {
          this.isLoading = false;
          console.log("All done!");
          this.toastr.success('Ajouter avec succès!', 'Success!');
          this.close();
        },
        error: (error, file) => {
          this.isLoading = false;
          this.toastr.error(`${error}`, 'Oupss!');
          console.log(error);
          console.log("file", file);
          this.close();
        },
      });
    } else {  
      alert("Please import valid .csv file."); 
    }  
  } 
 
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }

  capitalizeText(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

  close(){
      this.dialogRef.close(true);
  } 

}

 
@Component({
  selector: 'personnel-export-xlsx-dialog',
  templateUrl: './personnel-export-xlsx.html',
})
export class PersonnelExportXLSXDialogBox implements OnInit {
  isLoading = false;
  currentUser: PersonnelModel | any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor( 
      public dialogRef: MatDialogRef<PersonnelExportXLSXDialogBox>, 
      private toastr: ToastrService,
      private personnelService: PersonnelService, 
      private router: Router,
      private authService: AuthService,
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
  }


  onSubmit() {
    this.isLoading = true;
    var dateNow = new Date();
    var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
    var start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
    var end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US') ;
    this.personnelService.downloadReport(
        this.currentUser.code_entreprise,
        start_date,
        end_date
      ).subscribe({
      next: (res) => {
        this.isLoading = false;
        const blob = new Blob([res], {type: 'text/xlsx'});
        const downloadUrl = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Employes-${dateNowFormat}.xlsx`;
        link.click();


        this.toastr.success('Success!', 'Extraction effectuée!');
        // window.location.reload();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        console.log(err);
        this.close();
      }
    });
  } 


  close(){
      this.dialogRef.close(true);
  } 

}
