import request from '@/utils/request'

// 查询快递标准管理列表
export function listCharges(query) {
  return request({
    url: '/charges/charges/list',
    method: 'get',
    params: query
  })
}

// 查询快递标准管理详细
export function getCharges(chargesId) {
  return request({
    url: '/charges/charges/' + chargesId,
    method: 'get'
  })
}

// 新增快递标准管理
export function addCharges(data) {
  return request({
    url: '/charges/charges',
    method: 'post',
    data: data
  })
}

// 修改快递标准管理
export function updateCharges(data) {
  return request({
    url: '/charges/charges',
    method: 'put',
    data: data
  })
}

// 删除快递标准管理
export function delCharges(chargesId) {
  return request({
    url: '/charges/charges/' + chargesId,
    method: 'delete'
  })
}
