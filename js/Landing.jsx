const React = require('react')
const Level = require('./Level')
const Header = require('./Header')
const HorizontalConnectionLine = require('./HorizontalConnectionLine')
const { connector } = require('./Store')
const axios = require('axios')
const { object, func, string, arrayOf } = React.PropTypes

const getBosses = (callback) => {
  axios.get('http://localhost:3000/villain-hierarchy')
    .then((response) => {
      const bosses = response.data.map((boss) => {
        boss.level = 1
        boss.drilled = false

        return boss
      })

      callback(bosses)
    })
    .catch((error) => {
      console.log('Cannot get the names of the bosses', error)
    })
}

const Landing = React.createClass({
  propTypes: {
    levels: object.isRequired,
    setBosses: func.isRequired,
    villainElements: arrayOf(object).isRequired,
    svgHeight: string
  },

  componentDidMount () {
    getBosses(this.props.setBosses)
  },

  componentDidUpdate () {
    if (this.props.levels[1].length === 0) {
      getBosses(this.props.setBosses)
    }
  },

  render () {
    return (
      <div>
        <Header />
        <div className='organization-tree-container'>
          <div className='organization-level-container'>
            {
              Object.keys(this.props.levels).map((levelNum) => {
                const level = this.props.levels[levelNum]

                return (
                  <Level villains={level} key={levelNum} levelNum={levelNum} />
                )
              })
            }
          </div>
          <svg xmlns="http://www.w3.org/2000/svg"
            style={{height: this.props.svgHeight}}
            className='connection-line-container'>
            {
              this.props.villainElements
              .filter((villainElement) => {
                return !!villainElement.getAttribute('boss-id')
              })
              .map((villainElement) => {
                return (
                  <HorizontalConnectionLine
                    frontBoxId={villainElement.getAttribute('boss-id')}
                    backBoxId={villainElement.getAttribute('id')}
                    key={villainElement.getAttribute('boss-id') + villainElement.getAttribute('id')} />
                )
              })
            }
          </svg>
        </div>
      </div>
    )
  }
})

module.exports = connector(Landing)
