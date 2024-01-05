import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexLegend,
} from "ng-apexcharts";  
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model'; 

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
  selector: 'app-performence-pie',
  templateUrl: './performence-pie.component.html',
  styleUrls: ['./performence-pie.component.scss']
})
export class PerformencePieComponent {
  @Input('personne') personne: PersonnelModel; 

  isSelect = 'Année';  

  
    constructor(
        public themeService: CustomizerSettingsService,
    ) {  } 


    onSelectChange(event: any) {
      console.log(event.value);
      if(event.value === 'Année') {
        this.isSelect = 'Année';
      } else if(event.value === 'All') {
        this.isSelect = 'All';
      }
    }
 
}