import request from '@/utils/request'

export function getRoleList(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function getAllRoleList() {
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}

export function getMenuByRoleId(roleId) {
  return request({
    url: '/role/' + roleId + '/menu',
    method: 'get'
  })
}

export function updateRoleyId(data) {
  return request({
    url: '/role/' + data.id,
    method: 'put',
    data
  })
}

export function saveRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
export function saveRoleMenu(data) {
  return request({
    url: '/role/' + data.roleId + '/menu',
    method: 'post',
    data
  })
}

export function deleteRoleById(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}

