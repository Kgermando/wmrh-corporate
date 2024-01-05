import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart, 
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts"; 
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { DashAllService } from '../dash-all.service';
import { PerformencePieYearModel } from 'src/app/performences/models/performence-pie-model'; 
import { PresencePieModel } from 'src/app/presences/models/presence-pie-model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  grid: ApexGrid;
  chart: ApexChart;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: any;
};

export type ChartOptionsTatutPaie = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    labels: any;
    colors: any;
};


export type ChartOptionAllocations = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    grid: ApexGrid;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    colors: any;
};

export type ChartOptionPresence = {
    series: ApexNonAxisChartSeries;
    stroke: ApexStroke;
    chart: ApexChart;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    labels: any;
    legend: ApexLegend;
    colors: any;
};





@Component({
  selector: 'app-dash-all',
  templateUrl: './dash-all.component.html',
  styleUrls: ['./dash-all.component.scss']
})
export class DashAllComponent implements OnInit{
  @Input('start_date') start_date: any;
  @Input('end_date') end_date: any;
    
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public chartOptionsNetAPayer: Partial<ChartOptions>; 

  public chartOptionsSTatutPaie: Partial<ChartOptionsTatutPaie>;

  public chartOptionAllocations: Partial<ChartOptionAllocations>;

  public chartOptionPresence: Partial<ChartOptionPresence>;

  isLoading = false;

  currentUser: PersonnelModel | any;

  prerformencePieList: PerformencePieYearModel[] = [];

  netAPayerList:any[] = [];
  netAPayer = 0;

  statutPaieList:any[] = [];

  allocationList:any[] = [];

  presencePieList: PresencePieModel[] = [];


  primesList:any[] = [];
  primes = 0;
  primeAncienneteList:any[] = [];
  primeAnciennete = 0;
  penaliteList:any[] = [];
  penalite = 0;
  avanceSalaireList:any[] = [];
  avanceSalaire = 0;
  presEntrepriseList:any[] = [];
  presEntreprise = 0;
  heureSuppList:any[] = [];
  heureSupp = 0;
  syndicatList:any[] = [];
  syndicat = 0;
 

