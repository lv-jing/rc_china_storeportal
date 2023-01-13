// components/v-giftbaskets-modal/index.js
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
    },
    tip:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseUrl: app.globalData.apiConfig.API_BASE,
    START_DATE_SRT,
    END_DATE_STR
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('onClose')
    }
  }
})
