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
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { EntrepriseService } from 'src/app/admin/entreprise/entreprise.service';
import { EntrepriseModel } from 'src/app/admin/entreprise/models/entreprise.model';

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {
  displayedColumns: string[] = ['service', 'matricule', 'fullname', 'email', 'telephone', 'sexe', 'id'];
  
  ELEMENT_DATA: PersonnelModel[] = [];
  
  dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PersonnelModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  isLoading = false;
  currentUser: PersonnelModel | any;
 
  entreprise: EntrepriseModel;
  isActive = false;

 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private personnelService: PersonnelService,
      private entrepriseService: EntrepriseService,
      public dialog: MatDialog,
      private toastr: ToastrService,
  ) {}


  toggleTheme() {
    this.themeService.toggleTheme();
  }


  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
            this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
              this.ELEMENT_DATA = res; 
              this.dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;

              this.entrepriseService.getCodeEntreprise(this.currentUser.code_entreprise).subscribe(e => {
                this.entreprise = e;
              });
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
    this.router.navigate(['/layouts/personnels', id, 'personnel-edit'])
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
      this.isLoading = true;
      this.personnelService.downloadModelReport(this.currentUser.code_entreprise).subscribe({
      next: (res) => {
        this.isLoading = false; 
        const downloadUrl = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Votre_model_employes.xlsx`;
        link.click(); 
        this.toastr.info('Extraction effectuée!', 'Info!'); 
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        console.log(err); 
      }
    });
    } catch (error) {
      
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
export class PersonnelUploadCSVDialogBox {
  isLoading = false; 

  constructor( 
      public dialogRef: MatDialogRef<PersonnelUploadCSVDialogBox>, 
      private toastr: ToastrService,
      private personnelService: PersonnelService, 
  ) {}

  upload(event: Event) {
    this.isLoading = true;
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log({files});

    const file = files.item(0);
    const data = new FormData();
    // @ts-ignore
    data.append('file', file); 

    this.personnelService.uploadCSV(data).subscribe({
      next: () => { 
        window.location.reload();
        this.toastr.success('Success!', 'Ajouté avec succès!');
        this.isLoading = false; 
        // this.close();
      },
      error: (e) => {
        this.isLoading = false;
        this.close();
        this.toastr.error(`${e.error.message}`, 'Oupss!');
        window.alert(e.error.message);
        console.log(e);
        
      }
    });
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
