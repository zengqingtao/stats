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
        path:'/newUserOrders',
        name:'newUserOrders',
        meta: {
          auth: true,
          title:"新用户订单"
        },
        component: _import('user/newUserOrders')
      },
      {
        path:'/faithfulStat',
        name:'faithfulStat',
        meta: {
          auth: true,
          title:"忠实用户留存"
        },
        component: _import('user/faithfulStat')
      },
      {
        path:'/faithfulStatInfo',
        name:'faithfulStatInfo',
        meta:{
          auth:true,
          title:"忠实用户留存详情"
        },
        component: _import('user/faithfulStatInfo')
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
        path: '/commodity',
        name: 'commodity',
        meta: {
          auth: true,
          title:"商品销售"
        },
        component: _import('order/commodity_sales')
      },
      {
        path: '/commodityInfo',
        name: 'commodityInfo',
        meta: {
          auth: true,
          title:"商品详情"
        },
        component: _import('order/commodityInfo')
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
        path: '/factory_pk',
        name: 'factory_pk',
        meta: {
          auth: true,
          title:"厂区PK"
        },
        component: _import('order/factory_pk')
      },
      {
        path: '/realTimeReport',
        name: 'realTimeReport',
        meta: {
          auth: true,
          title:"实时日订单分析"
        },
        component: _import('order/realTimeReport')
      },
      {
        path: '/realTimeReportInfo',
        name: 'realTimeReportInfo',
        meta: {
          auth: true,
          title:"实时日订单分析详情"
        },
        component: _import('order/realTimeReportInfo')
      },
      {
        path:'/newPayUserRetention',
        name:'newPayUserRetention',
        meta:{
          auth:true,
          title:"新付款用户"
        },
        component: _import('order/newPayUserRetention')
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
        path: '/redPacketInfo',
        name: 'redPacketInfo',
        meta: {
          auth: true,
          title:"红包详情"
        },
        component: _import('redPacket/redPacketInfo')
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
      {
        path: '/factoryRedPacket',
        name: 'factoryRedPacket',
        meta: {
          auth: true,
          title:"分工厂红包汇总"
        },
        component: _import('redPacket/factoryRedPacket')
      },
      {
        path: '/activateFactory',
        name: 'activateFactory',
        meta: {
          auth: true,
          title:"老厂重新激活分厂"
        },
        component: _import('DataFollow/activateFactory')
      },
      {
        path: '/factory_orderDetail',
        name: 'factory_orderDetail',
        meta: {
          auth: true,
          title:"分工厂累计下单情况"
        },
        component: _import('order/factory_orderDetail')
      },
      {
        path: '/integratedPurchaseRetention',
        name: 'integratedPurchaseRetention',
        meta: {
          auth: true,
          title:"综合购买留存"
        },
        component: _import('comprehensive/intPurchaseReten')
      },
      {
        path:'/administratorManagement',
        name:'administratorManagement',
        meta: {
          auth: true,
          title:"管理员管理"
        },
        component: _import('systemManagement/administratorManagement')
      },
      {
        path:'/privilegeManagement',
        name:'privilegeManagement',
        meta: {
          auth: true,
          title:"权限管理"
        },
        component: _import('systemManagement/privilegeManagement')
      },
      {
        path:'/roleManagement',
        name:'roleManagement',
        meta: {
          auth: true,
          title:"角色管理"
        },
        component: _import('systemManagement/roleManagement')
      },
      {
        path: '/orderUserRetenStat',
        name: 'orderUserRetenStat',
        meta: {
          auth: true,
          title: "下单用户留存情况分析"
        },
        component: _import('order/orderUserReten')
      },
      {
        path: '/orderUserRetenStatInfo',
        name: 'orderUserRetenStatInfo',
        meta: {
          auth: true,
          title: "下单用户留存详情"
        },
        component: _import('order/orderUserRetenInfo')
      },
      {
        path:'/notPerformance',
        name:'notPerformance',
        meta: {
          auth: true,
          title:"未履约汇总"
        },
        component: _import('performance/notPerformance')
      },
      {
        path:'/dingTalk',
        name:'dingTalk',
        meta: {
          auth: true,
          title:"钉钉用户管理"
        },
        component: _import('systemManagement/dingTalk')
      },
      {
        path:'/integralStat',
        name:'integralStat',
        meta:{
          auth:true,
          title:"积分统计"
        },
        component: _import('integral/integralStat')
      },
      {
        path:'/integralStatInfo',
        name:'integralStatInfo',
        meta:{
          auth:true,
          title:"积分统计详情"
        },
        component: _import('integral/integralStatInfo')
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
