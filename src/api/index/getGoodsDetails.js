import request from '@/plugin/axios'

export function  getGoodsDetails(data) {
  return request({
    url:"/DashBoard/SalesGoodsStatistics",
    method: 'post',
    data
  })
}