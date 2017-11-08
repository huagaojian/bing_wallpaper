import Vue from 'vue'
import Router from 'vue-router'
import WallPaperList from '@/components/WallPaperList'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'WallPaperList',
        component: WallPaperList
    }]
})
