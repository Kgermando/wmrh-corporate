import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';   
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ApointementModel } from '../models/presence-model';
import { PresenceService } from '../presence.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { SiteLocationModel } from 'src/app/preferences/site-location/models/site-location-model';
import { SiteLocationService } from 'src/app/preferences/site-location/site-location.service';
import { CorporateService } from 'src/app/preferences/corporates/corporate.service';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';
import { Papa } from 'ngx-papaparse';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-registre-presence',
  templateUrl: './registre-presence.component.html',
  styleUrls: ['./registre-presence.component.scss']
})
export class RegistrePresenceComponent implements OnInit { 
  @Input('personne') personne: PersonnelModel; 
  
  displayedColumns: string[] = ['site_location', 'matricule', 'apointement', 'prestation', 'date_entree', 'date_sortie', 'observation'];
  
  ELEMENT_DATA: ApointementModel[] = []; 
  
  dataSource = new MatTableDataSource<ApointementModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<ApointementModel>(true, []);

  isLoading = false;
  isLoad = false;
  currentUser: PersonnelModel; 

  corporateList: CorporateModel[] = [];
  corporate: CorporateModel;
  siteLocationList: SiteLocationModel[] = [];
  siteLocation: SiteLocationModel;

  formGroup!: FormGroup;
  date_presence: any;

  mois = '';
  dateNow = new Date();
  dateMonth = 0; 


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

 
  constructor(
    private formBuilder: FormBuilder,
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private presenceService: PresenceService,
      private corporateService: CorporateService,
      public dialog: MatDialog,
      private toastr: ToastrService,
  ) {}

