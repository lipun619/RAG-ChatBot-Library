import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';

/** Chat window slide-up + fade-in / slide-down + fade-out */
export const chatWindowAnimation = trigger('chatWindowAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
    animate(
      '250ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0) scale(1)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' })
    ),
  ]),
]);

/** Individual chat message fade-in + slide-up */
export const messageAnimation = trigger('messageAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate(
      '200ms 50ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
]);

/** Chat bubble scale entrance */
export const bubbleAnimation = trigger('bubbleAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0)' }),
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
]);
