import request from '@/plugin/axios'

export function getpk_target (data) {
    return request({
        url: '/platformreport/getPickupPkItemList',
        method: 'post',
        data
    })
}
