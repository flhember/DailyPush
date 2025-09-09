export function findLevelIndex(maxPushUps: number) {
  if (maxPushUps == null) return undefined;
  if (maxPushUps <= 5) return 'u5';
  if (maxPushUps <= 10) return '6_10';
  if (maxPushUps <= 20) return '11_20';
  if (maxPushUps <= 25) return '21_25';
  if (maxPushUps <= 30) return '26_30';
  if (maxPushUps <= 35) return '31_35';
  if (maxPushUps <= 40) return '36_40';
  if (maxPushUps <= 45) return '41_45';
  if (maxPushUps <= 50) return '46_50';
  if (maxPushUps <= 55) return '51_55';
  if (maxPushUps <= 60) return '56_60';
  return 'o60';
}
