import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
    ChartComponent,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexStroke,
    ApexTooltip,
    ApexDataLabels,
    ApexLegend,
} from "ng-apexcharts";
import { PersonnelModel } from "src/app/personnels/models/personnel-model"; 
import { PresencePieModel } from "src/app/presences/models/presence-pie-model";
import { PresenceService } from "src/app/presences/presence.service";


export type ChartOptions = {
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
  selector: 'app-presence-pie-month',
  templateUrl: './presence-pie-month.component.html',
  styleUrls: ['./presence-pie-month.component.scss']
})
export class PresencePieMonthComponent implements OnInit {
  @Input('personne') personne: PersonnelModel;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  
  presencePieList: PresencePieModel[] = [];

  constructor( private presenceService: PresenceService) { }

  
    ngOnInit(): void {
        this.getPie(); 
    }


    getPie() {
        this.presenceService.getPie(this.personne.code_entreprise, this.personne.matricule).subscribe(
            res => {
                this.presencePieList = res;
                this.chartOptions = {
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
                                return val;
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
                    // labels: [
                    //   'P',
                    //   'A',
                    //   'AA',
                    //   'AM',
                    //   'CC',
                    //   'CA',
                    //   'CO',
                    //   'S', 
                    //   'O'
                    // ]
                };
            }
        )
    }
}
