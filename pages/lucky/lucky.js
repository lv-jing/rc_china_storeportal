import { ImagerModel } from '../../models/imager'
import { MemberModel } from '../../models/member'
import {START_DATE,END_DATE} from '../../utils/constant'

const imagerModel = new ImagerModel()

import { LuckyModel } from '../../models/lucky'
let luckyModel = new LuckyModel()
let memberModel = new MemberModel()

const app = getApp()
const noColor = 'rgba(255,255,255,0)'
const op1 = 1
// pages/lucky/lucky.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: [noColor, noColor, noColor, noColor, noColor, noColor, noColor, noColor],
    opacity: [op1, op1, op1, op1, op1, op1, op1, op1],
    bannerBgImage: '',
    luckyTime: 0,
    luckyRecords: [],
    btnDisabled: false,
    baseUrl: app.globalData.apiConfig.API_BASE,
    luckyModalHidden: true,
    modalTitle: '',
    modalDescription: '',
    ruleModalHidden: true,
    loading: false,
    isNoPotions: false,
    showLuckyTip: false,
    showEndTip: false,
    tip:'活动已结束'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowDate = new Date().getTime()
    let startDate = new Date(`${START_DATE} 10:00:00`).getTime() // todo
    let endDate = new Date(`${END_DATE} 22:00:00`).getTime()
    if (nowDate > endDate || nowDate < startDate) {
      this.setData({
        btnDisabled: true,
        showEndTip: true,
        luckyModalHidden: false,
        luckyTime: 0,
        tip:nowDate<startDate?'活动未开始':'活动已结束'
      })
    }
    let that = this
    let source = options.source
    let memberId = wx.getStorageSync('member').id;
    if (!memberId) {
      memberModel.getLoginCode()
        .then(res => {
          return memberModel.isMember(res)
        }).then(res => {
          if (res && res.data) {
            if (res.data.ismember.toLowerCase() == 'true') {
              app.globalData.phoneNumber = res.data.phone;
              memberModel.getMember(res.data.phone).then(res => {
                memberModel.setMemberStorage(res)
                that.getLuckyRecords()
                if (nowDate <= endDate) {
                  luckyModel.addLuckyLog({ phone: res.data.phone, type: source })
                }
              })
            } else {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          } else {
            wx.redirectTo({
              url: '../index/index',
            })
          }
        })
    } else {
      this.getLuckyRecords()
      if (nowDate <= endDate) {
        luckyModel.addLuckyLog({ phone: app.globalData.phoneNumber ? app.globalData.phoneNumber : wx.getStorageSync('member').username, type: source })
      }
    }
    this.setData({
      bannerBgImage: imagerModel.praseLuckyBgImageStorage()
    })
  },

  luckyAgain() {
    if (this.data.luckyTime === 0) {
      this.setData({
        luckyModalHidden: false,
        showLuckyTip: true
      })
    } else {
      this.luckyNow()
    }
  },

  luckyNow() {
    let nowDate = new Date().getTime()
    let endDate = new Date(`${END_DATE} 22:00:00`).getTime()
    if (nowDate > endDate) {
      this.setData({
        btnDisabled: true,
        showEndTip: true,
        luckyModalHidden: false,
        luckyTime: 0
      })
      this.data
      return
    }
    this.setData({
      btnDisabled: true,
      luckyModalHidden: true
    })
    luckyModel.luckyAciont(wx.getStorageSync('member').id).then(res => {
      let which = 0
      if (res.code === 1) {
        if (res.data.type === '10') {
          this.setData({
            modalTitle: '哎呀~积分不足',
            isNoPotions: true,
            luckyModalHidden: false,
            showLuckyTip: false,
            btnDisabled: false
          })
          return
        } else if (res.data.type === '0') {
          let noAwardArray = ['0', '5', '6', '7']
          which = noAwardArray[Math.floor((Math.random() * noAwardArray.length))]
        } else {
          which = res.data.type
        }
        this.stop(parseInt(which))
      } else {
        wx.showModal({
          title: '提示',
          content: res && res.data && res.data.msg || '抽奖接口失败，请稍后重试。'
        })
        this.setData({
          btnDisabled: false,
          luckyModalHidden: true
        })
      }
    }).catch(err => {
      wx.showModal({
        title: '提示',
        content: err && err.msg || '抽奖接口错误，请稍后重试。'
      })
      this.setData({
        btnDisabled: false,
        luckyModalHidden: true
      })
    })
  },

  //which为中奖位置 需要停止时调用该方法
  stop: function (which) {
    var e = this;
    //初始化当前位置
    var current = -2;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;
    //值越大旋转时间越长 即旋转速度
    var intime = 2;
    e.stopLuck(which, index, intime, 10);
  },

  stopLuck: function (which, index, time, splittime) {
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var color = e.data.color;
    var opacity = e.data.opacity;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        color[7] = noColor
        opacity[7] = op1
      } else if (index != 0) {
        color[index - 1] = noColor
        opacity[index - 1] = op1
      }
      //当前位置为选中状态
      color[index] = '#FFC000'
      opacity[index] = 0.5
      e.setData({
        color: color,
        opacity: opacity
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 200 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        e.stopLuck(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          e.setData({
            btnDisabled: false,
            luckyModalHidden: false,
            showLuckyTip: false
          })
          if (which == 0 || which == 5 || which == 6 || which == 7) {
            e.setData({
              modalTitle: '与奖品擦肩而过~',
              modalDescription: '未中奖'
            })
          } else {
            e.setData({
              modalTitle: '恭喜中奖!'
            })
            let descritpion = ''
            switch (which) {
              case 1:
                descritpion = '5元立减券'
                break;
              case 2:
                descritpion = '20元立减券'
                break;
              case 3:
                descritpion = '100元券'
                break;
              case 4:
                descritpion = '惊喜礼盒'
                break;
            }
            e.setData({
              modalDescription: descritpion
            })

          }
          e.setData({
            color: [noColor, noColor, noColor, noColor, noColor, noColor, noColor, noColor],
            opacity: [op1, op1, op1, op1, op1, op1, op1, op1],
          })
          e.getLuckyRecords()
        }, 1000);
      }
    }, time);
  },

  toCoupon() {
    wx.switchTab({
      url: `../coupon/coupon`
    })
  },

  onClose() {
    this.setData({
      luckyModalHidden: true
    })
  },

  openRuleModal() {
    this.setData({
      ruleModalHidden: false
    })
  },

  closeRuleModal() {
    this.setData({
      ruleModalHidden: true
    })
  },
  comfiemRuleModal() {
    this.closeRuleModal()
  },

  getLuckyRecords() {
    this.setData({ loading: true })
    luckyModel.getLuckyRecords(wx.getStorageSync('member').id).then(res => {
      if (res.code === 1) {
        this.setData({
          luckyRecords: res.data.memberDrawRecord.reverse(),
          luckyTime: res.data.drawNum
        })
        this.setData({ loading: false })
      } else {
        wx.showModal({
          title: '提示',
          content: res && res.data && res.data.msg || '获取抽奖数据失败，请稍后重试。'
        })
        this.setData({ loading: false })
      }
    }).catch(err => {
      wx.showModal({
        title: '提示',
        content: err && err.msg || '获取抽奖数据失败，请稍后重试。'
      })
      this.setData({ loading: false })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let e = this
    return {
      title: '转发好友成功注册各获3次抽奖机会~',
      path: 'pages/index/index?recommendId=' + wx.getStorageSync('member').id,
      imageUrl: e.data.baseUrl + '/assets/godiva/images/lucky/push.png'
    }
  }
})