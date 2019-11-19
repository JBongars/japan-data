'use strict';

const ogr2ogr = require('ogr2ogr');
const fs = require('fs');

const writeStream = fs.createWriteStream('./result')
const ogr = ogr2ogr('./provinces.zip');


ogr.exec(function (er, data) {
  if (er) console.error(er)
  console.log(data)
})

const ogr2 = ogr2ogr('./result.zip')
ogr2.stream().pipe(writeStream)
