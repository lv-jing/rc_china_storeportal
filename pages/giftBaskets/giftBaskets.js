// pages/giftBaskets/giftBaskets.js
import { MemberModel } from '../../models/member'
import {START_DATE,END_DATE} from '../../utils/constant'
const app = getApp()
const memberModel = new MemberModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fullbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_goldbg.jpg)`,
    form: {
      name: null,
      sex: null, // 1：男士 2：女士 
      phone: null,
      advice: null,
      storeAddress: null,//到店自取
      address: null, //邮寄,
      storeShortAddress: ''
    },
    sexPickerShow: false,
    actions: [
      {
        name: '先生', className: "sexClass", value: 1
      },
      {
        name: '女士', className: "sexClass", value: 2
      }
    ],
    wayList: [
      {
        value: 'self',
        text: '选择门店',
        displayText: '选择门店',
        checked: false
      },
      {
        value: 'emailSend',
        text: '邮寄',
        displayText: '邮寄（仅适用于所在城市无线下门店）',
        checked: false
      },
    ],
    storePickerShow: false,
    province: '',
    city: '',
    area: '',
    provinceId: '',
    cityId: '',
    areaId: '',
    showModal: false,
    isValid: 1,
    exitModalHidden: true,
    emailSendHidden: true,
    giftHidden: true,
    inputDis: false,
    tip:'活动未开始'
  },

  onTextAreaChange(e) {
    let form = this.data.form
    form['advice'] = e.detail
    this.setData({
      form
    })
  },
  onInputChange(e) {
    const value = e.detail.value
    const name = e.target.id
    let form = this.data.form
    form[name] = value
    this.setData({
      form
    })
  },
  onClose() {
    this.setData({ sexPickerShow: false });
  },
  ongiftClose() {
    this.setData({ giftHidden:true });
  },
  openSexPicker() {
    if(this.data.inputDis) return
    this.setData({
      sexPickerShow: true
    })
  },
  onSexSelect(e) {
    const value = e.detail
    let form = this.data.form
    form['sex'] = value
    this.setData({
      sexPickerShow: false,
      form
    })
  },
  onSexCancel(e) {
    this.setData({
      sexPickerShow: false,
    })
  },
  wayCheckboxChange(e) {
    if(this.data.inputDis) return
    // const value = e.currentTarget.dataset.item.value
    // const checked = e.currentTarget.dataset.item.checked
    const value = 'self'
    const checked = false
    const list = this.data.wayList
    if (!checked && value === 'self') { // 选中 
      this.openStorePicker()
    }
    list.forEach(item => {
      if (item.value === value) {
        item.checked = !checked
      } else {
        item.checked = false
      }
      this.setData({
        wayList: list
      })
    })
  },
  sureSelectAreaListener: function (e) {
    console.log(e, 'eeeeeee')
    if (e.detail.currentTarget.dataset.provinceid === '9999') {
      this.setData({
        storePickerShow: false,
        emailSendHidden: false
      })
      const list = this.data.wayList
      list.forEach(item => {
        item.checked = item.value === 'emailSend';
      })
      this.setData({
        wayList: list
      })
      return
    }
    let form = this.data.form
    form['storeAddress'] = `${e.detail.currentTarget.dataset.province} ${e.detail.currentTarget.dataset.city} ${e.detail.currentTarget.dataset.area}`
    form['storeShortAddress'] = `${e.detail.currentTarget.dataset.city}${e.detail.currentTarget.dataset.area}`
    this.setData({
      storePickerShow: false,
      emailSendHidden: true,
      province: e.detail.currentTarget.dataset.province,
      city: e.detail.currentTarget.dataset.city,
      area: e.detail.currentTarget.dataset.area,
      provinceId: e.detail.currentTarget.dataset.provinceid,
      cityId: e.detail.currentTarget.dataset.cityid,
      areaId: e.detail.currentTarget.dataset.areaid,
      form
    })
  },
  openStorePicker() {
    this.setData({
      storePickerShow: true
    })
  },

  validate() {
    let isValid = 1
    const reg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
    if (!this.data.form.name || this.data.form.name.indexOf(' ') > -1 || !this.data.form.sex || !this.data.form.phone || (!this.data.form.storeAddress && !this.data.form.address)) {
      isValid = 2
      return isValid
    }
    if (!reg.test(this.data.form.phone)) {
      isValid = 3
      return isValid
    }

    const wayList = this.data.wayList
    wayList.forEach(item => {
      if (item.value === 'self' && item.checked && !this.data.form.storeAddress) {
        isValid = 1
        return
      }
      if (item.value === 'emailSend' && item.checked && !this.data.form.address) {
        isValid = 1
      }
    })
    return isValid
  },
  submit() {
    const isValid = this.validate()
    if (isValid === 1) {
      let params = {
        userName: this.data.form.name,
        sex: this.data.form.sex ? this.data.form.sex.value : null,
        phone: this.data.form.phone,
        receive: null,
        address: '',
        message: this.data.form.advice,
        storeId: this.data.areaId
      }
      const wayList = this.data.wayList
      wayList.forEach(item => {
        if (item.value === 'self' && item.checked) {
          params.receive = 1
          params.address = this.data.form.storeAddress
        } else if (item.value === 'emailSend' && item.checked) {
          params.receive = 2
          params.address = this.data.form.address
        }
      })
      console.log(params, 'params------------')
      memberModel.updateGiftBaskets(params).then(res => {
        if (res.code === 1) {
          this.setData({
            isValid,
            showModal: true
          })
        } else if (res.code === 0) {
          let address = res.data
          let shortAddressList = address ? address.split(' ') : []
          let shortAddress = shortAddressList && shortAddressList.length === 3 ?
            shortAddressList[1] + shortAddressList[2] : ''
          wx.showModal({
            title: '提示',
            content: `尊敬的用户，您已预约${shortAddress}领取，请勿重复提交。`,
            showCancel: false
          })
        }
      })
    } else {
      this.setData({
        isValid,
        showModal: true
      })
    }
  },
  closeTipModal() {
    this.setData({
      showModal: false
    })
    if(this.data.isValid === 1) {
      wx.switchTab({
        url: '../guide/guide',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowDate = new Date().getTime()
    let startDate = new Date(`${START_DATE} 18:00:00`).getTime() // todo
    let endDate = new Date(`${END_DATE} 12:00:00`).getTime()
    if (nowDate > endDate || nowDate < startDate) {
      this.setData({
        giftHidden: false,
        inputDis:true,
        tip:nowDate<startDate?'未开始':'已结束'
      })
    }
    memberModel.getLoginCode()
      .then(res => {
        return memberModel.isMember(res)
      }).then(res => {
        if (res.data && res.code == 1) {
          if (res.data.ismember.toLowerCase() == 'true') {

          }
        } else {
          this.openExitModal()
        }
      })
  },
  openExitModal() {
    this.setData({
      exitModalHidden: false
    })
  },
  comfiemExitModal() {
    this.setData({
      exitModalHidden: true
    })
    this.toRegister()
  },
  toRegister() {
    wx.navigateTo({
      url: '../index/index'
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

  }
})