import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      {
        path: '/newAnalysis',
        name: 'newAnalysis',
        meta: {
          auth: true,
          title:"新增分析"
        },
        component: _import('user/newAnalysis')
      },
      {
        path: '/newAnalysisInfo',
        name: 'newAnalysisInfo',
        meta: {
          auth: true,
          title:"用户详情"
        },
        component: _import('user/newAnalysisInfo')
      },
      {
        path: '/platformReport',
        name: 'platformReport',
        meta: {
          auth: true,
          title:"日订单分析"
        },
        component: _import('order/platformReport')
      },
      {
        path: '/platformReportInfo',
        name: 'platformReportInfo',
        meta: {
          auth: true,
          title:"订单详情"
        },
        component: _import('order/platformReportInfo')
      },
      {
        path: '/redPacket',
        name: 'redPacket',
        meta: {
          auth: true,
          title:"红包日报表"
        },
        component: _import('redPacket/redPacket')
      },
      {
        path: '/realTimeRedPacket',
        name: 'realTimeRedPacket',
        meta: {
          auth: true,
          title:"实时红包报表"
        },
        component: _import('redPacket/realTimeRedPacket')
      },
       // 系统 前端日志
       {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
