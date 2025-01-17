import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Icon component for tab bar
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}> {/* Wrapper for the entire app */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
            height: 60,
            borderTopWidth: 0, 
            elevation: 0, 
            shadowOpacity: 0, 
          },
          headerShown: false,
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name="user"
                color={'#fff'}
                size={28}
                style={{ marginTop: 20 }} 
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="two"
          options={{
            title: 'Tab Two',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={'#fff'} />,
          }}
        />
        <Tabs.Screen
          name="schools"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name="plane"
                color={'#fff'}
                size={28}
                style={{ marginTop: 20 }} 
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, 
  },
});