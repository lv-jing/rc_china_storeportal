const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { desurl, needBackToMiniPro = false } = options;
    this.needBackToMiniPro = needBackToMiniPro;
    this.desurl = desurl;
    const { phoneNumber } = app.globalData;
    let urlMap = {
      'rule': `${app.globalData.apiConfig.API_BASE}/mobile/web/member/rule`, // 会员权益
      'default': `${app.globalData.apiConfig.API_BASE}/scrm/toMemberAccountPage2`, // 我的账户
      'points': `${app.globalData.apiConfig.API_BASE}/mobile/web`, // 积分乐园
      'coupon': `${app.globalData.apiConfig.API_BASE}/scrm/questionnaire/godivaCoupon/toCouponPage`, // 我的票券
      'update': `${app.globalData.apiConfig.API_BASE}/scrm/toMemberPage`, // 个人信息完善页
      'cm': `${app.globalData.apiConfig.API_BASE}/mobile/web/cm`,// 在线客服
      'pointshop': `${app.globalData.apiConfig.API_BASE}/scrm/mobile/web/shop`//积分商城
    }

    let url = (urlMap[desurl] || urlMap['default']) + `?miniprogram=true&phone=${phoneNumber}&needBackToMiniPro=${needBackToMiniPro}`;
    console.log(url);
    this.setData({ url })
  },
  handleLoad: function () {

  },
  handleError: function (e) {
    const that = this;
    // wx.redirectTo({
    //   url: `../account/account?needBackToMiniPro=${that.needBackToMiniPro}&desurl=${that.desurl}`,
    //   success: function(){
    //     console.log('success')
    //   },
    //   fail: function(){
    //     console.log('fail');
    //   }
    // });
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
    wx.hideHomeButton()
  }
})