const React = require('react')
const { connector } = require('./Store')
const { object, func } = React.PropTypes
const axios = require('axios')

const areAllDrilled = (levels) => {
  if (levels['1'].length === 0) return false

  return Object.keys(levels).every(function (levelNum) {
    return levels[levelNum].every(function (villain) {
      return villain.drilled
    })
  })
}

const discoverAllVillains = (levels, callback) => {
  Object.keys(levels).map(function (levelNum) {
    levels[levelNum].map(function (villain) {
      if (villain.drilled) {
        return
      } else {
        villain.drilled = true
      }

      axios.get(`http://localhost:3000/villain-hierarchy/${villain.id}`)
        .then((response) => {
          if (response.data.length > 0) {
            const subordinates = response.data.map((subordinate) => {
              subordinate.level = villain.level + 1
              subordinate.drilled = false
              subordinate.bossId = villain.id

              return subordinate
            })

            levels[villain.level + 1] = levels[villain.level + 1] || []

            levels[villain.level + 1].push(...subordinates)

            discoverAllVillains(levels, callback)
          } else {
            if (!areAllDrilled(levels)) {
              discoverAllVillains(levels, callback)
            } else {
              callback(levels)
            }
          }
        })
        .catch((error) => {
          console.log('Cannot get the names of the gangs', error)
        })
    })
  })
}

const Header = React.createClass({
  handleDiscoverAllClickEvent (event) {
    let levels = Object.assign({}, this.props.levels)

    discoverAllVillains(levels, this.props.setAllLevels)
  },

  handleClearAllClickEvent (event) {
    this.props.clearLevels()
  },

  render () {
    let buttonDisplay

    if (areAllDrilled(this.props.levels)) {
      buttonDisplay = 'none'
    }

    return (
      <header className='header'>
        <h1 className='brand'>
          Evil thing corporation tree generator
        </h1>
        <button className='discover-all'
          onClick={this.handleDiscoverAllClickEvent}
          style={{display: buttonDisplay}}>
          Click to discover all reports
        </button>
        <button className='discover-all'
          onClick={this.handleClearAllClickEvent}>
          Click to clear reports
        </button>
      </header>
    )
  },

  propTypes: {
    levels: object.isRequired,
    setAllLevels: func.isRequired,
    updateSvgHeight: func.isRequired,
    clearLevels: func.isRequired
  }
})

module.exports = connector(Header)
