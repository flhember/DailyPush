export type DayPlan = {
  day: 1 | 2 | 3 | 4 | 5 | 6;
  restSec: number;
  sets: (number | 'max')[];
  minLastSet: number;
  minRestAfterDays: number; // jours de repos mini après la séance
};

// < 5 pompes
export const pushupsUnder5: DayPlan[] = [
  { day: 1, restSec: 60, sets: [2, 3, 2, 2, 'max'], minLastSet: 3, minRestAfterDays: 1 },
  { day: 2, restSec: 90, sets: [3, 4, 2, 3, 'max'], minLastSet: 4, minRestAfterDays: 1 },
  { day: 3, restSec: 120, sets: [4, 5, 4, 4, 'max'], minLastSet: 5, minRestAfterDays: 2 },
  { day: 4, restSec: 60, sets: [5, 6, 4, 4, 'max'], minLastSet: 6, minRestAfterDays: 1 },
  { day: 5, restSec: 90, sets: [5, 6, 4, 4, 'max'], minLastSet: 7, minRestAfterDays: 1 },
  { day: 6, restSec: 120, sets: [5, 7, 5, 5, 'max'], minLastSet: 7, minRestAfterDays: 2 },
];

//6 -> 10
export const pushups6to10: DayPlan[] = [
  { day: 1, restSec: 60, sets: [5, 6, 4, 4, 'max'], minLastSet: 5, minRestAfterDays: 1 },
  { day: 2, restSec: 90, sets: [6, 7, 6, 6, 'max'], minLastSet: 7, minRestAfterDays: 1 },
  { day: 3, restSec: 120, sets: [8, 10, 7, 7, 'max'], minLastSet: 10, minRestAfterDays: 2 },
  { day: 4, restSec: 60, sets: [9, 11, 8, 8, 'max'], minLastSet: 11, minRestAfterDays: 1 },
  { day: 5, restSec: 90, sets: [10, 12, 9, 9, 'max'], minLastSet: 13, minRestAfterDays: 1 },
  { day: 6, restSec: 120, sets: [12, 13, 10, 10, 'max'], minLastSet: 15, minRestAfterDays: 2 },
];

// 11–20 pompes
export const pushups11to20: DayPlan[] = [
  { day: 1, restSec: 60, sets: [8, 9, 7, 7, 'max'], minLastSet: 8, minRestAfterDays: 1 },
  { day: 2, restSec: 90, sets: [9, 10, 8, 8, 'max'], minLastSet: 10, minRestAfterDays: 1 },
  { day: 3, restSec: 120, sets: [11, 13, 9, 9, 'max'], minLastSet: 13, minRestAfterDays: 2 },
  { day: 4, restSec: 60, sets: [12, 14, 10, 10, 'max'], minLastSet: 15, minRestAfterDays: 1 },
  { day: 5, restSec: 90, sets: [13, 15, 11, 11, 'max'], minLastSet: 17, minRestAfterDays: 1 },
  { day: 6, restSec: 120, sets: [14, 16, 13, 13, 'max'], minLastSet: 19, minRestAfterDays: 2 },
];

// 21–25 pompes
export const pushups21to25: DayPlan[] = [
  { day: 1, restSec: 60, sets: [12, 17, 13, 13, 'max'], minLastSet: 17, minRestAfterDays: 1 },
  { day: 2, restSec: 90, sets: [14, 19, 14, 14, 'max'], minLastSet: 19, minRestAfterDays: 1 },
  { day: 3, restSec: 120, sets: [16, 21, 15, 15, 'max'], minLastSet: 21, minRestAfterDays: 2 },
  { day: 4, restSec: 60, sets: [18, 22, 16, 16, 'max'], minLastSet: 21, minRestAfterDays: 1 },
  { day: 5, restSec: 90, sets: [20, 25, 20, 20, 'max'], minLastSet: 23, minRestAfterDays: 1 },
  { day: 6, restSec: 120, sets: [23, 28, 22, 22, 'max'], minLastSet: 25, minRestAfterDays: 2 },
];

