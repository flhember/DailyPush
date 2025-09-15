import AsyncStorage from '@react-native-async-storage/async-storage';
const RECOVERY_FLAG = '@app:recovery_session';

export const markRecoverySession = async () => {
  await AsyncStorage.setItem(RECOVERY_FLAG, '1');
};
export const clearRecoverySession = async () => {
  await AsyncStorage.removeItem(RECOVERY_FLAG);
};
export const isRecoverySession = async () => {
  return (await AsyncStorage.getItem(RECOVERY_FLAG)) === '1';
};
