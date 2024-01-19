var express = require("express");
var sqlite3 = require('sqlite3').verbose();
var logs = require('../logs/logs')

const client = new sqlite3.Database("./db/customers.sqlite", sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) return console.error(err.message);
        logs.info('Connected to database');
    })


module.exports= client;