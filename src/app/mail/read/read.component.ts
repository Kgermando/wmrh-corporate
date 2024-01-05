import { Component } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent {
  constructor(
    public themeService: CustomizerSettingsService
) {}

toggleTheme() {
    this.themeService.toggleTheme();
}
}
