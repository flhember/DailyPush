export function findLevelIndex(maxPushUps: number) {
  if (maxPushUps == null) return undefined;
  if (maxPushUps <= 5) return 'under5';
  if (maxPushUps <= 10) return '6-10';
  if (maxPushUps <= 20) return '11-20';
  if (maxPushUps <= 25) return '21-25';
  if (maxPushUps <= 30) return '26-30';
  if (maxPushUps <= 35) return '31-35';
  if (maxPushUps <= 40) return '36-40';
  if (maxPushUps <= 45) return '41-45';
  if (maxPushUps <= 50) return '46-50';
  if (maxPushUps <= 55) return '51-55';
  if (maxPushUps <= 60) return '56-60';
  return 'over60';
}
