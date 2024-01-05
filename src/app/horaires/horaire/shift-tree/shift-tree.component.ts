import { Component, Input } from '@angular/core';
import { HoraireModel } from '../../models/horaire.model';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { HoraireInfoDialogBox } from '../horaire.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shift-tree',
  templateUrl: './shift-tree.component.html',
  styleUrls: ['./shift-tree.component.scss']
})
export class ShiftTreeComponent {
    @Input() horaire: HoraireModel;

    constructor(
      public dialog: MatDialog, 
    ) {}


    dateClass3: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
      // Only highligh dates inside the month view.
      if (view === 'month') {
        var date = cellDate.getDate();
        var dateMonth = cellDate.getMonth();
        var dateYear = cellDate.getFullYear();  
        var day: any;
        var dayMonth: any;
        var dayYear: any; 

        let dataCSS = '';

        for (let index of this.horaire.date_shift_3) { 
          date = cellDate.getDate();
          dateMonth = cellDate.getMonth();
          dateYear = cellDate.getFullYear(); 
          const dy = new Date(index);
          day = dy.getDate();
          dayMonth = dy.getMonth();
          dayYear = dy.getFullYear(); 
          if (date === day && dateMonth === dayMonth && dateYear === dayYear) {
            dataCSS = "shift_3";
          }
        }
        return dataCSS;
      }

      return '';
    } 

    openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, 
      personnel_shift: any, shift: number, time: any): void {
    this.dialog.open(HoraireInfoDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        personnel_shift: personnel_shift,
        shift: shift,
        time: time
      }
    }); 
  }
}
