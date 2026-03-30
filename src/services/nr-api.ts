import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, take } from 'rxjs';
import {
  AllCardResponse,
  ApiCard,
  CycleData,
  CycleDataResponse,
  PackData,
  PackDataResponse,
} from '../models/api-model';

@Injectable({
  providedIn: 'root',
})
export class NRApi {
  private http: HttpClient = inject(HttpClient);

  private baseUrl = 'https://netrunnerdb.com/';

  getAllCards(): Observable<ApiCard[]> {
    return this.http.get<AllCardResponse>(this.baseUrl.concat('api/2.0/public/cards')).pipe(
      take(1),
      map((val: AllCardResponse) => val.data),
    );
  }

  // getBanListCards(): Observable<BannedList> {
  //   return this.http.get<BannedList>(this.baseUrl.concat('api/2.0/public/mwl')).pipe(take(1));
  // }

  getCycleData(): Observable<CycleData[]> {
    return this.http.get<CycleDataResponse>(this.baseUrl.concat('api/2.0/public/cycles')).pipe(
      take(1),
      map((val: CycleDataResponse) => val.data),
    );
  }

  getPackData(): Observable<PackData[]> {
    return this.http.get<PackDataResponse>(this.baseUrl.concat('api/2.0/public/packs')).pipe(
      take(1),
      map((val: PackDataResponse) => val.data),
    );
  }

  //Stitch together standard pack list for now since not available in v2.0 apis
  getStandardPackList(): Observable<string[]> {
    return of(['df', 'ur', 'urbp', 'sg', 'msbp', 'ms', 'ph', 'tai', 'rwr', 'elev', 'vp']);
    // return forkJoin([this.getCycleData(), this.getPackData()]).pipe(
    //   map((val) => {
    //     const standardPacks = val[0]
    //       .filter((val) => !val.rotated && val.code !== 'draft')
    //       .map((val) => val.code);
    //     return val[1]
    //       .filter((val) => {
    //         return standardPacks.includes(val.cycle_code);
    //       })
    //       .map((val) => val.code);
    //   }),
    // );
  }

  //Manual for now in v2.0 apis
  getStartupPackList() {
    return ['vp', 'elev', 'sg'];
  }
}
