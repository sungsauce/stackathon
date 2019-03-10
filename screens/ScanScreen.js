import React from 'react'
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { ImagePicker, Permissions } from 'expo'
import Environment from '../config/environment'
import ResultsScreen from './ResultsScreen'
import { updateCurrentImage } from '../store/reducer'

console.disableYellowBox = true

export class ScanScreen extends React.Component {
  state = {
    // imageUri: null,
    status: null,
    results: null
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL)
    await Permissions.askAsync(Permissions.CAMERA)
  }

  render() {
    let { currentImage } = this.props

    return (
      <View style={{ flex: 1 }}>
        {currentImage ? (
          <ResultsScreen
            {...this.state}
            imageUri={currentImage}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Button onPress={this._takePhoto} title="Take a photo" />
            <Button onPress={this._pickImage} title="Pick an image from camera roll" />
          </View>
        )}
        {this._maybeRenderLoadingOverlay()}
        <StatusBar barStyle="default" />
      </View>
    )
  }

  _renderItem = ({ item }) => (
    <Text style={styles.labelResults}>{item.description}</Text>
  )

  _keyExtractor = item => item.mid

  _maybeRenderLoadingOverlay = () => {
    if (this.state.status === 'Analyzing...') {
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
          <Text style={styles.status}>{this.state.status}</Text>
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
      this.props.updateCurrentImage(uri)
      this.setState({
        // imageUri: uri,
        status: 'Analyzing...'
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
      this.props.updateCurrentImage(uri)
      this.setState({
        // imageUri: uri,
        status: 'Analyzing...'
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
        status: 'Retrieved',
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
    color: 'rgba(255,255,255, 1)',
    lineHeight: 24,
    textAlign: 'center'
  }
})

const mapStateToProps = state => ({
  currentImage: state.currentImage
})

const mapDispatchToProps = dispatch => ({
  updateCurrentImage: (uri) => dispatch(updateCurrentImage(uri))
})

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen)