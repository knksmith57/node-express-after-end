express-after-end
=================

> express middleware for taking action after a request has ended


## Quickstart
```sh
$ npm install --save express-after-end
```

Then, in your application:

```js
var express = require('express');
var afterEnd = require('express-after-end')

var app = express()

app.use(function (req, res, next) {
  res.locals.reqStartTime = new Date()
  console.log('< %s %s', req.method, req.originalUrl)
  next()
})

app.use(afterEnd(function (req, res) {
  var responseTime = new Date() - res.locals.reqStartTime
  console.log('> %s %s %d %d', req.method, req.originalUrl, res.statusCode, responseTime)
}))

app.use(function (req, res) {
  res.status(200).send('OK')
})

app.listen(80);
```


## ?
Questions / comments / concerns? --> [@knksmith57][1]


[1]: https://twitter.com/knksmith57

