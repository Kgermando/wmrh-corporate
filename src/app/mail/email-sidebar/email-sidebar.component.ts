import { Component } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-email-sidebar',
  templateUrl: './email-sidebar.component.html',
  styleUrls: ['./email-sidebar.component.scss']
})
export class EmailSidebarComponent {
  constructor(
    public themeService: CustomizerSettingsService
) {}

}
