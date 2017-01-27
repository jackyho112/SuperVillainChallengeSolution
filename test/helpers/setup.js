const TestUtils = require('react-addons-test-utils')
const expect = require('expect')
require('babel-register')
require('babel-polyfill')

global.document = require('jsdom').jsdom('<body><div id="app"></div></body>')
global.window = document.defaultView
global.navigator = window.navigator

const ShallowRender = (component) => {
  const renderer = TestUtils.createRenderer()
  renderer.render(component)

  return renderer
}

module.exports = { ShallowRender }
