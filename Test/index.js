'use strict'

const Test = require('./lib/test')

const createTest = (data) => new Test(data)
module.exports = createTest
