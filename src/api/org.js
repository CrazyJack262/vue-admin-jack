import request from '@/utils/request'

export function getTrees() {
  return request({
    url: '/org/trees',
    method: 'get'
  })
}

export function updateOrgyId(data) {
  return request({
    url: '/org/' + data.id,
    method: 'put',
    data
  })
}
