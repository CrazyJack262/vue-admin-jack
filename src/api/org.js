import request from '@/utils/request'

export function getTrees() {
  return request({
    url: '/org/trees',
    method: 'get'
  })
}

export function getOrgList() {
  return request({
    url: '/org/list',
    method: 'get'
  })
}

export function updateOrgById(data) {
  return request({
    url: '/org/' + data.id,
    method: 'put',
    data
  })
}

export function saveOrg(data) {
  return request({
    url: '/org',
    method: 'post',
    data
  })
}

export function saveOrgUser(data) {
  return request({
    url: '/orgUser',
    method: 'post',
    data
  })
}

export function deleteOrgUserByUserId(id) {
  return request({
    url: '/orgUser/' + id,
    method: 'delete'
  })
}

export function deleteOrgById(id) {
  return request({
    url: '/org/' + id,
    method: 'delete'
  })
}
