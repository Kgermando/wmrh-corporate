import { Component, Input, OnInit } from '@angular/core';
import { SalaireService } from '../salaire.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';

@Component({
  selector: 'app-classeur-filter',
  templateUrl: './classeur-filter.component.html',
  styleUrls: ['./classeur-filter.component.scss']
})
export class ClasseurFilterComponent implements OnInit {
  @Input('farde') farde: any;


  currentUser: PersonnelModel | any;

  fardeList: any[] = [];
  dateFarde: any;
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
          this.salaireService.farde(this.currentUser.code_entreprise).subscribe(farde => {
            this.fardeList = farde;
            var datePaieList = this.fardeList.filter((v) => v.month == this.farde.month && v.year == this.farde.year);
            this.dateFarde = datePaieList[datePaieList.length-1]; 
            const month = parseInt(this.dateFarde.month);
            this.annee =  parseInt(this.dateFarde.year);
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
