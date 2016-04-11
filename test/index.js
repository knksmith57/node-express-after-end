'use strict'

var afterEnd = require('..')
var express = require('express')
var should = require('should')
var supertest = require('supertest')

/* global describe it beforeEach */

describe('express-after-end', function () {
  var app

  beforeEach(function () {
    app = express()
  })

  describe('when before is false (default)', function () {
    it('should always call next()', function (done) {
      var called = false

      app.use(afterEnd(function () {}))
      app.use(function (req, res) {
        called = true
        res.status(200).send('OK')
      })

      supertest(app)
        .get('/')
        .expect(200, function (err) {
          if (err) {
            throw new Error(err)
          }
          should(called).equal(true)
          done()
        })
    })

    it('should call function after built-in end()', function (done) {
      app.use(afterEnd(function (req, res) {
        (function () {
          res.set('x-after-end', 'true')
        }).should.throw()
      }))

      app.use(function (req, res) {
        res.status(200).send('OK')
      })

      supertest(app)
        .get('/')
        .expect(200, done)
    })

    it('should call all functions FIFO after build-in end()', function (done) {
      app.use(function (req, res, next) {
        res.locals.step = 0
        next()
      })

      app.use(afterEnd(function (req, res) {
        should(++res.locals.step).equal(1)
      }))

      app.use(afterEnd(function (req, res) {
        should(++res.locals.step).equal(2)
      }))

      app.use(afterEnd(function (req, res) {
        should(++res.locals.step).equal(3)
      }))

      app.use(function (req, res) {
        res.status(200).send('OK')
      })

      supertest(app)
        .get('/')
        .expect(200, done)
    })
  })

  describe('when before is true', function () {
    it('should always call next()', function (done) {
      var called = false

      app.use(afterEnd(function () {}, true))
      app.use(function (req, res) {
        called = true
        res.status(200).send('OK')
      })

      supertest(app)
        .get('/')
        .expect(200, function (err) {
          if (err) {
            throw new Error(err)
          }
          should(called).equal(true)
          done()
        })
    })

    it('should call function before built-in end()', function (done) {
      app.use(afterEnd(function (req, res) {
        res.set('x-after-end', 'true')
      }, true))

      app.use(function (req, res) {
        res.status(200).send('OK')
      })

      supertest(app)
        .get('/')
        .expect('x-after-end', 'true')
        .expect(200, done)
    })

    it('should call all functions LIFO after build-in end()', function (done) {
      app.use(function (req, res, next) {
        res.locals.step = 0
        next()
      })

      app.use(afterEnd(function (req, res) {
        should(++res.locals.step).equal(3)
      }, true))

      app.use(afterEnd(function (req, res) {
        should(++res.locals.step).equal(2)
      }, true))

      app.use(afterEnd(function (req, res) {
        should(++res.locals.step).equal(1)
      }, true))

      app.use(function (req, res) {
        res.status(200).send('OK')
      })

      supertest(app)
        .get('/')
        .expect(200, done)
    })
  })
})
