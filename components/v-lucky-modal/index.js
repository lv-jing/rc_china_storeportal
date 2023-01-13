// components/v-lucky-modal/index.js
import {START_DATE,END_DATE} from '../../utils/constant'

const app = getApp()
const detalDate =(date)=>{
        console.info('date',date)
  let str =  date.substring(5)
  console.info('str',str)

  let dateStr = str[0]==0?str.substring(1):str
  console.info('dateStr',dateStr)
  return dateStr
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    noPoints: Boolean,
    title: String,
    tip: String,
    description: String,
    showLuckyTip: Boolean,
    showEndTip: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    startDate:detalDate(START_DATE),endDate:detalDate(END_DATE),
    baseUrl: app.globalData.apiConfig.API_BASE
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    close() {
      this.triggerEvent('onClose')
    },
    toCoupon(){
      this.triggerEvent('toCoupon')
    },
    luckyAgain() {
      this.triggerEvent('luckyAgain')
    },
    luckyNow() {
      this.triggerEvent('luckyNow')
    }
  }
})
