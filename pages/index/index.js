//index.js
//获取应用实例
const app = getApp()

import request from '../../request.js'
/**
   * 入口：会员注册
   */
Page({
  data: {
    topbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_topbg_v2.jpg)`,
    fullbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_goldbg.jpg)`,
    inited: false,
    isChecked: true,
    showModal: false,
    showTip: false,
    showAgree: false,
    showExit: false,
    progressBar: {
      height: 0,
      innerBarRealHeight: 10,
      innerBarDefaultHeight: 10,
    },
    phone: '',
    fromGuidePage: false,
    showSuccessToast: false,
    isSystemUpdated: false,
    register_channel: null, //扫小程序码传递活动名称
    recommendId: '',
    inviteId: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    console.log('注册onshow')
    wx.hideHomeButton()
  },
  onLoad: function (options) {
    if (options.register_channel) {
      this.register_channel = options.register_channel
    }
    if (options.recommendId) {
      this.setData({
        recommendId: options.recommendId
      })
    }
    if (options.inviteId) {
      this.setData({
        inviteId: options.inviteId
      })
    }
    console.log(options, '注册options---------------')
    let aleadyCloseMiddleLuckyString = 'aleadyCloseMiddleLucky' + (new Date().getMonth() + 1) + new Date().getDate()
    wx.setStorageSync(aleadyCloseMiddleLuckyString,false)
    this.loadData(options)
  },
  loadData(options) {
    const that = this;
    let redirectUrl = '';
    // 跳转目标页面
    if (options && options.redirect) {
      redirectUrl = options.redirect;
    }
    // 已经请求过ismemberByCode
    if (options && options.fromGuidePage) {
      that.setData({
        inited: true,
        fromGuidePage: true
      })
    } else {
      wx.setStorageSync('cookieKey', '');
      wx.login({
        success: ret => {
          let loginCode = ret.code;
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (loginCode) {
            setTimeout(function () {
              //发起网络请求
              request({
                url: '/scrm/ismemberByCode',
                contentType: 'form',
                data: {
                  code: loginCode
                },
                showLoading: false,
              }).then(res => {
                if (res && res.header) {
                  let cookit = res.header['set-cookie'] || res.header['Set-Cookie']
                  if (cookit) {
                    wx.setStorageSync('cookieKey', that.normalizeUserCookie(cookit)); //保存Cookie到Storage
                  }
                }
                if (res && res.data && res.data.code == 1) {
                  app.globalData.unionId = res.data.data.unionid;
                  if (res.data.data.ismember.toLowerCase() == 'true') {
                    app.globalData.phoneNumber = res.data.data.phone;
                    that.setData({
                      phone: res.data.data.phone
                    });
                    wx.switchTab({
                      url: '../guide/guide',
                    })
                  }
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res && res.data && res.data.msg || 'ismemberByCode接口失败，请稍后重试。'
                  })
                }
                that.setData({
                  inited: true
                })
              }).catch(err => {
                console.log(err)
                wx.showModal({
                  title: '提示',
                  content: err && err.msg || 'ismemberByCode接口错误，请稍后重试。'
                })
              })
            }, 1000)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail: err => {
          if (err && err.errMsg) {
            wx.showModal({
              title: '提示',
              content: err.errMsg ? err.errMsg : '获取登录码失败，请退出重试'
            })
          }
        }
      })
    }
  },

  normalizeUserCookie(cookies = '') {
    let __cookies = [];
    (cookies.match(/([\w\-.]*)=([^\s=]+);/g) || []).forEach((str) => {
      if (str !== 'Path=/;' && str.indexOf('csrfToken=') !== 0) {
        __cookies.push(str);
      }
    });
    return __cookies.join(' ')
  },
  showTip() {
    this.setData({
      showTip: true
    })
  },
  closeTip() {
    this.setData({
      showTip: false
    })
  },
  getPhoneNumber: function (e) {
    const that = this;
    if (e.detail.errMsg.startsWith("getPhoneNumber:fail Error:")) { //微信会自动给出提示
      return
    }
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {//用户点击拒绝
      this.setData({
        showExit: true
      });
    } else {//用户点击接受
      request({
        url: '/scrm/decodePhone',
        contentType: 'form',
        data: {
          encrypdata: e.detail.encryptedData,
          ivdata: e.detail.iv
        },
      })
        .then(res => {
          if (res && res.data && res.data.code == 1) {
            app.globalData.phoneNumber = res.data.data.phoneNumber;
            that.setData({
              phone: res.data.data.phoneNumber
            })
            that.getPhoneNumberCallback();
          } else {
            wx.showModal({
              title: '提示',
              content: res.data && res.data.msg || '手机号解码失败，请稍后重试'
            })
          }
        })
        .catch(err => {
          wx.showModal({
            title: '提示',
            content: '手机号解码失败，请稍后重试！'
          })
        })
    }
  },
  getPhoneNumberCallback: function () {
    this.setData({
      showAgree: true
    });

    // 若存在用户信息，则无需弹框
    // const { userInfo } = app.globalData
    // if (userInfo) {
    //   this.toRegister();
    // } else {
    //   this.setData({
    //     showAgree: true
    //   });
    // }
  },
  switchStatus: function () {
    this.setData({
      isChecked: !this.data.isChecked
    })
  },
  showRegisterRule: function () {
    if (!this.data.progressBar.height) {
      setTimeout(() => {
        var query = wx.createSelectorQuery();
        //选择id
        var that = this;
        query.select('#progress').boundingClientRect(function (rect) {
          if (rect) {
            that.setData({
              'progressBar.height': rect.height
            })
          }
        }).exec();
      }, 500)
    }
    this.setData({
      showModal: true,
      'progressBar.innerBarRealHeight': this.data.progressBar.innerBarDefaultHeight
    })
  },
  hideRegisterRule: function () {
    this.setData({
      showModal: false
    })
  },
  preventTouchMove: function () {

  },
  bindscroll: function (e) {
    let percent = e.detail.scrollTop / e.detail.scrollHeight;
    let ret;
    if (percent < .1) {
      ret = this.data.progressBar.innerBarDefaultHeight;
    } else {
      ret = this.data.progressBar.height * (percent > .95 ? 1 : percent);
    }
    this.setData({
      'progressBar.innerBarRealHeight': ret
    })
  },
  getUserProfile(e) {
    const that = this;
    that.setData({
      showAgree: false
    });
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res);
        app.globalData.userInfo = res.userInfo;
        that.toRegister();
      },
      fail(res) {
        wx.showModal({
          content: '获取用户信息失败',
          confirmText: '好的',
          showCancel: false
        })
      }
    })
  },
  // getUserInfo(e) {
  //   const that = this;
  //   that.setData({
  //     showAgree: false
  //   });
  //   // 获取用户授权
  //   wx.getSetting({
  //     success(res) {
  //       if (res.authSetting['scope.userInfo']) {
  //         console.log("已授权=====")
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //         wx.getUserInfo({
  //           success(res) {
  //             console.log("获取用户信息成功", res);
  //             app.globalData.userInfo = res.userInfo;
  //             that.toRegister();
  //           },
  //           fail(res) {
  //             wx.showModal({
  //               content: '获取用户信息失败',
  //               confirmText: '好的',
  //               showCancel: false
  //             })
  //           }
  //         })
  //       } else {
  //         console.log("未授权=====")
  //         that.toRegister();
  //       }
  //     },
  //     fail: function () {
  //       wx.showModal({
  //         content: '获取用户授权失败',
  //         confirmText: '好的',
  //         showCancel: false
  //       })
  //     }
  //   })
  // },
  // 无论是否同意授权，都将注册
  toRegister() {
    const that = this;
    let param = {
      avatarUrl: '',
      city: '',
      country: '',
      gender: '',
      language: '',
      nickName: '',
      province: '',
      unionid: app.globalData.unionId,
      registerChannel: this.register_channel || null,
      recommendId: this.data.recommendId || null,
      inviteId: this.data.inviteId || null,
    }
    param = Object.assign({}, param, app.globalData.userInfo || {})
    let duration = 2000;
    console.log(param, '注册参数')
    if (that.processRegister) {
      return false
    }
    that.processRegister = true;
    request({
      url: '/scrm/register',
      data: param,
    })
      .then(res => {
        that.processRegister = false
        if (res && res.data && res.data.code == 1) {
          // 已注册
          if (app.globalData.userInfo) {
            // 注册成功，跳转抽奖页面
            that.setData({
              showSuccessToast: true
            })
            setTimeout(function () {
              that.setData({
                showSuccessToast: false
              })
              wx.redirectTo({
                url: '../lottery/lottery'
              })
            }, duration)
          } else {
            // 注册成功，拒绝用户授权，跳转个人信息完善页           
            wx.redirectTo({
              url: '../account/account?desurl=update&needBackToMiniPro=true'
            })
          }
        } else if (res && res.data && res.data.code == 2) {
          // 老用户=> 数据有但是需要微信需要重新授权,直接同步微信信息，跳转主页
          wx.showModal({
            title: '提示',
            content: res && res.data && res.data.msg || '注册失败，请稍后重试。',
            showCancel: false,
            confirmText: '好的',
            complete: (res1) => {
              if (res1.confirm) {
                wx.redirectTo({
                  url: `/pages/guide/guide`
                })
              }
            }
          })
        }
        else if (res && res.data && res.data.code == 3) {
          wx.showModal({
            title: '提示',
            content: '该微信已绑定相关会员，请使用原先手机号登录，如需使用新手机号登录，还请联系在线客服。',
            showCancel: false,
            confirmText: '好的'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res && res.data && res.data.msg || '注册失败，请稍后重试。'
          })
        }
      })
      .catch(err => {
        that.processRegister = false
        wx.showModal({
          title: '提示',
          content: err && err.msg || '注册失败，请稍后重试。'
        })
      })
  },
  cancelAuth() {
    this.setData({
      showAgree: false
    });
  },
  closeExitPop() {
    this.setData({
      showExit: false
    });
  },
  goBackToPrePage() {
    wx.reLaunch({
      url: '/pages/guide/guide?backfromindex=true',
    })
  }
})