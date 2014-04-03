var bcsv = require('binary-csv')
var xhr = require('xhr')
var bops = require('bops')
var through = require('through')
var url = require('url')
var term = require('hypernal')()
var tablify = require('tablify').tablify
var concat = require('concat-stream')

// style fake terminal
var termEl = term.term.element
termEl.style['font'] = '12px Monaco, mono'
termEl.style.height = '100%'
termEl.style.width = '100%'
termEl.style.padding = '5px'
termEl.style.overflow = 'hidden'
termEl.style.position = 'absolute'
termEl.style.top = '0px'
termEl.style['white-space'] = 'pre'
termEl.style['z-index'] = '1'
termEl.style['background'] = '#f7f7f7'
termEl.style['color'] = '#bbb'

var headerRow = document.querySelector('header .row')
var parentDiv = headerRow.parentNode
parentDiv.insertBefore(termEl, headerRow)

var Buffer = require('buffer').Buffer

var parsedURL = url.parse(window.location.href, true)

var csv = parsedURL.query.csv || 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv'

xhr({ responseType: 'arraybuffer', url: 'http://cors.maxogden.com/' + csv }, response)

function response(err, resp, data) {
  if (err) throw err
  var buff = new Buffer(new Uint8Array(data))
  var parser = bcsv({json: true})
  document.querySelector('.easteregg').style.display = 'block'
  parser.pipe(concat(render))
  parser.write(buff)
  parser.end()
}

function render(rows) {
  for (var i = 0; i < rows.length; i++) {
    var sub = rows.slice(0, i)
    var offset = (i + 1) * 1000
    schedule(sub, offset)
  }
  
  function schedule(sub, offset) {
    setTimeout(function() {
      term.reset()
      term.write(tablify(sub))    
    }, offset)
  }
}