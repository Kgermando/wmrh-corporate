import { Component, HostListener } from '@angular/core';
import { ToggleService } from './toggle.service';
import { DatePipe } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'src/app/classes/auth';
import { NotifyService } from 'src/app/notify/notify.service';
import { NotifyModel } from 'src/app/notify/models/notify-model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    isToggled = false;

    loading = false;
    currentUser: PersonnelModel | any;

    isNotify = false;
    notifyList: NotifyModel[] = [];

    formGroup!: FormGroup;
    isLoading = false;
    
    constructor(
        private toggleService: ToggleService,
        private datePipe: DatePipe,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private notifyService: NotifyService,
        private formBuilder: FormBuilder,
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.loading = true; 
        Auth.userEmitter.subscribe(
            user => {
              this.currentUser = user; 
              console.log(this.currentUser);
              this.notifyService.getAllNotify(this.currentUser.code_entreprise, this.currentUser.matricule).subscribe(
                res => {
                    var dataList: NotifyModel[] = res;
                    this.notifyList = dataList.filter(n => n.is_read === false);
                    if (this.notifyList.length > 0) {
                        this.isNotify = true;
                    } else {
                        this.isNotify = false;
                    }
                }
              )
            }
          );
        this.loading = false;
    }


    isRead(id: number) {
        try {
            this.isLoading = true;
            var body = {
                is_read: true,
                signature: this.currentUser.matricule, 
                update_created: new Date(),
            }
            console.log('isread', id);
            this.notifyService.update(id, body).subscribe({
                next: (res) => {
                    this.isLoading = false;
                },
                error: err => {
                    console.log('Notify', err); 
                    this.isLoading = false;
                }
            });
        } catch (error) {
            this.isLoading = false;
            console.log(error);
        }
    }
  
    logOut() {
        this.authService.logout().subscribe(res => {
           console.log(res);
           localStorage.removeItem('jwt');
           localStorage.removeItem('roles');
        //    localStorage.clear();
        });
    }




    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy', 'fr-FR');

}