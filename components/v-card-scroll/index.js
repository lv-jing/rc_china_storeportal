// components/v-card-scroll/index.js
const DEFAULT_PAGE = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    startPageX: 0,
    currentView: DEFAULT_PAGE,
    toView: `card_${DEFAULT_PAGE}`,
    list: ['Javascript', 'Typescript', 'Java']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      this.setData({
        startPageX: e.changedTouches[0].pageX
      })
    },
  
    touchEnd(e) {
      const moveX = e.changedTouches[0].pageX - this.data.startPageX;
      const maxPage = this.data.list.length - 1;
      if (Math.abs(moveX) >= 50){
        if (moveX > 0) {
          this.setData({
            currentView: this.data.currentView !== 0 ? this.data.currentView - 1 : 0
          })
        } else {
          this.setData({
            currentView: this.data.currentView !== maxPage ? this.data.currentView + 1 : maxPage
          })
        }
      }
      this.setData({
        toView: `card_${this.data.currentView}`
      });
      console.log(this.data.toView, 'TOvIEW')
    }
  }
})
