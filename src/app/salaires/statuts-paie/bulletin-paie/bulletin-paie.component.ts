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
import jsPDF from "jspdf";
import { formatDate } from '@angular/common';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-bulletin-paie',
  templateUrl: './bulletin-paie.component.html',
  styleUrls: ['./bulletin-paie.component.scss']
})
export class BulletinPaieComponent implements OnInit {
  title = 'Bulletin de paie'; 

  isLoading = false;

  salaire: SalaireModel;

  preference: PreferenceModel;

  currentUser: PersonnelModel | any;

  rbiUSD = 0;
  rniUSD = 0;
  iprUSD = 0;
  syndicatUSD = 0;
  net_a_payerUSD = 0;
  penalitesUSD = 0;
  avanceSalaireNbrUSD = 0;
  heureSupplementaireMonnaieUSD = 0;
  primesUSD = 0;
  prime_ancienneteUSD = 0;
  alloc_famillialeUSD = 0;
  alloc_transportUSD = 0;
  alloc_logementUSD = 0;
  salaire_baseUSD = 0;
  prise_en_charge_frais_bancaireUSD = 0; 
  cnss_qpoUSD = 0;
  soins_medicauxUSD = 0;
  impot_elideUSD = 0;

  fardeList: any[] = [];
  dateFarde: any;
  dateNow = new Date();
  dateMonth = 0;
  dateYear = 0; 

  mois = '';

  @ViewChild('htmlData', { static: false}) htmlData!: ElementRef;

