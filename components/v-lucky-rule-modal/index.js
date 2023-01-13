// components/v-lucky-rule-modal/index.js
import {START_DATE_SRT,END_DATE_STR} from '../../utils/constant'

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: '30rpx',
    baseUrl: app.globalData.apiConfig.API_BASE,
    START_DATE_SRT,END_DATE_STR
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close')
     },
    scroll(e) {
      // console.log(e)
      let top = e.detail.scrollTop;
      if (top < 30) {
        top = 30
      }
      this.setData({
        scrollTop: top/2+'px'
      })
    }
  }
})
