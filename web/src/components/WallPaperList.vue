<template>
    <div>
        <ul>
            <li v-for="(v,i) in filenameList">
                <a :href="imgFolder + '/' + v + '.jpg'" target="blank">
                	{{i}} : {{v.split('/')[1]}} <br>
                	<img :src="imgFolder+'/'+v+'_thumb.jpg'" alt="">
                </a>
                <br><br>
            </li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'WallPaperList',
    data() {
        return {
            wallpaperList: [],
            thumbList: [],
            filenameList: [],
            // httpUrl: 'http://localhost:2002',
            // imgFolder: 'http://localhost:2002/bing'
            httpUrl: 'http://bing.cokin.cc',
            imgFolder: 'http://bing.cokin.cc/bing'
        }
    },
    methods: {
        /**
         * 获取图片列表
         * @return {[type]} [description]
         */
        getWallPaperList() {
            axios.get(this.httpUrl + '/get_img_list')
                .then((response) => {
                    // console.log(response)
                    this.handleWallpapers(response.data.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        /**
         * 处理壁纸
         * @param  {[type]} wallpapers [description]
         * @return {[type]}            [description]
         */
        handleWallpapers(wallpapers) {
            // console.log(wallpapers)
            for (let i = 0; i < wallpapers.length; i++) {
                // 拆分 URL
                let septatedDir = wallpapers[i].split('/')
                let len = septatedDir.length
                // 所在目录，以年月区分的目录
                let folder = septatedDir[len - 2]
                // 图片完整名，包含后缀
                let image = septatedDir[len - 1]
                // 图片名，不包含后缀
                let filename = image.split('.')[0]
                // 后缀
                let suffix = image.split('.')[1]
                // 类型，缩略图为 thumb
                let type = filename.substr(filename.length - 5, 5)

                // 缩略图
                if (type.toLowerCase() == 'thumb' && suffix == 'jpg') {
                    this.thumbList.push(this.imgFolder + '/' + folder + '/' + image)
                }
                // 大图：壁纸
                else if (type.toLowerCase() != 'thumb' && suffix == 'jpg') {
                    this.wallpaperList.push(this.imgFolder + '/' + folder + '/' + image)
                    this.filenameList.push(folder + '/' + filename)
                }
            }

            console.log('wallpaper', this.wallpaperList)
            console.log('thumb', this.thumbList)
            console.log('filenames', this.filenameList)
        }
    },
    created() {
        this.getWallPaperList()
    }
}

</script>
<style>
html,body {
	height: 100%;
}
*{
	list-style: none;
	margin: 0;
	padding: 0;
}
body{
	margin: 0
}

</style>
