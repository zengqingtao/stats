import request from '@/plugin/axios'
// 新付款用户存留
export function  getOrderUserReten(data) {
  return request({
    url: '/OrderUserRetainedReport/list',
    method: 'post',
    data
  })
}