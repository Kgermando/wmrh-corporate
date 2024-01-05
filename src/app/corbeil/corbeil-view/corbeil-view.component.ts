import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PersonnelService } from 'src/app/personnels/personnel.service';

@Component({
  selector: 'app-corbeil-view',
  templateUrl: './corbeil-view.component.html',
  styleUrls: ['./corbeil-view.component.scss']
})
export class CorbeilViewComponent implements OnInit {
  isLoading = false;

  personne: PersonnelModel;

  currentUser: PersonnelModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private personnelService: PersonnelService) {}


    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.personnelService.get(Number(id)).subscribe(res => {
            this.personne = res;
            this.isLoading = false;
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
  
}
