import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PresenceService } from '../presence.service';
import { ApointementModel } from '../models/presence-model';
import { PresencePAAAModel } from '../models/presence-pie-model';
import { FormGroup } from '@angular/forms';
import { CorporateService } from 'src/app/preferences/corporates/corporate.service';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';
import { SiteLocationModel } from 'src/app/preferences/site-location/models/site-location-model';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrls: ['./pointage.component.scss']
})
export class PointageComponent implements OnInit {

  isLoading = false;
  currentUser: PersonnelModel | any; 

  personnelList: PersonnelModel[] = [];
  personnelFilter: PersonnelModel[] = [];

  presence: ApointementModel;

  itemsPAAAList: PresencePAAAModel[] = [];
  itemsPList: PresencePAAAModel[] = [];
  itemsAList: PresencePAAAModel[] = [];
  itemsAAList: PresencePAAAModel[] = [];

  itemsCongeList: PresencePAAAModel[] = [];
  itemsAMList: PresencePAAAModel[] = [];
  itemsCCList: PresencePAAAModel[] = [];
  itemsCAList: PresencePAAAModel[] = [];
  itemsCOList: PresencePAAAModel[] = [];
  itemsSList: PresencePAAAModel[] = [];
  itemsOList: PresencePAAAModel[] = [];
  itemsMList: PresencePAAAModel[] = [];
 
  numberP: number = 0;
  numberA: number = 0;
  numberAA: number = 0;

  numberAM: number = 0;
  numberCC: number = 0;
  numberCA: number = 0;
  numberCO: number = 0;
  numberS: number = 0;
  numberO: number = 0;
  numberM: number = 0; 

  formGroup: FormGroup;
  corporateList: CorporateModel[] = [];
  corporate: CorporateModel;
  siteLocationList: SiteLocationModel[] = [];
  siteLocation: SiteLocationModel;

  
 
  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private corporateService: CorporateService,
    private presenceService: PresenceService,
    private personnelService: PersonnelService
  ) {}


  ngOnInit(): void {
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.route.params.subscribe(routeParams => {
            this.personnelService.refreshDataList$.subscribe(() => {
              this.loadData(routeParams['id'], this.currentUser.code_entreprise, this.currentUser.site_locations.site_location);
            });
            this.loadData(routeParams['id'], this.currentUser.code_entreprise, this.currentUser.site_locations.site_location);
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      }
    );
  }

  loadData(id: any, code_entreprise: string, site_location: string): void {
    this.isLoading = true;
    this.corporateService.getOne(Number(id)).subscribe(res => {
      this.corporate = res;
      this.personnelService.getPersennelByCorporate(this.corporate.id).subscribe(personnels => {
        var employes = personnels;
        this.personnelList = employes.filter((v: PersonnelModel) => (v.site_locations) ? v.site_locations.site_location == site_location : []);

        this.personnelFilter = [...this.personnelList];

        this.presenceService.getItemsPAAA(code_entreprise, site_location).subscribe(res => {
          this.itemsPAAAList = res;
          this.itemsPList = this.itemsPAAAList.filter(v => v.apointement === 'P');
          this.itemsAList = this.itemsPAAAList.filter(v => v.apointement === 'A');
          this.itemsAAList = this.itemsPAAAList.filter(v => v.apointement === 'AA');
          this.itemsPList.map((item: any) => this.numberP = item.count);
          this.itemsAList.map((item: any) => this.numberA = item.count);
          this.itemsAAList.map((item: any) => this.numberAA = item.count); 
        });
        this.presenceService.getItemsCongE(code_entreprise, site_location).subscribe(res => {
          this.itemsCongeList = res; 
          this.itemsAMList = this.itemsCongeList.filter(v => v.apointement === 'AM');
          this.itemsCCList = this.itemsCongeList.filter(v => v.apointement === 'CC');
          this.itemsCAList = this.itemsCongeList.filter(v => v.apointement === 'CA');
          this.itemsCOList = this.itemsCongeList.filter(v => v.apointement === 'CO');
          this.itemsSList = this.itemsCongeList.filter(v => v.apointement === 'S');
          this.itemsOList = this.itemsCongeList.filter(v => v.apointement === 'O');
          this.itemsMList = this.itemsCongeList.filter(v => v.apointement === 'M');
  
          this.itemsAMList.map((item: any) => this.numberAM = item.count);
          this.itemsCCList.map((item: any) => this.numberCC = item.count);
          this.itemsCAList.map((item: any) => this.numberCA = item.count);
          this.itemsCOList.map((item: any) => this.numberCO = item.count);
          this.itemsSList.map((item: any) => this.numberS = item.count);
          this.itemsOList.map((item: any) => this.numberO = item.count);
          this.itemsMList.map((item: any) => this.numberM = item.count);
        });
        this.isLoading = false;
      });
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value; 
    this.personnelFilter = [...this.personnelList.filter(personne =>  
      personne.matricule.includes(filterValue.trim().toLowerCase()))];
  }

 

    toggleTheme() {
      this.themeService.toggleTheme();
    }

}