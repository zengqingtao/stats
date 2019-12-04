import request from '@/plugin/axios'
// 新付款用户存留
export function  getBuyRetentionList(data) {
  return request({
    url: '/retention/getBuyRetentionList',
    method: 'post',
    data
  })
}
