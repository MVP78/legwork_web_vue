import request from '@/utils/request'

// 查询小程序用户管理列表
export function listUser(query) {
  return request({
    url: '/lwUser/list',
    method: 'get',
    params: query
  })
}

// 查询小程序用户管理详细
export function getUser(userId) {
  return request({
    url: '/lwUser/getInfo' + userId,
    method: 'get'
  })
}

// 新增小程序用户管理
export function addUser(data) {
  return request({
    url: '/lwUser/add',
    method: 'post',
    data: data
  })
}

// 修改小程序用户管理
export function updateUser(data) {
  return request({
    url: '/lwUser/edit',
    method: 'put',
    data: data
  })
}

// 删除小程序用户管理
export function delUser(userId) {
  return request({
    url: '/lwUser/remove' + userId,
    method: 'delete'
  })
}
