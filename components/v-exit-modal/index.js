// components/v-exit-modal/index.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
     confirm (e) {
       this.triggerEvent('confirm')
     },
  }
})