// 26–30 pompes
export const pushups26to30: DayPlan[] = [
  { day: 1, restSec: 60, sets: [14, 18, 14, 14, 'max'], minLastSet: 20, minRestAfterDays: 1 },
  { day: 2, restSec: 90, sets: [20, 25, 15, 15, 'max'], minLastSet: 23, minRestAfterDays: 1 },
  { day: 3, restSec: 120, sets: [20, 27, 18, 18, 'max'], minLastSet: 25, minRestAfterDays: 2 },
  { day: 4, restSec: 60, sets: [21, 25, 21, 21, 'max'], minLastSet: 27, minRestAfterDays: 1 },
  { day: 5, restSec: 90, sets: [25, 29, 25, 25, 'max'], minLastSet: 30, minRestAfterDays: 1 },
  { day: 6, restSec: 120, sets: [29, 33, 29, 29, 'max'], minLastSet: 33, minRestAfterDays: 2 },
];

// 31–35 pompes (3 jours)
export const pushups31to35: DayPlan[] = [
  { day: 1, restSec: 60, sets: [17, 19, 15, 15, 'max'], minLastSet: 20, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [10, 10, 13, 13, 10, 10, 9, 'max'],
    minLastSet: 25,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [13, 13, 15, 15, 12, 12, 10, 'max'],
    minLastSet: 30,
    minRestAfterDays: 2,
  },
];

// 36–40 pompes (3 jours)
export const pushups36to40: DayPlan[] = [
  { day: 1, restSec: 60, sets: [22, 24, 20, 20, 'max'], minLastSet: 25, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [15, 15, 18, 18, 15, 15, 14, 'max'],
    minLastSet: 30,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [18, 18, 20, 20, 17, 17, 15, 'max'],
    minLastSet: 35,
    minRestAfterDays: 2,
  },
];

// 41–45 pompes (3 jours)
export const pushups41to45: DayPlan[] = [
  { day: 1, restSec: 60, sets: [27, 29, 25, 25, 'max'], minLastSet: 35, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [19, 19, 22, 22, 18, 18, 22, 'max'],
    minLastSet: 35,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [20, 20, 24, 24, 20, 20, 22, 'max'],
    minLastSet: 40,
    minRestAfterDays: 2,
  },
];

// 46–50 pompes (3 jours)
export const pushups46to50: DayPlan[] = [
  { day: 1, restSec: 60, sets: [30, 34, 30, 30, 'max'], minLastSet: 40, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [19, 19, 23, 23, 19, 19, 22, 'max'],
    minLastSet: 37,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [20, 20, 27, 27, 21, 21, 21, 'max'],
    minLastSet: 44,
    minRestAfterDays: 2,
  },
];

// 51–55 pompes (3 jours, 9 séries J2/J3)
export const pushups51to55: DayPlan[] = [
  { day: 1, restSec: 60, sets: [30, 39, 35, 35, 'max'], minLastSet: 42, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [20, 20, 23, 23, 20, 20, 18, 18, 'max'],
    minLastSet: 53,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [22, 22, 30, 30, 25, 25, 18, 18, 'max'],
    minLastSet: 55,
    minRestAfterDays: 2,
  },
];

// 56–60 pompes (3 jours, 9 séries J2/J3)
export const pushups56to60: DayPlan[] = [
  { day: 1, restSec: 60, sets: [30, 44, 40, 40, 'max'], minLastSet: 55, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [22, 22, 27, 27, 24, 23, 18, 18, 'max'],
    minLastSet: 58,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [26, 26, 33, 33, 26, 26, 22, 22, 'max'],
    minLastSet: 60,
    minRestAfterDays: 2,
  },
];

// > 60 pompes (3 jours, 9 séries J2/J3)
export const pushupsOver60: DayPlan[] = [
  { day: 1, restSec: 60, sets: [35, 49, 45, 45, 'max'], minLastSet: 55, minRestAfterDays: 1 },
  {
    day: 2,
    restSec: 45,
    sets: [22, 22, 30, 30, 24, 24, 18, 18, 'max'],
    minLastSet: 59,
    minRestAfterDays: 1,
  },
  {
    day: 3,
    restSec: 45,
    sets: [28, 28, 35, 35, 27, 27, 23, 23, 'max'],
    minLastSet: 60,
    minRestAfterDays: 2,
  },
];
