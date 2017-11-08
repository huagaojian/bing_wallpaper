const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const join = path.join

/**
 * 获取文件
 * @param  {[type]} startPath [description]
 * @return {[type]}           [description]
 */
let findSync = (startPath) => {
    let result = []

    let finder = (path) => {
        let files = fs.readdirSync(path)
        files.forEach((val, index) => {
            let fPath = join(path, val)
            let stats = fs.statSync(fPath)
            if (stats.isDirectory()) finder(fPath)
            if (stats.isFile()) result.push(fPath)
        })

    }
    finder(startPath)
    return result
}

////////////////////////////////////////////////////////
/// Router
////////////////////////////////////////////////////////
router.get('/', (req, res, next) => {
	let result = findSync(path.join(__dirname, '../../bing_images/'))

	res.json({
		success: true,
		data: result
	})
})

module.exports = router