import { Component, Inject, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { EventData } from '../../../types/api';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { environment } from '../../environments/environment';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMailbox, lucideSearch } from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';
import { EventComposant } from '../../composant/event-composant/event-composant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-event',
  standalone: true,
  templateUrl: './client-event.html',
  styleUrl: './client-event.css',
  imports: [CommonModule, FullCalendarModule, FormsModule, NgIconComponent, EventComposant],
  providers: [provideIcons({ empty: lucideMailbox, search: lucideSearch })]
})
export class ClientEvent implements OnInit {
  boxForm!: EventData;
  calendarOptions!: CalendarOptions;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  events: EventData[] = [];
  isBrowser = false;
  searchTerm: string = '';
  searchTerm$ = new BehaviorSubject<string>('');
  eventsSubject = new BehaviorSubject<EventData[]>([]);
  events$ = this.eventsSubject.asObservable();
  private http = inject(HttpClient);
  private selectedEventSubject = new BehaviorSubject<EventData | null>(null);
  selectedEvent$ = this.selectedEventSubject.asObservable();
  private route = inject(ActivatedRoute);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  onSearchChange(value: string) {
    this.searchTerm$.next(value);
  }

  viewOnCalendar(startDate: string): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(startDate);
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.events$ = combineLatest([
      this.eventsSubject,
      this.searchTerm$
    ]).pipe(
      map(([events, term]) =>
        events.filter(r =>
          r.title.toLowerCase().includes(term.toLowerCase())
        )
      )
    );

    if (this.isBrowser) {
      this.initCalendar();
    }

    this.route.queryParams.subscribe(params => {
      const id = params['_id'];
      if(id){
        this.getEventsByEventId(id).subscribe({
          next: (event) => {
            this.selectedEventSubject.next(event);
          },
          error: (err) => console.error('Erreur chargement event :', err)
        });
      }
    });
  }

  getEventsByEventId(id: string): Observable<EventData> {
    return this.http.get<EventData>(`${environment.baseUrl}/events/${id}`);
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
        this.getEvents(fetchInfo.start.getFullYear()).subscribe({
          next: (events) => {
            const lo = events.map(event => ({
              title: event.title,
              start: event.startDate,
              end: event.endDate,
              allDay: true,
              backgroundColor: event.color,
              color: '#FFFFFF',
              extendedProps: {
                description: event.description,
                themes: event.themes,
                startDate: event.startDate,
                endDate: event.endDate,
                id: event._id
              }
            }));
            successCallback(lo)
            this.eventsSubject.next(events);
          },
          error: (error) => failureCallback(error)
        });
      },
      eventClick: this.eventClick.bind(this),
      datesSet: (info) => {
        const newYear = info.start.getFullYear();

        // Recharge les événements pour la nouvelle année
        const calendarApi = info.view.calendar;
        this.getEvents(newYear).subscribe({
          next: (events) => {
            const formattedEvents = events.map(event => ({
              title: event.title,
              start: event.startDate,
              end: event.endDate,
              allDay: true,
              backgroundColor: event.color,
              color: '#FFFFFF',
              extendedProps: {
                description: event.description,
                themes: event.themes,
                startDate: event.startDate,
                endDate: event.endDate,
                id: event._id
              }
            }));

            // On supprime les anciens événements et on ajoute les nouveaux
            calendarApi.removeAllEvents();
            formattedEvents.forEach(ev => calendarApi.addEvent(ev));
          },
          error: (err) => console.error('Erreur chargement events :', err)
        });
      }
    };
  }

  eventClick(info: any) {
    const clickedId = info.event.extendedProps.id;

    const currentEvents = this.eventsSubject.getValue();

    const found = currentEvents.find(e => e._id === clickedId);

    if (found) {
      this.selectedEventSubject.next(found);
    }
  }

  getEvents(year): Observable<EventData[]> {
    return this.http.get<EventData[]>(`${environment.baseUrl}/events?year=${year}`);
  }
}
