import request from '@/plugin/axios'

export function  getOrderDetails(data) {
  return request({
    url:"/DashBoard/orderDetails",
    method: 'post',
    data
  })
}