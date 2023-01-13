// components/choose-dialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true,
      observer: function(newVal, oldVal) {
        this.setData({
          hiddenmodalput: newVal
        });
      }
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
    },
    confirmDisabled: {
      type: Boolean,
      value: false
    },
    cancelDisabled: {
      type: Boolean,
      value: false
    },
    confirmLoading: {
      type: Boolean,
      value: false
    },
    cancelLoading: {
      type: Boolean,
      value: false
    },
    isCustomerFooter: {
      type: Boolean,
      value: false
    },
    showConfirmButton: {
      type: Boolean,
      value: true
    }
  },
  options:{
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    hiddenmodalput: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
     this.triggerEvent('close')
    },
    confirm () {
      this.triggerEvent('confirm')
    }
  }
})
