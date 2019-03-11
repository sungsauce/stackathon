import axios from 'axios'

const CLEAR_IMAGE = 'CLEAR_IMAGE'
const UPDATE_CURRENT_IMAGE = 'UPDATE_CURRENT_IMAGE'
const GOT_WIKI = 'GOT_WIKI'
const SAVE_BOOKMARK = 'SAVE_BOOKMARK'

export const clearImage = () => ({
  type: CLEAR_IMAGE
})

export const updateCurrentImage = (uri) => ({
  type: UPDATE_CURRENT_IMAGE,
  uri
})

const gotWiki = (wiki, wikiUrl) => ({
  type: GOT_WIKI,
  wiki: {...wiki, url: wikiUrl}
})

export const getWiki = (keyword) => async dispatch => {
  const uri = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&prop=extracts&explaintext&utf8=&format=json`
  const { data: results } = await axios.get(uri)
  const result = results.query.search[0]
  const { data: urlResult } = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${result.pageid}&inprop=url&format=json`)
  const resultUrl = urlResult.query.pages[result.pageid].fullurl
  dispatch(gotWiki(result, resultUrl))
}

export const saveBookmark = (bookmark) => ({
  type: SAVE_BOOKMARK,
  bookmark
})

const initialState = {
  currentImage: '',
  currentWiki: {snippet: '', url: ''},
  bookmarks: [],
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case CLEAR_IMAGE:
      return {...state, currentImage: initialState.currentImage}
    case UPDATE_CURRENT_IMAGE:
      return {...state, currentImage: action.uri}
    case GOT_WIKI:
      return {...state, currentWiki: action.wiki}
    case SAVE_BOOKMARK:
      return {...state, bookmarks: [...state.bookmarks, action.bookmark]}
    default:
      return state
  }
}
