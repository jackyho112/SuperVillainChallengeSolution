const React = require('react')
const { string } = React.PropTypes
const { connector } = require('./Store')

const HorizontalConnectionLine = (props) => {
  const frontBox = document.getElementById(props.frontBoxId)
  const frontBoxRect = frontBox.getBoundingClientRect()
  const frontBoxStyle = window.getComputedStyle(frontBox)
  const frontBoxHorizontalPadding =
    parseInt(frontBoxStyle.getPropertyValue('padding-left')) + parseInt(frontBoxStyle.getPropertyValue('padding-right'))
  const backBox = document.getElementById(props.backBoxId)

  return (
    <line
      x1={frontBox.offsetLeft + frontBoxRect.width - frontBoxHorizontalPadding}
      y1={frontBox.offsetTop}
      x2={backBox.offsetLeft}
      y2={backBox.offsetTop}
      strokeWidth="2"
      stroke="black" />
  )
}

HorizontalConnectionLine.propTypes = {
  frontBoxId: string,
  backBoxId: string
}

module.exports = connector(HorizontalConnectionLine)
