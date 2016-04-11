'use strict'

/**
 * Express middleware for taking action after a request has ended.
 *
 * Usage:
 * ```
 * var express = require('express');
 * var afterEnd = require('express-after-end')
 *
 * var app = express()
 *
 * app.use(function (req, res, next) {
 *   res.locals.reqStartTime = new Date()
 *   console.log('< %s %s', req.method, req.originalUrl)
 *   next()
 * })
 *
 *  app.use(afterEnd(function (req, res) {
 *   var responseTime = new Date() - res.locals.reqStartTime
 *   console.log('> %s %s %d %d', req.method, req.originalUrl, res.statusCode, responseTime)
 * }))
 *
 *  app.use(function (req, res) {
 *   res.status(200).send('OK')
 * })
 *
 * app.listen(80);
 * ```
 *
 * @param {Function} fn - function to invoke on response end
 * @param {Boolean} [before=false] - invoke fn before the default end() instead of after
 * @returns {Function}
 */

module.exports = function afterEnd (fn, before) {
  return function (req, res, next) {
    var _end = res.end
    res.end = function onResEnd () {
      if (before) {
        fn(req, res)
      }

      _end.apply(res, Array.apply(null, arguments))

      if (!before) {
        fn(req, res)
      }
    }
    next()
  }
}
