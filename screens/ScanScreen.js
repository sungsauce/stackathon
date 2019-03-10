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

    let imageView = null
    if (imageUri) {
      imageView = (
        <Image style={{ width: 300, height: 300, flex: 1}} source={{ uri: imageUri }} />
      )
    }

    let labelView = null
    if (status) {
      labelView = (
        <View style={{flex: 1}}>
          <Text style={styles.status}>{status}</Text>
          {results && (
            <FlatList
              data={results}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              contentContainerStyle={{width: 300}}
            />
          )}
        </View>
      )
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />
        <Button onPress={this._takePhoto} title="Take a photo" />
        {imageView}
        {labelView}
        {this._maybeRenderLoadingOverlay()}
        <StatusBar barStyle="default" />
      </View>
    )
  }

  _renderItem = ({ item }) => {
    return <Text style={styles.labelResults}>{item.description}</Text>
  }

  _keyExtractor = item => item.mid

  _maybeRenderLoadingOverlay = () => {
    if (this.state.status === 'Loading...') {
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
      const unwantedLabels = [
        'Dish',
        'Food',
        'Cuisine',
        'Ingredient',
        'Produce',
        'Recipe',
        'Meat',
        'Vegetable',
        'Side Dish',
        'Brunch',
        'Breakfast',
        'Lunch',
        'Dinner',
        'Dessert'
      ]
      const { responses } = await response.json()
      const filtered = responses[0].labelAnnotations.filter(
        label => !unwantedLabels.includes(label.description)
      )
      this.setState({
        status: 'Results:',
        results: filtered
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
