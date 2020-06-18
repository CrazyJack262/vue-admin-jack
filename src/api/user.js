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

export function searchList(query) {
  return request({
    url: '/users/search',
    method: 'get',
    params: query
  })
}

export function saveUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function getUserById(id) {
  return request({
    url: '/users/' + id,
    method: 'post'
  })
}

export function updateUserById(data) {
  return request({
    url: '/users/' + data.id,
    method: 'put',
    data
  })
}

export function deleteUserById(id) {
  console.log(id)
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}
