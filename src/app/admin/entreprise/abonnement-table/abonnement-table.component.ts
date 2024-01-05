import { Component, Input, ViewChild } from '@angular/core';
import { EntrepriseModel } from '../models/entreprise.model';
import { AbonnementModel } from 'src/app/abonnements/models/abonnement-model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { EntrepriseService } from '../entreprise.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToastrService } from 'ngx-toastr';
import { AbonnementAdminModel } from '../../abonnement-admin/models/abonnement.model';

@Component({
  selector: 'app-abonnement-table',
  templateUrl: './abonnement-table.component.html',
  styleUrls: ['./abonnement-table.component.scss']
})
export class AbonnementTableComponent {
  @Input('item') item: AbonnementAdminModel[]; 
  isLoading = false;

  total = 0;

  displayedColumns: string[] = ['devise', 'taux_devise', 'reference', 'responsable', 'bouquet', 'dure_paiement'];
  
  ELEMENT_DATA: AbonnementAdminModel[] = [];
  
  dataSource = new MatTableDataSource<AbonnementAdminModel>(this.ELEMENT_DATA);
  selection = new SelectionModel<AbonnementAdminModel>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 


  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
      private authService: AuthService,
    private entrepriseService: EntrepriseService,
    private _liveAnnouncer: LiveAnnouncer,) {} 
    private toastr: ToastrService
  
      ngAfterViewInit() {
          this.isLoading = true;
          this.ELEMENT_DATA = this.item; 
          this.total = this.item.length;
          this.dataSource = new MatTableDataSource<AbonnementAdminModel>(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
          
          // let id = this.route.snapshot.paramMap.get('id');
          // this.authService.user().subscribe({
          //     next: () => {
          //       this.entrepriseService.get(Number(id)).subscribe(res => {
          //         this.item = res; 
          //         this.ELEMENT_DATA = this.item.abonnements; 
          //         this.total = this.item.abonnements.length;
          //         this.dataSource = new MatTableDataSource<AbonnementAdminModel>(this.ELEMENT_DATA);
          //         this.dataSource.sort = this.sort;
          //         this.dataSource.paginator = this.paginator; 
          //       });
          //       this.isLoading = false;
          //     },
          //     error: (error) => {
          //       this.isLoading = false;
          //       this.router.navigate(['/auth/login']);
          //       console.log(error);
          //     }
          //   });
      }
  
   
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) { 
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
  
    detail(id: number) {
      this.router.navigate(['/layouts/personnels', id, 'personnel-edit'])
    }



    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.entrepriseService
          .delete(id)
          .subscribe({
            next: () => {
              this.toastr.info('Success!', 'Supprimé avec succès!');
              this.router.navigate(['layouts/preferences/departement']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          });
      }
    } 

    toggleTheme() {
      this.themeService.toggleTheme();
  } 
}
