import { ImagerModel } from '../../models/imager'
const imagerModel = new ImagerModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoBgImage: '',
    shareBgImage: '',
    pointsBgImage: '',
    bannerBgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
    shareHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      infoBgImage: imagerModel.praseInfoBgImageStorage(),
      shareBgImage: imagerModel.praseShareBgImageStorage(),
      pointsBgImage: imagerModel.prasePointsBgImageStorage(),
    })
  },
  goCompleteMember() {
    wx.navigateTo({
      url: '../../pages/fullInfo/fullInfo',
    })
  },
  toPointsLeyuan() {
    wx.navigateTo({
      url: `../../pages/account/account?desurl=points`,
    })
  },
  share() {
    this.setData({
      shareHidden: false
    })
  },
  hide() {
    this.setData({
      shareHidden: true
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
    // return {
    //   title: '邀请好友成功注册获得50积分奖励',
    //   path: 'pages/index/index?inviteId=' + wx.getStorageSync('member').id,
    //   imageUrl: app.globalData.apiConfig.API_BASE + '/assets/godiva/images/member/r_topbg.jpg'
    // }
  }
})