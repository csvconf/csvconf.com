// to generate speakers.json:
// cat csv\,conf\,2.0\ \ \(Responses\)\ -\ Yays\!.csv | csv-parser | jsonfilter --match "this['Confirmed? '].toLowerCase() === 'yes'"

// this generates html for website
var fs = require('fs')
var path = require('path')
var nugget = require('nugget')
var speakers = fs.readFileSync('./speakers.json')
  .toString().trim().split('\n')
  .map(function (s) { return JSON.parse(s) })
  .map(function (s) {
    return  {
      "name": s["What is your full name?"],
      "twitter": s["Optional: What is your Twitter username? (For the website if your talk is accepted)"].replace('@', ''),
      "title": s["What is the title of your talk?"]
    }
  })
  .map(function (s) {
  return `<li class="features-item">
    <a href="https://twitter.com/${s.twitter}">
      <span class="features-circle" style="background-image: url(/img/speakers/${s.twitter}.jpg)">
        <span class="features-circle-icon">
        </span>
      </span>
    </a>
    <h4>${s.name}</h4>
    <a href="#${s.twitter}"><h3>${s.title}</h3></a>
  </li>`  
})

console.log(speakers.join('\n'))

