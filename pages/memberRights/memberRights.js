import { ImagerModel } from '../../models/imager'
const imagerModel = new ImagerModel()
const DEFAULT_PAGE = 0;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/card2/card_bg1.png)`,
    cardText: 'Classic 经典卡',
    normalBgImage: '',
    goldBgImage: '',
    platinumBgImage: '',
    bannerBgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
    startPageX: 0,
    currentView: DEFAULT_PAGE,
    toView: `card_${DEFAULT_PAGE}`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      normalBgImage: imagerModel.getV1ImageStorage(),
      goldBgImage: imagerModel.getV2ImageStorage(),
      platinumBgImage: imagerModel.getV3ImageStorage()
    })
  },
  touchStart(e) {
    this.data.startPageX = e.changedTouches[0].pageX;
  },
  touchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.data.startPageX;
    const maxPage = 2;
    if (Math.abs(moveX) >= 20){
      if (moveX > 0) {
        this.setData({
          currentView : this.data.currentView !== 0 ? this.data.currentView - 1 : 0
        })
      } else {
        this.setData({
          currentView : this.data.currentView !== maxPage ? this.data.currentView + 1 : maxPage
        })
      }
    }
    this.setData({
      toView: `card_${this.data.currentView}`
    });
  },
  onTouchStart(e) {
    this.data.startPageX = e.changedTouches[0].pageX;
  },
  onTouchMove(e) {
  },
  onTouchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.data.startPageX;
    const maxPage = 2;
    if (Math.abs(moveX) >= 50){
      if (moveX > 0) {
        this.setData({
          currentView : this.data.currentView !== 0 ? this.data.currentView - 1 : 0
        })
      } else {
        this.setData({
          currentView : this.data.currentView !== maxPage ? this.data.currentView + 1 : maxPage
        })
      }
    }
    this.setData({
      toView: `card_${this.data.currentView}`,
      cardImage: this.data.currentView == 0 ? this.data.normalBgImage : this.data.currentView == 1 ? this.data.goldBgImage : this.data.platinumBgImage,
      cardText: this.data.currentView == 0 ? 'Classic 经典卡' : this.data.currentView == 1 ? 'Gold 金卡' : 'Platinum 白金卡'
    });
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

  }
})