import React from 'react'
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet
} from 'react-native'

export default function SingleResultScreen ({navigation}) {
  return (<View><Text>Single Result: {navigation.getParam('resultName', 'default')}</Text></View>)
}
