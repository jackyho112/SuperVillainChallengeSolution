/*global
$
*/

const React = require('react')
const axios = require('axios')
const { connector } = require('./Store')
const { string, number, func, object, bool } = React.PropTypes

const setTooltip = (title, cardId) => {
  $(`#${cardId}`).tooltip('destroy').tooltip({
    title: title,
    placement: 'right'
  })
}

const getCardTooltipTitle = (drilled) => {
  if (drilled) {
    return 'This member has been drilled already'
  } else {
    return 'Click to drill into this member\'s reports'
  }
}

const getMaxWindowHeight = () => {
  const body = document.body
  const html = document.documentElement

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
}

const MemberCard = React.createClass({
  propTypes: {
    name: string.isRequired,
    id: number.isRequired,
    level: number.isRequired,
    drilled: bool.isRequired,
    setSubordinates: func.isRequired,
    levels: object.isRequired,
    updateVillainDrilledStatus: func.isRequired,
    updateSvgHeight: func.isRequired,
    addVillainElement: func.isRequired,
    bossId: number,
    color: string
  },

  componentDidMount () {
    const villainElement = document.getElementById(this.props.id)
    const title = getCardTooltipTitle(this.props.drilled)

    if (this.props.bossId || this.props.bossId === 0) {
      villainElement.setAttribute('boss-id', this.props.bossId)
    }

    this.props.addVillainElement(villainElement)

    setTooltip(title, this.props.id)

    this.props.updateSvgHeight(`${getMaxWindowHeight()}px`)
  },

  componentDidUpdate () {
    const title = getCardTooltipTitle(this.props.drilled)

    setTooltip(title, this.props.id)
  },

  handleMemberCardClickEvent (event) {
    if (this.props.drilled) return

    const nextLevel = this.props.level + 1

    axios.get(`http://localhost:3000/villain-hierarchy/${this.props.id}`)
      .then((response) => {
        this.props.updateVillainDrilledStatus(this.props.level, this.props.id)

        if (response.data.length > 0) {
          const subordinates = response.data.map((subordinate) => {
            subordinate.level = nextLevel
            subordinate.drilled = false
            subordinate.bossId = this.props.id

            return subordinate
          })

          this.props.setSubordinates(subordinates, nextLevel)
        } else {
          console.log('This is a peasant')
        }
      })
      .catch((error) => {
        console.log('Cannot get the names of the gangs', error)
      })
  },

  render () {
    let buttonClassName

    if (this.props.drilled) {
      buttonClassName = 'member-card'
    } else {
      buttonClassName = 'member-card undrilled'
    }

    return (
      <div className='member-container'>
        <button className={buttonClassName}
          id={this.props.id}
          style={{color: this.props.color}}
          onClick={this.handleMemberCardClickEvent}>
          {this.props.name}
        </button>
      </div>
    )
  }
})

module.exports = connector(MemberCard)
