import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SalaireModel } from '../../models/salaire-model';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SalaireService } from '../../salaire.service';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { ToastrService } from 'ngx-toastr';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common'; 
import { NotifyService } from 'src/app/notify/notify.service';

import jsPDF from "jspdf";
// import html2canvas from 'html2canvas'; 
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
 

@Component({
  selector: 'app-fiche-paie',
  templateUrl: './fiche-paie.component.html',
  styleUrls: ['./fiche-paie.component.scss']
})
export class FichePaieComponent implements OnInit {
  isLoading = false;

  title = 'Traitement de la Fiche de paie';

  @ViewChild('htmlData', { static: false}) htmlData!: ElementRef;

  isPublie = false;

  salaire: SalaireModel;

  preference: PreferenceModel;

  currentUser: PersonnelModel | any;

  formGroup!: FormGroup;
 

  alloc_logement = 0;
  alloc_transport = 0;
  alloc_familliale = 0;
  soins_medicaux = 0;
  salaire_base = 0;
  primes = 0;
  prime_anciennete = 0;
  heure_supplementaire_monnaie = 0;
  rbi = 0;
  rni = 0;
  ipr = 0;
  impot_elide = 0;
  syndicat = 0;
  cnss_qpo = 0;
  penalites = 0;
  avance_slaire = 0;
  prise_en_charge_frais_bancaire = 0; 
  pres_entreprise = 0;
  net_a_payer = 0;


  // Condition pour verrouiller l'allocation input si negatif
  alloc_logementPlafond = 0;
  alloc_transportPlafond = 0;
  alloc_famillialePlafond = 0;
  redressement = 0;


  fardeList: any[] = [];
  dateFarde: any;
  dateNow = new Date();
  dateMonth = 0;
  dateYear = 0; 

