// this... also downloads speakers from the url they provided.
// Because we like re-inventing things
const fs = require('fs')
const csv = require('csv')
const request = require('request')
const nugget = require('nugget')


let file = fs.readFileSync('./_data/2017_speakers.csv')
let photos = []

csv.parse(file, (err, data) => {
  data.shift()
  data.forEach(datum => {
    let url = datum[3]
    if (url && url !== '') {

      if (!url.match(/^http/)) url = 'http://' + url
      photos.push(url)
    }
  })
})

nugget(photos, {resume: true, dir: __dirname + '/img/speakers-2017'}, function (err) {
  if (err) throw err
    // console.log(speakers.join('\n'))
})
