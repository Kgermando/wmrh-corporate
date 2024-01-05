import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 
import { EntrepriseModel } from 'src/app/admin/entreprise/models/entreprise.model';
import { PersonnelModel } from '../personnels/models/personnel-model';
import { PersonnelService } from '../personnels/personnel.service'; 

@Component({
  selector: 'app-corbeil',
  templateUrl: './corbeil.component.html',
  styleUrls: ['./corbeil.component.scss']
})
export class CorbeilComponent implements OnInit {
  displayedColumns: string[] = ['corporate_name', 'matricule', 'fullname', 'email', 'telephone', 'sexe'];
  
  ELEMENT_DATA: any[] = [];
  
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  isLoading = false;
  currentUser: PersonnelModel | any;
 
  entreprise: EntrepriseModel;
  isActive = false;

 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private personnelService: PersonnelService, 
      public dialog: MatDialog, 
  ) {}


  toggleTheme() {
    this.themeService.toggleTheme();
  }


  ngOnInit() {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user; 
            this.personnelService.corbeil(this.currentUser.code_entreprise).subscribe(res => {
              this.ELEMENT_DATA = res; 
              this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              console.log('service', this.ELEMENT_DATA);
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
    this.router.navigate(['/layouts/personnels', id, 'personnel-edit'])
  }
  

}



