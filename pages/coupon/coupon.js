import { CouponModel } from '../../models/coupon'
import { MemberModel } from '../../models/member'
import wxbarcode from 'wxbarcode';
let couponModel = new CouponModel()
let memberModel = new MemberModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponBgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
    couponTabList: [
      { //可使用
        name: 'canUseCoupon',
        value: 1,
        text: '可使用',
        active: true
      },
      { //已使用使用
        name: 'usedCoupon',
        value: 2,
        text: '已使用',
        active: false
      },
      { //已过期
        name: 'expiredCoupon',
        value: 3,
        text: '已过期',
        active: false
      }
    ],
    coupons: [
      {
        name: 'discoutCoupon',
        value: 1,
        text: '立减券',
        active: true,
        list: []
      },
      {
        name: 'giftCoupon',
        value: 2,
        text: '礼品券',
        active: false,
        list: []
      }
    ],
    currentCouponList: [],//显示的券,
    couponCreate: [], //可使用
    couponUsed: [], //已使用
    couponDel: [], //已过期
    currentTab: 1,//1 可使用， 2已使用， 3已过期
    currentCouponType: 1, // 1立减券，2礼品券
    codeModalhidden: true,
    code: '1234567890987654321',
    cid: '',
    loading: false,
    confirmLoading: false,
    confirmDisabled: false,
    showConfirmButton: true,
    baseUrl: app.globalData.apiConfig.API_BASE,
    alreadyConfirm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  changeTab(e) {
    const selectedTabValue = e.currentTarget.dataset.value
    let tabList = this.data.couponTabList
    tabList.forEach(item => {
      if (item.value === selectedTabValue) {
        item.active = true
      } else {
        item.active = false
      }
    })
    this.setData({
      currentTab: selectedTabValue,
      couponTabList: tabList
    })
    this.computedCurrentCouponList()
  },
  changeCouponType(e) {
    const typValue = e.currentTarget.dataset.value
    let couponList = this.data.coupons
    couponList.forEach(item => {
      if (item.value === typValue) {
        item.active = true
      } else {
        item.active = false
      }
    })
    this.setData({
      currentCouponType: typValue,
      coupons: couponList
    })
    this.computedCurrentCouponList()
  },
  getCoupons() {
    this.showLoading()
    couponModel.getCoupons(app.globalData.phoneNumber)
      .then(res => {
        this.hideLoading()
        const datas = res
        if (!datas.couponCreate && !datas.couponUsed && !datas.couponDel) {
          return
        }
        if (datas && datas.couponCreate) {
          this.setData({
            couponCreate: datas.couponCreate,
          })
          this.computedCurrentCouponList()
        }
        if (datas && datas.couponUsed) {
          this.setData({
            couponUsed: datas.couponUsed,
          })
        }
        if (datas && datas.couponDel) {
          this.setData({
            couponDel: datas.couponDel,
          })
        }
      }).catch(error => {
        wx.showToast({
          title: error.message ? error.message : 'questionnaire/godivaCoupon/queryUserCoupons接口错误',
        })
      })
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
  confirmUseCoupon() {
    const that = this
    if (!that.data.alreadyConfirm) {
      this.setData({
        alreadyConfirm: true
      })
      return
    }
    this.setData({
      confirmDisabled: true,
      confirmLoading: true
    })
    const cookie = wx.getStorageSync('cookieKey')
    wx.setStorageSync('cookieKey', `godiva_oid=${app.globalData.publicopenid}`);
    couponModel.useCoupon(that.data.cid)
      .then(res => {
        this.setData({
          confirmDisabled: false,
          confirmLoading: false
        })
        if (res.code === 0) {
          wx.showModal({
            content: '优惠券使用成功',
            showCancel: false,
            confirmText: '好的',
            complete: (res1) => {
              if (res1.confirm) {
                that.getCoupons()
              }
              that.closeCodeModal()
            }
          })
        } else {
          wx.showModal({
            content: res.msg||'优惠券使用失败',
            showCancel: false,
            confirmText: '好的',
            complete: (res1) => {
              if (res1.confirm) {
                that.getCoupons()
              }
              that.closeCodeModal()
            }
          })
        }
      })
  },
  computedCurrentCouponList() {
    const tab = this.data.currentTab
    const type = this.data.currentCouponType
    let list = []
    switch (tab) {
      case 1:
        this.data.couponCreate.forEach(item => {
          if (item.coupon.type2 == type) {
            list.push(item)
          }
        })
        this.setCurrentCouponList(list)
        break
      case 2:
        this.data.couponUsed.forEach(item => {
          if (item.coupon.type2 == type) {
            list.push(item)
          }
        })
        this.setCurrentCouponList(list)
        break
      case 3:
        this.data.couponDel.forEach(item => {
          if (item.coupon.type2 == type) {
            list.push(item)
          }
        })
        this.setCurrentCouponList(list)
        break
      default:
    }
  },
  setCurrentCouponList(list) {
    this.setData({
      currentCouponList: list
    })
  },
  openCodeModal(e) {
    const code = e.currentTarget.dataset.code
    const cid = e.currentTarget.dataset.cid
    if (code.startsWith('CB') || code.startsWith('TC')) {
      this.setData({
        showConfirmButton: false
      })
    } else {
      this.setData({
        showConfirmButton: true
      })
    }
    this.setData({
      code,
      cid
    })
    this.getJsBarcode(this.data.code)
    this.setData({
      codeModalhidden: false,
      alreadyConfirm: false
    })
  },
  closeCodeModal() {
    this.setData({
      codeModalhidden: true
    })
  },
  getJsBarcode(code) {
    wxbarcode.barcode('barcode', code, 350, 100);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currentCouponList: []
    })

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