const cookieParser = process.server ? require('cookieparser') : undefined

export const state = _ => {
  return {
    // 当前用户登录信息
    user: null
  }
}

export const mutations = {
  setUser(state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtServerInit 会在服务端渲染期间自动调用
  // 作用：初始化容器数据
  nuxtServerInit({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieParser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  }
}