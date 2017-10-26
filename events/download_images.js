const axios = require('axios')
const http = require('http')
const fs = require('fs')
const path = require('path')

// 图片保存地址
let IMG_PATH = path.resolve(__dirname, '../bing_images')

/**
 * 文件或文件夹是否存在
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * 下载图片，保存到 bing_images/path 文件夹中
 * @param  {[type]} url  [description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
let download = (url, path) => {
	let date = path 
	let savepath = path.substr(0, 6)
    let filename = date + '_' + url.split('/').pop()
    let fullpath = IMG_PATH + '/' + savepath + '/' + filename
    console.log('filename', filename)
    // console.log('fullpath', fullpath)

    // 判断文件夹是否存在
    if (!fsExistsSync(IMG_PATH + '/' + savepath)) {
        console.log('folder not exist')
        // 同步创建该文件夹
        fs.mkdirSync(IMG_PATH + '/' + savepath)
    }

    // 请求图片
    http.get(url, (res) => {
        let imgData = ''
        res.setEncoding('binary')
        res.on('data', (chunk) => {
            imgData += chunk
        })
        // 接收完成
        res.on('end', () => {
            fs.writeFile(fullpath, imgData, 'binary', (err) => {
                if (err) {
                    console.log('download failed', err)
                    return
                }
                console.log('download success')
            })
        })
    })
}

/**
 * 创建摘要
 * @param  {[type]} url  [description]
 * @param  {[type]} path [description]
 * @param  {[type]} desc [description]
 * @return {[type]}      [description]
 */
let createDescription = (url, path, desc) => {
	let date = path 
	let savepath = path.substr(0, 6)
    let filename = date + '_' + url.split('/').pop().split('.')[0] + '.txt'
    let fullpath = IMG_PATH + '/' + savepath + '/' + filename
    // console.log('fullpath', fullpath)

    // 判断文件夹是否存在
    if (!fsExistsSync(IMG_PATH + '/' + savepath)) {
        console.log('folder not exist')
        // 同步创建该文件夹
        fs.mkdirSync(IMG_PATH + '/' + savepath)
    }

    // 写入描述
    fs.writeFile(fullpath, desc, (err) => {
        if (err) {
            console.log('create description failed', err)
            return
        }
        console.log('create description success')
    })
}

/**
 * 获取图片
 * @return {[type]} [description]
 */
let getImage = () => {
    console.log('>>>>>>>>>>>>> get image url')

    // 检查保存文件夹
    if (!fsExistsSync(IMG_PATH)) {
        // 同步创建该文件夹
        fs.mkdirSync(IMG_PATH)
    }

    // 获取图片 url 和摘要
    axios.get('http://localhost:2002')
        .then((response) => {
            let url = response.data.url
            let path = response.data.date
            // 下载图片到指定目录
            download(url, path)
            // 保存描述信息
            let desc = JSON.stringify(response.data)
            createDescription(url, path, desc)
        })
}

module.exports = getImage