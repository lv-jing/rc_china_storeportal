//app.js
import apiConfig from './api.js';

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    this.praseStorage('bgImage', `background-image: url(${this.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_goldbg.jpg)`)  
    this.checkSystemUpdate()
  },

  checkSystemUpdate() {
    //使用更新对象之前判断是否可用
    console.log('检查版本是否更新')
    if (wx.canIUse('getUpdateManager')){
     const updateManager = wx.getUpdateManager()
     updateManager.onCheckForUpdate(res =>  {
       // 请求完新版本信息的回调
       console.log(res.hasUpdate, '是否更新')//res.hasUpdate返回boolean类型
       if (res.hasUpdate) {
        this.setData({
          loading: false
        })
         updateManager.onUpdateReady(() => {
           wx.showModal({
             title: '更新提示',
             content: '新版本已经准备好，是否重启当前应用？',
             success(res) {
               if (res.confirm) {
                 // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                 updateManager.applyUpdate()
               }
             }
           })
         })
         // 新版本下载失败时执行
         updateManager.onUpdateFailed(() => {
           wx.showModal({
             title: '发现新版本',
             content: '请删除当前小程序，重新搜索打开...',
           })
         })
       } 
     })
   }else{
     //如果小程序需要在最新的微信版本体验，如下提示
     wx.showModal({
       title: '更新提示',
       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
     })
   }
  },

  praseStorage(key, value) {
    if(!wx.getStorageSync(key)) {
      wx.setStorageSync(key,value)
    }
  },
  globalData: {
    apiConfig,
    phoneNumber: '', // 手机号
    userInfo: null,
    unionId: '',
    publicopenid: '',
    loading: false,
    member: {} // 会员信息
  }
})