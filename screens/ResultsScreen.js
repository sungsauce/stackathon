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
import { connect } from 'react-redux'
import { Icon } from 'expo'
import { clearImage } from '../store/reducer'

export function ResultsScreen({
  results,
  imageUri,
  keyExtractor,
  renderItem,
  startOver
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {results && (
        <View style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => startOver()}>
            <Icon.Ionicons
              name={Platform.OS === 'ios' ? 'ios-undo' : 'md-undo'}
              style={styles.startOver}
            />
            <Text style={styles.startOver}> Start Over </Text>
          </TouchableOpacity>
        </View>
      )}
      <Image
        style={{ width: 300, height: 300, marginTop: 30, marginBottom: 30 }}
        source={{ uri: imageUri }}
      />
      {results && (
        <FlatList
          data={results}
          extraData={results}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ width: 300 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  startOver: {
    color: 'black',
    fontSize: 17,
    marginTop: 10,
    marginLeft: 10
  }
})

// const mapStateToProps = state => ({

// })

const mapDispatchToProps = dispatch => ({
  startOver: () => dispatch(clearImage())
})

export default connect(null, mapDispatchToProps)(ResultsScreen)
