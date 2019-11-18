import request from '@/plugin/axios'
// 综合购买存留
export function  getSynthesisBuyList(data) {
  return request({
    url: '/retention/getSynthesisBuyList',
    method: 'post',
    data
  })
}
