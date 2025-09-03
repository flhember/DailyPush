import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const index = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default index;
