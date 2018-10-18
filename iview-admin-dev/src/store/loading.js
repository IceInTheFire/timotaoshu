export default {
  state: {
      loading: false
  },
  mutations: {
    updateLoading (state, payload) {
      state.loading = payload.loading
    }
  },
  actions: {
  }
}
