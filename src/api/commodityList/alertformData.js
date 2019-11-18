import request from '@/plugin/axios'

export function getalertformData (data) {
    return request({
        url: '/platformreport/getPickupGoodsList',
        method: 'post',
        data
    })
}