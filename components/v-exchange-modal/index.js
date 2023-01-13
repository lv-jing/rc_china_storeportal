import request from '../../request'
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
    confirmLoading: {
      type: Boolean,
      value: false
    },
    coupon: {
      type: Object,
      observer: function (newVal, oldVal) {
        if (newVal.couponNo === 'M220607300000') {
          this.setData({
            pointNum: 3,
            points: newVal.source * 3,
            disabledBtn: true
          }) // 10元立减*3（软冰）特殊处理
        } else {
          this.setData({
            pointNum: 1,
            points: newVal.source,
            disabledBtn: false
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    points: 0,
    pointNum: 1,
    Frequency: 1,
    baseURL: app.globalData.apiConfig.API_BASE,
    disabledBtn: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        pointNum: this.data.Frequency,
        points: 0
      })
      this.triggerEvent('close')
    },
    confirm(e) {
      this.exchangeCoupon()
    },
    addNum() {
      if(this.data.disabledBtn) {
        return
      }
      const pointNum = this.data.pointNum + this.data.Frequency
      const points = this.data.coupon.source * pointNum
      this.setData({
        pointNum,
        points
      })
    },
    reduceNum() {
      if(this.data.disabledBtn) {
        return
      }
      if (this.data.pointNum === this.data.Frequency) {
        return
      }
      const pointNum = this.data.pointNum - this.data.Frequency
      const points = this.data.coupon.source * pointNum
      this.setData({
        pointNum,
        points
      })
    },
    exchangeCoupon() {
      this.triggerEvent('confirm', { couponId: this.data.coupon.id, pointNum: this.data.pointNum })
      //  const params = {
      //   id: this.data.coupon.id,
      //   num: this.data.pointNum
      //  }
      //  this.setData({
      //   confirmDisabled: true,
      //   confirmLoading: true
      // })
      //  const cookie = wx.getStorageSync('cookieKey')
      //  wx.setStorageSync('cookieKey', `godiva_oid=${app.globalData.publicopenid}`);
      // request({
      //   url: `/mobile/api/coupon_convert`,
      //   method: 'Post',
      //   contentType: 'form',
      //   data: params
      // }).then(res => {
      //   this.setData({
      //     confirmDisabled: false,
      //     confirmLoading: false
      //   })
      //   if(res.data.code === 1) {
      //     wx.showToast({
      //       image: '../../images/error.png',
      //       title: res.data.msg,
      //       duration: 5000
      //     })
      //   } else if(res.data.code === 0){
      //     wx.showModal({
      //       content: '积分兑换成功',
      //       showCancel: false
      //     })

      //   }
      // }).catch(err => {

      // })
    }
  }
})
