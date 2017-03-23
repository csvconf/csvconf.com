// this... also downloads speakers from the url they provided.
// Because we like re-inventing things
const fs = require('fs')
const csv = require('csv')
const request = require('request')

let file = fs.readFileSync('./_data/2017_speakers.csv')

csv.parse(file, (err, data) => {
  data.shift()
  data.forEach(datum => {
    const url = datum[3]
    if (url && url !== '') {

      let file = fs.createWriteStream('./img/speakers-2017/' + datum[0] + '.jpg')
      let sendReq = request.get(url)
      sendReq.pipe(file)
    }

  })
})
