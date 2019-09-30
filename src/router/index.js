import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

import { validatenull } from '@/libs/validate.js'//-------------------引入
import { GetMenu } from '@/api/menu' //-------------------------引入
import { frameInRoutes } from '@/router/routes'
Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
//--------------↓修改
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      GetMenu().then(res => {
        // 设置用户菜单
        store.commit('d2admin/user/SET_MENU', res.role)
        let oRoutes = util.formatRoutes(res.role)
        // 多页面控制: 处理路由 得到每一级的路由设置
        store.commit('d2admin/page/init', [].concat(frameInRoutes, oRoutes))
        // 设置侧边栏菜单
        store.commit('d2admin/menu/asideSet', res.role)
        // 设置顶栏菜单
        store.commit('d2admin/menu/headerSet', [])
        router.addRoutes(oRoutes)
        if (util.checkRoute(res.role, to.path)) {
          next()
        } else {
          next({ name: 'index' })
        }
      }).catch(() => {
        // 查询菜单失败 跳转到登陆界面
        next({
          name: 'login',
          query: {
            redirect: to.fullPath
          }
        })
      })
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})
//----------------↑修改

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
