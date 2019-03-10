import React from 'react'
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native'
import { Constants, ImagePicker, Permissions } from 'expo'
import uuid from 'uuid'
import Environment from '../config/environment'
import firebase from '../config/firebase'

console.disableYellowBox = true

export default class ScanScreen extends React.Component {
  state = {
    imageUri: null,
    imageBase64: null,
    status: null,
    results: null
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL)
    await Permissions.askAsync(Permissions.CAMERA)
  }

  render() {
    let { imageUri, status, results } = this.state

    // console.log("RESULTS: ", results)

    let imageView = null
    if (imageUri) {
      imageView = (
        <Image style={{ width: 300, height: 300 }} source={{ uri: imageUri }} />
      )
    }

    let labelView = null
    if (status) {
      labelView = (
        <View>
          <Text style={styles.status}>{status}</Text>
          {/* <Text style={styles.labelResults}>{results}</Text> */}
          {results && (
            <FlatList
              data={results}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          )}
        </View>
      )
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {imageView}
        {labelView}
        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />
        <Button onPress={this._takePhoto} title="Take a photo" />

        {/* {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()} */}

        {/* <StatusBar barStyle="default" /> */}
      </View>
    )
  }

  _renderItem = ({ item }) => {
    // console.log("Item: ", item)
    return (
      <Text style={styles.labelResults}>{item.description}</Text>
    )
  }

  _keyExtractor = (item) => item.mid

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )
    }
  }

  _maybeRenderImage = () => {
    let { image } = this.state
    if (!image) {
      return
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden'
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {image}
        </Text>
      </View>
    )
  }

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image
    })
  }

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image)
    alert('Copied image URL to clipboard')
  }

  _takePhoto = async () => {
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true
    })
    if (!cancelled) {
      this.setState({
        imageUri: uri,
        imageBase64: base64,
        status: 'Loading...'
      })
      this._handleImagePicked(base64)
    }
  }

  _pickImage = async () => {
    const {
      cancelled,
      uri,
      base64
    } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true
    })
    if (!cancelled) {
      this.setState({
        imageUri: uri,
        imageBase64: base64,
        status: 'Loading...'
      })
      this._handleImagePicked(base64)
    }
  }

  _handleImagePicked = async base64 => {
    try {
      const body = {
        requests: [
          {
            image: { content: base64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'WEB_DETECTION', maxResults: 5 }
            ]
          }
        ]
      }

      const key = Environment.GOOGLE_CLOUD_VISION_API_KEY
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )
      const parsed = await response.json()

      console.log('parsed response: ', parsed)

      this.setState({
        status: 'Results:',
        results: parsed.responses[0].labelAnnotations.reverse()
      })
    } catch (e) {
      console.log(e)
      alert('Oh noes! Something went wrong. Try again.')
    }
  }
}

const styles = StyleSheet.create({
  labelResults: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    margin: 5
  },
  status: {
    fontSize: 17,
    color: 'rgba(0,0,0, 1)',
    lineHeight: 24,
    textAlign: 'center',
    margin: 5
  }
})
