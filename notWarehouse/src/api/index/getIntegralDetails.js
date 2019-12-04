import request from '@/plugin/axios'

export function  getIntegralDetails(data) {
  return request({
    url:"/DashBoard/ScoreStatistics",
    method: 'post',
    data
  })
}