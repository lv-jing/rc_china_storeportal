// pages/pointsManage/pointsManage.js
import { MemberModel } from '../../models/member'
import { ImagerModel } from '../../models/imager'
let memberModel = new MemberModel()
const imagerModel = new ImagerModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyBgImage: '',
    pointsBgImage: '',
    ruleModalHidden: true,
    totalPoints: 0, // 总积分
    canUsePoints: 0, // 可用积分
    freezingPoints: 0, // 冻结积分
    endTime: null,
    phone: '',
    loading: false,
    topbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      phone: app.globalData.phoneNumber,
      buyBgImage: imagerModel.praseBuyBgImageStorage(),
      pointsBgImage: imagerModel.prasepointsBgImageStorage()
    })
    if (!this.data.phone) {
      return
    }
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
  getUserInformation() {
    this.showLoading()
    memberModel.getMemberOrStorage(this.data.phone).then(res => {
      memberModel.setMemberStorage(res)
      this.hideLoading()
      this.setData({
        totalPoints: res.source,
        canUsePoints: res.sourceY,
        freezingPoints: res.sourceN,
        endTime: res.endTime
      })
    })
  },
  openRuleModal() {
    this.setData({
      ruleModalHidden: false
    })
  },
  closeRuleModal() {
    this.setData({
      ruleModalHidden: true
    })
  },
  comfiemRuleModal() {
    this.closeRuleModal()
  },
  toPointsRecord(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `../pointsRecord/pointsRecord?type=${type}`
    })
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
    this.getUserInformation()
    // if(wx.getStorageSync('member')) {
    //   this.setData({
    //     totalPoints: wx.getStorageSync('member').source,
    //     canUsePoints: wx.getStorageSync('member').sourceY,
    //     freezingPoints: wx.getStorageSync('member').sourceN,
    //     endTime: wx.getStorageSync('member').endTime,
    //     phone: app.globalData.phoneNumber
    //   })
    // } else {
    //   this.getUserInformation()
    // }
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