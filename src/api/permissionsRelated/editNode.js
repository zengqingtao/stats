//修改权限
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function editNode(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/node/editNode',
        headers: { Authorization },
        method: 'post',
        data
    })
}