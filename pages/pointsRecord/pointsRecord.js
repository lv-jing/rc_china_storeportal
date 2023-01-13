// pages/pointsRecord/pointsRecord.js
import request from '../../request.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   phone: '',
   type: 0, // 0, 1, 2,
   record: {},
   loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    
    if(!app.globalData.phoneNumber) {
      return
    } else{
      this.setData({
        phone: app.globalData.phoneNumber
      })
    }
    this.loadData()
  },
  loadData() {
    this.showLoading()
    request({
      url: `/scrm/godiva/godivaMember/memberRecord`,
      method: 'Post',
      contentType: 'json',
      data: {phone: this.data.phone}
    }).then(res => {
      this.hideLoading()
      this.setData({
        record: res.data
      })
    }).catch(err => {

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