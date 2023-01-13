
const app = getApp();
const tips = {
  1: '抱歉，出现了一个错误'
}
class Http {
  request({url, method='Get', data={}, contentType = 'application/json'}) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, method, data, contentType)
    })
  }
  _request(url, resolve, reject, method = 'Get', data = {} , contentType = 'application/json'){
    wx.request({
      url: app.globalData.apiConfig.API_BASE + url,
      method: method,
      header: {
        'godiva_oid': app.globalData.publicopenid || '',
        'Cookie': wx.getStorageSync('cookieKey') ? wx.getStorageSync('cookieKey') : '',
        'content-type': contentType === 'form' ? 'application/x-www-form-urlencoded' : contentType
      },
      data,
      success: (res) => {
        if(res.statusCode.toString().startsWith('2')) {
          resolve(res.data)
        } else {
          reject()
          if(res.data.msg) {
            this._showError(res.statusCode, res.data.msg)
          } else {
            this._showError(1)
          }
        }
      },
      fail: (err) => {
        reject()
        this._showError(1)
      }
    })
  }

  _showError(statusCode, errMsg = '') {
    wx.showModal({
      title: '提示',
      content: tips[statusCode] ? tips[statusCode] : errMsg,
      showCancel: false,
      confirmText: '好的'
    })
  }
  _normalizeUserCookie(cookies = '') {
    let __cookies = [];
    (cookies.match(/([\w\-.]*)=([^\s=]+);/g) || []).forEach((str) => {
      if (str !== 'Path=/;' && str.indexOf('csrfToken=') !== 0) {
        __cookies.push(str);
      }
    });
    return __cookies.join(' ')
  }
  
}

export {
  Http
}