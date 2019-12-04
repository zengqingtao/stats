//修改角色
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function editRole(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/role/editRole',
        headers: { Authorization },
        method: 'post',
        data
    })
}