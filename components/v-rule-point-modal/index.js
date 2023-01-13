// components/v-rule-point-modal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ''
    },
    confimText: {
      type: String,
      value: '好的'
    },
    cancelText: {
      type: String,
      value: '返回'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: '30rpx'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close')
     },
     confirm (e) {
       this.triggerEvent('confirm')
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
