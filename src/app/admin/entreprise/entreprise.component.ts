import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EntrepriseModel } from '../entreprise/models/entreprise.model';
import { MatPaginator } from '@angular/material/paginator';
import { EntrepriseService } from '../entreprise/entreprise.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent implements OnInit {
  displayedColumns: string[] = ['statut', 'company_name', 'code_entreprise', 'rccm', 'responsable'];
  
  ELEMENT_DATA: EntrepriseModel[] = [];
  
  dataSource = new MatTableDataSource<EntrepriseModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PersonnelModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any;
 
  isActive = false;
 
  constructor( 
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService, 
      private entrepriseService: EntrepriseService,
  ) {}  

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.entrepriseService.getEntreprise().subscribe(res => {
          this.ELEMENT_DATA = res; 
          this.dataSource = new MatTableDataSource<EntrepriseModel>(this.ELEMENT_DATA);
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
        }
      );
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
 
 