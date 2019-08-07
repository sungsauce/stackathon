import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  View,
  Linking,
  Button
} from 'react-native'
import { getWiki, saveBookmark } from '../store/reducer'

class SingleResultScreen extends Component {
  componentDidMount() {
    const keyword = this.props.navigation.getParam('resultName', 'default')
    this.props.getWiki(keyword)
  }

  render() {
    const { navigation, wiki, image, save } = this.props
    const title = navigation.getParam('resultName', 'default')
    const parsedWiki = wiki.snippet.replace(/<[^>]*>/g, '')
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{title}</Text>
        <Text style={{ margin: 20, fontSize: 15, textAlign: 'center' }}>
          {parsedWiki}...
        </Text>
        <Text />
        <Button
          title="Continue reading on Wikipedia"
          onPress={() => {
            Linking.openURL(wiki.url)
          }}
        />
        <Button
          title="View more images on Google"
          onPress={() => {
            Linking.openURL(`https://www.google.com/search?tbm=isch&q=${title}`)
          }}
        />
        <Button
          title="Save To Bookmarks"
          onPress={() => save({ title: title, image: image, wiki: parsedWiki })}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  wiki: state.currentWiki,
  image: state.currentImage
})

const mapDispatchToProps = dispatch => ({
  getWiki: keyword => dispatch(getWiki(keyword)),
  save: bookmark => dispatch(saveBookmark(bookmark))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleResultScreen)