  mois = '';
 

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private salaireService: SalaireService,
    private reglageService: ReglageService,
    private personnelService: PersonnelService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private notifyService: NotifyService
    // private notificationService: NotificationService
    ) {} 

    public toggle(event: MatSlideToggleChange) {
      this.isPublie = event.checked;
    }


    ngOnInit(): void { 
      this.formGroup = this._formBuilder.group({
        alloc_logement: ['', Validators.required],
        alloc_transport: ['', Validators.required],
        alloc_familliale: ['', Validators.required],
        soins_medicaux: ['', Validators.required],
        salaire_base: ['', Validators.required],
        primes: ['', Validators.required],
        prime_anciennete: ['', Validators.required],
        heure_supplementaire_monnaie: ['', Validators.required],
        rbi: ['', Validators.required],
        rni: ['', Validators.required],
        ipr: ['', Validators.required],
        impot_elide: ['', Validators.required],
        syndicat: ['', Validators.required],
        cnss_qpo: ['', Validators.required],
        penalites: ['', Validators.required],
        avance_slaire: ['', Validators.required],
        prise_en_charge_frais_bancaire: ['', Validators.required],
        pres_entreprise: ['', Validators.required],
        net_a_payer: ['', Validators.required],
        statut: this.isPublie ? 'Disponible' : 'Traitement',  
      });

      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');
          this.salaireService.get(Number(id)).subscribe(res => {
            this.salaire = res;
            var date = new Date(this.salaire.date_paie);
              this.dateMonth = date.getMonth() + 1;
              this.dateYear =  date.getFullYear();
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
            this.reglageService.preference(this.salaire.personnel.corporates.code_corporate).subscribe(reglage => {
              this.preference = reglage;
              this.formGroup.patchValue({
                alloc_logement: parseFloat(this.salaire.alloc_logement),
                alloc_transport: parseFloat(this.salaire.alloc_transport),
                alloc_familliale: parseFloat(this.salaire.alloc_familliale),
                soins_medicaux: parseFloat(this.salaire.soins_medicaux),
                salaire_base: parseFloat(this.salaire.salaire_base),
                primes: parseFloat(this.salaire.primes),
                prime_anciennete: parseFloat(this.salaire.prime_anciennete),
                heure_supplementaire_monnaie: parseFloat(this.salaire.heure_supplementaire_monnaie),
                rbi: this.rbi,  // Remuneration brute imposable
                rni: parseFloat(this.salaire.rni),  // Remuneration Nette Imposable
                ipr: parseFloat(this.salaire.ipr),  // Impôt Professionnel sur les Rémunérations (IPR)
                impot_elide: parseFloat(this.salaire.impot_elide),
                syndicat: parseFloat(this.salaire.syndicat),  // 1 %
                penalites: parseFloat(this.salaire.penalites),  // Sanctions sur le salaire net à payer
                avance_slaire: parseFloat(this.salaire.avance_slaire),
                prise_en_charge_frais_bancaire:  parseFloat(this.salaire.prise_en_charge_frais_bancaire),
                pres_entreprise: parseFloat(this.salaire.pres_entreprise),
                net_a_payer: parseFloat(this.salaire.net_a_payer),
                statut: this.isPublie ? 'Disponible' : 'Traitement',
                signature: this.currentUser.matricule,
                update_created: new Date(),
                entreprise: this.currentUser.entreprise,
                code_entreprise: this.currentUser.code_entreprise
              });
            });
            
            this.onChanges();
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

    onChanges(): void {
      this.formGroup.valueChanges.subscribe(val => {

      // Variables 
      this.salaire_base = +val.salaire_base;
      this.soins_medicaux = +val.soins_medicaux; 
      // Aciennetés 
      if(this.salaire.anciennete_nbr_age >5 && this.salaire.anciennete_nbr_age <= 10) {
        this.prime_anciennete = this.salaire_base * this.preference.prime_ancien_5 / 100; 

      } else if(this.salaire.anciennete_nbr_age >10 && this.salaire.anciennete_nbr_age <= 15) {
        this.prime_anciennete = this.salaire_base * this.preference.prime_ancien_10 / 100;
        
      } else if(this.salaire.anciennete_nbr_age >15 && this.salaire.anciennete_nbr_age <= 20) {
        this.prime_anciennete = this.salaire_base * this.preference.prime_ancien_15 / 100;
        
      } else if(this.salaire.anciennete_nbr_age >20 && this.salaire.anciennete_nbr_age <= 25) {
        this.prime_anciennete = this.salaire_base * this.preference.prime_ancien_20 / 100;
        
      } else if(this.salaire.anciennete_nbr_age >25) {
        this.prime_anciennete = this.salaire_base * this.preference.prime_ancien_25 / 100; 
      }


      // Se refère dans les donnés de heures pour les conditions
      if(this.salaire.heures_supp >= 2 && this.salaire.heures_supp <6) {
        this.heure_supplementaire_monnaie = this.salaire_base * 30 / 100;
      } else if(this.salaire.heures_supp >=6 && this.salaire.heures_supp <8) {
        this.heure_supplementaire_monnaie = this.salaire_base * 30 / 100;
      } else if(this.salaire.heures_supp >= 8) {
        this.heure_supplementaire_monnaie = this.salaire_base * 100 / 100;
      }

      // Remuneration Brute impôsable
      this.rbi = this.salaire_base + +val.primes + this.prime_anciennete + this.heure_supplementaire_monnaie;
 

      // Avantages sociaux
      this.alloc_familliale = +val.alloc_familliale;
      this.alloc_transport = +val.alloc_transport;
      this.alloc_logement = +val.alloc_logement; 


      // L'allocation familliale
      if (this.salaire.personnel.nbr_dependants > 0) {
        this.alloc_famillialePlafond = (parseFloat(this.preference.smig) *  
            this.salaire.personnel.nbr_dependants * this.salaire.nbre_jrs_preste);
      } else if(this.salaire.personnel.nbr_dependants == 0) {
        this.alloc_famillialePlafond = (parseFloat(this.preference.smig) * this.salaire.nbre_jrs_preste);
      }
      

       var alloc_famillialeExces = 0;
        if (this.alloc_familliale > this.alloc_famillialePlafond) {
          alloc_famillialeExces = this.alloc_familliale - this.alloc_famillialePlafond;
        } else if (this.alloc_famillialePlafond <= this.alloc_familliale) {
          alloc_famillialeExces = 0;
        }

        // L'allocation transport
        if (this.salaire.personnel.category === 'Cadres supérieurs' ||
            this.salaire.personnel.category === 'Cadres subalternes') {
              this.alloc_transportPlafond = (this.preference.courses_transport * 
                parseFloat(this.preference.montant_travailler_quadre) * this.salaire.nbre_jrs_preste);  
        } else {
          this.alloc_transportPlafond = (this.preference.courses_transport * 
            parseFloat(this.preference.montant_travailler_non_quadre) * this.salaire.nbre_jrs_preste);  
        }

        var alloc_transportExces = 0;
        if (this.alloc_transport > this.alloc_transportPlafond) {
          alloc_transportExces = this.alloc_transport - this.alloc_transportPlafond;
        } else if (this.alloc_transport <= this.alloc_transportPlafond) {
          alloc_transportExces = 0;
        } 

        // L'allocation logement à ne pas dépasser
        this.alloc_logementPlafond = this.rbi * 30 / 100; // Le logement ne depasse le 30% de rbi 
        
        var alloc_logementExces = 0;
        if (this.alloc_logement > this.alloc_logementPlafond) {
          alloc_logementExces = this.alloc_logement - this.alloc_logementPlafond;
        } else if (this.alloc_logement <= this.alloc_logementPlafond) {
          alloc_logementExces = 0;
        } 
      
      // Redressement de la base net imposable
      this.redressement = (alloc_famillialeExces + alloc_transportExces + alloc_logementExces);

      // NETTE IMPOSABELE
      this.cnss_qpo = this.rbi * parseFloat(this.preference.cnss_qpo) / 100; // (RBI * CNSQPO)

      // Remuneration Nette impôsable
      this.rni = this.rbi - this.cnss_qpo + this.redressement; // RNI = RBI-(RBI * CNSQPO) 

      

    // Calcul IPR retenu
      var iprRetenu = 0;
      var iprTrois = 0;
      var iprQuinze = 0;
      var iprTrente = 0;

      if (this.rni <= +this.preference.bareme_3) {
        iprRetenu = this.rni * 3 / 100;
        iprTrois = (+this.preference.bareme_3 - 0) * 3 / 100;

      } else if (this.rni <= +this.preference.bareme_15){
        iprRetenu = (this.rni - +this.preference.bareme_3) * 15 / 100 + iprTrois;
        iprQuinze = +this.preference.bareme_15 * 15 / 100;

      } else if (this.rni <= +this.preference.bareme_30){
        iprRetenu = (this.rni - +this.preference.bareme_30) * 30 / 100 + iprTrois + iprQuinze;
        iprTrente = +this.preference.bareme_15 * 30 / 100;

      } else if (this.rni > +this.preference.bareme_30 + 1){
        iprRetenu = (this.rni - +this.preference.bareme_30) * 40 / 100 + iprTrois + iprQuinze + iprTrente;
      }

 
      // IPR à payé 
      if (this.salaire.personnel.nbr_dependants > 0) {
        this.ipr = iprRetenu - (iprRetenu * this.salaire.personnel.nbr_dependants * 2 / 100);
      } else if (this.salaire.personnel.nbr_dependants == 0) {
        this.ipr = iprRetenu - (iprRetenu * 2 / 100);
      }
      

      // Impôt Elide trouvé 
      this.impot_elide = this.redressement - this.ipr;

      if (this.impot_elide > 0) {
        this.impot_elide = this.impot_elide;
      } else {
        this.impot_elide = 0;
      }

   
      if (this.salaire.personnel.syndicat) {
        this.syndicat = this.rni * parseFloat(this.preference.cotisation_syndicale) / 100;
      }

      // Prise_en_charge_frais_bancaire
      if(this.preference.prise_en_charge_frais_bancaire) {
        this.prise_en_charge_frais_bancaire = parseFloat(this.salaire.personnel.frais_bancaire);
      }

      this.penalites = +val.penalites;
      this.avance_slaire = +val.avance_slaire;
      this.syndicat = +val.syndicat;
      this.pres_entreprise = +val.pres_entreprise;
      
      var deductions = this.ipr + this.penalites + this.avance_slaire + this.syndicat + this.pres_entreprise;

      console.log('penalites', this.penalites)

      var avantageSocials = +this.alloc_logement + +this.alloc_familliale  +  +val.primes +
        +this.prime_anciennete + +this.heure_supplementaire_monnaie + 
          +this.prise_en_charge_frais_bancaire + +val.soins_medicaux;
 

        let net_a_payE = this.rni + avantageSocials - deductions;

        this.net_a_payer = parseFloat(net_a_payE.toFixed(2));
      });
    }

        
  

    onSubmit() { 
      try {
        this.isLoading = true;
        this.formGroup.patchValue({
          alloc_logement: this.alloc_logement,
          alloc_transport: this.alloc_transport,
          alloc_familliale: this.alloc_familliale,
          soins_medicaux: this.soins_medicaux,
          salaire_base: this.salaire_base,
          primes: this.primes,
          prime_anciennete: this.prime_anciennete,
          heure_supplementaire_monnaie: this.heure_supplementaire_monnaie,
          rbi: this.rbi,
          rni: this.rni,
          ipr: this.ipr,
          impot_elide: this.impot_elide,
          syndicat: this.syndicat,
          cnss_qpo: this.cnss_qpo,
          penalites: this.penalites,
          avance_slaire: this.avance_slaire,
          prise_en_charge_frais_bancaire: this.prise_en_charge_frais_bancaire,
          net_a_payer: this.net_a_payer,
          statut: this.isPublie ? 'Disponible' : 'Traitement',
          signature: this.currentUser.matricule, 
          update_created: new Date(),
        });
        this.salaireService.update(this.salaire.id, this.formGroup.getRawValue())
        .subscribe({
          next: () => {
            var personnel = {  
              statut_paie: 'Disponible',
              signature: this.currentUser.matricule,
              update_created: new Date(),
              entreprise: this.currentUser.entreprise,
              code_entreprise: this.currentUser.code_entreprise
            };
            this.personnelService.update(this.salaire.personnel.id, personnel).subscribe(
              () => {
                if (this.isPublie) {
                  var bodyNotify = {
                    personnel: this.salaire.personnel.id,
                    is_read: false,
                    title: `Bulletin ${this.mois} disponible.`,
                    // title: (this.salaire.personnel.sexe == 'Homme') 
                    //   ? `Bonjour Monsieur ${this.salaire.personnel.prenom.toUpperCase()} ${this.salaire.personnel.nom.toUpperCase()} votre bulletin de paie est maintement disponible.`
                    //   : `Bonjour Madame ${this.salaire.personnel.prenom.toUpperCase()} ${this.salaire.personnel.nom.toUpperCase()} votre bulletin de paie est maintement disponible.`,
                    route: `/layouts/salaires/disponible/${this.salaire.id}/bulletin-paie`,
                    signature: this.currentUser.matricule,
                    created: new Date(),
                    update_created: new Date(),
                    entreprise: this.currentUser.entreprise,
                    code_entreprise: this.currentUser.code_entreprise
                  };
                  this.notifyService.create(bodyNotify).subscribe(
                    res => {
                      // this.notificationService.subscribeToNotifications();
                      this.formGroup.reset();
                      this.router.navigate(['/layouts/salaires/statuts-paies']);
                      this.toastr.success(this.isPublie ? 'Bulletin publié' : 'Traitement enregistré', 'Success!');
                      this.isLoading = false;
                    }
                  )
                } else if (!this.isPublie) {
                  var bodyNotifyN = {
                    personnel: this.salaire.personnel.id,
                    is_read: false,
                    title: `Bulletin ${this.mois} en traitement.`,
                    // title: (this.salaire.personnel.sexe == 'Homme') 
                    //   ? `Bonjour Monsieur ${this.salaire.personnel.prenom.toUpperCase()}${this.salaire.personnel.nom.toUpperCase()} votre bulletin de paie est en traitement.`
                    //   : `Bonjour Madame ${this.salaire.personnel.prenom.toUpperCase()} ${this.salaire.personnel.nom.toUpperCase()} votre bulletin de paie est en traitement.`,
                    route: `/layouts/salaires/traitement/${this.salaire.id}/fiche-paie`, 
                    signature: this.currentUser.matricule,
                    created: new Date(),
                    update_created: new Date(),
                    entreprise: this.currentUser.entreprise,
                    code_entreprise: this.currentUser.code_entreprise
                  };
                  this.notifyService.create(bodyNotifyN).subscribe(
                    res => {
                      // this.notificationService.subscribeToNotifications();
                      this.formGroup.reset();
                      this.router.navigate(['/layouts/salaires/statuts-paies']);
                      this.toastr.success(this.isPublie ? 'Bulletin publié' : 'Traitement enregistré', 'Success!');
                      this.isLoading = false;
                    }
                  )
                }
              }, 
            )
            
            
            
           
          },
          error: err => {
            console.log(err);
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            this.isLoading = false;
          }
        }); 
      } catch (error) {
        this.isLoading = false;
        console.log(error);
      }
    }
 
    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { 

        var personnel = {
          date_paie: new Date(),
          statut_paie: 'En attente',
          signature: this.currentUser.matricule,
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
        };
        this.personnelService.update(this.salaire.personnel.id, personnel).subscribe({
          next: () => {  
            var salaire = {
              date_paie: new Date(),
              signature: this.currentUser.matricule,
              update_created: new Date(),
              entreprise: this.currentUser.entreprise,
              code_entreprise: this.currentUser.code_entreprise
            };
            this.salaireService.update(this.salaire.id, salaire).subscribe({
              next: () => {
                this.salaireService
                .delete(id)
                .subscribe(() => { 
                  this.toastr.info('Supprimé avec succès!', 'Supprimée!');
                  this.router.navigate(['/layouts/salaires', this.salaire.personnel.corporates.id, 'liste-paiements']);
                }); 
              }
            })
          },
          error: err => { 
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
        
      }
    } 


   
 

    // public openPDF(): void {
    //   let DATA: any = document.getElementById('htmlData');
    //   var dateNow = new Date();
    //   var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
    //   html2canvas(DATA).then((canvas) => {
    //     let fileWidth = 210;
    //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //     const FILEURI = canvas.toDataURL('image/png');
    //     let PDF = new jsPDF('p', 'mm', 'a4');
    //     let position = 0;
    //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //     PDF.save(`Bulletin-${dateNowFormat}.pdf`);
    //   });
    // }
    

    public openPDF(): void {
      let pdf = new jsPDF("p", "pt", "a4");
      var dateNow = new Date();
      var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
      pdf.html(this.htmlData.nativeElement, {
        callback: (pdf) => {
          pdf.addPage("a4", "p")
          pdf.save(`Bulletin-${dateNowFormat}.pdf`)
        }
      }) 
    }

    

    openNewTab() {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/layouts/salaires/calculate'])
      );
      window.open(url, '_blank');
    }

    openDialog() {
        this.dialog.open(CalculateDialog, { disableClose: true });
    }


    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}


@Component({
  selector: 'calculate-dialog',
  templateUrl: './calculate-dialog.html',
  styleUrls: ['./fiche-paie.component.scss']
})
export class CalculateDialog {

  constructor(
      public dialogRef: MatDialogRef<CalculateDialog>
  ) {}

  close(){
    this.dialogRef.close(true);
  }

}