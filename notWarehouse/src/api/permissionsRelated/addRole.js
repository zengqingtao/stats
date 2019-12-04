//添加角色
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function addRole(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/role/addRole',
        headers: { Authorization },
        method: 'post',
        data
    })
}