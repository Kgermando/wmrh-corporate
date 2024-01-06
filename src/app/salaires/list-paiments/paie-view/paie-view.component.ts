import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PersonnelService } from 'src/app/personnels/personnel.service'; 
import { SalaireService } from '../../salaire.service';
import { formatDate } from '@angular/common';
import { NotifyService } from 'src/app/notify/notify.service'; 
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IndemniteService } from '../../indemnites/indemnite.service';

@Component({
  selector: 'app-paie-view',
  templateUrl: './paie-view.component.html',
  styleUrls: ['./paie-view.component.scss']
})
export class PaieViewComponent implements OnInit {
  isLoading = false;
  isLoadingSubmit = false;

  personne: PersonnelModel;

  preference: PreferenceModel;

  currentUser: PersonnelModel | any;

  formGroup!: FormGroup;
  date_paie: any;

  nbreJrsPreste = 0;
  congepayeNbr = 0;
  nbrHeureSupp = 0;
  primeUSD = 0;
  primeCDF = 0;
  anciennete_nbr_age = 0;
  penaliteCDF = 0;
  penaliteUSD = 0;
  avanceSalaireUSD = 0;
  avanceSalaireCDF = 0;
  presEntrepriseUSD = 0;
  presEntrepriseCDF = 0;
  salaire = 0;
  alloc_logement = 0;
  alloc_transport = 0;
  alloc_familliale = 0;
  soins_medicaux = 0;

  rbi = 0;
  rni = 0;
  ipr = 0;

