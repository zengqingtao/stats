import request from '@/plugin/axios'

export function  getNotPerformance(data) {
  return request({
    url:"/pickupperform/NotPerformList",
    method: 'post',
    data
  })
}