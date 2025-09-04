type Session = { session: number; sets: (number | string)[] };
type Week = { week: number; sessions: Session[] };

export function generateProgram(maxPushups: number): Week[] {
  let level: number;

  if (maxPushups < 10) level = 1;
  else if (maxPushups < 20) level = 2;
  else if (maxPushups < 35) level = 3;
  else if (maxPushups < 50) level = 4;
  else level = 5;

  // table inspirée du programme 100 pushups
  const basePrograms: Record<number, (number | string)[][][]> = {
    1: [
      [
        [2, 3, 2, 2, 'max ≥ 3'],
        [3, 4, 2, 3, 'max ≥ 4'],
        [4, 5, 4, 4, 'max ≥ 5'],
      ],
      [
        [4, 6, 4, 4, 'max ≥ 6'],
        [5, 6, 4, 4, 'max ≥ 7'],
        [5, 7, 5, 5, 'max ≥ 8'],
      ],
    ],
    2: [
      [
        [6, 8, 6, 6, 'max ≥ 7'],
        [8, 10, 7, 7, 'max ≥ 9'],
        [9, 11, 8, 8, 'max ≥ 11'],
      ],
      [
        [10, 12, 9, 9, 'max ≥ 13'],
        [11, 13, 9, 9, 'max ≥ 15'],
        [12, 14, 10, 10, 'max ≥ 16'],
      ],
    ],
    3: [
      [
        [10, 12, 7, 7, 'max ≥ 9'],
        [10, 12, 8, 8, 'max ≥ 12'],
        [11, 15, 9, 9, 'max ≥ 13'],
      ],
      [
        [12, 17, 10, 10, 'max ≥ 15'],
        [14, 19, 12, 12, 'max ≥ 17'],
        [16, 21, 14, 14, 'max ≥ 20'],
      ],
    ],
    4: [
      [
        [14, 18, 14, 14, 'max ≥ 20'],
        [20, 25, 15, 15, 'max ≥ 25'],
        [20, 25, 20, 20, 'max ≥ 28'],
      ],
      [
        [22, 30, 20, 20, 'max ≥ 30'],
        [24, 32, 24, 24, 'max ≥ 34'],
        [26, 34, 26, 26, 'max ≥ 38'],
      ],
    ],
    5: [
      [
        [20, 25, 20, 20, 'max ≥ 30'],
        [25, 30, 25, 25, 'max ≥ 35'],
        [28, 35, 28, 28, 'max ≥ 40'],
      ],
      [
        [30, 38, 30, 30, 'max ≥ 42'],
        [34, 42, 34, 34, 'max ≥ 48'],
        [36, 45, 36, 36, 'max ≥ 50'],
      ],
    ],
  };

  const weeks: Week[] = [];

  basePrograms[level].forEach((week, wIndex) => {
    const sessions = week.map((sets, sIndex) => ({
      session: sIndex + 1,
      sets,
    }));
    weeks.push({ week: wIndex + 1, sessions });
  });

  return weeks;
}