  mois = '';
  dateNow = new Date();
  dateMonthNow = 0;  
 

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private personnelService: PersonnelService,
    private salaireService: SalaireService,
    private reglageService: ReglageService,
    private indemniteService: IndemniteService,
    private notifyService: NotifyService,
    private toastr: ToastrService) {}
 


    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];

          const dateNow = new Date();
          this.dateMonthNow = dateNow.getMonth() + 1;
          if (this.dateMonthNow === 1) {
            this.mois = 'Janvier';
          } else if(this.dateMonthNow === 2) {
              this.mois = 'Fevrier';
          } else if(this.dateMonthNow === 3) {
              this.mois = 'Mars';
          } else if(this.dateMonthNow === 4) {
              this.mois = 'Avril';
          } else if(this.dateMonthNow === 5) {
              this.mois = 'Mai';
          } else if(this.dateMonthNow === 6) {
              this.mois = 'Juin';
          } else if(this.dateMonthNow === 7) {
              this.mois = 'Juillet';
          } else if(this.dateMonthNow === 8) {
              this.mois = 'Aôut';
          } else if(this.dateMonthNow === 9) {
              this.mois = 'Septembre';
          } else if(this.dateMonthNow === 10) {
              this.mois = 'Octobre';
          } else if(this.dateMonthNow === 11) {
              this.mois = 'Novembre';
          } else if(this.dateMonthNow === 12) {
              this.mois = 'Décembre';
          } else {
            '';
          }

          this.formGroup = this.formBuilder.group({  
            date_paie: new FormControl(new Date()),
          });  

   
          this.onChange(id);
       
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    } 


    onChange(id: any) {

      if (!this.date_paie) {
        this.date_paie = new Date();
        var datePaie = formatDate(this.date_paie, 'yyyy-MM-dd', 'en-US'); 
        this.personnelService.get(Number(id)).subscribe(res => {
          this.personne = res;
          this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
            this.preference = res;
            this.salaireService.primeTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(prime => {
              var primes  = prime;
              primes.map((item: any) => this.primeUSD = parseFloat(item.sum));
            });
            this.salaireService.primeTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(prime => {
              var primes  = prime;
              primes.map((item: any) => this.primeCDF = parseFloat(item.sum));
            });
            this.salaireService.penaliteTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(penalite => {
              var penalites  = penalite;
              penalites.map((item: any) => this.penaliteUSD = parseFloat(item.sum));
            });
            this.salaireService.penaliteTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(penalite => {
              var penalites  = penalite;
              penalites.map((item: any) => this.penaliteCDF = parseFloat(item.sum));
            });
            this.salaireService.nbrHeureSupp(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(
              heureSup => {
                var heureSupp  = heureSup;
                heureSupp.map((item: any) => this.nbrHeureSupp = parseFloat(item.sum));
              }
            );
            this.salaireService.avanceSalaireTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              avanceSalaire => {
                var avanceSalaires = avanceSalaire; 
                avanceSalaires.map((item: any) => this.avanceSalaireUSD = parseFloat(item.sum)); 
              }
            );
            this.salaireService.avanceSalaireTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              avanceSalaire => {
                var avanceSalaires = avanceSalaire; 
                avanceSalaires.map((item: any) => this.avanceSalaireCDF = parseFloat(item.sum)); 
              }
            );
            this.salaireService.preEntrepriseUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              presEntreprise => {
                var preEntrepriseUSDs = presEntreprise; 
                preEntrepriseUSDs.map((item: any) => this.presEntrepriseUSD = parseFloat(item.sum)); 
              }
            );
            this.salaireService.preEntrepriseCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              presEntreprise => {
                var preEntrepriseUSD = presEntreprise; 
                preEntrepriseUSD.map((item: any) => this.presEntrepriseCDF = parseFloat(item.sum)); 
              }
            );
            this.salaireService.getJrPrestE(this.currentUser.code_entreprise, this.personne.matricule, datePaie).subscribe(
              jrsPreste => {
                var jrsPrestE = jrsPreste; 
                jrsPrestE.map((item: any) => this.nbreJrsPreste = parseFloat(item.presence));
              }
            );
            this.salaireService.getJrCongePayE(this.currentUser.code_entreprise, this.personne.matricule, datePaie).subscribe(
              jrsCongE => {
                var congepayes = jrsCongE; 
                congepayes.map((item: any) => this.congepayeNbr = parseFloat(item.conge));
              }
            );
            var date_debut_contrat_employE = (this.personne.date_debut_contrat) ? this.personne.date_debut_contrat : new Date(); 
            var date_contrat = formatDate(date_debut_contrat_employE, 'yyyy-MM-dd', 'en-US');
            this.salaireService.getAnciennete(this.currentUser.code_entreprise, this.personne.id, date_contrat, datePaie).subscribe(
              date_debut_contrat => {
                var date_debut_contrats = date_debut_contrat;
                date_debut_contrats.map((item: any) => this.anciennete_nbr_age = parseFloat(item.age['years']));
                if (Number.isNaN(this.anciennete_nbr_age)) {
                  this.anciennete_nbr_age = 0;
                } 
              }
            );
          });
          
        });
        
      }

      this.formGroup.valueChanges.subscribe(val => {
        this.date_paie = val.date_paie;
        var datePaie = formatDate(this.date_paie, 'yyyy-MM-dd', 'en-US'); 
        this.personnelService.get(Number(id)).subscribe(res => {
          this.personne = res;
          this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
            this.preference = res;
            this.salaireService.primeTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(prime => {
              var primes  = prime;
              primes.map((item: any) => this.primeUSD = parseFloat(item.sum));
            });
            this.salaireService.primeTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(prime => {
              var primes  = prime;
              primes.map((item: any) => this.primeCDF = parseFloat(item.sum));
            });
            this.salaireService.penaliteTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(penalite => {
              var penalites  = penalite;
              penalites.map((item: any) => this.penaliteUSD = parseFloat(item.sum));
            });
            this.salaireService.penaliteTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(penalite => {
              var penalites  = penalite;
              penalites.map((item: any) => this.penaliteCDF = parseFloat(item.sum));
            });
            this.salaireService.nbrHeureSupp(this.currentUser.code_entreprise, this.personne.id, datePaie, this.preference.pris_en_compte_mois_plus_1).subscribe(
              heureSup => {
                var heureSupp  = heureSup;
                heureSupp.map((item: any) => this.nbrHeureSupp = parseFloat(item.sum));
              }
            );
            this.salaireService.avanceSalaireTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              avanceSalaire => {
                var avanceSalaires = avanceSalaire; 
                avanceSalaires.map((item: any) => this.avanceSalaireUSD = parseFloat(item.sum)); 
              }
            );
            this.salaireService.avanceSalaireTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              avanceSalaire => {
                var avanceSalaires = avanceSalaire; 
                avanceSalaires.map((item: any) => this.avanceSalaireCDF = parseFloat(item.sum)); 
              }
            );
            this.salaireService.preEntrepriseUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              presEntreprise => {
                var preEntrepriseUSDs = presEntreprise; 
                preEntrepriseUSDs.map((item: any) => this.presEntrepriseUSD = parseFloat(item.sum)); 
              }
            );
            this.salaireService.preEntrepriseCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
              presEntreprise => {
                var preEntrepriseUSD = presEntreprise; 
                preEntrepriseUSD.map((item: any) => this.presEntrepriseCDF = parseFloat(item.sum)); 
              }
            );
            this.salaireService.getJrPrestE(this.currentUser.code_entreprise, this.personne.matricule, datePaie).subscribe(
              jrsPreste => {
                var jrsPrestE = jrsPreste; 
                jrsPrestE.map((item: any) => this.nbreJrsPreste = parseFloat(item.presence));
              }
            );
            this.salaireService.getJrCongePayE(this.currentUser.code_entreprise, this.personne.matricule, datePaie).subscribe(
              jrsCongE => {
                var congepayes = jrsCongE; 
                congepayes.map((item: any) => this.congepayeNbr = parseFloat(item.conge));
              }
            );
            var date_debut_contrat_employE = (this.personne.date_debut_contrat) ? this.personne.date_debut_contrat : new Date(); 
            var date_contrat = formatDate(date_debut_contrat_employE, 'yyyy-MM-dd', 'en-US');
            this.salaireService.getAnciennete(this.currentUser.code_entreprise, this.personne.id, date_contrat, datePaie).subscribe(
              date_debut_contrat => {
                var date_debut_contrats = date_debut_contrat;
                date_debut_contrats.map((item: any) => this.anciennete_nbr_age = parseFloat(item.age['years']));
                if (Number.isNaN(this.anciennete_nbr_age)) {
                  this.anciennete_nbr_age = 0;
                } 
              }
            );
          });
          
        });

      }); 

  
      
    }


    onSubmit() {
      try {
        this.isLoadingSubmit = true;
        var totalJrsPreste = 0;
        var nbre_jrs_ferie = 0;
        var ancennete = 0;
        var heureSupplementaire = 0;
        
        var salaire_base = 0;
        var rbi = 0;
        var rbi30 = 0;
        var rni = 0;
        var alloc_sur_plus = 0;
        var alloc_logement_sur_plus = 0;
        var alloc_transport_jrs_preste = 0;
        var alloc_familliale_jrs_preste = 0; 

        var cnss_qpo = 0;
        var iprRetenu = 0;
        var iprTrois = 0;
        var iprQuinze = 0;
        var iprTrente = 0;
        var iprApeyE = 0; 

        var syndicat = 0;
        var prise_en_charge_frais_bancaire = 0;
        
        // Si il y a des primes, penalités, avance_salaires, pres_entreprises en dollards et en francs
        // le systeme va additionner les deux monnaies apres la convertion du dollord en CDF si elle est au dessus de 0
        var prime = (this.primeUSD * this.preference.taux_dollard) + this.primeCDF;
        var penalite = (this.penaliteUSD * this.preference.taux_dollard) + this.penaliteCDF;
        var avanceSalaire = (this.avanceSalaireUSD * this.preference.taux_dollard) + this.avanceSalaireCDF;
        var pres_entreprise = (this.presEntrepriseUSD * this.preference.taux_dollard) + this.presEntrepriseCDF;

        if (this.personne.monnaie == 'USD') {
          this.salaire = parseFloat(this.personne.salaire_base) * this.preference.taux_dollard;
          this.alloc_logement = parseFloat(this.personne.alloc_logement) * this.preference.taux_dollard;
          this.alloc_transport = parseFloat(this.personne.alloc_transport) * this.preference.taux_dollard;
          this.alloc_familliale = parseFloat(this.personne.alloc_familliale) * this.preference.taux_dollard; 
          this.soins_medicaux = parseFloat(this.personne.soins_medicaux) * this.preference.taux_dollard;
        } else if (this.personne.monnaie == 'CDF'){
          this.salaire = parseFloat(this.personne.salaire_base);
          this.alloc_logement = parseFloat(this.personne.alloc_logement);
          this.alloc_transport = parseFloat(this.personne.alloc_transport);
          this.alloc_familliale = parseFloat(this.personne.alloc_familliale); 
          this.soins_medicaux = parseFloat(this.personne.soins_medicaux); 
        } 
 
        var new_year = new Date(this.preference.new_year);
        var noel = new Date(this.preference.noel);
        var martyr_day = new Date(this.preference.martyr_day);
        var lumumba_day = new Date(this.preference.lumumba_day);
        var kabila_day = new Date(this.preference.kabila_day);
        var kimbangu_day = new Date(this.preference.kimbangu_day);
        var liberation_day = new Date(this.preference.liberation_day);
        var parent_day = new Date(this.preference.parent_day);
        var labour_day = new Date(this.preference.labour_day);
        var indepence_day = new Date(this.preference.indepence_day);
        

        if (this.dateMonthNow == new_year.getMonth() || 
            this.dateMonthNow == martyr_day.getMonth() || 
            this.dateMonthNow == lumumba_day.getMonth() || 
            this.dateMonthNow == kabila_day.getMonth()) { 
            nbre_jrs_ferie = 4;
        } else if (this.dateMonthNow == noel.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonthNow == kimbangu_day.getMonth()) {
          nbre_jrs_ferie = 1;
        } else if (this.dateMonthNow == liberation_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonthNow == parent_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonthNow == labour_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonthNow == indepence_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }

        totalJrsPreste = this.nbreJrsPreste + nbre_jrs_ferie;

       
        
        if (this.congepayeNbr >= 1) {
          if (totalJrsPreste >= 1) {
            salaire_base = (this.salaire * totalJrsPreste) * 2/3;
          } else {
            salaire_base = (this.salaire * this.preference.total_jours_a_prester) * 2/3;
          }
        } else {
          salaire_base = this.salaire * totalJrsPreste;
        } 

      
        // Ancienneté
        if(this.anciennete_nbr_age >5 && this.anciennete_nbr_age <= 10) {
          ancennete = salaire_base * this.preference.prime_ancien_5 / 100;
        } else if(this.anciennete_nbr_age >10 && this.anciennete_nbr_age <= 15) {
          ancennete = salaire_base * this.preference.prime_ancien_10 / 100;
        } else if(this.anciennete_nbr_age >15 && this.anciennete_nbr_age <= 20) {
          ancennete = salaire_base * this.preference.prime_ancien_15 / 100;
        } else if(this.anciennete_nbr_age >20 && this.anciennete_nbr_age <= 25) {
          ancennete = salaire_base * this.preference.prime_ancien_20 / 100;
        } else if(this.anciennete_nbr_age >25) {
          ancennete = salaire_base * this.preference.prime_ancien_25 / 100;
        }

      
        // Heure supplmentaires
        if (this.nbrHeureSupp >=2 && this.nbrHeureSupp <6) {
          heureSupplementaire = salaire_base * 30 / 100;
        } else if(this.nbrHeureSupp >=6 && this.nbrHeureSupp <8) {
          heureSupplementaire = salaire_base * 60 / 100;
        } else if(this.nbrHeureSupp >= 8) {
          heureSupplementaire = salaire_base * 100 / 100;
        }


        // Remuneration Brute impôsable
        rbi = salaire_base + prime + ancennete + heureSupplementaire;

       
        // Allocation logement
        rbi30 = rbi * 30 / 100;
        alloc_logement_sur_plus = this.alloc_logement - rbi30; // Le logement ne depasse pas le 30% de rbi

        // Allocation transport
        alloc_transport_jrs_preste = this.alloc_transport * totalJrsPreste;

        // Allocation famillial
        if (this.personne.nbr_dependants > 0) {
          alloc_familliale_jrs_preste = this.alloc_familliale * this.personne.nbr_dependants * totalJrsPreste;
        } else if(this.personne.nbr_dependants == 0) {
          alloc_familliale_jrs_preste = this.alloc_familliale * totalJrsPreste;
        }
       

        // CNSS QPO
        cnss_qpo = rbi * parseFloat(this.preference.cnss_qpo) / 100;
        

       
        if (alloc_logement_sur_plus > 0) {
          alloc_sur_plus = alloc_logement_sur_plus; 
        }

        // Remuneration Nette impôsable  
        // rni = rbi - (rbi * cnss_qpo) + alloc_sur_plus;
        rni = rbi - cnss_qpo + alloc_sur_plus;


        // Calcul IPR retenu
        if (rni <= this.preference.bareme_3) {
          iprRetenu = rni * 3 / 100;
          iprTrois = (this.preference.bareme_3 - 0) * 3 / 100;

        } else if (rni <= this.preference.bareme_15){
          iprRetenu = (rni - this.preference.bareme_3 + iprTrois) * 15 / 100;
          iprQuinze = this.preference.bareme_15 * 15 / 100;

        } else if (rni <= this.preference.bareme_30){
          iprRetenu = (rni - this.preference.bareme_30 + iprTrois + iprQuinze) * 30 / 100;
          iprTrente = this.preference.bareme_15 * 30 / 100;

        } else if (rni > (this.preference.bareme_30 + 1)){
          iprRetenu = (rni - this.preference.bareme_30 + iprTrois + iprQuinze + iprTrente) * 40 / 100;
        }


        // Impôt Elide 
        var impotElide = alloc_sur_plus - iprRetenu;


        // IPR à payé 
        var iprApeyE = iprRetenu - (iprRetenu * this.personne.nbr_dependants * 2 / 100);

        // Syndicat souscrit 
        if (this.personne.syndicat) {
          syndicat = rni * parseFloat(this.preference.cotisation_syndicale) / 100;
        }

        // prise_en_charge_frais_bancaire  
        if(this.preference.prise_en_charge_frais_bancaire) {
          prise_en_charge_frais_bancaire = parseFloat(this.personne.frais_bancaire);
        }
        

        var prime_hs_frais_bancaire = prime + ancennete + heureSupplementaire + prise_en_charge_frais_bancaire;

        var avantageSocials = this.alloc_logement + alloc_transport_jrs_preste + alloc_familliale_jrs_preste;

        var deductions = iprApeyE + penalite + avanceSalaire + syndicat + pres_entreprise;

        var net_a_payer = rni + prime_hs_frais_bancaire + avantageSocials - deductions; 

        var body = {
          personnel: this.personne.id,
          departement: (this.personne.departements) ? this.personne.departements.departement : '-',
          fonction: (this.personne.fonctions) ? this.personne.fonctions.fonction : '-',
          title: (this.personne.titles) ? this.personne.titles.title : '-',
          service: (this.personne.services) ? this.personne.services.service : '-',
          site_location: (this.personne.site_locations) ? this.personne.site_locations.site_location : '-',
          monnaie: this.personne.monnaie,
          taux_dollard: this.preference.taux_dollard,
          nbr_dependants: this.personne.nbr_dependants,
          alloc_logement: this.alloc_logement,
          alloc_transport: alloc_transport_jrs_preste,
          alloc_familliale: alloc_familliale_jrs_preste,
          soins_medicaux: this.soins_medicaux,
          salaire_base: salaire_base,  // Par jour * 26
          primes: prime,
          anciennete_nbr_age: this.anciennete_nbr_age, // Nombre d'age d'ancienneté
          prime_anciennete: ancennete, // Cumul de prime d'ancienneté
          heures_supp: this.nbrHeureSupp,
          heure_supplementaire_monnaie: heureSupplementaire,
          conge_paye: this.congepayeNbr,
          nbre_jrs_preste: totalJrsPreste, // Nombre de jours presents
          nbre_jrs_ferie: nbre_jrs_ferie,
          rbi: rbi,  // Remuneration brute imposable
          cnss_qpo: cnss_qpo, // Impôt de 5% => 0.05
          rni: rni,  // Remuneration Nette Imposable
          ipr: iprApeyE,  // Impôt Professionnel sur les Rémunérations (IPR)
          impot_elide: impotElide,
          syndicat: syndicat,  // 1 %
          penalites: penalite,  // Sanctions sur le salaire net à payer
          avance_slaire: avanceSalaire,
          prise_en_charge_frais_bancaire: prise_en_charge_frais_bancaire,
          pres_entreprise: pres_entreprise,
          net_a_payer: net_a_payer,
          statut: 'Traitement',
          date_paie: this.date_paie, // this.formGroup.value.date_paie,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.personne.corporates.code_corporate,
          corporate: this.personne.corporates.id,
        };
        this.salaireService.create(body).subscribe({
          next: (res) => { 
            var personnel = { 
              date_paie: this.formGroup.value.date_paie,
              statut_paie: 'Traitement',
              signature: this.currentUser.matricule,
              update_created: new Date(),
              entreprise: this.currentUser.entreprise,
              code_entreprise: this.currentUser.code_entreprise
            };
            this.personnelService.update(this.personne.id, personnel).subscribe({
              next: () => {
                var bodyNotifyN = {
                  personnel: this.personne.id,
                  is_read: false,
                  title: `Bulletin ${this.mois} en traitement.`,
                  // title: (this.personne.sexe == 'Homme') ? `Bonjour Monsieur ${this.personne.prenom.toUpperCase()} ${this.personne.nom.toUpperCase()} votre bulletin de paie est en traitement.`
                  //   : `Bonjour Madame ${this.personne.prenom.toUpperCase()} ${this.personne.nom.toUpperCase()} votre bulletin de paie est en traitement.`,
                  route: `/layouts/salaires/traitement/${res['id']}/fiche-paie`,
                  signature: this.currentUser.matricule,
                  created: new Date(),
                  update_created: new Date(),
                  entreprise: this.currentUser.entreprise,
                  code_entreprise: this.currentUser.code_entreprise
                };
                this.notifyService.create(bodyNotifyN).subscribe(
                  () => {  
                    this.toastr.success('Genéré avec succès!', 'Success!'); 
                    this.router.navigate(['/layouts/salaires/traitement', res['id'], 'fiche-paie']);
                    this.isLoadingSubmit = false;
                  }
                ) 
              },
              error: err => { 
                this.isLoadingSubmit = false;
                this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
                console.log(err);
              }
            }); 
          }, 
          error: (err) => {
            this.isLoadingSubmit = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        }); 
      } catch (error) {
        this.isLoadingSubmit = false;
        console.log(error);
      }
    } 


    createIndemnite() {
      try {
        this.isLoadingSubmit = true;
        var body = {
          personnel: this.personne.id,
          intitule: 'Indemnité de ...',
          statut: 'Traitement',
          taux_dollard: this.preference.taux_dollard,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise,
          corporate: this.personne.corporates.id,
        };
        this.indemniteService.create(body).subscribe(res => {
          this.isLoadingSubmit = false;
          this.toastr.success('Genéré avec succès!', 'Success!'); 
          this.router.navigate(['/layouts/salaires/indemnites/traitement', res['id'], 'indemnite-paie']);
        });
      } catch (error) {
        this.isLoadingSubmit = false;
        console.log(error);
      }
    }
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
