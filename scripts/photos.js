// this downloads speaker photos from the url they supplied
var fs = require('fs')
var path = require('path')
var nugget = require('nugget')
var photos = []
var speakers = fs.readFileSync('./speakers.json')
  .toString().trim().split('\n')
  .map(function (s) { return JSON.parse(s) })
  .map(function (s) {
    var photo = s["Optional: Please provide a URL to a photo of yourself (For the website if your talk is accepted)"]
    if (photo) {
      if (!photo.match(/^http/)) photo = 'http://' + photo
      photos.push(photo)    
    }
  })

nugget(photos, {resume: true, dir: __dirname + '/img/speakers2'}, function (err) {
  if (err) throw err
  console.log(speakers.join('\n'))
})