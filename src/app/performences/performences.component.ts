import { Component, OnInit, ViewChild } from '@angular/core';
import { PerformenceModel } from './models/performence-model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PersonnelModel } from '../personnels/models/personnel-model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';  
import { CorporateModel } from '../preferences/corporates/models/corporate.model';
import { CorporateService } from '../preferences/corporates/corporate.service';
import { PersonnelService } from '../personnels/personnel.service';

@Component({
  selector: 'app-performences',
  templateUrl: './performences.component.html',
  styleUrls: ['./performences.component.scss']
})
export class PerformencesComponent implements OnInit {
  displayedColumns: string[] = ['update_created', 'matricule', 'fullname', 'ponctualite', 'hospitalite', 'travail', 'cumul'];
  
  ELEMENT_DATA: PersonnelModel[] = [];
  
  dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PerformenceModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any;

  corporate: CorporateModel;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService, 
      private route: ActivatedRoute,
      private corporateService: CorporateService,
      private personnelService: PersonnelService,   
      public dialog: MatDialog,
  ) {} 

  toggleTheme() {
      this.themeService.toggleTheme();
  }



  ngOnInit() { 
    this.route.params.subscribe(routeParams => { 
      this.personnelService.refreshDataList$.subscribe(() => {
        this.loadData(routeParams['id']);
      })
      this.loadData(routeParams['id']);
    });
  }
 
    public loadData(id: any): void {
      this.isLoading = true;
      this.corporateService.getOne(Number(id)).subscribe(res => {
        this.corporate = res; 
        this.personnelService.getPersennelByCorporate(this.corporate.id).subscribe((personnels) => {
          this.ELEMENT_DATA = personnels;
          this.dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        });
      });
    } 

 
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) { 
      if (sortState.direction) {
          this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
          this._liveAnnouncer.announce('Sorting cleared');
      }
  } 

}
 

