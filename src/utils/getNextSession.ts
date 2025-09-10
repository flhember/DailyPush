import { PROGRAMS, ProgramSlug } from '@/src/utils/program100pushups';

type NextSessionInput = {
  currentLevel: ProgramSlug;
  currentDay: number;
  success: boolean;
};

export function getNextSession({ currentLevel, currentDay, success }: NextSessionInput): {
  level: ProgramSlug;
  day: number;
} {
  const currDef = PROGRAMS.find((p) => p.key === currentLevel);
  const currDays = currDef?.plans.map((p) => p.day) ?? [1, 2, 3, 4, 5, 6];

  const minDay = Math.min(...currDays);
  const maxDay = Math.max(...currDays);
  const day = Math.min(Math.max(currentDay, minDay), maxDay); // clamp

  // Échec → on refait le même jour
  if (!success) return { level: currentLevel, day };

  // Succès + pas dernier jour → jour suivant (même niveau)
  if (day < maxDay) return { level: currentLevel, day: day + 1 };

  // ✅ Succès sur le dernier jour → jour 1 du niveau d’après
  const idx = PROGRAMS.findIndex((p) => p.key === currentLevel);
  const nextIdx = Math.min(idx + 1, PROGRAMS.length - 1); // reste sur le dernier niveau si déjà au max
  const nextDef = PROGRAMS[nextIdx] ?? currDef!;
  const nextMinDay = Math.min(...nextDef.plans.map((p) => p.day));

  return { level: nextDef.key as ProgramSlug, day: nextMinDay };
}
