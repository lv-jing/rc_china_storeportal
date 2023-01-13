
const app = getApp();

function requst({ url, method = 'Post', contentType = 'json', data = {}, showLoading = false }) {
  return new Promise((resolve, reject) => {
    let cookie = wx.getStorageSync('cookieKey');
    let header = {};
    if (contentType === 'form') {
      header['content-type'] = 'application/x-www-form-urlencoded';
    }
    if (cookie) {
      header.Cookie = cookie;
    }
    if (showLoading) {
      wx.showLoading({
        title: '加载中',
      })
    }
    wx.request({
      url: `${app.globalData.apiConfig.API_BASE}${url}`,
      method: method,
      header,
      data,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) {
          resolve(res)
        } else {
          reject({
            msg: `网络错误:${res.statusCode}`,
            detail: res
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        reject(err)
      }
    })
  })
}

export default requst