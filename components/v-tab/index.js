const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tab: {
      type: String,
      value: '0',
      observer: function (newVal, oldVal) {
        this.setData({
          currentTab: newVal
        }
        )
      }
    },
    record: {
      type: Object,
      observer: function (newVal, oldVal) {
        this.setData({
          allRecord: newVal,
          frozzePointList: newVal.type1,
          buyRecordList: newVal.type2,
          hudongPointLis: newVal.type3
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    bgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`, //
    fullbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/r_goldbg.jpg)`, //
    currentTab: 0,
    allRecord: Object,
    frozzePointList: [],
    buyRecordList: [],
    hudongPointLis: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //  tab切换逻辑
    swichNav: function (e) {
      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    },
    bindChange: function (e) {
      var that = this;
      that.setData({ currentTab: e.detail.current });
    }
  }
})
