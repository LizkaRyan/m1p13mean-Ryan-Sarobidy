import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop: boolean = true;
  @Input() showFooter: boolean = false;
  @Input() confirmLabel: string = 'Confirmer';
  @Input() cancelLabel: string = 'Annuler';
  @Input() confirmDisabled: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  isVisible: boolean = false;
  isAnimatingOut: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen) {
      this.isVisible = true;
      this.isAnimatingOut = false;
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    } else {
      this.triggerClose();
    }
  }

  triggerClose(): void {
    this.isAnimatingOut = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    setTimeout(() => {
      this.isVisible = false;
      this.isAnimatingOut = false;
    }, 250);
  }

  close(): void {
    this.onClose.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  confirm(): void {
    this.onConfirm.emit();
  }

  getSizeClass(): string {
    const sizes: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[95vw]'
    };
    return sizes[this.size];
  }
}