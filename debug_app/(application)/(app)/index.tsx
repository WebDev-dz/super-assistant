import React, {  } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// imports

export default function HomeScreen() {
 
  const isDark = false

  // business logic

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1 bg-red ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      // content
    </SafeAreaView>
  );
}