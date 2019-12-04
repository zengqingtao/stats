import request from '@/plugin/axios'

export function getDataFollow (data) {
    return request({
        url: '/factory/getFactoryDataList',
        method: 'post',
        data
    })
}