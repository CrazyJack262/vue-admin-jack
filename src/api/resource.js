import request from '@/utils/request'

export function searchResource(query) {
  return request({
    url: '/resource/search',
    method: 'get',
    params: query
  })
}

export function getById(id) {
  return request({
    url: '/resource/' + id,
    method: 'get'
  })
}

export function updateResourceById(data) {
  return request({
    url: '/resource/' + data.id,
    method: 'put',
    data
  })
}

export function saveResource(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}

export function deleteResourceById(id) {
  return request({
    url: '/resource/' + id,
    method: 'delete'
  })
}
