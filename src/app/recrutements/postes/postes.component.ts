import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { PosteModel } from './models/poste-model';
import { PostesService } from '../postes.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';

@Component({
  selector: 'app-postes',
  templateUrl: './postes.component.html',
  styleUrls: ['./postes.component.scss']
})
export class PostesComponent implements AfterViewInit {
  displayedColumns: string[] = ['statut', 'search_profil', 'type_contrat', 'echeance', 'created'];
  
  ELEMENT_DATA: PosteModel[] = [];
  
  dataSource = new MatTableDataSource<PosteModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PosteModel>(true, []);

  isLoading = false;
  currentUser: PersonnelModel | any;
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private postesService: PostesService
  ) {}

  toggleTheme() {
      this.themeService.toggleTheme();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

    ngAfterViewInit() { 
        this.isLoading = true;
        this.authService.user().subscribe({
            next: (user) => {
                this.currentUser = user;
                this.postesService.getAll(this.currentUser.code_entreprise).subscribe(res => {
                  this.ELEMENT_DATA = res; 
                  this.dataSource = new MatTableDataSource<PosteModel>(this.ELEMENT_DATA);
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
 

}
 