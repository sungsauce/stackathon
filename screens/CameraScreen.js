import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Camera, Permissions, Icon } from 'expo'

export const photos = []

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    flashMode: Camera.Constants.FlashMode.auto
  }

  async snapPhoto () {
    console.log('button pressed')
    if (this.camera) {
      console.log('taking photo')
      const options = {quality: 1, base64: true, fixOrientation: true, exif: true}
      const photo = await this.camera.takePictureAsync(options)
      console.log('photo: ', photo)
      photos.push(photo)
    }
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  render() {
    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref
            }}
          >
            <View
              style={{
                flex: 9,
                backgroundColor: 'transparent'
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-start',
                  flexDirection: 'row'
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.flashMode === Camera.Constants.FlashMode.auto
                        ? Camera.Constants.FlashMode.on
                        : Camera.Constants.FlashMode.auto
                  })
                }}
              >
                <Icon.Ionicons
                  name="ios-flash"
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: 10,
                    marginLeft: 10
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 10,
                    marginLeft: 10,
                    color: 'white'
                  }}
                >
                  {' '}
                  Flash{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                backgroundColor: 'transparent',
                justifyContent: 'center'
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.2,
                  borderWidth: 'thick'
                }}
                onPress={this.snapPhoto.bind(this)}
              >
                <Icon.Ionicons
                  name="ios-radio-button-on"
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 80,
                    alignSelf: 'center'
                  }}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )
    }
  }
}
