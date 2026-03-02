import { Component, Inject, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { EventAndRequest, RequestEvent } from '../../../types/api';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BehaviorSubject, map, Observable, combineLatest } from 'rxjs';
import { environment } from '../../environments/environment';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMailbox,
  lucideSearch,
  lucideCheck,
  lucideX
} from '@ng-icons/lucide';
import { EventComposant } from '../../composant/event-composant/event-composant';

@Component({
  selector: 'app-request-event',
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, NgIconComponent],
  templateUrl: './request-event.html',
  styleUrl: './request-event.css',
  providers: [provideIcons({ mailbox: lucideMailbox, search: lucideSearch, check: lucideCheck, x: lucideX })],
})
export class RequestEventPage implements OnInit {
  boxForm!: FormGroup;
  calendarOptions!: CalendarOptions;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  events: RequestEvent[] = [];
  isBrowser = false;
  private http = inject(HttpClient);
  searchTerm: string = '';
  searchTerm$ = new BehaviorSubject<string>('');
  reservationsSubject = new BehaviorSubject<RequestEvent[]>([]);
  reservations$ = this.reservationsSubject.asObservable();

  currentYear!: number; // pour stocker l'année déjà chargée
  calendarEvents: any[] = []; // événements déjà récupérés

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.initCalendar();
    }

    this.initForm();

    this.reservations$ = combineLatest([
      this.reservationsSubject,
      this.searchTerm$
    ]).pipe(
      map(([reservations, term]) =>
        reservations.filter(r =>
          r.title.toLowerCase().includes(term.toLowerCase())
        )
      )
    );

    // chargement initial
    this.getRequests("REQUEST").subscribe({
      next: (requests) => this.reservationsSubject.next(requests),
      error: (err) => console.error(err)
    });
  }

  viewOnCalendar(startDate: string): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(startDate);
  }

  getTimeBetween(date1: string | Date, date2: string | Date): string {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();

    const diffMs = Math.abs(d2 - d1); // différence en millisecondes

    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays >= 1) {
      return `${Math.ceil(diffDays)} jour${Math.ceil(diffDays) > 1 ? 's' : ''}`;
    } else {
      const diffHours = diffMs / (1000 * 60 * 60);
      return `${Math.ceil(diffHours)} heure${Math.ceil(diffHours) > 1 ? 's' : ''}`;
    }
  }

  turnIntoCalendarEvents(event: any, color: string): any {
    let name = ""
    if (event.shopId) {
      name = " - " + event.shopId.name;
    }
    return {
      title: event.title + name,
      start: event.startDate,
      end: event.endDate,
      allDay: false,
      backgroundColor: color,
      extendedProps: {
        description: event.description,
        themes: event.themes,
        startDate: event.startDate,
        endDate: event.endDate,
        title: event.title,
        id: event._id
      }
    }
  }

  handleSelect(info: any): void {
    // Ajouter l'heure par défaut si elle n'existe pas
    const start = info.startStr.includes('T') ? info.startStr.slice(0, 16) : `${info.startStr}T00:00`;
    const end = info.endStr
      ? (info.endStr.includes('T') ? info.endStr.slice(0, 16) : `${info.endStr}T00:00`)
      : '';

    this.boxForm.patchValue({
      startDate: start,
      endDate: end
    });
  }

  onSearchChange(value: string) {
    this.searchTerm$.next(value);
  }

  onSubmit(): void {
    if (this.boxForm.valid) {
      const themes = this.boxForm.value.themes.split(',').map((t: string) => t.trim());
      const eventData = {
        title: this.boxForm.value.title,
        startDate: this.boxForm.value.startDate,
        endDate: this.boxForm.value.endDate,
        description: this.boxForm.value.description,
        themes: themes,
        color: this.boxForm.value.color,
        createdAt: new Date().toISOString()
      }
      this.postRequestEvent(eventData).subscribe({
        next: (events) => {
          this.changeEvents(events);
          this.reservationsSubject.next(events.requests);
        },
        error: (err) => console.error('Erreur lors de la création de l\'événement:', err)
      });
    }
  }

  cancel(): void {
    this.boxForm.reset({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      themes: '',
      color: '#000000',
      _id: null
    });
  }

  initCalendar(): void {
    this.calendarOptions = {
      height: 500,
      timeZone: 'UTC',
      displayEventTime: false,
      locale: frLocale,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      contentHeight: 400,
      aspectRatio: 1.5,
      events: [],
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'dayGridMonth',
      eventClick: this.eventClick.bind(this),
      selectable: true,
      select: this.handleSelect.bind(this),
      datesSet: (info) => {
        const newYear = info.start.getFullYear();

        if (this.currentYear !== newYear) {
          this.currentYear = newYear;

          // fetch seulement si année différente
          this.getRequestsAndEvent('REQUEST', newYear).subscribe({
            next: (events) => {
              const lo = events.events.map(e => this.turnIntoCalendarEvents(e, '#22C55E'));
              lo.push(...events.requests.map(e => this.turnIntoCalendarEvents(e, '#F59E0B')));

              this.calendarEvents = lo;

              const calendarApi = info.view.calendar;
              calendarApi.removeAllEvents();
              lo.forEach(ev => calendarApi.addEvent(ev));
            },
            error: (err) => console.error('Erreur chargement events :', err)
          });
        } else {
          // si c'est le même mois / année, juste afficher ce qu'on a déjà
          const calendarApi = info.view.calendar;
          calendarApi.removeAllEvents();
          this.calendarEvents.forEach(ev => calendarApi.addEvent(ev));
        }
      }
    };
  }

  eventClick(info) {
    this.searchTerm$.next(info.event.extendedProps.title);
    this.searchTerm = info.event.extendedProps.title;
  }

  getRequestsAndEvent(status, year): Observable<EventAndRequest> {
    return this.http.get<EventAndRequest>(`${environment.baseUrl}/requests-event/with-event?status=${status}&year=${year}`);
  }

  getRequests(status: string): Observable<RequestEvent[]> {
    return this.http.get<RequestEvent[]>(`${environment.baseUrl}/requests-event?status=${status}`);
  }

  changeEvents(events: EventAndRequest): void {
    const calendarApi = this.calendarComponent.getApi();

    calendarApi.removeAllEvents();

    events.events.forEach((event: any) => {
      calendarApi.addEvent(this.turnIntoCalendarEvents(event, '#22C55E'));
    });

    events.requests.forEach((event: any) => {
      calendarApi.addEvent(this.turnIntoCalendarEvents(event, '#F59E0B'));
    });
  }

  postRequestEvent(data: any): Observable<EventAndRequest> {
    return this.http.post<EventAndRequest>(`${environment.baseUrl}/requests-event`, data);
  }

  initForm(): void {
    this.boxForm = this.fb.group({
      _id: [null],
      title: ['Halloween Party', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      themes: ['Friandises, Costumes', Validators.required],
      description: ['Faites peur!', Validators.required],
      color: ['#fa652f', Validators.required]
    });
  }
}