import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SalaireService } from '../salaire.service';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReleveSalaireModel } from '../models/releve-salaire-model';
import { CorporateService } from 'src/app/preferences/corporates/corporate.service';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';

@Component({
  selector: 'app-releve-paie',
  templateUrl: './releve-paie.component.html',
  styleUrls: ['./releve-paie.component.scss']
})
export class RelevePaieComponent implements OnInit {

  releveList: ReleveSalaireModel[] = [];

  isLoading = false;
  isLoad = false;
  currentUser: PersonnelModel | any;

  corporateList: CorporateModel[] = []; 
  corporate: CorporateModel;
  classerList: any[] = []; 
  dateClasser: any;
  dateNow = new Date();
  dateMonth = 0;
  dateYear: any; 

  mois = '';
  date_paie:any;

  net_a_payer = 0;
  ipr = 0;
  cnss = 0;
  frais_bancaire = 0;
  rbi_total = 0;

  heure_supp_total = 0;
  prime_total = 0;
  penalite_total = 0;
  syndicat_total = 0; 

  formGroup!: FormGroup; 


  constructor( 
      public themeService: CustomizerSettingsService,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private corporateService: CorporateService,
      private salaireService: SalaireService, 
      public dialog: MatDialog,
  ) {}


  toggleTheme() {
      this.themeService.toggleTheme();
  }

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
    this.salaireService.classerDisponible(this.currentUser.code_entreprise, this.corporate.id).subscribe(classer => {
      this.classerList = classer;
      this.isLoad = false;
    });
  }

  onChangeClasser(event: any) {
    this.isLoad = true;
    var month = event.value.month;
    var year = event.value.year; 
    this.salaireService.relevePaie(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(res => {
      this.releveList = res;

      this.salaireService.netAPayerTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        net_a_payer => {
          var net_a_payE = net_a_payer;
          net_a_payE.map((item: any) => this.net_a_payer = parseFloat(item.sum));  
        }
      );
      this.salaireService.iprTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        ipr => {
          var iprs = ipr;
          iprs.map((item: any) => this.ipr = parseFloat(item.sum));
        }
      );
      this.salaireService.cnssQPOTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        cnss => {
          var cnssQPO = cnss; 
          cnssQPO.map((item: any) => this.cnss = parseFloat(item.sum));
        }
      );
      this.salaireService.rbiTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        rbi => {
          var rbis = rbi; 
          rbis.map((item: any) => this.rbi_total = parseFloat(item.sum));
        }
      );
      this.salaireService.heureSuppTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        heure_supp => {
          var heure_supps = heure_supp;
          heure_supps.map((item: any) => this.heure_supp_total = parseFloat(item.sum));  
        }
      );
      this.salaireService.primeTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        prime => {
          var primes = prime;
          primes.map((item: any) => this.prime_total = parseFloat(item.sum));
        }
      );
      this.salaireService.penalitesTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        penalites => {
          var penalitess = penalites; 
          penalitess.map((item: any) => this.penalite_total = parseFloat(item.sum));
        }
      );
      this.salaireService.syndicatTotal(this.currentUser.code_entreprise, this.corporate.code_corporate, month, year).subscribe(
        syndicat => {
          var syndicats = syndicat; 
          syndicats.map((item: any) => this.syndicat_total = parseFloat(item.sum));
        }
      ); 
    });
    this.isLoad = false;
  } 
 

  onFilter() {
    var body = {
      entreprise: this.formGroup.value.entreprise,
      classeur: this.formGroup.value.classeur,
    };

    // console.log('body', this.formGroup.value.entreprise);

    // console.log('entreprise', body.entreprise);
    
    if (body.classeur.month == undefined && body.classeur.year == undefined) { 
      var date = new Date();
      var month = date.getMonth() + 1;
      var year = date.getFullYear(); 
      this.salaireService.relevePaie(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(res => {
        this.releveList = res;
        var datePaieList = this.classerList.filter((v) => v.month == month.toString() && v.year == year.toString());
        this.dateClasser = datePaieList[datePaieList.length-1];
        this.dateMonth = new Date(this.dateClasser).getMonth();
          this.dateYear =  new Date(this.dateClasser).getFullYear();
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
        }
        
        this.salaireService.netAPayerTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          net_a_payer => {
            var net_a_payE = net_a_payer;
            net_a_payE.map((item: any) => this.net_a_payer = parseFloat(item.sum));  
          }
        );
        this.salaireService.iprTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          ipr => {
            var iprs = ipr;
            iprs.map((item: any) => this.ipr = parseFloat(item.sum));
          }
        );
        this.salaireService.cnssQPOTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          cnss => {
            var cnssQPO = cnss; 
            cnssQPO.map((item: any) => this.cnss = parseFloat(item.sum));
          }
        );
        this.salaireService.rbiTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          rbi => {
            var rbis = rbi; 
            rbis.map((item: any) => this.rbi_total = parseFloat(item.sum));
          }
        );
        this.salaireService.heureSuppTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          heure_supp => {
            var heure_supps = heure_supp;
            heure_supps.map((item: any) => this.heure_supp_total = parseFloat(item.sum));  
          }
        );
        this.salaireService.primeTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          prime => {
            var primes = prime;
            primes.map((item: any) => this.prime_total = parseFloat(item.sum));
          }
        );
        this.salaireService.penalitesTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          penalites => {
            var penalitess = penalites; 
            penalitess.map((item: any) => this.penalite_total = parseFloat(item.sum));
          }
        );
        this.salaireService.syndicatTotal(this.currentUser.code_entreprise, body.entreprise, month.toString(), year.toString()).subscribe(
          syndicat => {
            var syndicats = syndicat; 
            syndicats.map((item: any) => this.syndicat_total = parseFloat(item.sum));
          }
        ); 
      });
    }
    if (body.classeur.month != undefined && body.classeur.year != undefined) { 
      this.salaireService.relevePaie(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(res => {
        this.releveList = res;

        this.salaireService.netAPayerTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          net_a_payer => {
            var net_a_payE = net_a_payer;
            net_a_payE.map((item: any) => this.net_a_payer = parseFloat(item.sum));  
          }
        );
        this.salaireService.iprTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          ipr => {
            var iprs = ipr;
            iprs.map((item: any) => this.ipr = parseFloat(item.sum));
          }
        );
        this.salaireService.cnssQPOTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          cnss => {
            var cnssQPO = cnss; 
            cnssQPO.map((item: any) => this.cnss = parseFloat(item.sum));
          }
        );
        this.salaireService.rbiTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          rbi => {
            var rbis = rbi; 
            rbis.map((item: any) => this.rbi_total = parseFloat(item.sum));
          }
        );
        this.salaireService.heureSuppTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          heure_supp => {
            var heure_supps = heure_supp;
            heure_supps.map((item: any) => this.heure_supp_total = parseFloat(item.sum));  
          }
        );
        this.salaireService.primeTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          prime => {
            var primes = prime;
            primes.map((item: any) => this.prime_total = parseFloat(item.sum));
          }
        );
        this.salaireService.penalitesTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          penalites => {
            var penalitess = penalites; 
            penalitess.map((item: any) => this.penalite_total = parseFloat(item.sum));
          }
        );
        this.salaireService.syndicatTotal(this.currentUser.code_entreprise, body.entreprise, body.classeur.month, body.classeur.year).subscribe(
          syndicat => {
            var syndicats = syndicat; 
            syndicats.map((item: any) => this.syndicat_total = parseFloat(item.sum));
          }
        ); 
      });
    } 
  } 




  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SalaireExportXLSXDialogBox, {
      width: '600px', 
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  }

}