  toggleTheme() {
      this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    this.dateNow = new Date();
    this.dateMonth = this.dateNow.getMonth() + 1; 

    if (this.dateMonth === 1) {
        this.mois = 'Janvier';
    } else if(this.dateMonth === 2) {
        this.mois = 'Fevrier';
    } else if(this.dateMonth === 3) {
        this.mois = 'Mars';
    } else if(this.dateMonth === 4) {
        this.mois = 'Avril';
    } else if(this.dateMonth === 5) {
        this.mois = 'Mai';
    } else if(this.dateMonth === 6) {
        this.mois = 'Juin';
    } else if(this.dateMonth === 7) {
        this.mois = 'Juillet';
    } else if(this.dateMonth === 8) {
        this.mois = 'Aôut';
    } else if(this.dateMonth === 9) {
        this.mois = 'Septembre';
    } else if(this.dateMonth === 10) {
        this.mois = 'Octobre';
    } else if(this.dateMonth === 11) {
        this.mois = 'Novembre';
    } else if(this.dateMonth === 12) {
        this.mois = 'Décembre';
    } else {
        ''
    }

    this.formGroup = this.formBuilder.group({  
      date_presence: new FormControl(new Date()),
    }); 

    this.isLoading = true;
      this.authService.user().subscribe({
          next: (user) => {
            this.currentUser = user;
            this.corporateService.getAll(this.currentUser.code_entreprise).subscribe(res => {
              this.corporateList = res;
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
    this.corporate = event.value;
    this.siteLocationList = this.corporate.site_locations;

    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<ApointementModel>(this.ELEMENT_DATA);
  }

  onChangeSiteLocation(event: any) { 
    this.isLoad = true;
    this.siteLocation = event.value;

    this.onChange(this.siteLocation);
    this.isLoad = false;
  }

 
  onChange(siteLocation: SiteLocationModel) { 
    if (!this.date_presence) {
      var datePresence = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.presenceService.getRegisterPresence(
          siteLocation.code_entreprise, siteLocation.site_location, datePresence).subscribe(res => {
          this.ELEMENT_DATA = res;
          this.dataSource = new MatTableDataSource<ApointementModel>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
      });
    }
    this.formGroup.valueChanges.subscribe(val => {
      this.date_presence = val.date_presence;
      var datePresence = formatDate(this.date_presence, 'yyyy-MM-dd', 'en-US'); 
      this.presenceService.getRegisterPresence(
        siteLocation.code_entreprise, siteLocation.site_location, datePresence).subscribe(res => {
          this.ELEMENT_DATA = res; 
          this.dataSource = new MatTableDataSource<ApointementModel>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.presenceService
        .delete(id)
        .subscribe(() => this.ELEMENT_DATA = this.ELEMENT_DATA.filter(item => item.id !== id));
    }
  }

  openUploadDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PresenceUploadCSVDialogBox, {
      width: '600px', 
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 


  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PresenceExportXLSXDialogBox, {
      width: '600px', 
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }

  downloadModelReport() {
    try {
      this.isLoading = true;
      if (this.ELEMENT_DATA.length > 0) {
        if (this.currentUser.site_locations.site_location) {
          this.presenceService.downloadModelReport(
            this.currentUser.code_entreprise, 
            this.currentUser.site_locations.site_location).subscribe({
          next: (res) => {
            this.isLoading = false; 
            const downloadUrl = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `FICHE_DE_PRESENCES.xlsx`;
            link.click();
            this.toastr.info('Extraction effectuée!', 'Info!'); 
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err); 
          }
        });
        } else {
          this.toastr.warning('Vous n\'avez pas créé le site de travail!', 'Infos!');
          this.isLoading = false;
        }
      } else {
        this.toastr.info('Effectuez au moins une presence pour avoir le modèle', 'Infos!');
        this.isLoading = false;
      }
      
      
    } catch (error) {
      
    }
  } 

}


@Component({
  selector: 'presence-upload-csv-dialog',
  templateUrl: './presence-upload-csv.html',
})
export class PresenceUploadCSVDialogBox {
  isLoading = false; 
  presenceList: ApointementModel[] = [];
  pointage: ApointementModel;
  currentUser: PersonnelModel | any;
  personneList: PersonnelModel[] = [];
  personne: PersonnelModel;

  constructor( 
      public dialogRef: MatDialogRef<PresenceUploadCSVDialogBox>, 
      private toastr: ToastrService,
      private router: Router,
      private papa: Papa,
      private authService: AuthService,
      private presenceService: PresenceService,
      private personnelService: PersonnelService,
  ) {}

  ngOnInit() { 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.personnelService.getAll(this.currentUser.code_entreprise).subscribe((res) => {
          this.personneList = res;
        });
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
        skipEmptyLines: true,
        encoding: 'utf-8',
        step: (row) => {
          this.pointage = row.data;
          this.personne = this.personneList.filter((v) => v.matricule == this.pointage.matricule)[0];
          if (this.personne) {
            var body = {
              matricule: this.personne.matricule,
              apointement: this.pointage.apointement, 
              prestation: this.pointage.prestation,
              observation: this.pointage.observation,
              date_entree: new Date(this.pointage.date_entree),
              date_sortie: new Date(this.pointage.date_sortie),
              site_location: this.currentUser.site_locations.site_location,
              signature: this.currentUser.matricule,
              created: new Date(),
              update_created: new Date(),
              entreprise: this.currentUser.entreprise,
              code_entreprise: this.currentUser.code_entreprise,
              personnel: this.personne.id,
              corporate: this.personne.corporates.id
            };
            this.presenceService.create(body).subscribe({
              next: () => {},
              error: (err) => {
                this.isLoading = false;
                this.toastr.error(`${err.error.message}`, 'Oupss!');
                console.log(err);
                this.close();
              }
            });
          } else {
            this.toastr.info(`Verifiez les matricules`, 'Un soucis!');
            this.close();
          }
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
      this.isLoading = false;  
    }
 
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }
  
  close(){
      this.dialogRef.close(true);
  } 

}




@Component({
  selector: 'presence-export-xlsx-dialog',
  templateUrl: './presence-export-xlsx.html',
})
export class PresenceExportXLSXDialogBox implements OnInit {
  isLoading = false;
  currentUser: PersonnelModel | any;

  siteLocationList: SiteLocationModel[] = [];
  dateRange!: FormGroup;

  constructor( 
      public dialogRef: MatDialogRef<PresenceExportXLSXDialogBox>, 
      private toastr: ToastrService,
      private _formBuilder: FormBuilder,
      private presenceService: PresenceService,
      private router: Router,
      private authService: AuthService,
      private siteLocation: SiteLocationService,
  ) {}


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
          this.currentUser = user;
          this.siteLocation.getAll(this.currentUser.code_entreprise).subscribe(res => {
            this.siteLocationList = res;
          });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
    this.dateRange = this._formBuilder.group({
      site_location: ['', Validators.required],
      start: ['', Validators.required],
      end: ['-', Validators.required]
    });
  }

  

  onSubmit() {
    this.isLoading = true; 
    if (this.dateRange.valid) {
      var dateNow = new Date();
      var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
      var start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
      var end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US'); 
      this.presenceService.downloadReport(
          this.currentUser.code_entreprise,
          this.dateRange.value.site_location,
          start_date,
          end_date
        ).subscribe({
        next: (res) => {
          this.isLoading = false;
          const blob = new Blob([res], {type: 'text/xlsx'});
          const downloadUrl = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Presences-${dateNowFormat}.xlsx`;
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
  } 


  close(){
      this.dialogRef.close(true);
  } 

}
