import request from '@/utils/request'

// 查询提现管理列表
export function listWithdrawal(query) {
  return request({
    url: '/withdrawal/withdrawal/list',
    method: 'get',
    params: query
  })
}

// 查询提现管理详细
export function getWithdrawal(withdrawalId) {
  return request({
    url: '/withdrawal/withdrawal/' + withdrawalId,
    method: 'get'
  })
}

// 新增提现管理
export function addWithdrawal(data) {
  return request({
    url: '/withdrawal/withdrawal',
    method: 'post',
    data: data
  })
}

// 修改提现管理
export function updateWithdrawal(data) {
  return request({
    url: '/withdrawal/withdrawal',
    method: 'put',
    data: data
  })
}

// 删除提现管理
export function delWithdrawal(withdrawalId) {
  return request({
    url: '/withdrawal/withdrawal/' + withdrawalId,
    method: 'delete'
  })
}