  recrutementsList:any[] = [];
  recrutements = 0;
  postulantsList:any[] = [];
  postulants = 0;
  recrusList:any[] = [];
  recrus = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    private dashAllService: DashAllService
  ) {
      
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.getPie();
        this.getNetAPayer();
        this.getStatutPaie();
        this.getAllocations();
        this.getTotal();
        this.getPiePresence();
        this.getRecrutement();
 
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });   
  } 

  getPie() {
    this.dashAllService.getPerformencesAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res => {
            this.prerformencePieList = res;
            this.chartOptions = {
                series: [
                    {
                        name: "Ponctualité",
                        data: this.prerformencePieList.map((item: any) => parseFloat(item.ponctualite)),
                    },
                    {
                        name: "Hospitalité",
                        data: this.prerformencePieList.map((item: any) => parseFloat(item.hospitalite)),
                    },
                    {
                        name: "Travail",
                        data: this.prerformencePieList.map((item: any) => parseFloat(item.travail)),
                    }
                ],
                chart: {
                    type: "bar",
                    height: 350,
                    stacked: true,
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        horizontal: false
                    }
                },
                xaxis: {
                    type: "category",
                    axisBorder: {
                        show: false,
                    },
                    categories: this.prerformencePieList.map((item: PerformencePieYearModel) => {
                         if (item.year == 1) {
                            return 'Jan';
                        } else if (item.year == 2) {
                            return 'Fev';
                        } else if (item.year == 3) {
                            return 'Mar';
                        } else if (item.year == 4) {
                            return 'Avr';
                        } else if (item.year == 5) {
                            return 'Mai';
                        } else if (item.year == 6) {
                            return 'Jui';
                        } else if (item.year == 7) {
                            return 'Juil';
                        } else if (item.year == 8) {
                            return 'Aout';
                        } else if (item.year == 9) {
                            return 'Sep';
                        } else if (item.year == 10) {
                            return 'Oct';
                        } else if (item.year == 11) {
                            return 'Nov';
                        } else if (item.year == 12) {
                            return 'Dec';
                        } else {
                            return '';
                        }
                    }), 
                    labels: {
                        style: {
                            colors: "#a9a9c8",
                            fontSize: "14px",
                        }
                    }
                },
                colors: [
                    "#9A9BFE", "#DA0445", "#0D8F55"
                ], 
                legend: {
                    offsetY: 0,
                    position: "top",
                    fontSize: "14px",
                    horizontalAlign: "left",
                    labels: {
                        colors: '#5B5B98'
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: "#a9a9c8",
                            fontSize: "14px",
                        },
                    },
                    axisBorder: {
                        show: false,
                    }
                },
                fill: {
                    opacity: 1
                },
                grid: {
                    show: true,
                    strokeDashArray: 5,
                    borderColor: "#EDEFF5"
                }
            }; 
        }
    )
   }

   getNetAPayer() {
    this.dashAllService.masseSalarialAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.netAPayerList = res;
            this.netAPayerList.map((item: any) => this.netAPayer = parseFloat(item.net_a_payer));
        }
    )
    
   }


   getStatutPaie() {
    this.dashAllService.statutPaieAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res => {
            this.statutPaieList = res; 
            this.chartOptionsSTatutPaie = {
                series: this.statutPaieList.map((item: any) => parseFloat(item.count)),
                colors: this.statutPaieList.map((item: any) => {
                    if (item.statut_paie == "Disponible") {
                        return "#0D8F55";
                    } else if(item.statut_paie == "Traitement") {
                        return "#FAAA0C";
                    } else if(item.statut_paie == "En attente") {
                        return "#9DD2F6";
                    } else {
                        return '#FFFFFF'
                    }
                }),
                // colors: ["#0D8F55", "#FAAA0C"],
                chart: {
                    height: 365,
                    type: "donut"
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "" + val + " " + "employés";;
                        },
                    },
                },
                stroke: {
                    width: 1,
                    show: true
                },
                legend: {
                    offsetY: 0,
                    fontSize: "14px",
                    position: "bottom",
                    horizontalAlign: "center"
                },
                labels: this.statutPaieList.map((item: any) => item.statut_paie),
            };
        }
    )
    
   }

   getAllocations() {
    this.dashAllService.allocationALl(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res => {
            this.allocationList = res;
            this.chartOptionAllocations = {
                series: [
                    {
                        name: "Logements",
                        data: this.allocationList.map((item: any) => parseFloat(item.logement)),
                    },
                    {
                        name: "Transports",
                        data: this.allocationList.map((item: any) => parseFloat(item.transport)),
                    },
                    {
                        name: "Familliales",
                        data: this.allocationList.map((item: any) => parseFloat(item.familliale)),
                    },
                    {
                        name: "Soins médicaux",
                        data: this.allocationList.map((item: any) => parseFloat(item.soins_medicaux)),
                    }
                ],
                chart: {
                    type: "bar",
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        borderRadius: 3,
                        horizontal: false,
                        columnWidth: "33%",
                        borderRadiusApplication: 'end',
                    }
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#757fef", "#2db6f5", "#ee368c", "#FAAA0C"], 
                stroke: {
                    width: 5,
                    show: true,
                    colors: ["transparent"]
                },
                xaxis: {
                    categories: this.allocationList.map((item: any) => {
                        if (item.year_ans == 1) {
                            return 'Jan';
                        } else if (item.year_ans == 2) {
                            return 'Fev';
                        } else if (item.year_ans == 3) {
                            return 'Mar';
                        } else if (item.year_ans == 4) {
                            return 'Avr';
                        } else if (item.year_ans == 5) {
                            return 'Mai';
                        } else if (item.year_ans == 6) {
                            return 'Jui';
                        } else if (item.year_ans == 7) {
                            return 'Juil';
                        } else if (item.year_ans == 8) {
                            return 'Aout';
                        } else if (item.year_ans == 9) {
                            return 'Sep';
                        } else if (item.year_ans == 10) {
                            return 'Oct';
                        } else if (item.year_ans == 11) {
                            return 'Nov';
                        } else if (item.year_ans == 12) {
                            return 'Dec';
                        } else {
                            return '';
                        }
                    }),
                    labels: {
                        style: {
                            colors: "#a9a9c8",
                            fontSize: "14px"
                        },
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: "#a9a9c8",
                            fontSize: "14px",
                        },
                    },
                    axisBorder: {
                        show: false,
                    },
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: function(val) {
                            return val + "FC";
                        }
                    }
                },
                legend: {
                    offsetY: 0,
                    position: "top",
                    fontSize: "14px",
                    horizontalAlign: "left",
                },
                grid: {
                    show: true,
                    strokeDashArray: 5,
                    borderColor: "#EDEFF5"
                }
            };
        }
    )
   
   }


   getTotal() {
    this.dashAllService.primesAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.primesList = res;
            this.primesList.map((item: any) => this.primes = parseFloat(item.total));
        }
    );
    this.dashAllService.primeAncienneteAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.primeAncienneteList = res;
            this.primeAncienneteList.map((item: any) => this.primeAnciennete = parseFloat(item.total));
        }
    );
    this.dashAllService.penaliteAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.penaliteList = res;
            this.penaliteList.map((item: any) => this.penalite = parseFloat(item.total));
        }
    );
    this.dashAllService.avanceSalaireAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.avanceSalaireList = res;
            this.avanceSalaireList.map((item: any) => this.avanceSalaire = parseFloat(item.total));
        }
    );
    this.dashAllService.presEntrepriseAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.presEntrepriseList = res;
            this.presEntrepriseList.map((item: any) => this.presEntreprise = parseFloat(item.total));
        }
    );
    this.dashAllService.heureSuppAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.heureSuppList = res;
            this.heureSuppList.map((item: any) => this.heureSupp = parseFloat(item.total));
        }
    );
    this.dashAllService.syndicatAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res =>  {
            this.syndicatList = res;
            this.syndicatList.map((item: any) => this.syndicat = parseFloat(item.total));
        }
    );
   }


   getPiePresence() {
    this.dashAllService.presencePieAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res => {
            this.presencePieList = res;
            this.chartOptionPresence = {
                series: this.presencePieList.map((item: any) => parseFloat(item.count)),
                chart: {
                    height: 315,
                    type: "pie"
                },
                stroke: {
                    width: 0,
                    show: true
                },
                colors: this.presencePieList.map((item: PresencePieModel) => {
                    if (item.apointement == 'P') {
                        return "#27ae60";
                    } else if(item.apointement == 'A') {
                        return "#FC0000";
                    } else if(item.apointement == 'AA') {
                        return "#FAAA0C";
                    } else if(item.apointement == 'AM') {
                        return "#ee368c";
                    } else if(item.apointement == 'CC') {
                        return "#8e44ad";
                    } else if(item.apointement == 'CA') {
                        return "#2db6f5";
                    } else if(item.apointement == 'CO') {
                        return "#1abc9c";
                    } else if(item.apointement == 'S') {
                        return "#2980b9";
                    } else if(item.apointement == 'O') {
                        return "#2c3e50";
                    } else if(item.apointement == 'M') {
                        return "#038fa8";
                    } else {
                        return "";
                    }
                }),
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '14px',
                    },
                    dropShadow: {
                        enabled: false
                    }
                },
                tooltip: {
                    style: {
                        fontSize: '14px',
                    },
                    y: {
                        formatter: function(val:any) {
                            return val + "%";
                        }
                    }
                },
                legend: {
                    offsetY: 5,
                    position: "bottom",
                    fontSize: "14px",
                    labels: {
                        colors: '#5B5B98',
                    },
                },
                labels: this.presencePieList.map((item: PresencePieModel) => item.apointement), 
            };
        }
    )
    }


    getRecrutement() {
        this.dashAllService.recrutementsTotalAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
            res =>  {
                this.recrutementsList = res;
                this.recrutementsList.map((item: any) => this.recrutements = parseFloat(item.count));
            }
        );
        this.dashAllService.postulantsTotalAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
            res =>  {
                this.postulantsList = res;
                this.postulantsList.map((item: any) => this.postulants = parseFloat(item.count));
            }
        );
        this.dashAllService.postulantsRetenuTotalAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
            res =>  {
                this.recrusList = res;
                this.recrusList.map((item: any) => this.recrus = parseFloat(item.count));
            }
        );
    }
}
