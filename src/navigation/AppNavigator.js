import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import des écrans
import MainScreen from '../screens/MainScreen';
import SurahSelectionScreen from '../screens/SurahSelectionScreen';
import PageSelectionScreen from '../screens/PageSelectionScreen';
import DuaaScreen from '../screens/DuaaScreen';
import TestScreen from '../screens/TestScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#f8f6f0' },
        }}>
        
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={{ title: 'القائمة الرئيسية' }}
        />
        
        <Stack.Screen 
          name="SurahSelection" 
          component={SurahSelectionScreen}
          options={{ title: 'اختيار السورة' }}
        />
        
        <Stack.Screen 
          name="PageSelection" 
          component={PageSelectionScreen}
          options={{ title: 'اختيار الصفحات' }}
        />
        
        <Stack.Screen 
          name="Duaa" 
          component={DuaaScreen}
          options={{ title: 'دعاء' }}
        />
        
        <Stack.Screen 
          name="Test" 
          component={TestScreen}
          options={{ title: 'الاختبار' }}
        />
        
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen}
          options={{ title: 'النتائج' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;