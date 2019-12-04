import request from '@/plugin/axios'

export function  getNotPerformanceInfo(data) {
  return request({
    url:"/pickupperform/NotPerformGoodsByPickupList",
    method: 'post',
    data
  })
}