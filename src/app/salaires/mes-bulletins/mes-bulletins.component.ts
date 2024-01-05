import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { SalaireModel } from '../models/salaire-model';
import { SalaireService } from '../salaire.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SalaireExportXLSXDialogBox } from '../releve-paie/releve-paie.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mes-bulletins',
  templateUrl: './mes-bulletins.component.html',
  styleUrls: ['./mes-bulletins.component.scss']
})
export class MesBulletinsComponent implements OnInit {
  displayedColumns: string[] = ['statut', 'matricule', 'taux_dollard', 'net_a_payer', 'ipr', 'cnss', 'created'];
   
  ELEMENT_DATA: SalaireModel[] = [];
  
  dataSource = new MatTableDataSource<SalaireModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<SalaireModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  isLoading = false;
  currentUser: PersonnelModel | any;

  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private salaireService: SalaireService,
      public dialog: MatDialog,
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user;
            this.salaireService.mesBulletins(this.currentUser.code_entreprise, this.currentUser.matricule).subscribe(res => {
                this.ELEMENT_DATA = res; 
                this.dataSource = new MatTableDataSource<SalaireModel>(this.ELEMENT_DATA);
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

  toggleTheme() {
      this.themeService.toggleTheme();
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

 
  openExportDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SalaireExportXLSXDialogBox, {
      width: '600px', 
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 

}