@Component({
  selector: 'salaire-export-xlsx-dialog',
  templateUrl: './salaire-export-xlsx.html',
})
export class SalaireExportXLSXDialogBox implements OnInit {
  isLoading = false;
  currentUser: PersonnelModel | any;

  // dateRange = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl() 
  // });
  dateRange!: FormGroup;

  classerList: any[] = [];

  constructor( 
      public dialogRef: MatDialogRef<SalaireExportXLSXDialogBox>,
      private _formBuilder: FormBuilder,
      private toastr: ToastrService,
      private salaireService: SalaireService,
      private router: Router,
      private authService: AuthService,
  ) {}


  ngOnInit(): void {
    this.dateRange = this._formBuilder.group({
      start: ['', Validators.required],
      end: ['-', Validators.required]
    });
    
    this.authService.user().subscribe({
      next: (user) => {
          this.currentUser = user; 
          this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    }); 
  }

  

  onSubmit() {
    this.isLoading = true; 
    if (this.dateRange.valid) {
      var dateNow = new Date();
      var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
      var start_date = formatDate(this.dateRange.value.start, 'yyyy-MM-dd', 'en-US');
      var end_date = formatDate(this.dateRange.value.end, 'yyyy-MM-dd', 'en-US'); 
      this.salaireService.downloadReport(
          this.currentUser.code_entreprise,
          start_date,
          end_date
        ).subscribe({
        next: (res) => {
          this.isLoading = false;
          // const blob = new Blob([res], {type: 'text/xlsx'});
          const downloadUrl = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Remuneration-${dateNowFormat}.xlsx`;
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
