import request from '@/plugin/axios'

export function getOrderDetail (data) {
    return request({
        url: '/factory/getFactoryOrderStatsList',
        method: 'post',
        data
    })
}