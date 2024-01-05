import { OnInit, Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AvanceSalaireModel } from '../models/avance-salaire-model';
import { SelectionModel } from '@angular/cdk/collections';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-avance-salaire-table',
  templateUrl: './avance-salaire-table.component.html',
  styleUrls: ['./avance-salaire-table.component.scss']
})
export class AvanceSalaireTableComponent implements OnInit {
  @Input('avanceSalaire') avanceSalaire: AvanceSalaireModel;
  @Input('preference') preference: PreferenceModel;

  displayedColumns: string[] = ['intitule', 'montant', 'created', 'update_created'];
  
  ELEMENT_DATA: AvanceSalaireModel[] = [];
  
  dataSource = new MatTableDataSource<AvanceSalaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<AvanceSalaireModel>(true, []);

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
                this.personnelService.get(this.avanceSalaire.personnel.id).subscribe(res => {
                  this.personne = res;
                    this.ELEMENT_DATA = this.personne.avances_salaires; 
                    this.dataSource = new MatTableDataSource<AvanceSalaireModel>(this.ELEMENT_DATA);
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
    this.router.navigate(['/layouts/salaires/avance-salaire', id, 'detail'])
  } 

}
