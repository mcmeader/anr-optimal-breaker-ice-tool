import { Component, inject, signal } from '@angular/core';
import { BreakerType, Card, IceType, RelevantCardTypes } from '../cards.model';
import { NRApi } from '../services/nr-api';
import { AllCards } from '../utils/all-cards.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('anr-optimal-breaker-ice-tool');
  api = inject(NRApi);
  cardUtils = inject(AllCards);

  callApi() {
    this.api.getAllCards().subscribe((val) => {
      const ice = val.filter((val) => val.type_code === RelevantCardTypes.ICE);
      const breakers = val
        .filter((val) => val.type_code === RelevantCardTypes.PROGRAM)
        .filter((val) => val.keywords?.includes(RelevantCardTypes.BREAKER));

      const uniqueBreakers = this.getUniqueValues(breakers);
      const uniqueIce = this.getUniqueValues(ice);

      this.cardUtils.fracters.set(
        uniqueBreakers.filter((val) => val.keywords.includes(BreakerType.FRACTER)),
      );
      this.cardUtils.decoders.set(
        uniqueBreakers.filter((val) => val.keywords.includes(BreakerType.DECODER)),
      );
      this.cardUtils.killers.set(
        uniqueBreakers.filter((val) => val.keywords.includes(BreakerType.KILLER)),
      );
      this.cardUtils.ai.set(uniqueBreakers.filter((val) => val.keywords.includes(BreakerType.AI)));

      this.cardUtils.barriers.set(
        uniqueBreakers.filter((val) => val.keywords.includes(IceType.BARRIER)),
      );
      this.cardUtils.codeGates.set(
        uniqueBreakers.filter((val) => val.keywords.includes(IceType.BARRIER)),
      );
      this.cardUtils.sentries.set(
        uniqueBreakers.filter((val) => val.keywords.includes(IceType.BARRIER)),
      );
      this.cardUtils.otherIce.set(
        uniqueBreakers.filter(
          (val) =>
            !val.keywords.includes(IceType.BARRIER) &&
            !val.keywords.includes(IceType.CODE_GATE) &&
            !val.keywords.includes(IceType.SENTRY),
        ),
      );

      console.log(
        'Fracters: ',
        this.cardUtils.fracters().map((val) => val.stripped_title),
      );
      console.log(
        'Decoders: ',
        this.cardUtils.decoders().map((val) => val.stripped_title),
      );
      console.log(
        'Killers: ',
        this.cardUtils.killers().map((val) => val.stripped_title),
      );
      console.log(
        'AI: ',
        this.cardUtils.ai().map((val) => val.stripped_title),
      );

      console.log('all ice: ', uniqueIce);
    });
  }

  getUniqueValues(vals: Card[]) {
    return vals.filter(
      (value, index, self) =>
        self.findIndex((item) => item.stripped_title === value.stripped_title) === index,
    );
  }
}
