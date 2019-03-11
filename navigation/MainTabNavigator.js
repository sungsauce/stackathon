import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import ScanScreen from '../screens/ScanScreen'
import BookmarksScreen from '../screens/BookmarksScreen'
import ResultsScreen from '../screens/ResultsScreen'
import SingleResultScreen from '../screens/SingleResultScreen'

const HomeStack = createStackNavigator({
  Home: ScanScreen,
  Results: ResultsScreen,
  SingleResult: SingleResultScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-home` : 'md-home'}
    />
  ),
};

const BookmarksStack = createStackNavigator({
  Bookmarks: BookmarksScreen,
});

BookmarksStack.navigationOptions = {
  tabBarLabel: 'Bookmarks',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  BookmarksStack,
});
