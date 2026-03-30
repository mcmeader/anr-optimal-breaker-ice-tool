import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiCard, IceInteraction } from '../models/api-model';
import { BoostCost, BreakCost, ParsedBreaker } from '../models/breaker-model';
import {
  BreakerType,
  CorpFaction,
  IceType,
  RelevantCardTypes,
  RunnerFaction,
} from '../models/enums';
import { IceSubroutine, ParsedIce, Trace } from '../models/ice-model';
import { NRApi } from '../services/nr-api';
import { AllCards } from '../utils/all-cards/all-cards.utils';
import { BreakerInterfaceUtil } from '../utils/breaker/breaker-interface-util';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MatTableModule, MatSortModule, JsonPipe],
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('anr-optimal-breaker-ice-tool');
  api = inject(NRApi);
  cardUtils = inject(AllCards);
  breakerInterfaceUtils = inject(BreakerInterfaceUtil);
  datasource = new MatTableDataSource();
  datasource2 = new MatTableDataSource();
  datasource3 = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;
  @ViewChild(MatSort) sort3!: MatSort;
  displayedColumns: string[] = [
    'name',
    'faction',
    'cost',
    'interfaceCost',
    'boostCost',
    'legality',
    'baseStrength',
    'breakerType',
    'set',
  ];
  displayedColumns2: string[] = ['name', 'encounter', 'subroutines', 'text'];
  displayedColumns3: string[] = ['iceName', 'breakerName', 'fullBreakCost'];

  ngOnInit(): void {
    // this.api.getAllCards().subscribe((val) => {
    const standardVal = [
      {
        code: '26035',
        cost: 4,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 3,
        flavor: 'Old warriors have seen all the tricks; be forthright or fail.',
        illustrator: 'Krembler',
        keywords: 'Barrier - Destroyer',
        pack_code: 'df',
        position: 35,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'This ice gets -1 strength for each installed icebreaker. Subroutine Trash 1 installed program that is not a decoder, fracter, or killer. Subroutine End the run.',
        stripped_title: 'Hagen',
        text: 'This ice gets −1 strength for each installed <strong>icebreaker</strong>.\n[subroutine] Trash 1 installed program that is not a <strong>decoder</strong>, <strong>fracter</strong>, or <strong>killer</strong>.\n[subroutine] End the run.',
        title: 'Hagen',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26044',
        cost: 5,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        illustrator: 'Krembler',
        keywords: 'Sentry - AP - Observer',
        pack_code: 'df',
        position: 44,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When the Runner encounters this ice, choose a card type. For the remainder of the encounter, whenever you trash a card of the chosen type with net damage from a subroutine on this ice, do 1 net damage. Subroutine Do 1 net damage. Subroutine Do 1 net damage. Subroutine Do 1 net damage.',
        stripped_title: 'Saisentan',
        text: 'When the Runner encounters this ice, choose a card type. For the remainder of the encounter, whenever you trash a card of the chosen type with net damage from a subroutine on this ice, do 1 net damage.\n[subroutine] Do 1 net damage.\n[subroutine] Do 1 net damage.\n[subroutine] Do 1 net damage.',
        title: 'Saisentan',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26050',
        cost: 1,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: 'You are the ONE BILLIONTH visitor!',
        illustrator: 'NtscapeNavigator',
        keywords: 'Code Gate - Advertisement',
        pack_code: 'df',
        position: 50,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When the Runner passes this ice, gain 1 credit. Subroutine Gain 2 credits. The Runner gains 1 credit.',
        stripped_title: 'Congratulations!',
        text: 'When the Runner passes this ice, gain 1[credit].\n[subroutine] Gain 2[credit]. The Runner gains 1[credit].',
        title: 'Congratulations!',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26051',
        cost: 0,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 1,
        flavor:
          'Though many countries attempted to regulate digital loot boxes in the early 21st century, GameNET has managed to circumvent any such laws via explicit, transparent percentage rates… and some very determined lobbyists.',
        illustrator: 'Krembler',
        keywords: 'Trap',
        pack_code: 'df',
        position: 51,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          "Subroutine End the run unless the Runner pays 2 credits. Subroutine Reveal the top 3 cards of the stack. Add 1 of those cards to the grip and gain X credits, where X is equal to that card's play or install cost. The Runner shuffles the stack. Trash this ice.",
        stripped_title: 'Loot Box',
        text: '[subroutine] End the run unless the Runner pays 2[credit].\n[subroutine] Reveal the top 3 cards of the stack. Add 1 of those cards to the grip and gain X[credit], where X is equal to that cardʼs play or install cost. The Runner shuffles the stack. Trash this ice.',
        title: 'Loot Box',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26058',
        cost: 3,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'A choice occurs. The waveform collapses.',
        illustrator: 'Krembler',
        keywords: 'Code Gate',
        pack_code: 'df',
        position: 58,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'While this ice is protecting HQ, the Runner cannot break more than 1 of its printed subroutines during each encounter. Subroutine The Runner loses 2 credits. Subroutine End the run.',
        stripped_title: 'Afshar',
        text: 'While this ice is protecting HQ, the Runner cannot break more than 1 of its printed subroutines during each encounter.\n[subroutine] The Runner loses 2[credit].\n[subroutine] End the run.',
        title: 'Afshar',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26059',
        cost: 3,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'Effective, Cheap, Durable. Pick two.',
        illustrator: 'Krembler',
        keywords: 'Barrier',
        pack_code: 'df',
        position: 59,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'When the Runner encounters this ice, place 1 virus counter on it. This ice gets -1 strength for each hosted virus counter. Subroutine End the run.',
        stripped_title: 'Sandstone',
        text: 'When the Runner encounters this ice, place 1 virus counter on it.\nThis ice gets −1 strength for each hosted virus counter.\n[subroutine] End the run.',
        title: 'Sandstone',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26060',
        cost: 7,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        illustrator: 'Iain Fairclough',
        keywords: 'Sentry - Destroyer - Tracer - Liability',
        pack_code: 'df',
        position: 60,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'When you rez this ice, take 1 bad publicity. Subroutine Trash 1 installed Runner card. Subroutine Trace[6]. If successful, the Runner cannot steal or trash Corp cards for the remainder of this run.',
        stripped_title: 'Trebuchet',
        text: 'When you rez this ice, take 1 bad publicity.\n[subroutine] Trash 1 installed Runner card.\n[subroutine] Trace[6]. If successful, the Runner cannot steal or trash Corp cards for the remainder of this run.',
        title: 'Trebuchet',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26065',
        cost: 0,
        deck_limit: 3,
        faction_code: 'neutral-corp',
        faction_cost: 0,
        illustrator: 'N. Hopkins',
        keywords: 'Mythic',
        pack_code: 'df',
        position: 65,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'During runs against this server, you can rez this ice any time you could rez non-ice cards. Each piece of ice protecting this server gets +1 strength. Subroutine The Runner loses 1 credit.',
        stripped_title: 'Rime',
        text: 'During runs against this server, you can rez this ice any time you could rez non-ice cards.\nEach piece of ice protecting this server gets +1 strength.\n[subroutine] The Runner loses 1[credit].',
        title: 'Rime',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26101',
        cost: 3,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          'Each generation of design assistants makes a sysop’s job easier. They need only speak and it will be so.',
        illustrator: 'Krembler',
        keywords: 'Sentry',
        pack_code: 'ur',
        position: 101,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Subroutine You may add 1 card from Archives to HQ. Subroutine You may install 1 card from Archives or HQ, ignoring all costs.',
        stripped_title: 'Drafter',
        text: '[subroutine] You may add 1 card from Archives to HQ.\n[subroutine] You may install 1 card from Archives or HQ, ignoring all costs.',
        title: 'Drafter',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26102',
        cost: 10,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 5,
        flavor: 'The valiant do not hesitate.',
        illustrator: 'Liiga Smilshkalne',
        keywords: 'Sentry - Bioroid - AP - Destroyer',
        pack_code: 'ur',
        position: 102,
        quantity: 3,
        side_code: 'corp',
        strength: 7,
        stripped_text:
          'Lose click: Break 1 subroutine on this ice. The Corp gets +1 allotted click for their next turn. Only the Runner can use this ability. Subroutine Do 2 core damage. Subroutine Trash 1 installed Runner card. Gain 3 credits. Subroutine End the run.',
        stripped_title: 'Tyr',
        text: '<strong>Lose [click]:</strong> Break 1 subroutine on this ice. The Corp gets +1 allotted [click] for their next turn. Only the Runner can use this ability.\n[subroutine] Do 2 core damage.\n[subroutine] Trash 1 installed Runner card. Gain 3[credit].\n[subroutine] End the run.',
        title: 'Týr',
        type_code: 'ice',
        uniqueness: true,
      },
      {
        code: '26108',
        cost: 2,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 1,
        flavor: '$BMI.001 > Out of Memory Error',
        illustrator: 'Janet Bruesselbach',
        keywords: 'Code Gate - Observer',
        pack_code: 'ur',
        position: 108,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'When the Runner encounters this ice, choose a card type. For the remainder of the encounter, whenever you reveal the grip with a subroutine on this ice, you may trash 1 revealed card of the chosen type. Subroutine Reveal the grip. Subroutine Reveal the grip.',
        stripped_title: 'Engram Flush',
        text: 'When the Runner encounters this ice, choose a card type. For the remainder of the encounter, whenever you reveal the grip with a subroutine on this ice, you may trash 1 revealed card of the chosen type.\n[subroutine] Reveal the grip.\n[subroutine] Reveal the grip.',
        title: 'Engram Flush',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26109',
        cost: 3,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor: '“The Konjin dons the mask of our fears, but what lies underneath?”',
        illustrator: 'Krembler',
        keywords: 'Mythic - Psi',
        pack_code: 'ur',
        position: 109,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When the Runner encounters this ice, play a Psi Game. (Players secretly bid 0-2 credits. Then each player reveals and spends their bid.) If the bids differ, you may choose another rezzed piece of ice. The Runner encounters that ice. (When that encounter ends, if the run has not ended, finish encountering this ice.)',
        stripped_title: 'Konjin',
        text: 'When the Runner encounters this ice, play a Psi Game. <em>(Players secretly bid 0–2[credit]. Then each player reveals and spends their bid.)</em> If the bids differ, you may choose another rezzed piece of ice. The Runner encounters that ice. <em>(When that encounter ends, if the run has not ended, finish encountering this ice.)</em>',
        title: 'Konjin',
        type_code: 'ice',
        uniqueness: true,
      },
      {
        code: '26115',
        cost: 4,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: 'Free to Pay',
        illustrator: 'Krembler',
        keywords: 'Sentry',
        pack_code: 'ur',
        position: 115,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          '2 credits: Break 1 subroutine on this ice. Only the Runner can use this ability, and only if they are not tagged. Subroutine Add 1 installed Runner card to the grip. Subroutine Give the Runner 1 tag.',
        stripped_title: 'F2P',
        text: '<strong>2[credit]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability, and only if they are not tagged.\n[subroutine] Add 1 installed Runner card to the grip.\n[subroutine] Give the Runner 1 tag.',
        title: 'F2P',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26116',
        cost: 3,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 3,
        flavor: '[Pay 15 gems to access this content]',
        illustrator: 'N. Hopkins',
        keywords: 'Barrier',
        pack_code: 'ur',
        position: 116,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'Whenever the Runner breaks a printed subroutine on this ice, they lose 1 credit. Subroutine End the run unless the Runner pays 3 credits. Subroutine End the run unless the Runner pays 3 credits.',
        stripped_title: 'Gold Farmer',
        text: 'Whenever the Runner breaks a printed subroutine on this ice, they lose 1[credit].\n[subroutine] End the run unless the Runner pays 3[credit].\n[subroutine] End the run unless the Runner pays 3[credit].',
        title: 'Gold Farmer',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26123',
        cost: 3,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'Thou slept not in thy house on earth.\nThou openest thy place in heaven.',
        illustrator: 'Owen Sinodov',
        keywords: 'Barrier',
        pack_code: 'ur',
        position: 123,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'You can advance this ice. While there are 3 or more hosted advancement counters, this ice gets +3 strength and the Runner cannot break more than 1 of its printed subroutines during each encounter. Subroutine Gain 1 credit. Place 1 advancement counter on an installed card. Subroutine End the run.',
        stripped_title: 'Akhet',
        text: 'You can advance this ice.\nWhile there are 3 or more hosted advancement counters, this ice gets +3 strength and the Runner cannot break more than 1 of its printed subroutines during each encounter.\n[subroutine] Gain 1[credit]. Place 1 advancement counter on an installed card.\n[subroutine] End the run.',
        title: 'Akhet',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26124',
        cost: 6,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        illustrator: 'Krembler',
        keywords: 'Sentry - Destroyer',
        pack_code: 'ur',
        position: 124,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'You can advance this ice. It gets +1 strength for each hosted advancement counter. Subroutine Give the Runner 1 tag. If there are 3 or more hosted advancement counters, instead give the Runner 2 tags. Subroutine Trash 1 installed program. If there are 3 or more hosted advancement counters, instead trash 1 installed program and 1 installed resource.',
        stripped_title: 'Colossus',
        text: 'You can advance this ice. It gets +1 strength for each hosted advancement counter.\n[subroutine] Give the Runner 1 tag. If there are 3 or more hosted advancement counters, instead give the Runner 2 tags.\n[subroutine] Trash 1 installed program. If there are 3 or more hosted advancement counters, instead trash 1 installed program and 1 installed resource.',
        title: 'Colossus',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26125',
        cost: 4,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 4,
        flavor:
          '“I donʼt know how Skorpios gets these designs past Brand Management.”\n—Liz Campbell, VP Project Security',
        illustrator: 'NtscapeNavigator',
        keywords: 'Sentry - Destroyer - Tracer',
        pack_code: 'ur',
        position: 125,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'Subroutine Trace[4]. If successful, trash 1 installed program. Subroutine Trace[3]. If successful, trash 1 installed piece of hardware. While this ice is protecting HQ, it gains "Subroutine Trace[3]. If successful, end the run." after its other subroutines.',
        stripped_title: 'Winchester',
        text: '[subroutine] Trace[4]. If successful, trash 1 installed program.\n[subroutine] Trace[3]. If successful, trash 1 installed piece of hardware.\nWhile this ice is protecting HQ, it gains “[subroutine] Trace[3]. If successful, end the run.” after its other subroutines.',
        title: 'Winchester',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30038',
        cost: 6,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 3,
        flavor: '<strong>Designed by 2018 European Champion Patrick Gower</strong>',
        illustrator: 'Galen Dara',
        keywords: 'Sentry - Bioroid - Destroyer',
        pack_code: 'sg',
        position: 38,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'Lose click: Break 1 subroutine on this ice. Only the Runner can use this ability. Subroutine Trash 1 installed Runner card. Subroutine You may install 1 card from HQ or Archives. Subroutine The Runner cannot steal or trash Corp cards for the remainder of this run.',
        stripped_title: 'Ansel 1.0',
        text: '<strong>Lose [click]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability.\n[subroutine] Trash 1 installed Runner card.\n[subroutine] You may install 1 card from HQ or Archives.\n[subroutine] The Runner cannot steal or trash Corp cards for the remainder of this run.',
        title: 'Ansel 1.0',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30039',
        cost: 6,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor: 'A giant wakes…',
        illustrator: 'Galen Dara',
        keywords: 'Barrier - Bioroid',
        pack_code: 'sg',
        position: 39,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'Lose click: Break 1 subroutine on this ice. Only the Runner can use this ability. Subroutine You may install 1 piece of ice from HQ or Archives directly inward from this ice, ignoring all costs. Subroutine End the run. Subroutine End the run.',
        stripped_title: 'Bran 1.0',
        text: '<strong>Lose [click]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability.\n[subroutine] You may install 1 piece of ice from HQ or Archives directly inward from this ice, ignoring all costs.\n[subroutine] End the run.\n[subroutine] End the run.',
        title: 'Brân 1.0',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30046',
        cost: 2,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'It reads your future in a single biometric sweep.',
        illustrator: 'BalanceSheet',
        keywords: 'Code Gate - AP',
        pack_code: 'sg',
        position: 46,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Subroutine Do 1 net damage. If you trash a card this way with a printed play or install cost that is an odd number, end the run. (0 is not odd.)',
        stripped_title: 'Diviner',
        text: '[subroutine] Do 1 net damage. If you trash a card this way with a printed play or install cost that is an odd number, end the run. <em>(0 is not odd.)</em>',
        title: 'Diviner',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30047',
        cost: 4,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'You did not escape, you were shown mercy.',
        illustrator: 'BalanceSheet',
        keywords: 'Sentry - AP',
        pack_code: 'sg',
        position: 47,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Subroutine Do 2 net damage. The Runner may jack out. Subroutine Do 2 net damage.',
        stripped_title: 'Karuna',
        text: '[subroutine] Do 2 net damage. The Runner may jack out.\n[subroutine] Do 2 net damage.',
        title: 'Karunā',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30054',
        cost: 5,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: '“I might take a break from VR after this one.”\n–SeaOfRibaldry, sensie streamer',
        illustrator: 'Bruno Balixa',
        keywords: 'Code Gate',
        pack_code: 'sg',
        position: 54,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'When the Runner encounters this ice, end the run unless the Runner takes 1 tag. Subroutine Give the Runner 1 tag unless they pay 4 credits.',
        stripped_title: 'Funhouse',
        text: 'When the Runner encounters this ice, end the run unless the Runner takes 1 tag.\n[subroutine] Give the Runner 1 tag unless they pay 4[credit].',
        title: 'Funhouse',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30055',
        cost: 2,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor:
          'AvID:?:73.174 time=0.632 ms\nAvID:?:73.174 time=0.201 ms\nAvID:?:73.174 time=0.000 ms <strong>ALERT</strong>',
        illustrator: 'Bruno Balixa',
        keywords: 'Barrier',
        pack_code: 'sg',
        position: 55,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'When you rez this ice during a run against this server, give the Runner 1 tag. Subroutine End the run.',
        stripped_title: 'Ping',
        text: 'When you rez this ice during a run against this server, give the Runner 1 tag.\n[subroutine] End the run.',
        title: 'Ping',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30062',
        cost: 5,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: '“Puts a hole in your rig <strong>and</strong> your plans.”\n–René “Loup” Arcemont',
        illustrator: 'Owen Sinodov',
        keywords: 'Sentry - Destroyer',
        pack_code: 'sg',
        position: 62,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text: 'Subroutine Trash 1 installed program or end the run.',
        stripped_title: 'Ballista',
        text: '[subroutine] Trash 1 installed program or end the run.',
        title: 'Ballista',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30063',
        cost: 7,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        illustrator: 'Owen Sinodov',
        keywords: 'Barrier',
        pack_code: 'sg',
        position: 63,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'You can advance this ice. It gets +5 strength while there are 3 or more hosted advancement counters. Subroutine Give the Runner 1 tag. Subroutine End the run. Subroutine End the run.',
        stripped_title: 'Pharos',
        text: 'You can advance this ice. It gets +5 strength while there are 3 or more hosted advancement counters.\n[subroutine] Give the Runner 1 tag.\n[subroutine] End the run.\n[subroutine] End the run.',
        title: 'Pharos',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30072',
        cost: 3,
        deck_limit: 3,
        faction_code: 'neutral-corp',
        faction_cost: 0,
        flavor: 'Keep the neighbors honest.',
        illustrator: 'Scott Uminga',
        keywords: 'Barrier',
        pack_code: 'sg',
        position: 72,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'While this ice is protecting a remote server, it gets +2 strength. Subroutine End the run.',
        stripped_title: 'Palisade',
        text: 'While this ice is protecting a remote server, it gets +2 strength.\n[subroutine] End the run.',
        title: 'Palisade',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30073',
        cost: 1,
        deck_limit: 3,
        faction_code: 'neutral-corp',
        faction_cost: 0,
        flavor: '“Youʼll give till it hurts… then itʼll reach for more.”\n–Red Comyn',
        illustrator: 'Scott Uminga',
        keywords: 'Sentry - AP',
        pack_code: 'sg',
        position: 73,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text: 'Subroutine Do 1 net damage. Subroutine Gain 1 credit.',
        stripped_title: 'Tithe',
        text: '[subroutine] Do 1 net damage.\n[subroutine] Gain 1[credit].',
        title: 'Tithe',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '30074',
        cost: 2,
        deck_limit: 3,
        faction_code: 'neutral-corp',
        faction_cost: 0,
        flavor: '[this space intentionally left blank]',
        illustrator: 'Scott Uminga',
        keywords: 'Code Gate',
        pack_code: 'sg',
        position: 74,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'Subroutine The Runner loses 3 credits. Subroutine If the Runner has 6 credits or less, end the run.',
        stripped_title: 'Whitespace',
        text: '[subroutine] The Runner loses 3[credit].\n[subroutine] If the Runner has 6[credit] or less, end the run.',
        title: 'Whitespace',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '32004',
        cost: 5,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 3,
        illustrator: 'Jakuza',
        keywords: 'Barrier - Bioroid - AP',
        pack_code: 'msbp',
        position: 4,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'When you rez this ice during a run against this server, you may derez another installed card. If you do, the Runner cannot use paid abilities printed on bioroid ice for the remainder of this turn. Lose click: Break 1 subroutine on this ice. Only the Runner can use this ability. Subroutine Do 1 core damage. Subroutine End the run.',
        stripped_title: 'Hakarl 1.0',
        text: 'When you rez this ice during a run against this server, you may derez another installed card. If you do, the Runner cannot use paid abilities printed on <strong>bioroid</strong> ice for the remainder of this turn.\n<strong>Lose [click]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability.\n[subroutine] Do 1 core damage.\n[subroutine] End the run.',
        title: 'Hákarl 1.0',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '32005',
        cost: 3,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'Ethereal beauty brings sweet death with only a brief touch.',
        illustrator: 'Jack Reeves',
        keywords: 'Sentry - AP',
        pack_code: 'msbp',
        position: 5,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When you rez this ice during a run against this server, you may trash 1 card from HQ to do 2 net damage. Subroutine Do 1 net damage.',
        stripped_title: 'Anemone',
        text: 'When you rez this ice during a run against this server, you may trash 1 card from HQ to do 2 net damage.\n[subroutine] Do 1 net damage.',
        title: 'Anemone',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33035',
        cost: 2,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor: 'End the run. End the run. End the run. End the run.',
        illustrator: 'Jakuza',
        keywords: 'Barrier - Harmonic',
        pack_code: 'ms',
        position: 35,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'Whenever you rez a piece of harmonic ice, place 1 power counter on this ice. This ice gains "Subroutine End the run." for each hosted power counter.',
        stripped_title: 'Echo',
        text: 'Whenever you rez a piece of <strong>harmonic</strong> ice, place 1 power counter on this ice.\nThis ice gains "[subroutine] End the run." for each hosted power counter.',
        title: 'Echo',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33036',
        cost: 5,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 3,
        illustrator: 'Jakuza',
        keywords: 'Barrier - Bioroid - AP',
        pack_code: 'ms',
        position: 36,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'When you rez this ice during a run against this server, you may derez another installed card. If you do, the Runner cannot use paid abilities printed on bioroid ice for the remainder of this turn. Lose click: Break 1 subroutine on this ice. Only the Runner can use this ability. Subroutine Do 1 core damage. Subroutine End the run.',
        stripped_title: 'Hakarl 1.0',
        text: 'When you rez this ice during a run against this server, you may derez another installed card. If you do, the Runner cannot use paid abilities printed on <strong>bioroid</strong> ice for the remainder of this turn.\n<strong>Lose [click]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability.\n[subroutine] Do 1 core damage.\n[subroutine] End the run.',
        title: 'Hákarl 1.0',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33037',
        cost: 2,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 1,
        flavor: 'With networks, growth is exponential.',
        illustrator: 'Jakuza',
        keywords: 'Code Gate - Harmonic',
        pack_code: 'ms',
        position: 37,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When you rez this ice during a run against this server, you may search R&D for a piece of ice and reveal it. (Shuffle R&D after searching it.) Add that ice to HQ. Subroutine Gain 1 credit for each rezzed piece of harmonic ice.',
        stripped_title: 'Wave',
        text: 'When you rez this ice during a run against this server, you may search R&D for a piece of ice and reveal it. <em>(Shuffle R&D after searching it.)</em> Add that ice to HQ.\n[subroutine] Gain 1[credit] for each rezzed piece of <strong>harmonic</strong> ice.',
        title: 'Wave',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33043',
        cost: 3,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'Ethereal beauty laced with the most elegant venom.',
        illustrator: 'Jack Reeves',
        keywords: 'Sentry - AP',
        pack_code: 'ms',
        position: 43,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When you rez this ice during a run against this server, you may trash 1 card from HQ to do 2 net damage. Subroutine Do 1 net damage.',
        stripped_title: 'Anemone',
        text: 'When you rez this ice during a run against this server, you may trash 1 card from HQ to do 2 net damage.\n[subroutine] Do 1 net damage.',
        title: 'Anemone',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33044',
        cost: 3,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor:
          'Digital refuse is their food, and you should never come between an animal and its food.',
        illustrator: 'Jack Reeves',
        keywords: 'Sentry - AP',
        pack_code: 'ms',
        position: 44,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'While this ice is protecting Archives, it gets +3 strength. Subroutine Do 3 net damage.',
        stripped_title: 'Bathynomus',
        text: 'While this ice is protecting Archives, it gets +3 strength.\n[subroutine] Do 3 net damage.',
        title: 'Bathynomus',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33045',
        cost: 7,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'Keep off the grass.',
        illustrator: 'Jack Reeves',
        keywords: 'Barrier - AP',
        pack_code: 'ms',
        position: 45,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'The rez cost of this ice is lowered by 1 credit for each rezzed piece of code gate ice. Subroutine Do 2 net damage. Subroutine End the run.',
        stripped_title: 'Ivik',
        text: 'The rez cost of this ice is lowered by 1[credit] for each rezzed piece of <strong>code gate</strong> ice.\n[subroutine] Do 2 net damage.\n[subroutine] End the run.',
        title: 'Ivik',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33053',
        cost: 5,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor:
          'Names of old carry little weight today, their legacies broken and swept away. Now, we are the rulers of truth.',
        illustrator: 'BalanceSheet',
        keywords: 'Code Gate',
        pack_code: 'ms',
        position: 53,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'You can advance this ice. When the Runner encounters this ice, you may remove 1 hosted advancement counter. If you do, the Runner loses 3 credits. Subroutine The Runner loses 3 credits. Subroutine End the run.',
        stripped_title: 'Mestnichestvo',
        text: 'You can advance this ice.\nWhen the Runner encounters this ice, you may remove 1 hosted advancement counter. If you do, the Runner loses 3[credit].\n[subroutine] The Runner loses 3[credit].\n[subroutine] End the run.',
        title: 'Mestnichestvo',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33054',
        cost: 2,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor:
          "No task the witch set would ever be too great, for Vasilisa had her mother's blessing.",
        illustrator: 'BalanceSheet',
        keywords: 'Sentry - Observer',
        pack_code: 'ms',
        position: 54,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When the Runner encounters this ice, you may pay 1 credit. If you do, place 1 advancement counter on an installed card you can advance. Subroutine Give the Runner 1 tag.',
        stripped_title: 'Vasilisa',
        text: 'When the Runner encounters this ice, you may pay 1[credit]. If you do, place 1 advancement counter on an installed card you can advance.\n[subroutine] Give the Runner 1 tag.',
        title: 'Vasilisa',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33060',
        cost: 5,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        illustrator: 'Scott Uminga',
        keywords: 'Barrier',
        pack_code: 'ms',
        position: 60,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'When you rez this ice, place 4 power counters on it. When your turn begins, remove 1 hosted power counter. This ice gains "Subroutine End the run." before its other subroutines for each hosted power counter. Subroutine Trash this ice.',
        stripped_title: 'Envelopment',
        text: 'When you rez this ice, place 4 power counters on it.\nWhen your turn begins, remove 1 hosted power counter.\nThis ice gains "[subroutine] End the run." before its other subroutines for each hosted power counter.\n[subroutine] Trash this ice.',
        title: 'Envelopment',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33061',
        cost: 3,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        flavor: 'Confound the runner so that they cannot see our true intent.',
        illustrator: 'Scott Uminga',
        keywords: 'Barrier',
        pack_code: 'ms',
        position: 61,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text: 'Subroutine Gain 2 credits. Subroutine End the run.',
        stripped_title: 'Maskirovka',
        text: '[subroutine] Gain 2[credit].\n[subroutine] End the run.',
        title: 'Maskirovka',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33062',
        cost: 4,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'Centuries of military tactics compressed into a single entity.',
        illustrator: 'Scott Uminga',
        keywords: 'Sentry - Destroyer',
        pack_code: 'ms',
        position: 62,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When you rez this ice, you may trash 1 of your other installed cards. If you do, this ice gets +5 strength for the remainder of the run. Subroutine Trash 1 installed program. Subroutine Trash 1 installed program.',
        stripped_title: 'Stavka',
        text: 'When you rez this ice, you may trash 1 of your other installed cards. If you do, this ice gets +5 strength for the remainder of the run.\n[subroutine] Trash 1 installed program.\n[subroutine] Trash 1 installed program.',
        title: 'Stavka',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33098',
        cost: 3,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          'As one, every monitoring device on the ship reverberated, emitting a noise so primordial, so titanic, it shook Padma to her core.\nDaeg hissed.',
        illustrator: 'Jakuza',
        keywords: 'Sentry - AP - Destroyer - Harmonic',
        pack_code: 'ph',
        position: 98,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'As an additional cost to rez this ice, derez another piece of harmonic ice. Subroutine Do 1 core damage. Subroutine Trash 1 installed program. Subroutine Trash 1 installed program.',
        stripped_title: 'Bloop',
        text: 'As an additional cost to rez this ice, derez another piece of <strong>harmonic</strong> ice.\n[subroutine] Do 1 core damage.\n[subroutine] Trash 1 installed program.\n[subroutine] Trash 1 installed program.',
        title: 'Bloop',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33099',
        cost: 3,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          'The sound welled up from the deep: throbbing, thumping, growing with every passing beat of their hearts.',
        illustrator: 'Jakuza',
        keywords: 'Code Gate - Harmonic',
        pack_code: 'ph',
        position: 99,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'When you rez this ice during a run against this server, the Runner loses click. Subroutine The Runner loses 1 credit for each rezzed piece of harmonic ice. Subroutine End the run unless the Runner spends click.',
        stripped_title: 'Pulse',
        text: 'When you rez this ice during a run against this server, the Runner loses [click].\n[subroutine] The Runner loses 1[credit] for each rezzed piece of <strong>harmonic</strong> ice.\n[subroutine] End the run unless the Runner spends [click].',
        title: 'Pulse',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33108',
        cost: 2,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor:
          'Hafrún has lived through generations of changes in the Net, and now there are whispers that something from the deep is making it anxious.',
        illustrator: 'Jack Reeves',
        keywords: 'Barrier - Code Gate',
        pack_code: 'ph',
        position: 108,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When you rez this ice during a run against this server, you may trash 1 card from HQ. If you do, choose 1 installed Runner card. That cards abilities cannot break subroutines for the remainder of that run. Subroutine End the run.',
        stripped_title: 'Hafrun',
        text: 'When you rez this ice during a run against this server, you may trash 1 card from HQ. If you do, choose 1 installed Runner card. That cardʼs abilities cannot break subroutines for the remainder of that run.\n[subroutine] End the run.',
        title: 'Hafrún',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33109',
        cost: 7,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor:
          '"Matt, thereʼs something big heading your way. Matt, are you hearing me? Matt? Oh no."\n—Moth',
        illustrator: 'Ed Mattinian',
        keywords: 'Code Gate - AP',
        pack_code: 'ph',
        position: 109,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'Subroutine The Runner loses 2 credits. Subroutine Gain 2 credits. Subroutine Do 2 net damage. Subroutine You may draw 1 or 2 cards.',
        stripped_title: 'Vampyronassa',
        text: '[subroutine] The Runner loses 2[credit].\n[subroutine] Gain 2[credit].\n[subroutine] Do 2 net damage.\n[subroutine] You may draw 1 or 2 cards.',
        title: 'Vampyronassa',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33116',
        cost: 3,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 3,
        flavor: 'SCANNING... ASSEMBLING INSULT!',
        illustrator: 'Bruno Balixa',
        keywords: 'Barrier',
        pack_code: 'ph',
        position: 116,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When you rez this ice during a run against this server, you may have the Runner gain 2 credits. If you do, choose 1 installed resource. That resource loses all abilities until your next turn ends. Subroutine End the run.',
        stripped_title: 'Klevetnik',
        text: 'When you rez this ice during a run against this server, you may have the Runner gain 2[credit]. If you do, choose 1 installed resource. That resource loses all abilities until your next turn ends.\n[subroutine] End the run.',
        title: 'Klevetnik',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33117',
        cost: 4,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        illustrator: 'BalanceSheet',
        keywords: 'Sentry - AP',
        pack_code: 'ph',
        position: 117,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When you rez this ice during a run against this server, you may have the Runner gain 2 credits. If you do, during each encounter with this ice for the remainder of that run, the Runner cannot break more than 1 of its printed subroutines. Subroutine Give the Runner 1 tag. Subroutine Do 2 net damage. Subroutine You may draw 2 cards.',
        stripped_title: 'Unsmiling Tsarevna',
        text: 'When you rez this ice during a run against this server, you may have the Runner gain 2[credit]. If you do, during each encounter with this ice for the remainder of that run, the Runner cannot break more than 1 of its printed subroutines.\n[subroutine] Give the Runner 1 tag.\n[subroutine] Do 2 net damage.\n[subroutine] You may draw 2 cards.',
        title: 'Unsmiling Tsarevna',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '33124',
        cost: 4,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'Waiting for the next blow to land.',
        illustrator: 'Scott Uminga',
        keywords: 'Code Gate',
        pack_code: 'ph',
        position: 124,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          "When the Runner encounters this ice, you may trash 1 of your other installed cards. If you do, the Runner cannot break this ice's printed subroutines for the remainder of this encounter. Subroutine Gain 1 credit. The Runner loses 1 credit. Subroutine The Runner trashes 1 of their installed cards.",
        stripped_title: 'Anvil',
        text: 'When the Runner encounters this ice, you may trash 1 of your other installed cards. If you do, the Runner cannot break this iceʼs printed subroutines for the remainder of this encounter.\n[subroutine] Gain 1[credit]. The Runner loses 1[credit].\n[subroutine] The Runner trashes 1 of their installed cards.',
        title: 'Anvil',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34034',
        cost: 2,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        illustrator: 'Ed Mattinian',
        keywords: 'Barrier',
        pack_code: 'tai',
        position: 34,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'Threat 3 -> When you rez this ice during a run against this server, you may install 1 non-agenda card from HQ or Archives in the root of or protecting another server. (This ability is active if any player has 3 or more agenda points.) Subroutine End the run.',
        stripped_title: 'Ablative Barrier',
        text: 'Threat 3 → When you rez this ice during a run against this server, you may install 1 non-agenda card from HQ or Archives in the root of or protecting another server. <em>(This ability is active if any player has 3 or more agenda points.)</em>\n[subroutine] End the run.',
        title: 'Ablative Barrier',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34035',
        cost: 4,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          '"Hey Br3n-N, just doing the hourly check-in. I saw a weird cyber-echo near your last node. You OK, mate?"\n—Moth',
        illustrator: 'Cat Shen',
        keywords: 'Sentry - AP',
        pack_code: 'tai',
        position: 35,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Threat 4 -> When the Runner encounters this ice, give them 1 tag unless they spend click. (This ability is active if any player has 4 or more agenda points.) Subroutine Give the Runner 1 tag. Subroutine If the Runner is tagged, do 1 core damage.',
        stripped_title: 'Jaguarundi',
        text: 'Threat 4 → When the Runner encounters this ice, give them 1 tag unless they spend [click]. <em>(This ability is active if any player has 4 or more agenda points.)</em>\n[subroutine] Give the Runner 1 tag.\n[subroutine] If the Runner is tagged, do 1 core damage.',
        title: 'Jaguarundi',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34036',
        cost: 6,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          'We make these arms for all, so that none who oppose peace would risk their own destruction.',
        illustrator: 'Bruno Balixa',
        keywords: 'Code Gate',
        pack_code: 'tai',
        position: 36,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'trash: End the run unless the Runner spends click. Use this ability only during a run on this server. Subroutine The Runner loses click. Subroutine The Runner loses click. Subroutine End the run.',
        stripped_title: 'M.I.C.',
        text: '[trash]<strong>:</strong> End the run unless the Runner spends [click]. Use this ability only during a run on this server.\n[subroutine] The Runner loses [click].\n[subroutine] The Runner loses [click].\n[subroutine] End the run.',
        title: 'M.I.C.',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34042',
        cost: 6,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        illustrator: 'Cat Shen',
        keywords: 'Code Gate - AP',
        pack_code: 'tai',
        position: 42,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'Threat 3 -> The Runner cannot spend credits while subroutines on this ice are resolving. (This ability is active if any player has 3 or more agenda points.) Subroutine Do 1 net damage unless the Runner pays 2 credits. Subroutine Do 1 net damage unless the Runner pays 2 credits. Subroutine Do 1 net damage unless the Runner pays 2 credits.',
        stripped_title: 'Attini',
        text: 'Threat 3 → The Runner cannot spend credits while subroutines on this ice are resolving. <em>(This ability is active if any player has 3 or more agenda points.)</em>\n[subroutine] Do 1 net damage unless the Runner pays 2[credit].\n[subroutine] Do 1 net damage unless the Runner pays 2[credit].\n[subroutine] Do 1 net damage unless the Runner pays 2[credit].',
        title: 'Attini',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34043',
        cost: 4,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'The construct turns to you, eyes wild. "Beloved," it asks, "is that you?"',
        illustrator: 'Marlon Ruiz',
        keywords: 'Sentry - AP - Observer',
        pack_code: 'tai',
        position: 43,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'When the Runner passes this ice, if there are 4 or more cards in the grip, give them 1 tag. Subroutine Do 1 net damage. Subroutine Do 1 net damage.',
        stripped_title: 'Phoneutria',
        text: 'When the Runner passes this ice, if there are 4 or more cards in the grip, give them 1 tag.\n[subroutine] Do 1 net damage.\n[subroutine] Do 1 net damage.',
        title: 'Phoneutria',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34044',
        cost: 2,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'Next!\n<strong>Designed by 2020 Intercontinental Champion Yannick Stucki</strong>',
        illustrator: 'Cat Shen',
        keywords: 'Barrier',
        pack_code: 'tai',
        position: 44,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'When the Runner passes this ice, you may swap it with a piece of ice from HQ. If you do, gain 4 credits. (The new ice is installed unrezzed. You do not pay an install cost.) Subroutine End the run.',
        stripped_title: 'Tatu-Bola',
        text: 'When the Runner passes this ice, you may swap it with a piece of ice from HQ. If you do, gain 4[credit]. <em>(The new ice is installed unrezzed. You do not pay an install cost.)</em>\n[subroutine] End the run.',
        title: 'Tatu-Bola',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34053',
        cost: 5,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 3,
        flavor: 'An exemplar of Starlightʼs hubris, it stands vigil over secrets of hypocrisy.',
        illustrator: 'Jakuza',
        keywords: 'Sentry - Observer',
        pack_code: 'tai',
        position: 53,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'Threat 4 -> When the Runner encounters this ice, it gains X "Subroutine End the run." subroutines for the remainder of this run, after its other subroutines. X is equal to the number of tags the Runner has. Subroutine Give the Runner 1 tag. Subroutine Give the Runner 1 tag.',
        stripped_title: 'Starlit Knight',
        text: 'Threat 4 → When the Runner encounters this ice, it gains X "[subroutine] End the run." subroutines for the remainder of this run, after its other subroutines. X is equal to the number of tags the Runner has.\n[subroutine] Give the Runner 1 tag.\n[subroutine] Give the Runner 1 tag.',
        title: 'Starlit Knight',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34054',
        cost: 2,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: '"No one has ever told me to get lost so politely."\n—Arissana Rocha Nahu',
        illustrator: 'Bruno Balixa',
        keywords: 'Code Gate - Observer',
        pack_code: 'tai',
        position: 54,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'Whenever the Runner passes this ice after encountering it, if they did not break its printed subroutine with a decoder during that encounter, give them 1 tag. Subroutine The Runner loses 1 credit.',
        stripped_title: 'Virtual Service Agent',
        text: 'Whenever the Runner passes this ice after encountering it, if they did not break its printed subroutine with a <strong>decoder</strong> during that encounter, give them 1 tag.\n[subroutine] The Runner loses 1[credit].',
        title: 'Virtual Service Agent',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34059',
        cost: 4,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 1,
        flavor: 'The forest around them grew denser with each beat of their heart.',
        illustrator: 'Emilio Rodríguez',
        keywords: 'Barrier - Expendable',
        pack_code: 'tai',
        position: 59,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'click, 1 credit, reveal and trash this ice from HQ: Place 3 advancement counters on 1 installed piece of ice. You can advance this ice. It gets +1 strength for each hosted advancement counter. Subroutine Gain 1 credit. End the run.',
        stripped_title: 'Tree Line',
        text: '[click], <strong>1</strong>[credit], <strong>reveal and trash this ice from HQ:</strong> Place 3 advancement counters on 1 installed piece of ice.\nYou can advance this ice. It gets +1 strength for each hosted advancement counter.\n[subroutine] Gain 1[credit]. End the run.',
        title: 'Tree Line',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34060',
        cost: 5,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        flavor:
          '"The only rule you need to remember is that it makes the rules."\n—Pumpkin-and-Dumplin',
        illustrator: 'Scott Uminga',
        keywords: 'Code Gate - Liability',
        pack_code: 'tai',
        position: 60,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'As an additional cost to rez this ice, take 1 bad publicity or remove 1 tag. Subroutine Gain 2 credits. Subroutine The Runner loses 2 credits. Subroutine End the run if you have more credits than the Runner.',
        stripped_title: 'Valentao',
        text: 'As an additional cost to rez this ice, take 1 bad publicity or remove 1 tag.\n[subroutine] Gain 2[credit].\n[subroutine] The Runner loses 2[credit].\n[subroutine] End the run if you have more credits than the Runner.',
        title: 'Valentão',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34100',
        cost: 3,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        illustrator: 'Bruno Balixa',
        keywords: 'Mythic - Destroyer',
        pack_code: 'rwr',
        position: 100,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'When you rez this ice, choose 1 or more subtypes among barrier, code gate, and sentry. This ice gains the chosen subtypes while it remains rezzed. When a turn ends, derez this ice. Subroutine If this ice is a code gate, the Runner loses click and 1 credit. Subroutine If this ice is a sentry, trash 1 installed program. Subroutine If this ice is a barrier, gain 1 credit and end the run.',
        stripped_title: 'Lycian Multi-Munition',
        text: 'When you rez this ice, choose 1 or more subtypes among <strong>barrier</strong>, <strong>code gate</strong>, and <strong>sentry</strong>. This ice gains the chosen subtypes while it remains rezzed.\nWhen a turn ends, derez this ice.\n[subroutine] If this ice is a <strong>code gate</strong>, the Runner loses [click] and 1[credit].\n[subroutine] If this ice is a <strong>sentry</strong>, trash 1 installed program.\n[subroutine] If this ice is a <strong>barrier</strong>, gain 1[credit] and end the run.',
        title: 'Lycian Multi-Munition',
        type_code: 'ice',
        uniqueness: true,
      },
      {
        code: '34101',
        cost: 4,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 3,
        flavor: 'At Thunderbolt, we ask: why not turn plowshares to swords?',
        illustrator: 'Ed Mattinian',
        keywords: 'Sentry - Destroyer',
        pack_code: 'rwr',
        position: 101,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'You cannot trash more than 1 installed Runner card with this ice during each encounter. Subroutine Trash 1 installed resource. Subroutine Trash 1 installed piece of hardware. Subroutine Trash 1 installed program.',
        stripped_title: 'Sorocaban Blade',
        text: 'You cannot trash more than 1 installed Runner card with this ice during each encounter.\n[subroutine] Trash 1 installed resource.\n[subroutine] Trash 1 installed piece of hardware.\n[subroutine] Trash 1 installed program.',
        title: 'Sorocaban Blade',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34109',
        cost: 6,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'They live forever in the rivers of the Net.',
        illustrator: 'Júlio Rocha',
        keywords: 'Barrier - AP',
        pack_code: 'rwr',
        position: 109,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'Threat 4 -> This ice gets +2 strength. (This ability is active if any player has 4 or more agenda points.) Subroutine Do 2 net damage. Subroutine You may trash 1 card from HQ to end the run. Subroutine You may trash 1 card from HQ to end the run.',
        stripped_title: 'Boto',
        text: 'Threat 4 → This ice gets +2 strength. <em>(This ability is active if any player has 4 or more agenda points.)</em>\n[subroutine] Do 2 net damage.\n[subroutine] You may trash 1 card from HQ to end the run.\n[subroutine] You may trash 1 card from HQ to end the run.',
        title: 'Boto',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34110',
        cost: 10,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor: 'Don’t let it catch your scent.',
        illustrator: 'Elwin "Jakuza" Rumplmair',
        keywords: 'Sentry - AP - Destroyer - Observer',
        pack_code: 'rwr',
        position: 110,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'Whenever an encounter with this ice ends, if it was rezzed this turn, trash 1 installed Runner card unless the Runner takes 2 tags or suffers 3 net damage. Subroutine Trash 1 installed Runner card. Subroutine Give the Runner 2 tags. Subroutine Do 3 net damage.',
        stripped_title: 'Cloud Eater',
        text: 'Whenever an encounter with this ice ends, if it was rezzed this turn, trash 1 installed Runner card unless the Runner takes 2 tags or suffers 3 net damage.\n[subroutine] Trash 1 installed Runner card.\n[subroutine] Give the Runner 2 tags.\n[subroutine] Do 3 net damage.',
        title: 'Cloud Eater',
        type_code: 'ice',
        uniqueness: true,
      },
      {
        code: '34111',
        cost: 3,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        illustrator: 'Scott Uminga',
        keywords: 'Code Gate',
        pack_code: 'rwr',
        position: 111,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'The first time each turn a run begins, you may move this ice to the outermost position protecting the attacked server. (The Runner will approach this ice.) Subroutine You may draw 1 card. You may install 1 piece of ice from HQ protecting another server, ignoring all costs. Subroutine Each piece of ice gets +2 strength for the remainder of this run.',
        stripped_title: 'Tributary',
        text: 'The first time each turn a run begins, you may move this ice to the outermost position protecting the attacked server. <em>(The Runner will approach this ice.)</em>\n[subroutine] You may draw 1 card. You may install 1 piece of ice from HQ protecting another server, ignoring all costs.\n[subroutine] Each piece of ice gets +2 strength for the remainder of this run.',
        title: 'Tributary',
        type_code: 'ice',
        uniqueness: true,
      },
      {
        code: '34116',
        cost: 4,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 1,
        flavor: 'Sebastião gritted his teeth as more and more indicators glowed red.',
        illustrator: 'Ed Mattinian',
        keywords: 'Barrier',
        pack_code: 'rwr',
        position: 116,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'While the Runner is tagged, this ice gets +2 strength. Subroutine Gain 1 credit for each tag the Runner has. Subroutine End the run.',
        stripped_title: 'Capacitor',
        text: 'While the Runner is tagged, this ice gets +2 strength.\n[subroutine] Gain 1[credit] for each tag the Runner has.\n[subroutine] End the run.',
        title: 'Capacitor',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34117',
        cost: 5,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 3,
        flavor: 'Eat, grow, deny. A truly ravenous generation.',
        illustrator: 'Júlio Rocha',
        keywords: 'Code Gate - AP - Liability',
        pack_code: 'rwr',
        position: 117,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'As an additional cost to rez this ice, take 1 bad publicity or remove 1 tag. Subroutine You may draw 1 card. Subroutine Do 1 net damage. Subroutine End the run if there are more cards in HQ than in the grip.',
        stripped_title: 'Piranhas',
        text: 'As an additional cost to rez this ice, take 1 bad publicity or remove 1 tag.\n[subroutine] You may draw 1 card.\n[subroutine] Do 1 net damage.\n[subroutine] End the run if there are more cards in HQ than in the grip.',
        title: 'Piranhas',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34118',
        cost: 10,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 3,
        flavor: '“Starlight called it a gift. I call it providence.”\n—The Holo Man',
        illustrator: 'Adam S. Doyle',
        keywords: 'Sentry - AP - Observer - Deep Net',
        pack_code: 'rwr',
        position: 118,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'When the Runner encounters this ice, they lose 3 credits unless they suffer 2 net damage or take 1 tag. Subroutine The Runner loses 3 credits. Subroutine Do 2 net damage. Subroutine Give the Runner 1 tag.',
        stripped_title: 'Seraph',
        text: 'When the Runner encounters this ice, they lose 3[credit] unless they suffer 2 net damage or take 1 tag.\n[subroutine] The Runner loses 3[credit].\n[subroutine] Do 2 net damage.\n[subroutine] Give the Runner 1 tag.',
        title: 'Seraph',
        type_code: 'ice',
        uniqueness: true,
      },
      {
        code: '34125',
        cost: 2,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'A little circular reasoning never hurt anybody.',
        illustrator: 'Krembler',
        keywords: 'Code Gate - Expendable',
        pack_code: 'rwr',
        position: 125,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'click, 1 credit, reveal and trash this ice from HQ: Draw 1 card. Reveal up to 2 agendas in HQ and/or Archives and shuffle them into R&D. When your turn begins, you may add this ice to HQ. Subroutine End the run.',
        stripped_title: 'Descent',
        text: '[click], <strong>1[credit]</strong>, <strong>reveal and trash this ice from HQ:</strong> Draw 1 card. Reveal up to 2 agendas in HQ and/or Archives and shuffle them into R&D.\nWhen your turn begins, you may add this ice to HQ.\n[subroutine] End the run.',
        title: 'Descent',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34126',
        cost: 6,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor: 'The final blow is struck.',
        illustrator: 'Scott Uminga',
        keywords: 'Sentry - Destroyer - Observer',
        pack_code: 'rwr',
        position: 126,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'During each encounter with this ice, the Runner cannot break more than 1 of its printed subroutines except using killers. Subroutine Give the Runner 1 tag. Subroutine Trash 1 installed resource or piece of hardware. Subroutine Trash 1 installed program that is not a decoder, fracter, or killer.',
        stripped_title: 'Hammer',
        text: 'During each encounter with this ice, the Runner cannot break more than 1 of its printed subroutines except using <strong>killers</strong>.\n[subroutine] Give the Runner 1 tag.\n[subroutine] Trash 1 installed resource or piece of hardware.\n[subroutine] Trash 1 installed program that is not a <strong>decoder</strong>, <strong>fracter</strong>, or <strong>killer</strong>.',
        title: 'Hammer',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '34127',
        cost: 6,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        illustrator: 'Ed Mattinian',
        keywords: 'Barrier',
        pack_code: 'rwr',
        position: 127,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'You can advance this ice. It gets +1 strength for each hosted advancement counter. When you rez this ice, place 1 advancement counter on it plus 1 advancement counter for each card type among faceup cards in Archives. Subroutine Gain 2 credits. End the run. Subroutine End the run. Subroutine End the run.',
        stripped_title: 'Logjam',
        text: 'You can advance this ice. It gets +1 strength for each hosted advancement counter.\nWhen you rez this ice, place 1 advancement counter on it plus 1 advancement counter for each card type among faceup cards in Archives.\n[subroutine] Gain 2[credit]. End the run.\n[subroutine] End the run.\n[subroutine] End the run.',
        title: 'Logjam',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35041',
        cost: 3,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 1,
        flavor: '“You dare?”',
        illustrator: 'Ferenc Patkós',
        keywords: 'Sentry - Bioroid - AP - Destroyer',
        pack_code: 'elev',
        position: 41,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When you rez this ice during a run against this server, you may trash 1 installed trojan program. Lose click: Break 1 subroutine on this ice. Only the Runner can use this ability. Subroutine Trash 1 installed program. Subroutine Do 1 core damage.',
        stripped_title: 'Bumi 1.0',
        text: 'When you rez this ice during a run against this server, you may trash 1 installed <strong>trojan</strong> program.\n<strong>Lose [click]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability.\n[subroutine] Trash 1 installed program.\n[subroutine] Do 1 core damage.',
        title: 'Bumi 1.0',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35042',
        cost: 3,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          '“It is a fallacy that conscious observation can change reality. The consciousness of the observer isn’t required at all.”\n—The Encyclopedia Silica',
        illustrator: 'Bruno Balixa',
        keywords: 'Code Gate',
        pack_code: 'elev',
        position: 42,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'While this ice is the only piece of ice protecting this server, it gets +4 strength. Subroutine You may install 1 card from HQ. Subroutine End the run.',
        stripped_title: 'Scatter Field',
        text: 'While this ice is the only piece of ice protecting this server, it gets +4 strength.\n[subroutine] You may install 1 card from HQ.\n[subroutine] End the run.',
        title: 'Scatter Field',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35052',
        cost: 7,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor: 'Jinteki’s most experimental ice are often their most dangerous.',
        illustrator: 'Bruno Balixa',
        keywords: 'Sentry - AP - Observer',
        pack_code: 'elev',
        position: 52,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'Subroutine Draw 1 card. You may add 1 card from HQ to the top of R&D. Subroutine Do 1 net damage. Give the Runner 1 tag. Subroutine Do 2 net damage.',
        stripped_title: 'Empiricist',
        text: '[subroutine] Draw 1 card. You may add 1 card from HQ to the top of R&D.\n[subroutine] Do 1 net damage. Give the Runner 1 tag.\n[subroutine] Do 2 net damage.',
        title: 'Empiricist',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35053',
        cost: 8,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        illustrator: 'Mia Siergiejew',
        keywords: 'Code Gate',
        pack_code: 'elev',
        position: 53,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'Subroutine You may install 1 piece of ice from Archives, ignoring all costs. Subroutine You may rez 1 installed piece of ice, paying 2 credits less. Subroutine Resolve 1 subroutine on a rezzed sentry. Subroutine Resolve 1 subroutine on another rezzed code gate.',
        stripped_title: 'Mycoweb',
        text: '[subroutine] You may install 1 piece of ice from Archives, ignoring all costs.\n[subroutine] You may rez 1 installed piece of ice, paying 2[credit] less.\n[subroutine] Resolve 1 subroutine on a rezzed <strong>sentry</strong>.\n[subroutine] Resolve 1 subroutine on another rezzed <strong>code gate</strong>.',
        title: 'Mycoweb',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35054',
        cost: 3,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 1,
        flavor: 'The silence of the forest is the surest sign of danger.',
        illustrator: 'Scott Uminga',
        keywords: 'Barrier - AP',
        pack_code: 'elev',
        position: 54,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'The Runner cannot break the printed subroutine on this ice except using a fracter. Subroutine End the run unless the Runner suffers 3 net damage.',
        stripped_title: 'Semak-samun',
        text: 'The Runner cannot break the printed subroutine on this ice except using a <strong>fracter</strong>.\n[subroutine] End the run unless the Runner suffers 3 net damage.',
        title: 'Semak-samun',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35063',
        cost: 3,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: 'They know what makes you tick.\nAnd ticked-off.',
        illustrator: 'Júlio Rocha',
        keywords: 'Sentry - AP - Observer',
        pack_code: 'elev',
        position: 63,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Subroutine Give the Runner 1 tag. Subroutine Do 1 net damage. Subroutine Do 2 net damage if the Runner has at least 2 tags.',
        stripped_title: 'Doomscroll',
        text: '[subroutine] Give the Runner 1 tag.\n[subroutine] Do 1 net damage.\n[subroutine] Do 2 net damage if the Runner has at least 2 tags.',
        title: 'Doomscroll',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35064',
        cost: 4,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: '”On the Net, we hold the power.”\n —Arnold Teoh, NBN technologist',
        illustrator: 'Ed Mattinian',
        keywords: 'Code Gate',
        pack_code: 'elev',
        position: 64,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          '3 credits: Break 1 subroutine on this ice. Only the Runner can use this ability. Subroutine End the run. Subroutine If the threat level is 2 or greater, end the run. Subroutine If the threat level is 4 or greater, end the run.',
        stripped_title: 'N-Pot',
        text: '<strong>3[credit]:</strong> Break 1 subroutine on this ice. Only the Runner can use this ability.\n[subroutine] End the run.\n[subroutine] If the threat level is 2 or greater, end the run.\n[subroutine] If the threat level is 4 or greater, end the run.',
        title: 'N-Pot',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35074',
        cost: 14,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        flavor: '“Dammit, Moth! Where are you? This thing is way bigger than you s—”\n—C0nr4d',
        illustrator: 'Anthony Hutchings',
        keywords: 'Sentry - Destroyer',
        pack_code: 'elev',
        position: 74,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'You can forfeit 1 agenda as you rez this ice to pay for 10 credits of its rez cost. Subroutine Trash 1 installed program or end the run. Subroutine Trash 1 installed resource or end the run. Subroutine End the run.',
        stripped_title: 'Biawak',
        text: 'You can forfeit 1 agenda as you rez this ice to pay for 10[credit] of its rez cost.\n[subroutine] Trash 1 installed program or end the run.\n[subroutine] Trash 1 installed resource or end the run.\n[subroutine] End the run.',
        title: 'Biawak',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35075',
        cost: 2,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 1,
        flavor:
          '“The detritus of failed incursions accumulates. Instead of sweeping it all away, the parsimonious sysop should nudge this debris into defensive positions in the server’s metagravity well.”\n—Moira Virtue, Ice Engineering, KKU',
        illustrator: 'Krembler',
        keywords: 'Barrier',
        pack_code: 'elev',
        position: 75,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'The Runner cannot trash this ice (while it is rezzed). Subroutine End the run. Subroutine End the run.',
        stripped_title: 'Kessleroid',
        text: 'The Runner cannot trash this ice <em>(while it is rezzed)</em>.\n[subroutine] End the run.\n[subroutine] End the run.',
        title: 'Kessleroid',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35076',
        cost: 4,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        illustrator: 'Scott Uminga',
        keywords: 'Code Gate - AP',
        pack_code: 'elev',
        position: 76,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'You can advance this ice. When the Runner encounters this ice, if it has 3 or more hosted advancement counters, you may place 1 advancement counter on an installed card you can advance. Subroutine You may place 1 advancement counter on an installed card you can advance. Subroutine The Runner loses 2 credits. Subroutine Do 1 net damage.',
        stripped_title: 'Syailendra',
        text: 'You can advance this ice.\nWhen the Runner encounters this ice, if it has 3 or more hosted advancement counters, you may place 1 advancement counter on an installed card you can advance.\n[subroutine] You may place 1 advancement counter on an installed card you can advance.\n[subroutine] The Runner loses 2[credit].\n[subroutine] Do 1 net damage.',
        title: 'Syailendra',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35079',
        cost: 2,
        deck_limit: 3,
        faction_code: 'neutral-corp',
        faction_cost: 0,
        flavor: 'Stop that.',
        illustrator: 'Ed Mattinian',
        keywords: 'Code Gate',
        pack_code: 'elev',
        position: 79,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'When you rez this ice during a run against this server, purge virus counters. Subroutine End the run.',
        stripped_title: 'Flyswatter',
        text: 'When you rez this ice during a run against this server, purge virus counters.\n[subroutine] End the run.',
        title: 'Flyswatter',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '35080',
        cost: 2,
        deck_limit: 3,
        faction_code: 'neutral-corp',
        faction_cost: 0,
        flavor: 'Itur in antiquam telam.',
        illustrator: 'Ferenc Patkós',
        keywords: 'Sentry - Observer',
        pack_code: 'elev',
        position: 80,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'When an agenda is scored or stolen from this server or its root, trash this ice. Subroutine Give the Runner 1 tag unless they pay 3 credits. Subroutine End the run if the Runner is tagged.',
        stripped_title: 'Lamplighter',
        text: 'When an agenda is scored or stolen from this server or its root, trash this ice.\n[subroutine] Give the Runner 1 tag unless they pay 3[credit].\n[subroutine] End the run if the Runner is tagged.',
        title: 'Lamplighter',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36028',
        cost: 8,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 4,
        flavor: '<strong>Designed by 2021 World Champion Patrick Gower</strong>',
        illustrator: 'Benjamin Giletti',
        keywords: 'Sentry - Bioroid - Destroyer',
        pack_code: 'vp',
        position: 28,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'Lose click click: Break up to 2 subroutines on this ice. Only the Runner can use this ability. Subroutine Trash 1 installed Runner card. Subroutine Remove 1 card in the heap from the game. Subroutine You may install 1 card from HQ or Archives. Subroutine End the run.',
        stripped_title: 'Ansel 2.0',
        text: '<strong>Lose [click][click]:</strong> Break up to 2 subroutines on this ice. Only the Runner can use this ability.\n[subroutine] Trash 1 installed Runner card.\n[subroutine] Remove 1 card in the heap from the game.\n[subroutine] You may install 1 card from HQ or Archives.\n[subroutine] End the run.',
        title: 'Ansel 2.0',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36029',
        cost: 4,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 1,
        flavor:
          'Everything in the Net is ultimately just information—light, sound, runners. If you can reflect any, you can reflect all.',
        illustrator: 'Elwin "Jakuza" Rumplmair',
        keywords: 'Barrier - Harmonic',
        pack_code: 'vp',
        position: 29,
        quantity: 3,
        side_code: 'corp',
        strength: 2,
        stripped_text:
          'The rez cost of this ice is lowered by 1 credit for each other unrezzed piece of ice. Subroutine End the run. Subroutine End the run.',
        stripped_title: 'Reverb',
        text: 'The rez cost of this ice is lowered by 1[credit] for each other unrezzed piece of ice.\n[subroutine] End the run.\n[subroutine] End the run.',
        title: 'Reverb',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36030',
        cost: 4,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor:
          'He bade write runes on the shield before the shining goddess,\non Sleipnir’s teeth, and the straps of the sledge.',
        illustrator: 'Adam S. Doyle',
        keywords: 'Code Gate',
        pack_code: 'vp',
        position: 30,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'Subroutine You may draw 1 card. Subroutine You may shuffle 1 card from HQ or Archives into R&D. Subroutine End the run.',
        stripped_title: 'Sleipnir',
        text: '[subroutine] You may draw 1 card.\n[subroutine] You may shuffle 1 card from HQ or Archives into R&D.\n[subroutine] End the run.',
        title: 'Sleipnir',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36031',
        cost: 1,
        deck_limit: 3,
        faction_code: 'haas-bioroid',
        faction_cost: 2,
        flavor: 'It was only a moment for you; you took no notice.',
        illustrator: 'Ed Mattinian',
        keywords: 'Code Gate',
        pack_code: 'vp',
        position: 31,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'When the Runner passes this ice, if they have no click remaining, they cannot steal or trash Corp cards for the remainder of this run. Subroutine The Runner loses click.',
        stripped_title: 'Vertigo',
        text: 'When the Runner passes this ice, if they have no [click] remaining, they cannot steal or trash Corp cards for the remainder of this run.\n[subroutine] The Runner loses [click].',
        title: 'Vertigo',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36039',
        cost: 1,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 2,
        flavor: 'A web that only tightens the more you’re lost within it.',
        illustrator: 'Benjamin Giletti',
        keywords: 'Code Gate',
        pack_code: 'vp',
        position: 39,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'click: Swap this ice with another installed piece of ice. Subroutine Look at the top card of R&D. You may add that card to the bottom of R&D. Subroutine Each piece of ice gets +1 strength for the remainder of this run.',
        stripped_title: 'ezaM',
        text: '[click]<strong>:</strong> Swap this ice with another installed piece of ice.\n[subroutine] Look at the top card of R&D. You may add that card to the bottom of R&D.\n[subroutine] Each piece of ice gets +1 strength for the remainder of this run.',
        title: 'ezaM',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36040',
        cost: 5,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor: '<strong>Designed by 2021 Asia-Pacific Champion William “Sokka” Huang</strong>',
        illustrator: 'Anthony Hutchings',
        keywords: 'Code Gate',
        pack_code: 'vp',
        position: 40,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'Whenever an encounter with this ice ends, if it has 3 or more hosted virus counters, purge virus counters and derez this ice. Subroutine Place 1 virus counter on this ice. Subroutine Look at the top 4 cards of R&D and arrange them in any order. Subroutine End the run.',
        stripped_title: 'Knowledge Seeker',
        text: 'Whenever an encounter with this ice ends, if it has 3 or more hosted virus counters, purge virus counters and derez this ice.\n[subroutine] Place 1 virus counter on this ice.\n[subroutine] Look at the top 4 cards of R&D and arrange them in any order.\n[subroutine] End the run.',
        title: 'Knowledge Seeker',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36041',
        cost: 6,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor: '”Step closer,” you dream you hear. “Feel my embrace.”',
        illustrator: 'Liiga Smilshkalne',
        keywords: 'Sentry - AP',
        pack_code: 'vp',
        position: 41,
        quantity: 3,
        side_code: 'corp',
        strength: 4,
        stripped_text:
          'Subroutine Do 2 net damage. Subroutine Do 2 net damage unless the Runner pays 3 credits. Subroutine Do 2 net damage unless the Runner jacks out.',
        stripped_title: 'Lionsmane',
        text: '[subroutine] Do 2 net damage.\n[subroutine] Do 2 net damage unless the Runner pays 3[credit].\n[subroutine] Do 2 net damage unless the Runner jacks out.',
        title: 'Lionsmane',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36042',
        cost: 2,
        deck_limit: 3,
        faction_code: 'jinteki',
        faction_cost: 3,
        flavor: 'BZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
        illustrator: 'Júlio Rocha',
        keywords: 'Trap - AP - Observer',
        pack_code: 'vp',
        position: 42,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Subroutine Do X net damage and give the Runner X tags. X is equal to the number of tags the Runner has. Subroutine Give the Runner 1 tag. Trash this ice.',
        stripped_title: 'Vicsek',
        text: '[subroutine] Do X net damage and give the Runner X tags. X is equal to the number of tags the Runner has.\n[subroutine] Give the Runner 1 tag. Trash this ice.',
        title: 'Vicsek',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36050',
        cost: 5,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 3,
        flavor: 'gimme gimme gimme gimme gimme gimme',
        illustrator: 'Scott Uminga',
        keywords: 'Barrier - Liability',
        pack_code: 'vp',
        position: 50,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'When you rez this ice, if it is protecting a central server, take 1 bad publicity. Subroutine End the run unless the Runner pays 3 credits. Subroutine End the run unless the Runner pays 3 credits.',
        stripped_title: 'Grubber',
        text: 'When you rez this ice, if it is protecting a central server, take 1 bad publicity.\n[subroutine] End the run unless the Runner pays 3[credit].\n[subroutine] End the run unless the Runner pays 3[credit].',
        title: 'Grubber',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36051',
        cost: 9,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 2,
        flavor: 'Drink deeply and forget.',
        illustrator: 'Qistina Khalidah',
        keywords: 'Sentry - Observer',
        pack_code: 'vp',
        position: 51,
        quantity: 3,
        side_code: 'corp',
        strength: 6,
        stripped_text:
          'Whenever the Runner bypasses or fully breaks this ice, give them 1 tag. Subroutine You may add 1 card from Archives to the top or bottom of R&D. Subroutine Add 1 installed Runner card to the grip.',
        stripped_title: 'Lethe',
        text: 'Whenever the Runner bypasses or fully breaks this ice, give them 1 tag.\n[subroutine] You may add 1 card from Archives to the top or bottom of R&D.\n[subroutine] Add 1 installed Runner card to the grip.',
        title: 'Lethe',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36052',
        cost: 1,
        deck_limit: 3,
        faction_code: 'nbn',
        faction_cost: 1,
        flavor:
          '“Yeah, I previously worked at a Weyland shop, but the boss had it out for me. Creative differences.”\n—Isolde Muraro, ice architect',
        illustrator: 'Ed Mattinian',
        keywords: 'Barrier',
        pack_code: 'vp',
        position: 52,
        quantity: 3,
        side_code: 'corp',
        strength: 1,
        stripped_text:
          'When the Runner encounters this ice, they lose 1 credit. Subroutine End the run unless the Runner pays 1 credit.',
        stripped_title: 'Paywall',
        text: 'When the Runner encounters this ice, they lose 1[credit].\n[subroutine] End the run unless the Runner pays 1[credit].',
        title: 'Paywall',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36058',
        cost: 4,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 3,
        flavor: 'Even light cannot escape. What makes you think <em>you</em> can?',
        illustrator: 'Ferenc Patkós',
        keywords: 'Sentry - Destroyer',
        pack_code: 'vp',
        position: 58,
        quantity: 3,
        side_code: 'corp',
        strength: 0,
        stripped_text:
          'trash: End the run. Use this ability only during a run against this server. Subroutine Trash 1 installed program unless the Runner pays 3 credits. Subroutine End the run unless the Runner pays 3 credits.',
        stripped_title: 'Event Horizon',
        text: '[trash]<strong>:</strong> End the run. Use this ability only during a run against this server.\n[subroutine] Trash 1 installed program unless the Runner pays 3[credit].\n[subroutine] End the run unless the Runner pays 3[credit].',
        title: 'Event Horizon',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36059',
        cost: 2,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor:
          '“The metakinetic energy of an incursion is an asset. Direct the invader’s movement into a dynamic system, and you may be surprised how much the cluster can extract from it.”\n—Moira Virtue, Ice Engineering, MU (formerly of KKU)',
        illustrator: 'Ed Mattinian',
        keywords: 'Sentry',
        pack_code: 'vp',
        position: 59,
        quantity: 3,
        side_code: 'corp',
        strength: 3,
        stripped_text:
          'Subroutine Gain 1 credit. You may draw 1 card. Subroutine Gain 1 credit. You may draw 1 card.',
        stripped_title: 'Flywheel',
        text: '[subroutine] Gain 1[credit]. You may draw 1 card.\n[subroutine] Gain 1[credit]. You may draw 1 card.',
        title: 'Flywheel',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '36060',
        cost: 8,
        deck_limit: 3,
        faction_code: 'weyland-consortium',
        faction_cost: 2,
        flavor:
          'No one can hear the clamor of the bells and not be alarmed. Least of all the intruder.',
        illustrator: 'Scott Uminga',
        keywords: 'Code Gate - Expendable',
        pack_code: 'vp',
        position: 60,
        quantity: 3,
        side_code: 'corp',
        strength: 5,
        stripped_text:
          'click, 1 credit, reveal and trash this ice from HQ: Search R&D for up to 1 barrier and up to 1 sentry and reveal them. (Shuffle R&D after searching it.) Add those cards to HQ. Subroutine The Runner loses 2 credits. Subroutine End the run. Subroutine End the run.',
        stripped_title: 'Tocsin',
        text: '[click], <strong>1</strong>[credit], <strong>reveal and trash this ice from HQ:</strong> Search R&D for up to 1 <strong>barrier</strong> and up to 1 <strong>sentry</strong> and reveal them. <em>(Shuffle R&D after searching it.)</em> Add those cards to HQ.\n[subroutine] The Runner loses 2[credit].\n[subroutine] End the run.\n[subroutine] End the run.',
        title: 'Tocsin',
        type_code: 'ice',
        uniqueness: false,
      },
      {
        code: '26024',
        cost: 2,
        deck_limit: 3,
        faction_code: 'shaper',
        faction_cost: 2,
        flavor:
          'It is not knowledge, but the act of learning, not possession, but the act of getting there, which grants the greatest enjoyment.',
        illustrator: 'Iain Fairclough',
        keywords: 'Icebreaker - Fracter',
        memory_cost: 1,
        pack_code: 'df',
        position: 24,
        quantity: 3,
        side_code: 'runner',
        strength: 1,
        stripped_text:
          'When you install this program, it gets +3 strength for the remainder of the turn. Interface -> 1 credit: Break 1 barrier subroutine. 2 credits: +2 strength.',
        stripped_title: 'Gauss',
        text: 'When you install this program, it gets +3 strength for the remainder of the turn.\nInterface → <strong>1[credit]:</strong> Break 1 <strong>barrier</strong> subroutine.\n<strong>2[credit]:</strong> +2 strength.',
        title: 'Gauss',
        type_code: 'program',
        uniqueness: false,
      },
    ];

    const ice = standardVal.filter((val) => val.type_code === RelevantCardTypes.ICE);
    const breakers = standardVal
      .filter((val) => val.type_code.toLowerCase() === RelevantCardTypes.PROGRAM)
      .filter((val) => val.keywords?.toLowerCase().includes(RelevantCardTypes.BREAKER));

    this.setIce(this.getUniqueValues(ice));
    this.setIceBreakers(this.getUniqueValues(breakers));
    this.setBreakCosts(this.cardUtils.barriers(), this.cardUtils.fracters());
    // });

    // this.api.getStandardPackList().subscribe((val) => {
    //   console.log(
    //     'standard ice',
    //     JSON.stringify(
    //       this.getUniqueValues(breakers).filter((val2) => val.includes(val2.pack_code)),
    //     ),
    //   );
    // });
  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource2.sort = this.sort2;
    this.datasource3.sort = this.sort3;
  }

  getUniqueValues(vals: ApiCard[]) {
    return vals.filter(
      (value, index, self) =>
        self.findIndex(
          (item) => item.stripped_title.toLowerCase() === value.stripped_title.toLowerCase(),
        ) === index,
    );
  }

  private setIceBreakers(uniqueBreakers: ApiCard[]) {
    this.cardUtils.fracters.set(
      uniqueBreakers
        .filter((val) => val.keywords?.toLowerCase().includes(BreakerType.FRACTER))
        .map((val) => this.extractBreakerData(val)),
    );
    this.cardUtils.decoders.set(
      uniqueBreakers
        .filter((val) => val.keywords?.toLowerCase().includes(BreakerType.DECODER))
        .map((val) => this.extractBreakerData(val)),
    );
    this.cardUtils.killers.set(
      uniqueBreakers
        .filter((val) => val.keywords?.toLowerCase().includes(BreakerType.KILLER))
        .map((val) => this.extractBreakerData(val)),
    );
    this.cardUtils.ai.set(
      uniqueBreakers
        .filter((val) => val.keywords?.toLowerCase().includes(BreakerType.AI))
        .map((val) => this.extractBreakerData(val)),
    );

    this.datasource.data = [
      ...this.cardUtils.fracters(),
      // ...this.cardUtils.decoders(),
      // ...this.cardUtils.killers(),
      // ...this.cardUtils.ai(),
    ];
  }

  private setIce(uniqueIce: ApiCard[]) {
    this.cardUtils.barriers.set(
      uniqueIce
        .filter((val) => val.keywords?.toLowerCase().includes(IceType.BARRIER))
        .map((val) => this.extractIceData(val)),
    );
    this.cardUtils.codeGates.set(
      uniqueIce
        .filter((val) => val.keywords?.toLowerCase().includes(IceType.CODE_GATE))
        .map((val) => this.extractIceData(val)),
    );
    this.cardUtils.sentries.set(
      uniqueIce
        .filter((val) => val.keywords?.toLowerCase().includes(IceType.SENTRY))
        .map((val) => this.extractIceData(val)),
    );
    this.cardUtils.otherIce.set(
      uniqueIce
        .filter(
          (val) =>
            !val.keywords?.toLowerCase().includes(IceType.BARRIER) &&
            !val.keywords?.toLowerCase().includes(IceType.CODE_GATE) &&
            !val.keywords?.toLowerCase().includes(IceType.SENTRY),
        )
        .map((val) => this.extractIceData(val)),
    );

    this.datasource2.data = [
      ...this.cardUtils.barriers(),
      // ...this.cardUtils.codeGates(),
      // ...this.cardUtils.sentries(),
      // ...this.cardUtils.otherIce(),
    ];
  }

  private extractIceData(card: ApiCard): ParsedIce {
    return {
      name: card.stripped_title,
      faction: card.faction_code as CorpFaction,
      influence: card.faction_cost,
      legality: [],
      cost: card.cost ?? -1,
      text: card.text ?? '',
      encounterEffect: this.getIceEncounterEffects(card.text ?? ''),
      subroutines: this.getIceSubroutines(card.text ?? ''),
      strength: card.strength ?? -1,
      iceType: this.getIceTypes(card),
      iceSubTypes: this.getIceSubTypes(card),
      imageCode: card.code,
    };
  }

  private extractBreakerData(card: ApiCard): ParsedBreaker {
    return {
      name: card.stripped_title,
      faction: card.faction_code as RunnerFaction,
      influence: card.faction_cost,
      memory: card.memory_cost ?? -1,
      legality: [],
      cost: card.cost ?? -1,
      text: card.text ?? '',
      interfaceCost: this.getInterfaceCost(card),
      boostCost: this.getBoostCost(card),
      baseStrength: card.strength ?? -1,
      breakerType: [],
      set: card.pack_code,
      imageCode: card.code,
    };
  }

  private getIceEncounterEffects(text: string) {
    const regex =
      /(?:When the Runner encounters this ice,?|Whenever an encounter with this ice ends,?)\s*(?:they must\s*)?([\s\S]*?)(?=\s*\[subroutine\]|\s*$)/gi;

    const results: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      results.push(match[1].trim());
    }

    return results.toString();
  }

  private getIceSubroutines(text: string): IceSubroutine[] {
    const subRegex = /\[subroutine\]\s*([\s\S]*?)(?=\s*\[subroutine\]|\s*$)/gi;

    const subroutines: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = subRegex.exec(text)) !== null) {
      subroutines.push(match[1].trim());
    }

    return subroutines.map((val) => {
      // this.testETRScenarios(val);
      return {
        etr: this.testETRScenarios(val),
        trace: this.testTraceScenarios(val),
        tags: this.testTagScenarios(val),
        damage: undefined,
        clicks: 0,
        trash: undefined,
        runner: undefined,
        corp: undefined,
        purge: false,
      };
    });
  }

  private getIceTypes(card: ApiCard) {
    return [];
  }

  private getIceSubTypes(card: ApiCard) {
    return [];
  }

  private getInterfaceCost(card: ApiCard): BreakCost {
    const customCard = this.customManualCards(card.stripped_title);
    if (customCard) {
      return customCard;
    } else {
      const creditCost = this.breakerInterfaceUtils.getCreditInterfaceValues(card.text ?? '');
      const virusCost = this.breakerInterfaceUtils.getVirusCounterInterface(card.text ?? '');
      const powerCounterCost = this.breakerInterfaceUtils.getPowerCounterValues(card.text ?? '');
      const cardsCost = this.breakerInterfaceUtils.getCardTrashInterface(card.text ?? '');
      return {
        credits: {
          cost: creditCost?.[0] ?? -1,
          subs: creditCost?.[1] ?? -1,
          stealth: false,
          usableTimes: -1,
        },
        cards: {
          cost: cardsCost?.[0] ?? -1,
          subs: cardsCost?.[0] ?? -1,
        },
        clicks: {
          cost: -1,
          subs: -1,
        },
        virusCounters: {
          cost: virusCost?.[0] ?? -1,
          subs: virusCost?.[0] ?? -1,
        },
        powerCounters: {
          cost: powerCounterCost?.[0] ?? -1,
          subs: powerCounterCost?.[0] ?? -1,
        },
      };
    }
  }

  private getBoostCost(card: ApiCard): BoostCost {
    const boostRegex = /<strong>(\d+)\[credit\]:<\/strong>\s*\+(\d+)\s*strength/;
    card.text?.match(boostRegex);
    const creditMatch = card.text?.match(boostRegex);
    return {
      credits: {
        cost: Number.parseInt(creditMatch?.[1] ?? '-1'),
        amount: Number.parseInt(creditMatch?.[2] ?? '-1'),
        stealth: false,
        usableTimes: -1,
      },
      netDamage: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
      meatDamage: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
      coreDamage: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
      cards: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
      clicks: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
      virusCounters: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
      powerCounters: {
        cost: -1,
        amount: -1,
        stealth: false,
        usableTimes: -1,
      },
    };
  }

  private customManualCards(cardName: string) {
    switch (cardName.toLowerCase()) {
      case 'flashbang':
        return {
          credits: {
            cost: 6,
            subs: 100,
          },
          netDamage: {
            cost: -1,
            subs: -1,
          },
          meatDamage: {
            cost: -1,
            subs: -1,
          },
          coreDamage: {
            cost: -1,
            subs: -1,
          },
          cards: {
            cost: -1,
            subs: -1,
          },
          clicks: {
            cost: -1,
            subs: -1,
          },
          virusCounters: {
            cost: -1,
            subs: -1,
          },
          powerCounters: {
            cost: -1,
            subs: -1,
          },
        };
      case 'baba yaga':
        return {
          credits: {
            cost: -3,
            subs: -3,
            stealth: false,
          },
          netDamage: {
            cost: -1,
            subs: -1,
          },
          meatDamage: {
            cost: -1,
            subs: -1,
          },
          coreDamage: {
            cost: -1,
            subs: -1,
          },
          cards: {
            cost: -1,
            subs: -1,
          },
          clicks: {
            cost: -1,
            subs: -1,
          },
          virusCounters: {
            cost: -1,
            subs: -1,
          },
          powerCounters: {
            cost: -1,
            subs: -1,
          },
        };
      case 'matryoshka':
        return {
          credits: {
            cost: -2,
            subs: -2,
            stealth: false,
          },
          netDamage: {
            cost: -1,
            subs: -1,
          },
          meatDamage: {
            cost: -1,
            subs: -1,
          },
          coreDamage: {
            cost: -1,
            subs: -1,
          },
          cards: {
            cost: -1,
            subs: -1,
          },
          clicks: {
            cost: -1,
            subs: -1,
          },
          virusCounters: {
            cost: -1,
            subs: -1,
          },
          powerCounters: {
            cost: -1,
            subs: -1,
          },
        };
      case 'banner':
        return {
          credits: {
            cost: -4,
            subs: -4,
            stealth: false,
          },
          netDamage: {
            cost: -1,
            subs: -1,
          },
          meatDamage: {
            cost: -1,
            subs: -1,
          },
          coreDamage: {
            cost: -1,
            subs: -1,
          },
          cards: {
            cost: -1,
            subs: -1,
          },
          clicks: {
            cost: -1,
            subs: -1,
          },
          virusCounters: {
            cost: -1,
            subs: -1,
          },
          powerCounters: {
            cost: -1,
            subs: -1,
          },
        };
      default:
        return undefined;
    }
  }

  private testETRScenarios(text: string) {
    const basicEndRunRegex = /^End the run\.?$/i;
    const tagRegex = /^End the run if the runner is tagged\.?$/i;
    const moneyDiffRegex = /^End the run if you have more credits than the Runner\.?$/i;
    const cardsDifferenceRegex =
      /^End the run if there are more cards in HQ than in the grip.\.?$/i;
    const psiGameRegex =
      /^End the run if you and the Runner spent a different number of credits\.?$/i;

    return {
      conditional: basicEndRunRegex.test(text),
      requiresTag: tagRegex.test(text),
      requiresMoneyDifference: moneyDiffRegex.test(text),
      requiresCardsDifference: cardsDifferenceRegex.test(text),
      requiresPsiGame: psiGameRegex.test(text),
    };
  }

  private testTraceScenarios(text: string): Trace | undefined {
    const traceRegex = /Trace\[(\d+)\]/i;

    if (traceRegex.test(text) !== null) {
      return {
        value: Number(traceRegex.test(text)),
        effect: undefined,
      };
    } else {
      return undefined;
    }
  }

  private testTagScenarios(text: string, trace = false) {
    const tagOnlyRegex = /^Give the Runner (\d+) tags?/i;
    const traceTagRegex = /^Trace\[\d+\]\.\s*If successful,\s*give the Runner (\d+) tags?/i;

    if (trace) {
      const traceTagMatch = text.match(traceTagRegex);
      return traceTagMatch ? Number(traceTagMatch[1].trim) : -1;
    } else {
      const tagOnlyMatch = text.match(tagOnlyRegex);
      return tagOnlyMatch ? Number(tagOnlyMatch[1]) : -1;
    }
  }

  private setBreakCosts(ice: ParsedIce[], breakers: ParsedBreaker[]) {
    const interaction: IceInteraction[] = [];

    breakers.forEach((breaker: ParsedBreaker) => {
      ice.forEach((ice: ParsedIce) => {
        interaction.push({
          breaker: breaker.name,
          ice: ice.name,
          costToBreak: this.getCostToFullBreak(breaker, ice),
          // smartBreakCost: this.getCostToSmartBreak(val, val2),
          canFullBreak: this.getCanFullBreak(breaker, ice),
        });
      });
    });

    this.datasource3.data = interaction;
  }

  private getCostToFullBreak(breaker: ParsedBreaker, ice: ParsedIce) {
    let costToBoost = 0;
    let costToBreak = 0;
    let currBreakerStr = breaker.baseStrength;
    let numBrokenSubs = 0;
    let i = 0;

    if (breaker.boostCost.credits.cost > 0) {
      while (currBreakerStr < ice.strength && i < 20) {
        costToBoost += breaker.boostCost.credits.cost;
        currBreakerStr += breaker.boostCost.credits.amount;
        console.log('ss', currBreakerStr);
        i += 1;
      }
    }

    if (i === 20) {
      //If backed out set to dumb small amount to flag
      costToBoost = -1000;
    }

    i = 0;

    if (breaker.interfaceCost.credits.cost > 0) {
      while (numBrokenSubs < ice.subroutines.length && i < 20) {
        costToBreak += breaker.interfaceCost.credits.cost;
        numBrokenSubs += breaker.interfaceCost.credits.subs;
        //Backout in case
        i += 1;
      }
    }

    if (i === 20) {
      //If backed out set to dumb small amount to flag
      costToBreak = -1000;
    }

    console.log('abc123', costToBoost, costToBreak, costToBoost + costToBreak);
    return costToBoost + costToBreak;
  }

  // private getCostToSmartBreak(breaker: ParsedBreaker, ice: ParsedIce) {
  //   return 0;
  // }

  private getCanFullBreak(breaker: ParsedBreaker, ice: ParsedIce) {
    return false;
  }
}
