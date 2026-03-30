import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BreakerInterfaceUtil {
  getCreditInterfaceValues(text: string) {
    const costMatch =
      text.match(
        /Interface\s*→\s*(?:<strong>)?(?:(\d+|X)\[credit\]|\[trash\])\:(?:<\/strong>)?/i,
      ) || text.match(/(?:<strong>)?(?:(\d+|X)\[credit\]|\[trash\])\:(?:<\/strong>)?/i);

    if (!costMatch) return null;

    const rawCost = costMatch[0].toLowerCase();

    const cost = rawCost.includes('[trash]') ? 0 : costMatch[1] === 'X' ? -2 : Number(costMatch[1]);

    const afterCost = text.slice(costMatch.index);

    const breakPatterns = [
      /Break\s+all\s+subroutines?/i,
      /Break(?:\s+up\s+to)?\s*(any number|\d+|X)\s*(?:of\s+)?(?:<strong>[^<]+<\/strong>\s*)+subroutines?/i,
      /Break(?:\s+up\s+to)?\s*(any number|\d+|X)\s*(?:<strong>[^<]+<\/strong>\s*(?:or|and)\s*)+<strong>[^<]+<\/strong>\s*subroutines?/i,
      /Break(?:\s+up\s+to)?\s*(any number|\d+|X)\s*<strong>[^<]+<\/strong>\s*(?:or|and)\s*(?:any number|\d+|X)\s*<strong>[^<]+<\/strong>\s*subroutines?/i,
      /Break(?:\s+up\s+to)?\s*(any number|all|\d+|X)\s*subroutines?/i,
      /\+[X\d]+\s*strength\.[\s\S]*?break(?:\s+up\s+to)?\s*(any number|all|\d+|X)\s*subroutines?/i,
    ];

    let rawBreak: string | null = null;

    for (const pattern of breakPatterns) {
      const match = afterCost.match(pattern);
      if (match) {
        rawBreak = match[1] ?? 'all';
        break;
      }
    }

    if (!rawBreak) return null;

    const normalizedBreak = rawBreak.toLowerCase();

    const breakCount =
      normalizedBreak === 'any number' || normalizedBreak === 'all'
        ? 100
        : rawBreak === 'X'
          ? -2
          : Number(rawBreak);

    return [cost, breakCount];
  }

  getVirusCounterInterface(text: string) {
    const match = text.match(
      /Interface\s*→\s*(?:<strong>)?(?:(Any|Hosted)\s+((?:\d+\s+)?)virus\s+counters?|((?:\d+\s+)?)hosted\s+virus\s+counters?):(?:<\/strong>)?\s*Break(?:\s+up\s+to)?\s*(?:(\d+|X|any number)\s*)?(?:of\s+)?(?:<strong>[^<]+<\/strong>\s*(?:or|and)\s*)*(?:<strong>[^<]+<\/strong>\s*)?subroutines?/i,
    );

    if (!match) return null;

    const rawCost = match[2]?.trim() || match[3]?.trim() || (match[1] ? '1' : null);

    const rawBreak = match[4] || '1';

    const cost = rawCost?.toLowerCase?.() === 'any' ? 1 : rawCost === 'X' ? -2 : Number(rawCost);

    const breakCount =
      rawBreak.toLowerCase?.() === 'any number' ? 100 : rawBreak === 'X' ? -2 : Number(rawBreak);

    return [cost, breakCount];
  }

  getPowerCounterValues(text: string) {
    const match =
      text.match(
        /Interface\s*→\s*(?:<strong>)?(?:(a|\d+)\s+)?hosted\s+power\s+counters?:(?:<\/strong>)?\s*Break(?:\s+up\s+to)?\s*(\d+|X|any number)\s*(?:of\s+)?(?:<strong>[^<]+<\/strong>\s*)*subroutines?/i,
      ) ||
      text.match(
        /Interface\s*→\s*(?:<strong>)?Hosted\s+(?:(a|\d+)\s+)?power\s+counters?:(?:<\/strong>)?\s*Break(?:\s+up\s+to)?\s*(\d+|X|any number)\s*(?:of\s+)?(?:<strong>[^<]+<\/strong>\s*)*subroutines?/i,
      );

    if (!match) return null;

    const cost = !match[1] || match[1].toLowerCase?.() === 'a' ? 1 : Number(match[1]);

    const breakCount =
      match[2].toLowerCase?.() === 'any number' ? 100 : match[2] === 'X' ? -2 : Number(match[2]);

    return [cost, breakCount];
  }

  getCardTrashInterface(text: string) {
    const match = text.match(
      /Interface\s*→\s*(?:<strong>)?Trash\s+(?:(a|\d+)\s+)?cards?\s+from\s+your\s+grip:(?:<\/strong>)?\s*Break(?:\s+up\s+to)?\s*(\d+|X|any number)\s*(?:of\s+)?(?:<strong>[^<]+<\/strong>\s*)*subroutines?/i,
    );

    if (!match) return null;

    const cost = !match[1] || match[1].toLowerCase() === 'a' ? 1 : Number(match[1]);

    const breakCount =
      match[2].toLowerCase() === 'any number' ? 100 : match[2] === 'X' ? -2 : Number(match[2]);

    return [cost, breakCount];
  }
}
