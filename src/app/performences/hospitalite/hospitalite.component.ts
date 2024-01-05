import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { PerformenceService } from '../performence.service';

@Component({
  selector: 'app-hospitalite',
  templateUrl: './hospitalite.component.html',
  styleUrls: ['./hospitalite.component.scss']
})
export class HospitaliteComponent implements OnInit{
  @Input('element') element: PersonnelModel;

  isLoading = false;

  currentUser: PersonnelModel | any;

  hospitaliteTotal = 0;


  constructor(
    public themeService: CustomizerSettingsService, 
    private router: Router,
    private authService: AuthService,
    private performenceService: PerformenceService,) {}



  ngOnInit(): void {
    this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.performenceService.hospitaliteTotal(this.currentUser.code_entreprise, this.element.id).subscribe(
            res => {
              var hospitalites = res; 
              hospitalites.map((item: any) => this.hospitaliteTotal = parseFloat(item.sum)); 
            }
          );
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });   
  }
}
