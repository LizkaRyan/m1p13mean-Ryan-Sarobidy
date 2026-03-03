import { Component, OnInit, Inject, PLATFORM_ID, inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {  CalendarOptions } from '@fullcalendar/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  lucidePlus,
  lucideEdit2,
} from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import frLocale from '@fullcalendar/core/locales/fr';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventData } from '../../../types/api';

@Component({
  selector: 'app-event',
  standalone: true, // si vous utilisez des composants standalone
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, NgIconComponent],
  templateUrl: './event.html',
  styleUrls: ['./event.css'],
  providers: [provideIcons({ plus: lucidePlus, edit: lucideEdit2 })],

})
export class Event implements OnInit {
  boxForm!: FormGroup;
  calendarOptions!: CalendarOptions;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  events: EventData[] = [];
  isBrowser = false;
  private http = inject(HttpClient);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.initCalendar();
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
          },
          error: (error) => failureCallback(error)
        });
      },
      eventClick: this.eventClick.bind(this),
      selectable: true,
      select: this.handleSelect.bind(this),
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

  eventClick(info) {
    const start = info.event.extendedProps.startDate.includes('T') ? info.event.extendedProps.startDate.slice(0, 16) : `${info.event.extendedProps.startDate}T00:00`;
    const end = info.event.extendedProps.endDate
      ? (info.event.extendedProps.endDate.includes('T') ? info.event.extendedProps.endDate.slice(0, 16) : `${info.event.extendedProps.endDate}T00:00`)
      : '';
    this.boxForm.patchValue({
      _id: info.event.extendedProps.id,
      title: info.event.title,
      startDate: start,
      endDate: end,
      description: info.event.extendedProps.description,
      themes: info.event.extendedProps.themes.join(', '),
      color: info.event.backgroundColor
    });
  }

  // Méthode appelée lors d'une sélection par glissement
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

  getEvents(year): Observable<EventData[]> {
    return this.http.get<EventData[]>(`${environment.baseUrl}/events?year=${year}`);
  }

  onSubmit(): void {
    if (this.boxForm.valid) {
      const themes = this.splitAndFormat(this.boxForm.value.themes);
      const eventData = {
        title: this.boxForm.value.title,
        startDate: this.boxForm.value.startDate,
        endDate: this.boxForm.value.endDate,
        description: this.boxForm.value.description,
        themes: themes,
        color: this.boxForm.value.color,
        createdAt: new Date().toISOString()
      }

      if (this.boxForm.value._id) {
        this.patchEvent(eventData).subscribe({
          next: (events) => {
            this.changeEvents(events);
          },
          error: (error) => console.error('Erreur lors de la soumission du formulaire:', error)
        });
      }
      else {
        this.postEvent(eventData).subscribe({
          next: (events) => {
            this.changeEvents(events);
          },
          error: (error) => console.error('Erreur lors de la soumission du formulaire:', error)
        });
      }
      this.cancel();
    }
  }

  changeEvents(events: EventData[]): void {
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

  postEvent(event: EventData): Observable<EventData[]> {
    return this.http.post<EventData[]>(`${environment.baseUrl}/events`, event);
  }

  patchEvent(event: any): Observable<EventData[]> {
    return this.http.patch<EventData[]>(`${environment.baseUrl}/events/${this.boxForm.value._id}`, event);
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

  delete(): void {
    this.patchEvent({deletedAt: new Date().toISOString()}).subscribe({
      next: (events) => {
        this.changeEvents(events);
      },
      error: (error) => console.error('Erreur lors de la suppression de l\'événement:', error)
    })
    this.cancel();
  }

  initForm(): void {
    this.boxForm = this.fb.group({
      _id: [null],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      themes: ['', Validators.required],
      description: ['', Validators.required],
      color: ['#000000', Validators.required]
    });
  }
}