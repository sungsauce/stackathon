import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet
} from 'react-native'

class BookmarksScreen extends Component {
  keyExtractor = item => item.title

  renderItem = ({ item }) => (
    <View style={styles.card}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={styles.name}>{item.title}</Text>
        <Image
          style={{
            width: 100,
            height: 100,
            margin: 10
          }}
          source={{ uri: item.image }}
        />
      </View>
      <Text style={styles.description}>{item.wiki}...</Text>
    </View>
  )

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.heading}>Bookmarks</Text>
        <FlatList
          data={this.props.bookmarks}
          extraData={this.props.bookmarks}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          contentContainerStyle={{ width: 300 }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  bookmarks: state.bookmarks
})

export default connect(
  mapStateToProps,
  null
)(BookmarksScreen)

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15
  },
  card: {
    width: 300,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    padding: 10,
    margin: 15
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  description: {
    flex: 1
  }
})
