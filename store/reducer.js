const CLEAR_IMAGE = 'CLEAR_IMAGE'
const UPDATE_CURRENT_IMAGE = 'UPDATE_CURRENT_IMAGE'

export const clearImage = () => ({
  type: CLEAR_IMAGE
})

export const updateCurrentImage = (uri) => ({
  type: UPDATE_CURRENT_IMAGE,
  uri
})

const initialState = {
  currentImage: '',
  images: []
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case CLEAR_IMAGE:
      return {...state, currentImage: initialState.currentImage}
    case UPDATE_CURRENT_IMAGE:
      return {...state, currentImage: action.uri}
    default:
      return state
  }
}
