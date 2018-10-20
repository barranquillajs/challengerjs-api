'use strict'

const assert = require('assert')
const { performance } = require('perf_hooks')


class Test {
  constructor(data){
    this.inputForTesting = data.input[0]
    this.expectedOutput = data.output[0]
  }

  isOutputCorrect (fun) {
    const clientOutput = fun(this.inputForTesting)
    const result = assert.deepEqual(clientOutput, this.expectedOutput)
    if (typeof result === 'undefined') {
      return true
    }
    return false
  }

  getAmoutOfTimeInExecution (fun) {
    const t0n = performance.now()
    fun(this.inputForTesting)
    const t1 = performance.now()
    return t1 - t0
  }

  getNumberOfCharacters (funtionString) {
    const res = funtionString.split('').length
    return res
  }

}

module.exports = Test
