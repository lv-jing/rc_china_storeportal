const app = getApp()
import { MemberModel } from '../../models/member'
import { ImagerModel } from '../../models/imager'
let wxbarcode = require('../../utils/barcode/index');
import {START_DATE,END_DATE} from '../../utils/constant'

let memberModel = new MemberModel()
const imagerModel = new ImagerModel()
/**
 * 入口：我的账户
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topbgStyle: '',
    fullbgStyle: '',
    cardProgressBar: '',
    cardFrontBgImage: '',
    normalBgImage: '',
    goldBgImage: '',
    platinumBgImage: '',
    cardBackBgImage: '',
    cardRotate: '',
    inited: false,
    showModal: false,
    cardFront: true,
    showCode: false,
    progressBar: {
      height: 0,
      innerBarRealHeight: 10,
      innerBarDefaultHeight: 10,
    },
    code: '',
    member: {},
    color: 'red',
    ruleModalHidden: true,
    loading: false,
    exitModalHidden: true,
    tempImage: '',
    options: null,
    pageRefresh: true,
    luckyHiddren: true,
    baseUrl: app.globalData.apiConfig.API_BASE,
    toLuckyHiddren: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options,
      loading: true,
      topbgStyle: imagerModel.praseTopbgStyleStorage(),
      cardProgressBar: imagerModel.praseCardProgressBarStorage(),
      cardBackBgImage: imagerModel.praseCardBackBgImageStorage(),
      cardRotate: imagerModel.praseCardRotateStorage(),
      fullbgStyle: imagerModel.praseBgImageStorage(),
      normalBgImage: imagerModel.getV1ImageStorage(),
      goldBgImage: imagerModel.getV2ImageStorage(),
      platinumBgImage: imagerModel.getV3ImageStorage(),
      aleadyCloseMiddleLuckyString: 'aleadyCloseMiddleLucky' + (new Date().getMonth() + 1) + new Date().getDate()
    })

    this.loadData(this.data.options)
  },

  loadData(options) {
    if (options && options.backfromindex) {
      this.setData({
        inited: true
      })
      return;
    }
    wx.setStorageSync('cookieKey', '');
    memberModel.getLoginCode()
      .then(res => {
        return memberModel.isMember(res)
      }).then(res => {
        if (res.data && res.code == 1) {
          app.globalData.unionId = res.data.unionid;
          app.globalData.publicopenid = res.data.publicopenid;
          if (res.data.ismember.toLowerCase() == 'true') {
            app.globalData.phoneNumber = res.data.phone;
            memberModel.setMemberStatusStorage(res.data.ismember.toLowerCase() == 'true' ? 1 : 2)
            this.setData({
              phone: res.data.phone
            });
            let nowDate = new Date().getTime()
            let startDate = new Date(`${START_DATE} 10:00:00`).getTime() // todo
            let endDate = new Date(`${END_DATE} 22:00:00`).getTime()
            if (nowDate <= endDate && nowDate >= startDate) {
              memberModel.addGuidLog({ phone: res.data.phone, type: '0' })
            }
            this.getUserInformation()
          } else {
            this.setData({
              loading: false
            })
            memberModel.setMemberStatusStorage(2)
            this.openExitModal()
          }
        } else {
          this.setData({
            loading: false
          })
          memberModel.setMemberStatusStorage(2)
          wx.showModal({
            title: '提示',
            content: err.errMsg ? err.errMsg : '抱歉，出现了错误',
            showCancel: false,
            confirmText: '好的'
          })
        }
      })
    // .catch(err => {
    //   this.setData({
    //     loading: false
    //   })
    //   wx.showModal({
    //       title: '提示',
    //       content: err.errMsg ? err.errMsg : '抱歉，出现了错误',
    //       showCancel: false,
    //       confirmText: '好的'
    //   })
    // })
  },

  showLucky() {
    let nowDate = new Date().getTime()
    let startDate = new Date(`${START_DATE} 10:00:00`).getTime() // todo
    let endDate = new Date(`${END_DATE} 22:00:00`).getTime()
    if (nowDate <= endDate && nowDate >= startDate) {
      this.setData({
        luckyHiddren: wx.getStorageSync(this.data.aleadyCloseMiddleLuckyString) ? true : false,
        toLuckyHiddren: false
      })
    }
    let linkHideData = new Date(`${END_DATE} 22:00:00`).getTime()
    if (nowDate > endDate && nowDate <= linkHideData) {
      this.setData({
        luckyHiddren: true,
        toLuckyHiddren: false
      })
    }
    if (nowDate > linkHideData) {
      this.setData({
        luckyHiddren: true,
        toLuckyHiddren: true
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

  L100(crmNo) {
    memberModel.L100({ crmNo }).then(res => {
      console.log(res, 'L100接口返回')
    })
  },
  updateMemberInfo(member) {
    const res = member
    memberModel.setMemberStorage(res)
    this.setData({
      loading: false,
      inited: true,
      member: res,
      code: res.no
    })
    if (res.level === 'v1') {
      this.setData({
        cardFrontBgImage: this.data.normalBgImage
      })
    } else if (res.level === 'v2') {
      this.setData({ //金卡
        cardFrontBgImage: this.data.goldBgImage
      })
    } else { //白金卡
      this.setData({
        cardFrontBgImage: this.data.platinumBgImage
      })
    }
    this.getJsBarcode(this.data.code)
  },
  getUserInformation() {
    if (this.data.pageRefresh) {
      memberModel.getMember(this.data.phone).then(res => {
        this.updateMemberInfo(res)
        if (res.no) {
          this.L100(res.no)
        }
      })
    } else {
      memberModel.getMemberOrStorage(this.data.phone).then(res => {
        this.updateMemberInfo(res)
        if (res.no) {
          this.L100(res.no)
        }
      })
    }
  },
  getJsBarcode(code) {
    const that = this
    wxbarcode.barcode('barcode', this.data.code, 350, 50);
    const ctx = wx.createCanvasContext('barcode');
    ctx.draw(true, setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'barcode',
        success: function (res) {
          that.setData({
            tempImage: res.tempFilePath
          })
        },
      })
    }, 1));
  },
  rotateCard(cardFront) {
    var that = this

    this.setData({
      cardFront: !that.data.cardFront,
    })
    // this.getJsBarcode(this.data.code)
  },
  toCoupon() {
    const that = this;
    wx.switchTab({
      url: `../coupon/coupon`
    })
  },
  toPointsManage() {
    wx.switchTab({
      url: `../pointsManage/pointsManage`
    })
  },
  toPointsShop() {
    let nowDate = new Date().getTime()
    let startDate = new Date(`${START_DATE} 10:00:00`).getTime() // todo
    let endDate = new Date(`${END_DATE} 22:00:00`).getTime()
    if (nowDate <= endDate && nowDate >= startDate) {
      memberModel.addGuidLog({ phone: this.data.phone, type: 'points-mall' })
    }
    wx.navigateTo({
      url: `../pointsShop/pointsShop`
    })
  },
  toUserInfo: function () {
    const that = this;
    wx.navigateTo({
      url: `../userInfo/userInfo?phone=${that.data.phone}`
    })
  },
  toAward: function () {
    wx.navigateTo({
      url: `../award/award`
    })
  },
  toRegister() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  toRegisterOrLogin: function () {
    if (!this.data.inited) {
      return;
    }
    wx.navigateTo({
      url: '../index/index?fromGuidePage=true'
    })
  },
  toRulPage: function () {
    // wx.showToast({
    //   title: '敬请期待！',
    //   duration: 3000
    // })
    wx.navigateTo({
      url: '../../pages/memberRights/memberRights'
    })
  },
  openRuleModal() {
    this.setData({
      ruleModalHidden: false
    })
  },
  openExitModal() {
    this.setData({
      exitModalHidden: false
    })
  },
  // closeExitModal() {
  //   this.setData({
  //     exitModalHidden: true
  //   })
  // },
  comfiemExitModal() {
    this.setData({
      exitModalHidden: true
    })
    this.toRegister()
  },
  closeRuleModal() {
    this.setData({
      ruleModalHidden: true
    })
  },
  comfiemRuleModal() {
    this.closeRuleModal()
  },
  bindscroll: function (e) {
    let percent = e.detail.scrollTop / e.detail.scrollHeight;
    let ret;
    if (percent < .1) {
      ret = this.data.progressBar.innerBarDefaultHeight;
    } else {
      ret = this.data.progressBar.height * (percent > .78 ? 1 : percent);
    }
    this.setData({
      'progressBar.innerBarRealHeight': ret
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

  hideLucky() {
    this.setData({
      luckyHiddren: true
    })
    wx.setStorageSync(this.data.aleadyCloseMiddleLuckyString, true)
  },
  linkToLucky: function () {
    wx.setStorageSync(this.data.aleadyCloseMiddleLuckyString, true)
    wx.navigateTo({
      url: '../lucky/lucky?source=leftLink'
    })
    this.setData({
      luckyHiddren: true
    })
  },
  modalToLucky: function () {
    wx.setStorageSync(this.data.aleadyCloseMiddleLuckyString, true)
    wx.navigateTo({
      url: '../lucky/lucky?source=modal'
    })
    this.setData({
      luckyHiddren: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.showLucky()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow-------')
    if (this.data.pageRefresh) { //
      return
    } else {
      this.loadData(this.data.options)
    }
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onhide-------')
    this.setData({
      pageRefresh: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onunload------')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.phone) {
      memberModel.getMember(this.data.phone).then(res => {
        this.updateMemberInfo(res)
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})