// app/(tabs)/_layout.tsx
import { Monicon } from '@monicon/native';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#29195cff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Monicon name="mdi:home-outline" size={28} color={focused ? '#29195cff' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ focused }) => (
            <Monicon name="mdi:refresh" size={28} color={focused ? '#29195cff' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="customer-service"
        options={{
          title: 'Customer Service',
          tabBarIcon: ({ focused }) => (
            <Monicon name="mdi:help-circle-outline" size={28} color={focused ? '#29195cff' : 'gray'} />
          ),
        }}
      />
    </Tabs>
  );
}