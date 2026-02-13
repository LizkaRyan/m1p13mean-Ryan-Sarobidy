import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  lucidePlus,
  lucideEdit2,
} from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-event',
  standalone: true, // si vous utilisez des composants standalone
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, NgIconComponent],
  templateUrl: './event.html',
  styleUrls: ['./event.css'],
  providers: [provideIcons({ plus: lucidePlus, edit: lucideEdit2 })]
})
export class Event implements OnInit {
  boxForm!: FormGroup;
  calendarOptions!: CalendarOptions;

  isBrowser = false;

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
      contentHeight: 400,
      aspectRatio: 1.5,
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: [
        { title: 'Test Event', start: '2026-02-10T10:00:00', end: '2026-02-12' },
        { title: 'Meeting', date: '2026-02-18' }
      ],
      selectable: true,
      // Utilisation de dateClick pour ouvrir le formulaire au clic simple
      //dateClick: this.handleDateClick.bind(this),
      // Si vous préférez la sélection par glissement, gardez select ci-dessous
      select: this.handleSelect.bind(this)
    };
  }

  // Méthode appelée lors d'une sélection par glissement
  handleSelect(info: any): void {
    this.boxForm.patchValue({
      startDate: info.startStr.split('T')[0], // on ne garde que la partie date
      endDate: info.endStr ? info.endStr.split('T')[0] : null
    });
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