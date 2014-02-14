
var constants = require('../constants.json');
var util = require('util');
var url = require('url');
var request = require('request');
var sqlite = require('sqlite3').verbose();
var argv = require('minimist')(process.argv.slice(2));

function Grid(x, y) {
  this.env = {
    sun: 0
  }
  this.refreshRate = 60*60*1000 /constants.speed;
  this.dbname = util.format('./grid/%d/%d/resource.db', x, x+y);
  this.db = new sqlite.Database(this.dbname, 
    sqlite.OPEN_READWRITE, this._onSqlConnected);
}

Grid.prototype._onSqlConnected = function(err) {
  if (err) {
    console.error(err);
    process.exit(0);
  } else {
    console.info('connected sqlite');
    setInterval(this.getWeather, this.refreshRate);
  }
}

Grid.prototype.getWeather = function() {
  var self = this;
  var option = {}
  option.json = true;
  option.url = url.format({
    host: 'localhost',
    protocol: 'http',
    pathname: '/earth/weather.php',
    query: {
      x: this.x,
      y: this.y
    }
  })

  request(option, function(err, response, body) {
    if (err || !body.sun) {
      process.exit(0);
    }
    self.env.sun = body.sun;
    if (body.rain !== 0) {
      var SQLTXT = "UPDATE environment SET value = value + ? WHERE name = 'water'";
      self.db.run(SQLTXT, function(err) {
        if (err) 
          self.handleError(err);
        else
          console.info('water:', body.rain);
      })
    }
  })
}

Grid.prototype.getSunshine = function() {
  //  /earth/sun.php
  // TODO(Twwy): need define
}

module.exports = Grid;
