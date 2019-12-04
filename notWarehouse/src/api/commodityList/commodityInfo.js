import request from '@/plugin/axios'

export function getCommodityInfo (data) {
    return request({
        url: '/platformreport/findHotGoodsInfo',
        method: 'post',
        data
    })
}