import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'; 
import { HoraireModel } from '../models/horaire.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HoraireService } from '../horaire.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 

@Component({
  selector: 'app-horaire',
  templateUrl: './horaire.component.html',
  styleUrls: ['./horaire.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HoraireComponent implements OnInit {

  isLoadingView = false;
  horaire: HoraireModel;
  currentUser: PersonnelModel;


  horaireEvent: any;

  
  constructor( 
    private router: Router,
      private authService: AuthService,
      private route: ActivatedRoute,
      private horaireService: HoraireService,
      public dialog: MatDialog,
      private toastr: ToastrService
  ) {}

  ngOnInit(): void { 
    
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.route.params.subscribe(routeParams => {
          this.loadData(routeParams['horaire_id']);
          console.log('routeParams', routeParams['horaire_id'])
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  public loadData(id: any): void {
    this.isLoadingView = true;
    this.horaireService.get(Number(id)).subscribe(res => {
      this.horaire = res;
      this.isLoadingView = false;
    });
  }
 
 
  edit(id: number): void { 
    this.router.navigate(['/layouts/presences', this.horaire.corporate.id, 'horaires', this.horaire.id, 'horaire-edit']);
  }
 
  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.horaireService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!');
            // this.router.navigate(['/layouts/presences', this.horaire.corporate.id, 'horaires']); 
            window.location.reload();
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        }
      );
    }
  }

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, 
      personnel_shift: any, shift: number, time: any): void {
    this.dialog.open(HoraireInfoDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        personnel_shift: personnel_shift,
        shift: shift,
        time: time
      }
    }); 
  } 

}



@Component({
  selector: 'horaire-dialog',
  templateUrl: './horaire-info.html',
})
export class HoraireInfoDialogBox {
  
  date: string;
  horaire: HoraireModel;

  personnel_shift: string[] = []; 
  shift: number;
  time: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<HoraireInfoDialogBox>, 
      private horairervice: HoraireService,
  ) {} 

  
  close(){
    this.dialogRef.close(true);
  } 
 

}
