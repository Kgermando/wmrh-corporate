import { Component, Input, OnInit } from '@angular/core';
import { SalaireService } from '../salaire.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';

@Component({
  selector: 'app-classeur-filter-disp',
  templateUrl: './classeur-filter-disp.component.html',
  styleUrls: ['./classeur-filter-disp.component.scss']
})
export class ClasseurFilterDispComponent implements OnInit {
  @Input('classer') classer: any;
  @Input('corporate') corporate: CorporateModel;


  currentUser: PersonnelModel | any;
 
  classerList: any[] = [];
  dateClasser: any;
  moisClasseur = '';
  annee: any;

  constructor( 
    private router: Router,
    private authService: AuthService,
    private salaireService: SalaireService,
) {}


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.salaireService.classerDisponible(this.currentUser.code_entreprise, this.corporate.id).subscribe(classer => {
          this.classerList = classer;
 
          var datePaieList = this.classerList.filter((v) => v.month == this.classer.month && v.year == this.classer.year);
          this.dateClasser = datePaieList[datePaieList.length-1];
          const month = parseInt(this.dateClasser.month);
          this.annee =  parseInt(this.dateClasser.year);
          if (month === 1) {
            this.moisClasseur = 'Janvier';
          } else if(month === 2) {
              this.moisClasseur = 'Fevrier';
          } else if(month === 3) {
              this.moisClasseur = 'Mars';
          } else if(month === 4) {
              this.moisClasseur = 'Avril';
          } else if(month === 5) {
              this.moisClasseur = 'Mai';
          } else if(month === 6) {
              this.moisClasseur = 'Juin';
          } else if(month === 7) {
              this.moisClasseur = 'Juillet';
          } else if(month === 8) {
              this.moisClasseur = 'Aôut';
          } else if(month === 9) {
              this.moisClasseur = 'Septembre';
          } else if(month === 10) {
              this.moisClasseur = 'Octobre';
          } else if(month === 11) {
            this.moisClasseur = 'Novembre';
          } else if(month === 12) {
            this.moisClasseur = 'Décembre';
          }
        });
          
      },
      error: (error) => { 
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
    
  }

 


}
