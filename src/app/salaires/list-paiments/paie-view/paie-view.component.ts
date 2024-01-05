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
  allocLogement = 0;
  allocTransport = 0;
  allocFamilliale = 0;

  rbi = 0;
  rni = 0;
  ipr = 0;

  mois = '';
  dateNow = new Date();
  dateMonth = 0;  
 

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private personnelService: PersonnelService,
    private salaireService: SalaireService,
    private reglageService: ReglageService,
    private notifyService: NotifyService,
    private toastr: ToastrService) {}
 


    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];

          const dateNow = new Date();
          this.dateMonth = dateNow.getMonth() + 1;
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
        console.log('datePaie 1', datePaie);
        this.personnelService.get(Number(id)).subscribe(res => {
          this.personne = res;
          this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
            this.preference = res;
          });
          this.salaireService.primeTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(prime => {
            var primes  = prime;
            primes.map((item: any) => this.primeUSD = parseFloat(item.sum));
          });
          this.salaireService.primeTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(prime => {
            var primes  = prime;
            primes.map((item: any) => this.primeCDF = parseFloat(item.sum));
          });
          this.salaireService.penaliteTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(penalite => {
            var penalites  = penalite;
            penalites.map((item: any) => this.penaliteUSD = parseFloat(item.sum));
          });
          this.salaireService.penaliteTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(penalite => {
            var penalites  = penalite;
            penalites.map((item: any) => this.penaliteCDF = parseFloat(item.sum));
          });
          this.salaireService.nbrHeureSupp(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
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
        
      }

      this.formGroup.valueChanges.subscribe(val => {
        this.date_paie = val.date_paie;
        var datePaie = formatDate(this.date_paie, 'yyyy-MM-dd', 'en-US');
        console.log('datePaie 2', datePaie);
        this.personnelService.get(Number(id)).subscribe(res => {
          this.personne = res;
          this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
            this.preference = res;
          });
          this.salaireService.primeTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(prime => {
            var primes  = prime;
            primes.map((item: any) => this.primeUSD = parseFloat(item.sum));
          });
          this.salaireService.primeTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(prime => {
            var primes  = prime;
            primes.map((item: any) => this.primeCDF = parseFloat(item.sum));
          });
          this.salaireService.penaliteTotalUSD(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(penalite => {
            var penalites  = penalite;
            penalites.map((item: any) => this.penaliteUSD = parseFloat(item.sum));
          });
          this.salaireService.penaliteTotalCDF(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(penalite => {
            var penalites  = penalite;
            penalites.map((item: any) => this.penaliteCDF = parseFloat(item.sum));
          });
          this.salaireService.nbrHeureSupp(this.currentUser.code_entreprise, this.personne.id, datePaie).subscribe(
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


    onSubmit() {
      try {
        this.isLoadingSubmit = true;
        console.log('date_paie 111111', this.date_paie);
        var salaire = 0;
        var alloc_famillialeMonnaie = 0;
        var alloc_transportMonnaie = 0;
        var alloc_logementMonnaie = 0;
        var soins_medicauxMonnaie = 0;
        var prime = (this.primeUSD * this.preference.taux_dollard) + this.primeCDF;
        var penalite = (this.penaliteUSD * this.preference.taux_dollard) + this.penaliteCDF;
        var avanceSalaire = (this.avanceSalaireUSD * this.preference.taux_dollard) + this.avanceSalaireCDF;
        var pres_entreprise = (this.presEntrepriseUSD * this.preference.taux_dollard) + this.presEntrepriseCDF;

        if (this.personne.monnaie == 'USD') {
          salaire = parseFloat(this.personne.salaire_base) * this.preference.taux_dollard;
          alloc_famillialeMonnaie = parseFloat(this.personne.alloc_familliale) * this.preference.taux_dollard;
          alloc_transportMonnaie = parseFloat(this.personne.alloc_transport) * this.preference.taux_dollard;
          alloc_logementMonnaie = parseFloat(this.personne.alloc_logement) * this.preference.taux_dollard;
          soins_medicauxMonnaie = parseFloat(this.personne.soins_medicaux) * this.preference.taux_dollard; 
        } else if (this.personne.monnaie == 'CDF'){
          salaire = parseFloat(this.personne.salaire_base);
          alloc_famillialeMonnaie = parseFloat(this.personne.alloc_familliale);
          alloc_transportMonnaie = parseFloat(this.personne.alloc_transport);
          alloc_logementMonnaie = parseFloat(this.personne.alloc_logement);
          soins_medicauxMonnaie = parseFloat(this.personne.soins_medicaux); 
        } 

       

        var totalJrsPreste = 0;
        var nbre_jrs_ferie = 0;

        var new_year = new Date(this.preference.new_year);
        var martyr_day = new Date(this.preference.martyr_day);
        var lumumba_day = new Date(this.preference.lumumba_day);
        var kabila_day = new Date(this.preference.kabila_day);
        var kimbangu_day = new Date(this.preference.kimbangu_day);
        var liberation_day = new Date(this.preference.liberation_day);
        var parent_day = new Date(this.preference.parent_day);
        var labour_day = new Date(this.preference.labour_day);
        var indepence_day = new Date(this.preference.indepence_day);
        

        if (this.dateMonth == new_year.getMonth() || 
            this.dateMonth == martyr_day.getMonth() || 
            this.dateMonth == lumumba_day.getMonth() || 
            this.dateMonth == kabila_day.getMonth()) { 
            nbre_jrs_ferie = 4;
        } else if (this.dateMonth == kimbangu_day.getMonth()) {
          nbre_jrs_ferie = 1;
        } else if (this.dateMonth == liberation_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonth == parent_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonth == labour_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }  else if (this.dateMonth == indepence_day.getMonth()) {
          nbre_jrs_ferie = 1;
        }

        totalJrsPreste = this.nbreJrsPreste + nbre_jrs_ferie;

        var salaire_base = 0;
        
        if (this.congepayeNbr >= 1) {
          if (totalJrsPreste >= 1) {
            salaire_base = (salaire * totalJrsPreste) * 2/3;
          } else {
            salaire_base = (salaire * 26) * 2/3;
          }
        } else {
          salaire_base = salaire * totalJrsPreste;
        } 

      
        var ancennete = 0;
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

        var heureSupplementaireMonnaie = 0;
 
        if (this.nbrHeureSupp >=2 && this.nbrHeureSupp <6) {
          heureSupplementaireMonnaie = salaire_base * 30 / 100;
        } else if(this.nbrHeureSupp >=6 && this.nbrHeureSupp <8) {
          heureSupplementaireMonnaie = salaire_base * 60 / 100;
        } else if(this.nbrHeureSupp >= 8) {
          heureSupplementaireMonnaie = salaire_base * 100 / 100;
        }

        var alloc_familliale = 0;
        var alloc_famillialeSurPlus = 0;
        if (this.personne.nbr_dependants > 0) {
          alloc_familliale = alloc_famillialeMonnaie * this.personne.nbr_dependants * totalJrsPreste;
          alloc_famillialeSurPlus = alloc_familliale - (parseFloat(this.preference.smig) * this.personne.nbr_dependants * totalJrsPreste);  
        } else if(this.personne.nbr_dependants == 0) {
          alloc_familliale = alloc_famillialeMonnaie * totalJrsPreste;
          alloc_famillialeSurPlus = alloc_familliale - (parseFloat(this.preference.smig) * totalJrsPreste); 
        }
       
        var alloc_transport = alloc_transportMonnaie * totalJrsPreste;

        var alloc_transportSurplus = 0;
        if (this.personne.category === 'Cadres supérieurs' || this.personne.category === 'Cadres subalternes') {
          alloc_transportSurplus = alloc_transport - (this.preference.courses_transport * parseFloat(this.preference.montant_travailler_quadre) * totalJrsPreste);
        } else {
          alloc_transportSurplus = alloc_transport - (this.preference.courses_transport * parseFloat(this.preference.montant_travailler_non_quadre) * totalJrsPreste);
        }
       

        // Remuneration Brute impôsable
        var rbi = salaire_base + 
            prime + ancennete + heureSupplementaireMonnaie;  

       

        var alloc_logementSurPlus = alloc_logementMonnaie - (30 * rbi / 100); // Le logement ne depasse le 30% de rbi


        var alloc_famillialeExces = 0;
        if (alloc_famillialeSurPlus > alloc_familliale) {
          alloc_famillialeExces = alloc_familliale - alloc_famillialeSurPlus;
        } else if (alloc_famillialeSurPlus <= alloc_familliale) {
          alloc_famillialeExces = 0;
        }

        var alloc_transportExces = 0;
        if (alloc_transportSurplus > alloc_transport) {
          alloc_transportExces = alloc_transport - alloc_transportSurplus;
        } else if (alloc_transportSurplus <= alloc_transport) {
          alloc_transportExces = 0;
        }

        var alloc_logementExces = 0;
        if (alloc_logementSurPlus > alloc_logementMonnaie) {
          alloc_logementExces = alloc_logementMonnaie - alloc_logementSurPlus;
        } else if (alloc_logementSurPlus <= alloc_logementMonnaie) {
          alloc_logementExces = 0;
        }

        // Remuneration Nette impôsable
        var cnss_qpo = 0;
        cnss_qpo = rbi * parseFloat(this.preference.cnss_qpo) / 100;

        // RNI = RBI-(RBI * CNSQPO) + ReIntegrations
        var rni = rbi - (cnss_qpo + alloc_famillialeExces + alloc_transportExces + alloc_logementExces); 


        // Calcul IPR retenu
        var iprRetenu = 0;
        var iprTrois = 0;
        var iprQuinze = 0;
        var iprTrente = 0;

        if (rni <= +this.preference.bareme_3) {
          iprRetenu = rni * 3 / 100;
          iprTrois = (+this.preference.bareme_3 - 0) * 3 / 100;

        } else if (rni <= +this.preference.bareme_15){
          iprRetenu = (rni - +this.preference.bareme_3) * 15 / 100 + iprTrois;
          iprQuinze = +this.preference.bareme_15 * 15 / 100;

        } else if (rni <= +this.preference.bareme_30){
          iprRetenu = (rni - +this.preference.bareme_30) * 30 / 100 + iprTrois + iprQuinze;
          iprTrente = +this.preference.bareme_15 * 30 / 100;

        } else if (rni > (+this.preference.bareme_30 + 1)){
          iprRetenu = (rni - +this.preference.bareme_30) * 40 / 100 + iprTrois + iprQuinze + iprTrente;
        }


        // Impôt Elide
        var impotElide = iprRetenu - (alloc_famillialeExces + alloc_transportExces + alloc_logementExces);


        // IPR à payé
        var iprApeyE = 0; 
        var iprApeyE = iprRetenu - (iprRetenu * this.personne.nbr_dependants * 2 / 100);

        // Syndicat souscrit
        var syndicat = 0;
        if (this.personne.syndicat) {
          syndicat = rni * parseFloat(this.preference.cotisation_syndicale) / 100;
        }

        // prise_en_charge_frais_bancaire
        var prise_en_charge_frais_bancaireMonnaie = 0;
        if(this.preference.prise_en_charge_frais_bancaire) {
          prise_en_charge_frais_bancaireMonnaie = parseFloat(this.personne.frais_bancaire);
        }
        

        var deductions = iprApeyE + penalite + avanceSalaire + syndicat + pres_entreprise;

        var avantageSocials = alloc_logementMonnaie + 
          alloc_transport + alloc_familliale +
          prime + ancennete + heureSupplementaireMonnaie + prise_en_charge_frais_bancaireMonnaie;
        

        var net_a_payer = rni + avantageSocials - deductions; 

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
          alloc_logement: alloc_logementMonnaie,
          alloc_transport: alloc_transport,
          alloc_familliale: alloc_familliale,
          soins_medicaux: soins_medicauxMonnaie,
          salaire_base: salaire_base,  // Par jour * 26
          primes: prime,
          anciennete_nbr_age: this.anciennete_nbr_age, // Nombre d'age d'ancienneté
          prime_anciennete: ancennete, // Cumul de prime d'ancienneté
          heures_supp: this.nbrHeureSupp,
          heure_supplementaire_monnaie: heureSupplementaireMonnaie,
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
          prise_en_charge_frais_bancaire: prise_en_charge_frais_bancaireMonnaie,
          pres_entreprise: pres_entreprise,
          net_a_payer: net_a_payer,
          statut: 'Traitement',
          date_paie: this.date_paie, // this.formGroup.value.date_paie,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
          entreprise: this.currentUser.entreprise,
          code_entreprise: this.currentUser.code_entreprise
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
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
