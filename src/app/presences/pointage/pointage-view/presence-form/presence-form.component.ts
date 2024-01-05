import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { PenaliteAddDialogBox } from 'src/app/penalites/penalites.component';
import { PenaliteService } from 'src/app/penalites/penalite.service';
import { monnaieDataList } from 'src/app/shared/tools/monnaie-list';
import { ApointementModel } from 'src/app/presences/models/presence-model';
import { PresenceService } from 'src/app/presences/presence.service';

@Component({
  selector: 'app-presence-form',
  templateUrl: './presence-form.component.html',
  styleUrls: ['./presence-form.component.scss']
})
export class PresenceFormComponent {
  @Input('personne') personne: PersonnelModel; 

  isLoadingForm = false;
  isLoading = false;

  formGroup!: FormGroup;

  currentUser: PersonnelModel | any;

  prestationList: any[] = []

 
  apointementLastItem: ApointementModel[] = [];
  apointementItem: ApointementModel;

  isAbsense = false; // Date de reprise pour les congés
  isPresence = false; //Si la personne est presente ou absence autorisée 

  isDisable = true;

  isPToday = false;
  isAToday = false;
  isAAToday = false; 
  isAMToday = false;
  isCDToday = false;
  isCAToday = false;
  isCOToday = false;
  isSToday = false;
  isOToday = false;
  isMToday = false;

  isPTodayForm = false;
  isATodayForm = false;
  isAATodayForm = false; 
  isAMTodayForm = false;
  isCDTodayForm = false;
  isCATodayForm = false;
  isCOTodayForm = false;
  isSTodayForm = false;
  isOTodayForm = false;
  isMTodayForm = false;

  apointementList: string[] = [
    'P',
    'A',
    'AA',
    'AM',
    'CC',
    'CA',
    'S', 
    'O',
    'M'
  ];

  constructor(
    private router: Router,
      public themeService: CustomizerSettingsService,
      private authService: AuthService,
      private _formBuilder: FormBuilder,
      private presenceService: PresenceService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {
    this.prestationList = [
      { pres:'Journée entière', cote: 1},
      { pres:'Demi-journée', cote: 0.5},
    ]
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.presenceService.getLastItem(this.personne.code_entreprise, this.personne.matricule).subscribe((res: ApointementModel[]) => {
          this.apointementLastItem = res;
          this.apointementItem = this.apointementLastItem[0]; 
          if(this.apointementItem != null) {
            const dateToday = new Date();
            const day = dateToday.getDate();
            const dayMonth = dateToday.getMonth();
            const dayYear = dateToday.getFullYear(); 
            // Date d'entree 
            const dateEntree = new Date(this.apointementItem.date_entree);
            const dateEntreeDay = dateEntree.getDate();
            const dateEntreeMonth = dateEntree.getMonth();
            const dateEntreeYear = dateEntree.getFullYear(); 
      
            var dataSortie = new Date(this.apointementItem.date_sortie);
      
            const datePresenceSortie = formatDate(dataSortie, 'dd-MM-yyyy', 'en-US');
            const dateAujourdui = formatDate(dateToday, 'dd-MM-yyyy', 'en-US'); 
      
            if (this.apointementItem.apointement === 'P') {
              if (dateEntreeDay === day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
                this.isPToday = true;
              }
              if (dateEntreeDay < day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
                this.isPTodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'A'){
              if (dateEntreeDay === day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
                this.isAToday = true;
              }
              if (dateEntreeDay < day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
                this.isATodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'AA'){
              if (dateEntreeDay === day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
                this.isAAToday = true;
              }
              if (dateEntreeDay < day && dateEntreeMonth === dayMonth && dateEntreeYear === dayYear) {
                this.isAATodayForm = true;
              }
            }
            
            
            else if(this.apointementItem.apointement === 'AM'){
              if (dataSortie > dateToday) {
                this.isAMToday = true;
              }
              if (datePresenceSortie <= dateAujourdui) { 
                this.isAMTodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'CC'){
              if (dataSortie > dateToday) {
                this.isCDToday = true;
              }
              if (datePresenceSortie <= dateAujourdui) {
                this.isCDTodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'CA'){
              if (dataSortie > dateToday) {
                this.isCAToday = true;
              }
              if (datePresenceSortie <= dateAujourdui) {
                this.isCATodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'S'){
              if (dataSortie > dateToday) {
                this.isSToday = true;
              }
              if (datePresenceSortie <= dateAujourdui) {
                this.isSTodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'O'){
              if (dataSortie > dateToday) {
                this.isOToday = true;
              }
              if (datePresenceSortie <= dateAujourdui) {
                this.isOTodayForm = true;
              }
            } else if(this.apointementItem.apointement === 'M'){
              if (dataSortie > dateToday) {
                this.isMToday = true;
              }
              if (datePresenceSortie <= dateAujourdui) {
                this.isMTodayForm = true;
              }
            }
          }
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });


    
    this.formGroup = this._formBuilder.group({
      apointement: ['', Validators.required],
      prestation: ['0', Validators.required],
      observation: ['Rien à signaler', Validators.required],
      date_sortie: ['-', Validators.required]
    });
    
  }

  onPresenceChange(event: any) { 
    if (
      event.value === 'AM' || event.value === 'CC' || 
      event.value === 'CA' || event.value === 'S' || 
      event.value === 'O' || event.value === 'M') { 
      this.isAbsense = true;  // Date de reprise pour des congés
    } else if(event.value === 'P' || event.value === 'A' || 
      event.value === 'AA') {
      this.isAbsense = false; 
    } else {
      this.isAbsense = false;
    } 

    if(event.value === 'P' || event.value === 'AA' || event.value === 'AM') { 
      this.isPresence = true;  // Prestation de la journée
    } else {
      this.isPresence = false;
    }
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, personnel: number): void {
    this.dialog.open(PenaliteSAddDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        personnel: personnel
      }
    }); 
  } 


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoadingForm = true;
        var body = { 
          matricule: this.personne.matricule,
          apointement: this.formGroup.value.apointement, 
          prestation: this.isPresence ? this.formGroup.value.prestation: 0,
          observation: this.formGroup.value.observation,
          date_entree: new Date(),
          date_sortie: this.isAbsense ? this.formGroup.value.date_sortie : new Date(),
          site_location: this.currentUser.site_locations.site_location,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise,
          personnel: this.personne.id
        };
        this.presenceService.create(body).subscribe({
          next: (res) => { 
            this.formGroup.reset(); 
            this.toastr.success('Success!', 'Ajouté avec succès!');
            if(res['apointement'] === 'S') {
              this.openEditDialog('300ms', '100ms', this.personne.id);
            } 
            this.router.navigate(['/layouts/presences/pointage']);
            this.isLoadingForm = false;
          },
          error: (err) => {
            this.isLoadingForm = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      }
      
    } catch (error) {
      this.isLoadingForm = false;
      console.log(error);
    }
  } 

}



@Component({
  selector: 'penalite-s-dialog',
  templateUrl: './presence-s-penalite.html',
})
export class PenaliteSAddDialogBox implements OnInit {
  isLoading = false;

  formGroup!: FormGroup; 
 

  currentUser: PersonnelModel | any; 

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
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
    this.formGroup = this.formBuilder.group({  
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
          personnel: this.data['personnel'],
          intitule: this.formGroup.value.intitule,
          monnaie: this.formGroup.value.monnaie,
          montant: this.formGroup.value.montant,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
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
