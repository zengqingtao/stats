import request from '@/plugin/axios'

export function getpkData (data) {
    return request({
        url: '/platformreport/getPickupPkInfo',
        method: 'post',
        data
    })
}
