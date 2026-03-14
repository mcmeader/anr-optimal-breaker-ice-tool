import { Component, inject, signal } from '@angular/core';
import {
  ApiCard,
  BreakerType,
  CorpFaction,
  IceType,
  ParsedBreaker,
  ParsedIce,
  RelevantCardTypes,
  RunnerFaction,
} from '../cards.model';
import { NRApi } from '../services/nr-api';
import { AllCards } from '../utils/all-cards.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
imports: [MatTableModule],
})
export class App {
  protected readonly title = signal('anr-optimal-breaker-ice-tool');
  api = inject(NRApi);
  cardUtils = inject(AllCards);
  datasource:

  callApi() {
    this.api.getAllCards().subscribe((val) => {
      const ice = val.filter((val) => val.type_code === RelevantCardTypes.ICE);
      const breakers = val
        .filter((val) => val.type_code === RelevantCardTypes.PROGRAM)
        .filter((val) => val.keywords?.includes(RelevantCardTypes.BREAKER));

      const uniqueBreakers = this.getUniqueValues(breakers);
      const uniqueIce = this.getUniqueValues(ice);

      this.cardUtils.fracters.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(BreakerType.FRACTER))
          .map((val) => this.extractBreakerData(val)),
      );
      this.cardUtils.decoders.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(BreakerType.DECODER))
          .map((val) => this.extractBreakerData(val)),
      );
      this.cardUtils.killers.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(BreakerType.KILLER))
          .map((val) => this.extractBreakerData(val)),
      );
      this.cardUtils.ai.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(BreakerType.AI))
          .map((val) => this.extractBreakerData(val)),
      );
      this.cardUtils.barriers.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(IceType.BARRIER))
          .map((val) => this.extractIceData(val)),
      );
      this.cardUtils.codeGates.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(IceType.BARRIER))
          .map((val) => this.extractIceData(val)),
      );
      this.cardUtils.sentries.set(
        uniqueBreakers
          .filter((val) => val.keywords.includes(IceType.BARRIER))
          .map((val) => this.extractIceData(val)),
      );
      this.cardUtils.otherIce.set(
        uniqueBreakers
          .filter(
            (val) =>
              !val.keywords.includes(IceType.BARRIER) &&
              !val.keywords.includes(IceType.CODE_GATE) &&
              !val.keywords.includes(IceType.SENTRY),
          )
          .map((val) => this.extractIceData(val)),
      );

      t
    });
  }

  getUniqueValues(vals: ApiCard[]) {
    return vals.filter(
      (value, index, self) =>
        self.findIndex((item) => item.stripped_title === value.stripped_title) === index,
    );
  }

  private extractIceData(card: ApiCard): ParsedIce {
    return {
      name: '',
      faction: CorpFaction.HB,
      influence: 0,
      legality: [],
      cost: 0,
      encounterEffect: '',
      subroutines: [],
      strength: 0,
      iceType: [],
    };
  }

  private extractBreakerData(card: ApiCard): ParsedBreaker {
    return {
      name: '',
      faction: RunnerFaction.ANARCH,
      influence: 0,
      memory: 0,
      legality: [],
      cost: 0,
      interfaceCost: 0,
      boostCost: 0,
      baseStrength: 0,
      breakerType: [],
    };
  }
}
