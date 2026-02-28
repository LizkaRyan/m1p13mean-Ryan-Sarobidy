import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventData } from '../../../types/api';

@Component({
  selector: 'app-event-composant',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './event-composant.html',
  styleUrl: './event-composant.css',
})
export class EventComposant {
  @Input() event: EventData;
  @Input() viewOnCalendar: (startDate: string) => void;
  @Input() validateEvent?: (id: string) => void;
  @Input() refuseEvent?: (id: string) => void;
  @Input() isRequest: boolean = false;

  onClick() {
    if (this.viewOnCalendar) {
      this.viewOnCalendar(this.event.startDate);
    }
  }

  onValidate() {
    if (this.validateEvent) {
      this.validateEvent(this.event._id!);
    }
  }

  onRefuse() {
    if (this.refuseEvent) {
      this.refuseEvent(this.event._id!);
    }
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

  getThemes(string: string): string[] {
    return string.split(',').map(s => s.trim());
  }
}
