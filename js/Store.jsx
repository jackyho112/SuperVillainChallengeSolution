const redux = require('redux')
const reactRedux = require('react-redux')

const initialState = {
  levels: {
    1: []
  },

  villainElements: [],

  levelColors: {},

  svgHeight: '0'
}

const SET_BOSSES = 'setBosses'
const SET_SUBORDINATES = 'setSubordinates'
const UPDATE_VILLAIN_DRILLED_STATUS = 'updateVillainDrilledStatus'
const UPDATE_SVG_HEIGHT = 'updateSvgHeight'
const ADD_VILLAIN_ELEMENT = 'addVillainElement'
const SET_ALL_LEVELS = 'setAllLevels'
const SET_LEVEL_COLOR = 'setLevelColor'
const CLEAR_LEVELS = 'clearLevels'

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOSSES:
      return reduceBosses(state, action)
    case SET_SUBORDINATES:
      return reduceSubordinates(state, action)
    case UPDATE_VILLAIN_DRILLED_STATUS:
      return reduceVillainDrilledStatus(state, action)
    case UPDATE_SVG_HEIGHT:
      return reduceSvgHeight(state, action)
    case ADD_VILLAIN_ELEMENT:
      return reduceVillainElement(state, action)
    case SET_ALL_LEVELS:
      return reduceLevels(state, action)
    case SET_LEVEL_COLOR:
      return reduceLevelColor(state, action)
    case CLEAR_LEVELS:
      return reduceInitialState(state)
    default:
      return state
  }
}

const reduceBosses = (state, action) => {
  const newState = {}

  Object.assign(newState, state, {
    levels: { 1: action.value }
  })

  return newState
}

const reduceSubordinates = (state, action) => {
  const newState = {}

  const value = action.value

  const existingSubordinates = state.levels[value.level] || []

  const newLevels = Object.assign({}, state.levels)

  newLevels[value.level] = [...existingSubordinates, ...value.subordinates]

  Object.assign(newState, state, {levels: newLevels})

  return newState
}

const reduceVillainDrilledStatus = (state, action) => {
  const newState = {}

  const newVillains = state.levels[action.value.level].map(function (villain) {
    if (villain.id === action.value.villainId) {
      villain = Object.assign({}, villain, {drilled: true})
    }

    return villain
  })

  const newLevels = Object.assign({}, state.levels)

  newLevels[action.value.level] = newVillains

  Object.assign(newState, state, {levels: newLevels})

  return newState
}

const reduceSvgHeight = (state, action) => {
  const newState = {}

  Object.assign(newState, state, {svgHeight: action.value})

  return newState
}

const reduceVillainElement = (state, action) => {
  const newState = {}

  const newVillainElements = [...state.villainElements, action.value]

  Object.assign(newState, state, {villainElements: newVillainElements})

  return newState
}

const reduceLevels = (state, action) => {
  const newState = {}

  const newLevels = {}

  Object.keys(action.value).map((levelNum) => {
    newLevels[levelNum] = [...action.value[levelNum]]
  })

  Object.assign(newState, state, {levels: newLevels})

  return newState
}

const reduceLevelColor = (state, action) => {
  const newState = {}

  const newLevelColor = {}

  newLevelColor[action.value.levelNum] = action.value.color

  const newLevelColors = Object.assign({}, state.levelColors, newLevelColor)

  Object.assign(newState, state, {levelColors: newLevelColors})

  return newState
}

const reduceInitialState = (state) => {
  const newState = {}

  Object.assign(newState, state, initialState)

  return newState
}

const store = redux.createStore(
  rootReducer,
  initialState,
  redux.compose(
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f
  )
)

const mapStateToProps = (state) => {
  return {
    levels: state.levels,
    levelColors: state.levelColors,
    svgHeight: state.svgHeight,
    villainElements: state.villainElements
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBosses (bosses) {
      dispatch({ type: SET_BOSSES, value: bosses })
    },

    setSubordinates (subordinates, level) {
      dispatch({type: SET_SUBORDINATES, value: {
        subordinates,
        level
      }})
    },

    updateVillainDrilledStatus (level, villainId) {
      dispatch({type: UPDATE_VILLAIN_DRILLED_STATUS, value: {
        level,
        villainId
      }})
    },

    updateSvgHeight (height) {
      dispatch({type: UPDATE_SVG_HEIGHT, value: height})
    },

    addVillainElement (element) {
      dispatch({type: ADD_VILLAIN_ELEMENT, value: element})
    },

    setAllLevels (levels) {
      dispatch({type: SET_ALL_LEVELS, value: levels})
    },

    setLevelColor (levelNum, color) {
      dispatch({type: SET_LEVEL_COLOR, value: {
        levelNum,
        color
      }})
    },

    clearLevels () {
      dispatch({type: CLEAR_LEVELS})
    }
  }
}

const connector = reactRedux.connect(mapStateToProps, mapDispatchToProps)

module.exports = { connector, store, rootReducer, initialState }
