import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service'; 
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router'; 
import { PersonnelService } from 'src/app/personnels/personnel.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { Subject } from 'rxjs';
import { SalaireService } from '../salaire.service';


@Component({
  selector: 'app-list-paiments',
  templateUrl: './list-paiments.component.html',
  styleUrls: ['./list-paiments.component.scss']
})
export class ListPaimentsComponent implements OnInit {
  displayedColumns: string[] = ['service', 'matricule', 'nom', 'postnom', 'prenom', 'email', 'telephone', 'sexe'];
  
  personnelFilter: PersonnelModel[] = []; // Filter des personnels qui sont deja payé!
  ELEMENT_DATA: PersonnelModel[] = [];
  
  dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<PersonnelModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 

  public loading$ = new Subject<boolean>();

  isLoading = false;
  currentUser: PersonnelModel | any; 
 
  constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public themeService: CustomizerSettingsService,
      private router: Router,
      private authService: AuthService,
      private personnelService: PersonnelService,
      private salaireService: SalaireService
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
        next: (user) => {
            this.currentUser = user;
            // this.personnelService.getAll(this.currentUser.code_entreprise).subscribe(res => {
            //   this.personnelFilter = res;
            //   this.ELEMENT_DATA = this.personnelFilter.filter((v) => parseFloat(v.salaire_base) > 0);  // v.date_paie <= fardeValueMax.max &&
            //   this.dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
            //   this.dataSource.sort = this.sort;
            //   this.dataSource.paginator = this.paginator;
            //   this.isLoading = false;
            // });
            this.personnelService.resetStatutPaieAll(this.currentUser.code_entreprise).subscribe(() => {
              this.personnelService.getAll(this.currentUser.code_entreprise)
              .subscribe(res => {
                  this.personnelFilter = res;
                  this.ELEMENT_DATA = this.personnelFilter.filter(v => 
                      parseFloat(v.salaire_base) > 0 && v.statut_paie == 'En attente');
                  this.dataSource = new MatTableDataSource<PersonnelModel>(this.ELEMENT_DATA);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;  

                  this.isLoading = false;
              });
            });
            
            
            
        },
        error: (error) => {
            this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      }); 
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


  resetStatutPaieAll() {
    this.isLoading = true;
    this.personnelService.resetStatutPaieAll(this.currentUser.code_entreprise).subscribe(() => {
        this.isLoading = false;
    })
  }



}
 