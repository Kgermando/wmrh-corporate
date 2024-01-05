import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart, 
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions, 
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexFill, 
  ApexTooltip,
  ApexStroke,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle
} from "ng-apexcharts"; 
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { DashAllService } from '../../all/dash-all.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { FinanceService } from '../finance.service';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';

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

export type ChartOptionsTatutPaie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  labels: any;
  colors: any;
};

export type ChartOptionNetApayerIPRCNSS = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    tooltip: any;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
    colors: any;
};

@Component({
  selector: 'app-finance-all',
  templateUrl: './finance-all.component.html',
  styleUrls: ['./finance-all.component.scss']
})
export class FinanceAllComponent implements OnInit{
    @Input('start_date') start_date: any;
    @Input('end_date') end_date: any;
isLoading = false;
  currentUser: PersonnelModel | any;

  preference: PreferenceModel;

  public chartOptionAllocations: Partial<ChartOptionAllocations>;

  public chartOptionsSTatutPaie: Partial<ChartOptionsTatutPaie>;

  public chartOptionNetApayerIPRCNSS: Partial<ChartOptionNetApayerIPRCNSS>;



  allocationList = [];

  statutPaieList = [];

  depensePayEList = [];

  primesList = [];
  primes = 0;
  primeAncienneteList = [];
  primeAnciennete = 0;
  penaliteList = [];
  penalite = 0;
  avanceSalaireList = [];
  avanceSalaire = 0;
  presEntrepriseList = [];
  presEntreprise = 0;
  heureSuppList = [];
  heureSupp = 0;
  syndicatList = [];
  syndicat = 0;

  totalRBIList = [];
  totalRBI = 0; 
  totalCNSSQPP = 0; 
  totalONEM = 0; 
  totalINPP = 0;


  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    private dashAllService: DashAllService,
    private financeService: FinanceService,
    private reglageService: ReglageService,
  ) {
      
  }

  ngOnInit(): void { 
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.getAllocations(); 
        this.getStatutPaie();
        this.getNetAPayerCCNSSQPO();
        this.getTotal();
        this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
            this.preference = res; 
            this.financeService.totalRBIAll(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
                res =>  {
                    this.totalRBIList = res;
                    this.totalRBIList.map((item: any) => this.totalRBI = parseFloat(item.total));
        
                    this.totalCNSSQPP = this.totalRBI * parseFloat(this.preference.cnss_qpp) / 100;
                    this.totalINPP = this.totalRBI * parseFloat(this.preference.inpp) / 100;
                    this.totalONEM = this.totalRBI * parseFloat(this.preference.onem) / 100;
                }
            );
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
                            return "" + val + " " + "employés";
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

   getNetAPayerCCNSSQPO() {
    this.financeService.depensePayEALl(this.currentUser.code_entreprise, this.start_date, this.end_date).subscribe(
        res => {
            this.depensePayEList = res;
            this.chartOptionNetApayerIPRCNSS = {
                series: [
                    {
                        name: "Net à payer",
                        data: this.depensePayEList.map((item: any) => parseFloat(item.net_a_payer)),
                    },
                    {
                        name: "IPR",
                        data: this.depensePayEList.map((item: any) => parseFloat(item.ipr)),
                    },
                    {
                        name: "CNSS QPO",
                        data: this.depensePayEList.map((item: any) => parseFloat(item.cnss_qpo)),
                    }
                ],
                chart: {
                    height: 287,
                    type: "line",
                    toolbar: {
                        show: false,
                    }
                },
                colors: [
                    "#2DB6F5", "#F765A3", "#757FEF"
                ],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 3,
                    curve: "straight",
                },
                legend: {
                    offsetY: 3,
                    position: "top",
                    fontSize: "14px",
                    horizontalAlign: "center",
                    labels: {
                        colors: '#5B5B98',
                    }
                },
                yaxis: {
                    tickAmount: 4,
                    labels: {
                        show: false,
                        style: {
                            colors: "#a9a9c8",
                            fontSize: "14px",
                        }
                    },
                    axisBorder: {
                        show: false,
                    }
                },
                xaxis: {
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        trim: false,
                        style: {
                            colors: "#a9a9c8",
                            fontSize: "14px",
                        }
                    },
                    categories: this.depensePayEList.map((item: any) => item.year_ans),
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



 

}
