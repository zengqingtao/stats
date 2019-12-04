import request from '@/plugin/axios'
// 新付款用户存留
export function  getOrderUserRetenInfo(data) {
  return request({
    url: '/OrderUserRetainedReport/info',
    method: 'post',
    data
  })
}