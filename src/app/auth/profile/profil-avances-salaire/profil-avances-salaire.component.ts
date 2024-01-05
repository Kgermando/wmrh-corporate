import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { AuthService } from '../../auth.service';
import { AvanceSalaireModel } from 'src/app/avance-salaires/models/avance-salaire-model';

@Component({
  selector: 'app-profil-avances-salaire',
  templateUrl: './profil-avances-salaire.component.html',
  styleUrls: ['./profil-avances-salaire.component.scss']
})
export class ProfilAvancesSalaireComponent implements OnInit { 
  @Input() currentUser: PersonnelModel;

  displayedColumns: string[] = ['update', 'intitule', 'montant'];
  
  ELEMENT_DATA: AvanceSalaireModel[] = [];
  
  dataSource = new MatTableDataSource<AvanceSalaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<AvanceSalaireModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  isLoading = false;  
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user;
            this.ELEMENT_DATA = this.currentUser.avances_salaires;
            this.dataSource = new MatTableDataSource<AvanceSalaireModel>(this.ELEMENT_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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
