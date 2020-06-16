import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/users/search',
    method: 'get',
    params: query
  })
}
