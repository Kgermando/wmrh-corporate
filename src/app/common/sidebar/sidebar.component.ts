import { Component } from '@angular/core';
import { ToggleService } from '../header/toggle.service';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { PersonnelModel } from 'src/app/personnels/models/personnel-model';
import { Auth } from 'src/app/classes/auth';
import { CorporateService } from 'src/app/preferences/corporates/corporate.service';
import { CorporateModel } from 'src/app/preferences/corporates/models/corporate.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    loading = false;
    currentUser: PersonnelModel | any;

    corporateList: CorporateModel[] = [];
    

    panelOpenState = false;

    isToggled = false;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private corporateService: CorporateService,
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
              this.corporateService.refreshDataList$.subscribe(() => {
                this.allGetNavigation(this.currentUser.code_entreprise);
              })
              this.allGetNavigation(this.currentUser.code_entreprise); 
              console.log('code_entreprise', this.currentUser.code_entreprise)
            }
        );
    }

    allGetNavigation(code_entreprise: string) {
        this.corporateService.allGetNavigation(code_entreprise).subscribe(res => {
            this.corporateList = res;
            this.loading = false;
        });
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

}