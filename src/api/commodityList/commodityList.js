import request from '@/plugin/axios'

export function getCommodityList (data) {
    return request({
        url: '/platformreport/getHotGoodsList',
        method: 'post',
        data
    })
}
