//获取一级菜单
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getParentNode(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/node/getParentNode',
        headers: { Authorization },
        method: 'post',
        data
    })
}