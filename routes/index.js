const express = require('express')
const router = express.Router()
const axios = require('axios')


/**
 * 获取图片url地址
 * @return {[type]} [description]
 */
let getImgUrl = () => {
    return axios.get(
        'http://cn.bing.com/HPImageArchive.aspx?setmkt=zh-CN&format=js&idx=0&n=1'
    )
}

/**
 * 获取图片故事
 * @return {[type]} [description]
 */
let getImgStory = () => {
    return axios.get(
        'http://cn.bing.com/cnhp/coverstory/?setmkt=zh-CN'
    )
}

////////////////////////////////////////////////////////
/// Router
////////////////////////////////////////////////////////
router.get('/', (req, res, next) => {

	// 并发获取
    axios
    .all([getImgUrl(), getImgStory()])
    .then(
    	axios.spread((imgUrl, imgStroy) => {
    		// console.log('imgUrl',imgUrl)
    		// console.log('imgStroy',imgStroy)
    		let url = 'http://s.cn.bing.net' + imgUrl.data.images[0].url
    		let copyright = imgUrl.data.images[0].copyright
    		let description = imgStroy.data.para1
    		let title = imgStroy.data.title
    		let date = imgUrl.data.images[0].enddate

    		res.json({
		    	url: url,
		    	copyright: copyright,
		    	description: description,
		    	title: title,
		    	date: date,
		    	location: {
		    		longitude: imgStroy.data.Longitude,
		    		latitude: imgStroy.data.Latitude
		    	}
		    })
    	})
    )
})

module.exports = router