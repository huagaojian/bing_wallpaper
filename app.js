const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// router
const index = require('./routes/index')
// events
const DownloadImages = require('./events/download_images')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 允许跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", '3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
})

//////////////////////////////////////////////////////////////////
/// FUNCTIONS
let loopEveryDayAt12 = (timer, fn) => {
	// 循环函数
	let loopFunction = ()=>{
		let date = new Date()
		let hours = date.getHours()
		let minites = date.getMinutes()
		if (hours == 12) {
			console.log('>>>>>>>>>>> loop at '+ hours + ':' + minites)
			fn()
		}
	}
	// 先执行一次
    fn() 
	// 定时执行
	timer = setInterval(loopFunction, 3600000)
}


//////////////////////////////////////////////////////////////////
// event
// 循环下载定时，每天12点执行
let downloadTimer
loopEveryDayAt12(downloadTimer, DownloadImages)
console.log('start loop downloading');

//////////////////////////////////////////////////////////////////
/// router
app.use('/', index)
//////////////////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app