import request from '@/plugin/axios'

export function  getTYList(data) {
  return request({
    url:"/DashBoard/getRealTimeStats",
    method: 'post',
    data
  })
}