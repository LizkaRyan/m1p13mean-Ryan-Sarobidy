import { Component, Inject, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { EventAndRequest, RequestEvent } from '../../../types/api';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-validation',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './event-validation.html',
  styleUrl: './event-validation.css',
})
export class EventValidation implements OnInit {
  calendarOptions!: CalendarOptions;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  events: RequestEvent[] = [];
  isBrowser = false;
  private http = inject(HttpClient);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.initCalendar();
    }
  }

  turnIntoCalendarEvents(event: any, color: string): any {
    let name = ""
    if(event.shopId){
      name = " - " + event.shopId.name;
    }
    return {
      title: event.title + name,
      start: event.startDate,
      end: event.endDate,
      allDay: true,
      backgroundColor: color,
      extendedProps: {
        description: event.description,
        themes: event.themes,
        startDate: event.startDate,
        endDate: event.endDate,
        id: event._id
      }
    }
  }

  initCalendar(): void {
    this.calendarOptions = {
      height: 500,
      locale: frLocale,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      contentHeight: 400,
      aspectRatio: 1.5,
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'dayGridMonth',
      events: (fetchInfo, successCallback, failureCallback) => {
        this.getRequestsEvent('REQUEST', fetchInfo.start.getFullYear()).subscribe({
          next: (events) => {
            const lo = events.events.map(event => (this.turnIntoCalendarEvents(event, '#22C55E')));
            
            lo.push(...events.requests.map(event => (this.turnIntoCalendarEvents(event, '#F59E0B'))));
            successCallback(lo)
          },
          error: (error) => failureCallback(error)
        });
      },
      eventClick: this.eventClick.bind(this),
      datesSet: (info) => {
        const newYear = info.start.getFullYear();

        // Recharge les événements pour la nouvelle année
        const calendarApi = info.view.calendar;
        this.getRequestsEvent('REQUEST', newYear).subscribe({
          next: (events) => {

            const lo = events.events.map(event => (this.turnIntoCalendarEvents(event, '#22C55E')));
            
            lo.push(...events.requests.map(event => (this.turnIntoCalendarEvents(event, '#F59E0B'))));

            // On supprime les anciens événements et on ajoute les nouveaux
            calendarApi.removeAllEvents();
            lo.forEach(ev => calendarApi.addEvent(ev));
          },
          error: (err) => console.error('Erreur chargement events :', err)
        });
      }
    };
  }

  eventClick(info) {
    const start = info.event.extendedProps.startDate.includes('T') ? info.event.extendedProps.startDate.slice(0, 16) : `${info.event.extendedProps.startDate}T00:00`;
    const end = info.event.extendedProps.endDate
      ? (info.event.extendedProps.endDate.includes('T') ? info.event.extendedProps.endDate.slice(0, 16) : `${info.event.extendedProps.endDate}T00:00`)
      : '';
    /*this.boxForm.patchValue({
      _id: info.event.extendedProps.id,
      title: info.event.title,
      startDate: start,
      endDate: end,
      description: info.event.extendedProps.description,
      themes: info.event.extendedProps.themes.join(', '),
      color: info.event.backgroundColor
    });*/
  }

  getRequestsEvent(status, year): Observable<EventAndRequest> {
    return this.http.get<EventAndRequest>(`${environment.baseUrl}/requests-event?status=${status}&year=${year}`);
  }

  changeEvents(events: RequestEvent[]): void {
    const calendarApi = this.calendarComponent.getApi();

    calendarApi.removeAllEvents();

    events.forEach((event: any) => {
      calendarApi.addEvent({
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        allDay: true,
        backgroundColor: event.color,
        textColor: '#FFFFFF',
        extendedProps: {
          description: event.description,
          themes: event.themes,
          startDate: event.startDate,
          endDate: event.endDate,
          id: event._id
        }
      });
    });
  }

  splitAndFormat(str) {
    return str
      .split(",")                 // séparer par virgule
      .map(s => s.trim())         // enlever les espaces début/fin
      .filter(s => s.length > 0)  // enlever les éléments vides
      .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
  }

  postEvent(event: RequestEvent): Observable<RequestEvent[]> {
    return this.http.post<RequestEvent[]>(`${environment.baseUrl}/events`, event);
  }

  patchEvent(event: any): Observable<RequestEvent[]> {
    return this.http.patch<RequestEvent[]>(`${environment.baseUrl}/events/${event._id}`, event);
  }

  delete(): void {
    this.patchEvent({ deletedAt: new Date().toISOString() }).subscribe({
      next: (events) => {
        this.changeEvents(events);
      },
      error: (error) => console.error('Erreur lors de la suppression de l\'événement:', error)
    })
  }
}