  delaiEditBulletin: Date;
  isValidDelai = false;
    

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private salaireService: SalaireService,
    private reglageService: ReglageService,
    private toastr: ToastrService) {}


    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');
          this.salaireService.get(Number(id)).subscribe(res => {
            this.salaire = res;
            var date = new Date(this.salaire.date_paie);
              this.dateMonth = date.getMonth();
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

            var net_a_payer = parseFloat(this.salaire.net_a_payer)  / parseFloat(this.salaire.taux_dollard);
            this.net_a_payerUSD = parseFloat(net_a_payer.toFixed(2)); 

            var rbi = parseFloat(this.salaire.rbi)  / parseFloat(this.salaire.taux_dollard);
            this.rbiUSD = parseFloat(rbi.toFixed(2));

            var rni = parseFloat(this.salaire.rni)  / parseFloat(this.salaire.taux_dollard);
            this.rniUSD = parseFloat(rni.toFixed(2));

            var ipr = parseFloat(this.salaire.ipr)  / parseFloat(this.salaire.taux_dollard);
            this.iprUSD = parseFloat(ipr.toFixed(2));

            var syndicat = parseFloat(this.salaire.syndicat)  / parseFloat(this.salaire.taux_dollard);
            this.syndicatUSD = parseFloat(syndicat.toFixed(2));

            var avance_slaire = parseFloat(this.salaire.avance_slaire)  / parseFloat(this.salaire.taux_dollard);
            this.avanceSalaireNbrUSD = parseFloat(avance_slaire.toFixed(2));

            var penalites = parseFloat(this.salaire.penalites)  / parseFloat(this.salaire.taux_dollard);
            this.penalitesUSD = parseFloat(penalites.toFixed(2));

            var heureSupplementaireMonnaie = parseFloat(this.salaire.heure_supplementaire_monnaie)  / parseFloat(this.salaire.taux_dollard);
            this.heureSupplementaireMonnaieUSD = parseFloat(heureSupplementaireMonnaie.toFixed(2));

            var primes = parseFloat(this.salaire.primes)  / parseFloat(this.salaire.taux_dollard);
            this.primesUSD = parseFloat(primes.toFixed(2));

            var prime_anciennete = parseFloat(this.salaire.prime_anciennete)  / parseFloat(this.salaire.taux_dollard);
            this.prime_ancienneteUSD = parseFloat(prime_anciennete.toFixed(2));

            var alloc_familliale = parseFloat(this.salaire.alloc_familliale)  / parseFloat(this.salaire.taux_dollard);
            this.alloc_famillialeUSD = parseFloat(alloc_familliale.toFixed(2));

            var alloc_transport = parseFloat(this.salaire.alloc_transport)  / parseFloat(this.salaire.taux_dollard);
            this.alloc_transportUSD = parseFloat(alloc_transport.toFixed(2));

            var alloc_logement = parseFloat(this.salaire.alloc_logement)  / parseFloat(this.salaire.taux_dollard);
            this.alloc_logementUSD = parseFloat(alloc_logement.toFixed(2));

            var salaire_base = parseFloat(this.salaire.salaire_base)  / parseFloat(this.salaire.taux_dollard);
            this.salaire_baseUSD = parseFloat(salaire_base.toFixed(2));

            var prise_en_charge_frais_bancaire = parseFloat(this.salaire.prise_en_charge_frais_bancaire)  / parseFloat(this.salaire.taux_dollard);
            this.prise_en_charge_frais_bancaireUSD = parseFloat(prise_en_charge_frais_bancaire.toFixed(2)); 

            var cnss_qpo = parseFloat(this.salaire.cnss_qpo)  / parseFloat(this.salaire.taux_dollard);
            this.cnss_qpoUSD = parseFloat(cnss_qpo.toFixed(2));

            var soins_medicaux = parseFloat(this.salaire.soins_medicaux)  / parseFloat(this.salaire.taux_dollard);
            this.soins_medicauxUSD = parseFloat(soins_medicaux.toFixed(2)); 

            // var impot_elide = parseFloat(this.salaire.impot_elide)  / parseFloat(this.salaire.taux_dollard);
            // this.impot_elideUSD = parseFloat(impot_elide.toFixed(2));

            // Reglage
            this.reglageService.preference(this.currentUser.code_entreprise).subscribe(reglage => {
              this.preference = reglage; 

              var date = new Date(this.salaire.update_created); 
              this.delaiEditBulletin = new Date(date);
              this.delaiEditBulletin.setDate(date.getDate() + this.preference.delai_edit_bulletin);

              var dateNow = new Date();

              if (dateNow > date && dateNow < this.delaiEditBulletin) {
                this.isValidDelai = true;
                console.log('isValidDelai true', this.isValidDelai);
              } else {
                this.isValidDelai = false;
                console.log('isValidDelai false', this.isValidDelai);
              }
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

    edit(id: number) {
      var body = {
        statut: 'Traitement', 
        signature: this.currentUser.matricule, 
        update_created: new Date(),
      };
      this.salaireService.update(id, body).subscribe(res => {
        this.router.navigate(['/layouts/salaires/statuts-paies']);
        this.toastr.info('Ce Bulletin est repassé en mode Traitement', 'Success!');
      });
    }
  


    public openPDF(): void {
      let pdf = new jsPDF("p", "pt", "a4");
      var dateNow = new Date();
      var dateNowFormat = formatDate(dateNow, 'dd-MM-yyyy_HH:mm', 'en-US');
      pdf.html(this.htmlData.nativeElement, {
        callback: (pdf) => {
          // pdf.addPage("a4", "p")
          pdf.save(`Bulletin-${dateNowFormat}.pdf`)
        }
      }) 
    }

 


    generatePDF() {
      let docDefinition = {   
        content: [
          { text: ` <h4 class="mb-0 text-center">{{ title.toUpperCase()}} </h4>`, style: "header" },
          "Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.",
          {
            text:
              "A simple table (no headers, no width specified, no spans, no styling)",
            style: "subheader"
          },
          "The following table has nothing more than a body array",
          {
            style: "tableExample",
            table: {
              body: [
                ["Column 1", "Column 2", "Column 3"],
                ["One value goes here", "Another one here", "OK?"]
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
          },
         content: {
          italics: true, 
         }
        },
  
      }; 
      pdfMake.createPdf(docDefinition).open();  
    }  


    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
