import { Injectable, signal } from '@angular/core';
import { Card } from '../cards.model';

@Injectable({
  providedIn: 'root',
})
export class AllCards {
  fracters = signal<Card[]>([]);
  decoders = signal<Card[]>([]);
  killers = signal<Card[]>([]);
  ai = signal<Card[]>([]);
  other = signal<Card[]>([]);

  barriers = signal<Card[]>([]);
  codeGates = signal<Card[]>([]);
  sentries = signal<Card[]>([]);
  otherIce = signal<Card[]>([]);
}
