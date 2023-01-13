// components/v-point-modal/index.js
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
    title: String,
    btnText: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/fail.png)`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('onClose')
    },
    more () {
      this.triggerEvent('onMore')
    }
  }
})
