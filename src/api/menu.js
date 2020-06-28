import request from '@/utils/request'

export function getTrees() {
  return request({
    url: '/menu/trees',
    method: 'get'
  })
}

export function getTreeList() {
  return request({
    url: '/menu/listAll',
    method: 'get'
  })
}

export function getById(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function updateMenuById(data) {
  return request({
    url: '/menu/' + data.id,
    method: 'put',
    data
  })
}

export function saveMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function deleteMenuById(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}
