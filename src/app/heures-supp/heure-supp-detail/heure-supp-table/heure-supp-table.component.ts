import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { SelectionModel } from '@angular/cdk/collections';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PersonnelService } from 'src/app/personnels/personnel.service';  
import { HeureSuppModel } from '../../models/heure-supp-model';

@Component({
  selector: 'app-heure-supp-table',
  templateUrl: './heure-supp-table.component.html',
  styleUrls: ['./heure-supp-table.component.scss']
})
export class HeureSuppTableComponent implements OnInit {
  @Input('heureSupp') heureSupp: HeureSuppModel;  

  displayedColumns: string[] = ['motif', 'nbr_heures', 'created', 'update_created'];
  
  ELEMENT_DATA: HeureSuppModel[] = [];
  
  dataSource = new MatTableDataSource<HeureSuppModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<HeureSuppModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator; 


  isLoading = false;
  currentUser: PersonnelModel | any;

  personne: PersonnelModel; 

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    private personnelService: PersonnelService, 
) {} 
toggleTheme() {
  this.themeService.toggleTheme();
}


ngOnInit() { 
      this.isLoading = true;
      this.authService.user().subscribe({
          next: (user) => {
              this.currentUser = user;
              this.personnelService.get(this.heureSupp.personnel.id).subscribe(res => {
                this.personne = res;
                  this.ELEMENT_DATA = this.personne.heures_supp; 
                  this.dataSource = new MatTableDataSource<HeureSuppModel>(this.ELEMENT_DATA);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
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

  detail(id: number) {
    this.router.navigate(['/layouts/presences/heures-supp', id, 'detail']) 
  } 
} 
