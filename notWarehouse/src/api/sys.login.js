import request from '@/plugin/axios'
import util from '@/libs/util.js'
/**
 * 登录
 * @param {用户名} username
 * @param {密码} password
 */
export const loginByUsername = (data) => { //--------------修改
  return request({
    url: '/auth/login',//admin/auth/login--------------修改
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method:'post',
    data:data
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  var Authorization ="Bearer "+util.cookies.get("token")
  return request({
    url: '/auth/getUserInfo',//--------------修改
    headers: {Authorization},
    method: 'post'
  })
}

/**
 * 退出登录
 */
export const logout = () => {
  var Authorization ="Bearer "+util.cookies.get("token")
  return request({
    url: '/auth/logout',//--------------修改
    headers: {Authorization},
    method: 'post'
  })
}


export const checkIsLogined = (data) => {
  return request({
    url: '/checklogined',//--------------修改
    method: 'post',
    data: data
  })
}
