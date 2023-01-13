export  function showLoading() {  //全局loading
  wx.showLoading({
    title: '加载中'
  })
}
export  function hideLoding(callback) {
  wx.hideLoading({
    complete: (res) => {
      callback()
    },
  })
}