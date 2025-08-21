import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import GetStarted from '@/components/custom/GetStarted';

export default function GetStartedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1">
        <GetStarted />
      </View>
    </SafeAreaView>
  );
}



