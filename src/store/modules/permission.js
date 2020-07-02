import { constantRoutes, asyncRoutes, jackRoutes } from '@/router'
import { getPcTrees } from '@/api/menu'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export const filterAsyncRouter = (menuList, routes) => { // 遍历后台传来的路由字符串，转换为组件对象
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menuList, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(menuList, tmp.children)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 是否授权
 *
 * @param menuList
 * @param route
 * @returns {boolean}
 */
function hasPermission(menuList, route) {
  return menuList.includes(route.path)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes).concat(asyncRoutes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getPcTrees().then(response => {
        const { data } = response
        const asyncRouter = filterAsyncRouter(data, jackRoutes)
        commit('SET_ROUTES', asyncRouter)
        resolve(asyncRouter)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
