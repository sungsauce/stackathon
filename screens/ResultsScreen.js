import React from 'react'
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  Button
} from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'expo'
import { clearImage } from '../store/reducer'
import { withNavigation } from 'react-navigation'

export function ResultsScreen({
  results,
  imageUri,
  keyExtractor,
  renderItem,
  startOver,
  status
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {results && (
        <View style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => startOver()}
          >
            <Icon.Ionicons
              name={Platform.OS === 'ios' ? 'ios-undo' : 'md-undo'}
              style={styles.startOver}
            />
            <Text style={styles.startOver}> Start Over </Text>
          </TouchableOpacity>
        </View>
      )}
      <Image
        style={{
          width: Dimensions.get('window').width,
          height: 250,
          marginTop: 10,
          marginBottom: 30
        }}
        source={{ uri: imageUri }}
      />
      {status !== 'Analyzing...' ? (
        results && results.length ? (
          <FlatList
            data={results}
            extraData={results}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{ width: 300 }}
          />
        ) : (
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
            No results found :(
          </Text>
        )
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  startOver: {
    color: 'black',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10
  }
})

// const mapStateToProps = state => ({

// })

const mapDispatchToProps = dispatch => ({
  startOver: () => dispatch(clearImage())
})

export default withNavigation(
  connect(
    null,
    mapDispatchToProps
  )(ResultsScreen)
)
