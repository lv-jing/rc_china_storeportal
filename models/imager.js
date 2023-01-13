import { Http } from '../utils/http'
const app = getApp()
class ImagerModel extends Http {

  //我的账户背景图片
  praseBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_goldbg.jpg)`
    return this._praseStorage('bgImage', value)
  }
  praseTopbgStyleStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/banner.png)`
    return this._praseStorage('topbgStyle', value)
  }
  praseCardProgressBarStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/progress.png)`
    return this._praseStorage('cardProgressBar', value)
  }
  praseCardBackBgImageStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/card2/card_back.png)`
    return this._praseStorage('cardBackBgImage', value)
  }

  praseCardRotateStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/card2/card_rotate.png`
    return this._praseStorage('cardRotate', value)
  }


  getV1ImageStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/card2/card_bg1.png)`
    return this._praseStorage('v1', value)
  }

  getV2ImageStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/card3/card_bg.png)`
    return this._praseStorage('v2', value)
  }

  getV3ImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/card1/card_bg.png)`
    return this._praseStorage('v3', value)
  }

  // 积分管理图片
  praseBuyBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/a_listbg1.png)`
    return this._praseStorage('buyBgImage', value)
  }
  prasepointsBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/a_listbg2.png)`
    return this._praseStorage('pointsBgImage', value)
  }

  // 额外信息图片
  praseInfoBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/e_listbg1.png)`
    return this._praseStorage('infoBgImage', value)
  }
  praseShareBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/e_listbg2.png)`
    return this._praseStorage('shareBgImage', value)
  }

  prasePointsBgImageStorage() {
    const value =  `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/e_listbg3.png)`
    return this._praseStorage('sharePointsBgImage', value)
  }
  praseBannerBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/r_topbg.jpg)`
    return this._praseStorage('bannerBgImage', value)
  }

  praseLuckyBgImageStorage() {
    const value = `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/lucky/banner.png)`
    return this._praseStorage('luckyBgImage', value)
  }



  _praseStorage(key ,value) {
    if(wx.getStorageSync(key)) {
      return wx.getStorageSync(key)
    } else {
      wx.setStorageSync(key, value)
      return value
    }
  }
}

export {
  ImagerModel
}