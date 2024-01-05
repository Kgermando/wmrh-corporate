import { Component, OnInit } from '@angular/core'; 
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service'; 
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { IndemniteService } from '../indemnite.service';
import { IndemniteModel } from '../models/indemnite.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-indemnite-view',
  templateUrl: './indemnite-view.component.html',
  styleUrls: ['./indemnite-view.component.scss']
})
export class IndemniteViewComponent implements OnInit {
  isLoading = false;

  indemnite: IndemniteModel;
  
  preference: PreferenceModel;

  currentUser: PersonnelModel | any;
  id: any;

  total = 0;

  delaiEditBulletin: Date;
  isValidDelai = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute, 
    private indemniteService: IndemniteService,
    private reglageService: ReglageService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.indemniteService.get(this.id).subscribe(item => {
          this.indemnite = item;
          this.reglageService.preference(this.indemnite.personnel.corporates.code_corporate).subscribe(reglage => {
            this.preference = reglage;
            var date = new Date(this.indemnite.update_created); 
            this.delaiEditBulletin = new Date(date);
            this.delaiEditBulletin.setDate(date.getDate() + this.preference.delai_edit_bulletin);
            var dateNow = new Date();
            if (dateNow > date && dateNow < this.delaiEditBulletin) {
              this.isValidDelai = true;
              console.log('isValidDelai true', this.isValidDelai);
            } else {
              this.isValidDelai = false;
              console.log('isValidDelai false', this.isValidDelai);
            }
            for (let item of this.indemnite.content) {
              if (this.indemnite.monnaie == 'CDF') {
                this.total += parseFloat(item.montant);
              } else if(this.indemnite.monnaie == 'USD') {
                this.total += parseFloat(item.montant) * this.preference.taux_dollard;
              }
            }
          });
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  } 

  
  edit(id: number) {
    var body = {
      statut: 'Traitement', 
      signature: this.currentUser.matricule, 
      update_created: new Date(),
    };
    this.indemniteService.update(id, body).subscribe(res => {
      this.router.navigate(['/layouts/salaires/indemnites/traitement', id, 'indemnite-paie']);
      this.toastr.info('Ce document est repassé en mode Traitement', 'Success!');
    });
  } 

  public openPDF(): void {
     
  }
}
