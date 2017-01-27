/* eslint-env mocha */

const React = require('react')
const { expect } = require('chai')
const { store, rootReducer, initialState } = require('../js/Store')

describe('Store', () => {
  it('should handle setBosses actions', () => {
    const bosses = [
      {id: 0, name: 'Club'},
      {id: 1, name: 'Cell Phone'}
    ]

    const state = rootReducer(
      {levels: {1: []}},
      { type: 'setBosses', value: bosses }
    )

    expect(state).to.deep.equal({levels: {1: bosses}})
  })

  it('should handle setSubordinates actions', () => {
    const newSubordinates = [
      {id: 5, name: 'Cellphone'},
      {id: 10, name: 'Computer'}
    ]

    const oldSubordinates = [
      {id: 7, name: 'Apple'},
      {id: 14, name: 'Book'}
    ]

    const stateWithNoVillain = rootReducer(
      {levels: {}},
      {
        type: 'setSubordinates',
        value: {subordinates: newSubordinates,level: 2}
      }
    )

    const stateWithExistingVillain = rootReducer(
      {levels: {2: oldSubordinates}},
      {
        type: 'setSubordinates',
        value: {subordinates: newSubordinates,level: 2}
      }
    )

    expect(stateWithNoVillain).to.deep.equal(
      {levels: {2: newSubordinates}}
    )

    expect(stateWithExistingVillain).to.deep.equal(
      {levels: {2: [...oldSubordinates, ...newSubordinates]}}
    )
  })

  it('should handle updateVillainDrilledStatus actions', () => {
    const state = rootReducer(
      {levels: {2: [{name: 'Microphone', id: 10, drilled: false}]}},
      {
        type: 'updateVillainDrilledStatus',
        value: {level: 2,villainId: 10}
      }
    )

    expect(state).to.deep.equal(
      {levels: {2: [{name: 'Microphone', id: 10, drilled: true}]}}
    )
  })

  it('should handle updateSvgHeight actions', () => {
    const state = rootReducer(
      {svgHeight: '0'},
      {type: 'updateSvgHeight', value: '100px'}
    )

    expect(state).to.deep.equal({
      svgHeight: '100px'
    })
  })

  it('should handle addVillainElement actions', () => {
    const state = rootReducer(
      {villainElements: ['node1', 'node2']},
      {type: 'addVillainElement', value: 'node3'}
    )

    expect(state).to.deep.equal({
      villainElements: ['node1', 'node2', 'node3']
    })
  })

  it('should handle setAllLevels actions', () => {
    const levels = {
      1: [{name: 'Wallet'}, {name: 'Lamp'}],
      2: [{name: 'Watch'}]
    }

    const levelsToReplace = {
      2: [{name: 'Card'}],
      3: [{name: 'Book'}, {name: 'Paper'}]
    }

    const state = rootReducer(
      {levels: levels},
      {type: 'setAllLevels', value: levelsToReplace}
    )

    expect(state).to.deep.equal({levels:levelsToReplace})
  })

  it('should handle setLevelColor actions', () => {
    const state = rootReducer(
      {levelColors: {1: 'blue', 2: 'pink'}},
      {type: 'setLevelColor', value: {levelNum: 3, color: 'purple'}}
    )

    expect(state).to.deep.equal({
      levelColors: {1: 'blue', 2: 'pink', 3: 'purple'}
    })
  })

  it('should handle clearLevels actions', () => {
    const state = rootReducer(
      {
        levels: {
          1: [{name: 'Key'}, {name: 'Plastic'}],
          2: [{name: 'Water'}, {name: 'Plastic'}, {name: 'Screen'}]
        }
      },
      {type: 'clearLevels'}
    )

    expect(state).to.deep.equal(initialState)
  })
})
