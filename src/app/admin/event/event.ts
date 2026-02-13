import { Component, OnInit, Inject, PLATFORM_ID, inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  lucidePlus,
  lucideEdit2,
} from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import frLocale from '@fullcalendar/core/locales/fr';
import timeGridPlugin from '@fullcalendar/timegrid';
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
            }));
            successCallback(lo)
          },
          error: (error) => failureCallback(error)
        });
      },
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
      console.log('Formulaire soumis', this.boxForm.value);
      // Ici, vous pouvez envoyer les données à votre API
    }
  }

  initForm(): void {
    this.boxForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      themes: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
}