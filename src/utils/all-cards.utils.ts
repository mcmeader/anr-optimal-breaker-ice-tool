import { Injectable, signal } from '@angular/core';
import { ParsedBreaker, ParsedIce } from '../cards.model';

@Injectable({
  providedIn: 'root',
})
export class AllCards {
  fracters = signal<ParsedBreaker[]>([]);
  decoders = signal<ParsedBreaker[]>([]);
  killers = signal<ParsedBreaker[]>([]);
  ai = signal<ParsedBreaker[]>([]);
  other = signal<ParsedBreaker[]>([]);

  barriers = signal<ParsedIce[]>([]);
  codeGates = signal<ParsedIce[]>([]);
  sentries = signal<ParsedIce[]>([]);
  otherIce = signal<ParsedIce[]>([]);
}
