import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { AllCardResponse, Card } from '../cards.model';

@Injectable({
  providedIn: 'root',
})
export class NRApi {
  private http: HttpClient = inject(HttpClient);

  private baseUrl = 'https://netrunnerdb.com/';

  getAllCards(): Observable<Card[]> {
    return this.http.get<AllCardResponse>(this.baseUrl.concat('api/2.0/public/cards')).pipe(
      take(1),
      map((val: AllCardResponse) => val.data),
    );
  }
}
