const React = require('react')
const MemberCard = require('./MemberCard')
const { connector } = require('./Store')
const { arrayOf, object, string, func } = React.PropTypes

const Level = React.createClass({
  propTypes: {
    villains: arrayOf(object).isRequired,
    levelNum: string.isRequired,
    levelColors: object,
    setLevelColor: func
  },

  componentWillMount () {
    if (!this.props.levelColors[this.props.levelNum]) {
      this.props.setLevelColor(
        this.props.levelNum,
        '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
      )
    }
  },

  render () {
    return (
      <div className='organization-level'>
        {
          this.props.villains.sort((a, b) => {
            const bossIdCompare = a.bossId - b.bossId
            const idCompare = a.id - b.id

            if (bossIdCompare === 0) {
              return idCompare
            } else {
              return bossIdCompare
            }
          }).map((villain) => {
            return (
              <MemberCard {...villain} key={villain.id} color={this.props.levelColors[this.props.levelNum]} />
            )
          })
        }
      </div>
    )
  }
})

module.exports = connector(Level)
