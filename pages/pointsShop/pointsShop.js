// pages/pointsShop/pointsShop.js
const app = getApp()
import request from '../../request'
import {CouponModel} from '../../models/coupon'
import { MemberModel } from '../../models/member'
import { ImagerModel } from '../../models/imager'
const imagerModel = new ImagerModel()
let memberModel = new MemberModel()
let couponModel = new CouponModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerBgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
    fullbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_goldbg.jpg)`,
    // fullbgStyle: '',
    type: 0, // 0 线下门店专区 1 www专区
    offlineCoupon: [],// 线下
    onlineCoupon: [],// www
    currentCouponList: [],
    exchangeModalHidden: true,
    currentCoupon: {}, // 当前选中的卡
    loading: false,
    pointModalHidden: true,
    confirmDisabled: false,
    confirmLoading: false,
    baseURL: app.globalData.apiConfig.API_BASE,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fullbgStyle: imagerModel.praseBgImageStorage()
    })
    if(!app.globalData.phoneNumber) {
      memberModel.getLoginCode()
      .then(res => {
        return memberModel.isMember(res)
      }).then(res => {
        if (res && res.data) {
          if (res.data.ismember.toLowerCase() == 'true') {
            app.globalData.phoneNumber = res.data.phone;
            this.getCoupons()
          }
        }
      })
    } else {
      this.getCoupons()
    }
  },
  onClickShow() {
    this.setData({
      show: true
    })
  },
  getCoupons() {
    const that = this
    this.showLoading()
    couponModel.getAllShopCoupons(app.globalData.phoneNumber)
    .then(res => {
      this.hideLoading()
      if(res) {
        const datas = res
        if(datas.offlineCoupon && datas.offlineCoupon.length > 0) {
          datas.offlineCoupon.forEach(item => {
            item.showBeginDate = item.beginDate.split(' ')[0]
            item.showEndDate = item.endDate.split(' ')[0]
          })
          this.setData({
            offlineCoupon: datas.offlineCoupon
          })
          this.computedCurrentCouponList()
        }
        if(datas.onlineCoupon && datas.onlineCoupon.length > 0) {
          datas.onlineCoupon.forEach(item => {
            item.showBeginDate = item.beginDate.split(' ')[0]
            item.showEndDate = item.endDate.split(' ')[0]
          })
          this.setData({
            onlineCoupon: datas.onlineCoupon
          })
        }
      }
    })
  },
  computedCurrentCouponList() {
    const type = this.data.type
    if(type == 0) {
      this.setData({
        currentCouponList: this.data.offlineCoupon
      })
    } else {
      this.setData({
        currentCouponList: this.data.onlineCoupon
      })
    }
  },
  openExchangeModal(e) {
    const { currentNum, totalNum } = e.currentTarget.dataset.current
    if(totalNum - currentNum === 0) 
    return
    this.setData({
      currentCoupon: e.currentTarget.dataset.current,
      exchangeModalHidden: false
    })
  },
  closeExchangeModal() {
    this.setData({
      exchangeModalHidden: true
    })
  },
  onClose() {
    this.setData({
      pointModalHidden: true
    })
  },
  toPointsLeyuan() {
    wx.navigateTo({
      url: `../../pages/account/account?desurl=points`,
    })
  },
  comfiemExchangeModal(e) {
    const params = {
      id: e.detail.couponId,
      num: e.detail.pointNum
     }
     const that = this
     this.setData({
      confirmDisabled: true,
      confirmLoading: true
    })
     const cookie = wx.getStorageSync('cookieKey')
     wx.setStorageSync('cookieKey', `godiva_oid=${app.globalData.publicopenid}`);
     console.log(params, 'params----------')
    request({
      url: `/mobile/api/coupon_convert`,
      method: 'Post',
      contentType: 'form',
      data: params
    }).then(res => {
      this.setData({
        confirmDisabled: false,
        confirmLoading: false
      })
      if(res.data.code === 1) {
        this.setData({
          pointModalHidden: false
        })
      } else if(res.data.code === 0){
        wx.showModal({
          content: '积分兑换成功',
          showCancel: false,
          confirmText: '好的',
          complete: (res) => {
            memberModel.getMember(app.globalData.phoneNumber).then(res => {
              memberModel.setMemberStorage(res)
            })
            this.getCoupons()
          }
        })
      } else if (res.data.code === 2 || res.data.code === 3 ) {
        wx.showModal({
          content: res.data.msg ? res.data.msg: '兑换失败',
          showCancel: false,
          confirmText: '好的'
        })
      }
      this.closeExchangeModal()
    }).catch(err => {

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showLoading() {
    this.setData({
      loading: true
    })
  },
  hideLoading() {
    this.setData({
      loading: false
    })
  },
  changeTab(e) {
    const type = e.currentTarget.dataset.type;
    if(type === this.data.type) {
      return
    }
    this.setData({
      type
    })
    this.computedCurrentCouponList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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