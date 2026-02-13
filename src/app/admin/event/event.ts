import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-event',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Event {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: (info) => {
      alert("Date cliquée : " + info.dateStr);
    },
    events: [
      { title: "Test Event", date: "2026-02-13" },
      { title: "Meeting", date: "2026-02-18" }
    ]
  };
}
