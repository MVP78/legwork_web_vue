import request from '@/utils/request'

// 查询骑手管理列表
export function listRider(query) {
  return request({
    url: '/rider/rider/list',
    method: 'get',
    params: query
  })
}

// 查询骑手管理详细
export function getRider(riderId) {
  return request({
    url: '/rider/rider/' + riderId,
    method: 'get'
  })
}

// 新增骑手管理
export function addRider(data) {
  return request({
    url: '/rider/rider',
    method: 'post',
    data: data
  })
}

// 修改骑手管理
export function updateRider(data) {
  return request({
    url: '/rider/rider/updateRider',
    method: 'put',
    data: data
  })
}

// 删除骑手管理
export function delRider(riderId) {
  return request({
    url: '/rider/rider/' + riderId,
    method: 'delete'
  })
}
