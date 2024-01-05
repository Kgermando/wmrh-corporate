import { Component, OnInit } from '@angular/core';
import { NotifyService } from './notify.service';
import { PersonnelModel } from '../personnels/models/personnel-model';
import { AuthService } from '../auth/auth.service';
import { NotifyModel } from './models/notify-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  isLoading = false;
  currentUser: PersonnelModel | any;

  notifyList: NotifyModel[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifyService: NotifyService) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.notifyService.getAllNotify(
          this.currentUser.code_entreprise, this.currentUser.matricule).subscribe(res => {
          this.notifyList = res;
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

  
}
