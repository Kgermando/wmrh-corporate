import { Component, Input } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HoraireModel } from '../models/horaire-model';

@Component({
  selector: 'app-horaire',
  templateUrl: './horaire.component.html',
  styleUrls: ['./horaire.component.scss']
})
export class HoraireComponent {
  // @Input('horaire') horaire?: HoraireModel;
  @Input('horaireList') horaireList: HoraireModel[];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    weekends: true,
    events: [
      { title: '-', date: '2023-09-25', backgroundColor: 'orange', textColor: 'white'},
      { title: `shift 2`, date: '2023-09-25', backgroundColor: 'green', textColor: 'white' },
    ],
    dayHeaderContent: [
      { startTime: '2023-09-09', endTime: '2023-09-30'}
    ],
    plugins: [dayGridPlugin]
  };
}
