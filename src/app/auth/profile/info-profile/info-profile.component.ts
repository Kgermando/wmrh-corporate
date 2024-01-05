import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PreferenceModel } from 'src/app/preferences/reglages/models/reglage-model';
import { ReglageService } from 'src/app/preferences/reglages/reglage.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-profile',
  templateUrl: './info-profile.component.html',
  styleUrls: ['./info-profile.component.scss']
})
export class InfoProfileComponent implements OnInit {
  @Input() currentUser: PersonnelModel;

  isLoading = false;

  preference: PreferenceModel;

  constructor(
    public themeService: CustomizerSettingsService,
    private router: Router,
    private authService: AuthService,
    private reglageService: ReglageService,
) {}

  ngOnInit(): void {
    this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user; 
            this.reglageService.preference(this.currentUser.code_entreprise).subscribe(res => {
              this.preference = res; 
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



  imageSlides2: OwlOptions = {
    items: 1,
    nav: true,
    loop: true,
    margin: 25,
    dots: true,
    autoplay: false,
    smartSpeed: 1000,
    autoplayHoverPause: true,
      navText: [
    "<i class='flaticon-chevron-1'></i>",
    "<i class='flaticon-chevron'></i>",
    "<i class='flaticon-chevron'></i>",
    "<i class='flaticon-chevron'></i>"
    ]
  }

  toggleTheme() {
      this.themeService.toggleTheme();
  }
}
