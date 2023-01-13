/**
 * 大转盘抽奖
 */
var app = getApp();
import request from '../../request.js'

Page({

  //奖品配置
  awardsConfig: {
    chance: true,
    awards: []
  },

  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    inited: 0,
    dotsList: {},
    dotNum: 15,
    awardIndex: -1,
    showPic: false,
    showToast: false,
    animationPicData: {},
    leftTimes: 1
  },
  onLoad: function () {
    const that = this;
    request({
      url: '/scrm/questionnaire/godivaCoupon/getRegisterCouponList',
    }).then(res => {
      if (res && res.data && res.data.code == 1 && res.data.data) {
        let tmpArr = res.data.data;
        if (!tmpArr.length) {
          let duration = 2000;
          that.setData({
            showToast: true
          });
          setTimeout(function () {
            that.setData({
              showToast: false
            })
            // wx.redirectTo({
            //   url: `../account/account?desurl=account`
            // })
            wx.redirectTo({
              url: `/pages/guide/guide`
            })
          }, duration);
          return
        }
        if (tmpArr.length == 1) {
          tmpArr.push({ id: '', name: '谢谢参与', pic1: '' })
        }
        const nameMap = {
          '68011': '5元立减券',
          '68012': '10元立减券',
          '68013': '20元立减券'
        }
        tmpArr = tmpArr.map(t => {
          if (nameMap[t.posCode]) {
            t.name = nameMap[t.posCode]
          }
          return t
        })
        that.awardsConfig.awards = tmpArr.concat(tmpArr);
        console.log(this.awardsConfig.awards)
        that.drawAwardRoundel();
      } else {
        wx.showModal({
          title: '提示',
          content: res.data && res.data.msg || '系统错误，请稍后再试。'
        })
      }
    })
  },
  onReady: function (e) {
    let dotsList = [];
    for (let i = 0; i < this.data.dotNum; i++) {
      dotsList.push({ deg: (360 / this.data.dotNum) * i + 'deg' })
    }
    this.setData({
      dotsList: dotsList,
    });
  },
  onShow: function () {
    wx.hideHomeButton()
  },
  showPicture: function () {
    let that = this
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in',
      delay: 0
    })
    animation.opacity(1).step()
    that.setData({
      showPic: true,
      animationPicData: animation.export()
    })
  },
  //画抽奖圆盘
  drawAwardRoundel: function () {
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length;  // 文字旋转 turn 值
    var baseDeg = 360 / awards.length;

    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      let item = awards[i];
      awardsList.push({
        turn: i * turnNum + 'turn',
        linesDeg: i * baseDeg - baseDeg / 2 + 'deg',
        skewY: (baseDeg - 90) + 'deg',
        award: item.name + '*2',
        pic: app.globalData.apiConfig.API_BASE + item.pic1,
        index: i
      });
    }

    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList,
      inited: 1
    });
  },

  //发起抽奖
  playReward: function () {
    const that = this;
    var awardsConfig = this.awardsConfig,
      awardsLen = awardsConfig.awards.length;
    that.setData({
      awardIndex: -1
    });
    request({
      url: '/scrm/questionnaire/godivaCoupon/grantReward',
      data: {
        phone: app.globalData.phoneNumber
      },
    }).then(res => {
      if (res && res.data && res.data.code == 1 && res.data.data) {
        //中奖index
        var awardIndex = -1;
        for (let [i, item] of awardsConfig.awards.entries()) {
          if (item.id == res.data.data.id) {
            awardIndex = i;
            break;
          }
        }
        if (awardIndex == -1) {
          return false;
        }
        awardIndex = awardIndex + Math.floor(Math.random() * 2) * (awardsLen / 2)
        var runNum = 8;//旋转8周
        var duration = 4000;//时长

        // 旋转角度
        this.runDeg = this.runDeg || 0;
        this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / awardsLen))
        //创建动画
        var animationRun = wx.createAnimation({
          duration: duration,
          timingFunction: 'ease'
        })
        animationRun.rotate(this.runDeg).step();
        this.setData({
          animationData: animationRun.export(),
          btnDisabled: 'disabled',
          leftTimes: 0
        });

        // 中奖提示
        setTimeout(function () {
          that.setData({
            awardIndex: awardIndex
          })
          wx.showModal({
            title: '恭喜',
            content: '获得两张' + (awardsConfig.awards[awardIndex].name),
            showCancel: false,
            success: function () {
              // wx.navigateTo({
              //   url: '../account/account?desurl=coupon'
              // })
              wx.switchTab({
                url: `../coupon/coupon`
              })
            }
          });
          this.setData({
            btnDisabled: ''
          });
        }.bind(this), duration);
      } else {
        wx.showModal({
          title: '提示',
          content: res.data && res.data.msg || '系统错误，请稍后再试。'
        })
      }
    })
  },
})