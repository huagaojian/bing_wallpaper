const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const images = require('images')

// 图片目录
let IMGDIR = path.join(__dirname, '../../bing_images/')

/**
 * 文件存在
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
let fsExistsSync = (path) => {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * 创建缩略图
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
let createThumbs = (res, dir)=>{
    // console.log('CurrentDir', dir)
    fs.readdir(dir, (err,filenames) => {
        if (err) {
            console.log(err)
            res.json({
                success: false,
                msg: err
            })
        }
        // 遍历文件
        for (let i = 0; i < filenames.length; i++) {
            let filename = filenames[i]
            let name = filename.split('.')[0]
            let type = name.substr(name.length-5,5)
            let suffix = filename.split('.')[1]
            // console.log('file',filename, type, suffix)

            // jpg 且 type 不为 s， 需要生成缩略图
            if (suffix == 'jpg' && type.toLowerCase() != 'thumb') {
                // 压缩图片
                let thumbPath = path.join(dir, name + '_thumb.' + suffix)

                if (!fsExistsSync(thumbPath)) {
                     // console.log('thumbPath', thumbPath)
                    images(path.join(dir, filename)).size(400).save(thumbPath, {
                        quality : 50
                    })
                }
            }
        }

        res.json({
            success: true
        })
    })
}

////////////////////////////////////////////////////////
/// Router
////////////////////////////////////////////////////////
router.get('/', (req, res, next) => {

    // 手动遍历创建缩略图
    fs.readdir(IMGDIR, (err, files)=>{
        if (err) {
            console.log(err)
            res.json({
                success: false,
                msg: err
            })
        }
        // 获取目录
        let folders = []
        // 同步方式 遍历文件
        files.forEach((filename)=>{
            if(fs.statSync(path.join(IMGDIR, filename)).isDirectory()){
                folders.push(filename)
            }
        })
        // 获取目录数组，根据目录查询目录下的文件
        for (let i = 0; i < folders.length; i++) {
            let imgDir = path.join(IMGDIR, folders[i])
            // console.log('imgDir',imgDir)
            createThumbs(res,imgDir)
        }
    })
})

module.exports = router