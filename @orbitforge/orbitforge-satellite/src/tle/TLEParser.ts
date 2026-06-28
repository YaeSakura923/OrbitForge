export interface TLEEntry {
  name: string;
  noradId: number;
  epochYear: number;
  epochDay: number;
  inclination: number;
  raan: number;
  eccentricity: number;
  argPerigee: number;
  meanAnomaly: number;
  meanMotion: number;
  bstar: number;
  classification: string;
  launchYear: string;
  launchNumber: string;
  launchPiece: string;
  elementNumber: number;
  revolutionNumber: number;
}

export class TLEParser {
  static parse(tleString: string): TLEEntry[] {
    const lines = tleString.trim().split('\n');
    const entries: TLEEntry[] = [];

    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.startsWith('1 ')) {
        i++;
        continue;
      }

      if (line.startsWith('2 ')) {
        const line1 = lines[i - 1]?.trim() || '';
        const name = lines[i - 2]?.trim() || 'Unknown';

        if (line1.startsWith('1 ')) {
          entries.push(this.parseTLESet(name, line1, line));
        }
        i++;
      } else {
        i++;
      }
    }

    return entries;
  }

  static parseSingle(name: string, line1: string, line2: string): TLEEntry {
    return this.parseTLESet(name, line1, line2);
  }

  private static parseTLESet(name: string, line1: string, line2: string): TLEEntry {
    return {
      name: name.replace(/^\d+\s+/, '').trim(),
      noradId: parseInt(line2.substring(2, 7).trim(), 10),
      epochYear: parseInt(line1.substring(18, 20), 10),
      epochDay: parseFloat(line1.substring(20, 32)),
      inclination: parseFloat(line2.substring(8, 16)),
      raan: parseFloat(line2.substring(17, 25)),
      eccentricity: parseFloat('0.' + line2.substring(26, 33)),
      argPerigee: parseFloat(line2.substring(34, 42)),
      meanAnomaly: parseFloat(line2.substring(43, 51)),
      meanMotion: parseFloat(line2.substring(52, 63)),
      bstar: this.parseBStar(line1.substring(53, 61)),
      classification: line1.substring(7, 8),
      launchYear: line1.substring(9, 11),
      launchNumber: line1.substring(11, 14),
      launchPiece: line1.substring(14, 17),
      elementNumber: parseInt(line1.substring(64, 68), 10),
      revolutionNumber: parseInt(line2.substring(63, 68), 10),
    };
  }

  private static parseBStar(bstarStr: string): number {
    if (!bstarStr || bstarStr.trim().length === 0) return 0;
    const trimmed = bstarStr.trim();
    const sign = trimmed.startsWith('-') ? -1 : 1;
    const cleanNum = trimmed.replace(/[+-]/g, '');

    if (cleanNum.length === 0) return 0;

    const decimal = cleanNum.includes('.')
      ? parseFloat(cleanNum)
      : parseFloat(cleanNum.substring(0, 5) + '.' + cleanNum.substring(5));

    const lastChar = trimmed[trimmed.length - 1];
    let exp = 0;
    if (lastChar.match(/[0-9]/)) {
      if (cleanNum.includes('-')) {
        const parts = cleanNum.split('-');
        if (parts.length > 1) exp = -parseInt(parts[parts.length - 1], 10);
      }
    } else {
      exp = parseInt(lastChar, 10);
      if (!isNaN(exp)) exp = -exp;
    }

    return sign * decimal * Math.pow(10, exp);
  }
}
