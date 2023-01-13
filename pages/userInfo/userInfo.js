import { getWayList, getProductList, getActivityList } from '../../utils/user'
import {showLoading, hideLoding} from '../../utils/loading'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import { MemberModel } from '../../models/member'
let memberModel = new MemberModel()
const app = getApp()
// let count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
    fullbgStyle: `background-image: url(${app.globalData.apiConfig.API_BASE}/godiva-demo/asset/images/r_goldbg.jpg)`,
    member: {},
    phone: '',
    nickname: '',
    name: '',
    xing: '',
    ming: '',
    sex: '',// 1：男士 2：女士 
    date: '',
    province:'',
    city:'',
    area:'',
    provinceId:'',
    cityId:'',
    areaId:'',
    show:false,
    sexPickerShow: false,
    wayModalHidden: true,
    productModalHidden: true,
    activityModalHidden: true,
    wayList: [],
    productList:[],
    activityList: [],
    selectedWay: [],
    selectedProduct: [],
    selectedAcitivity: [],
    append1: '',
    append2: '',
    append3: '',
    birthdayLockHidden: false,
    birthdayPopupShow: false,
    currentDate: new Date().getTime(),
    minDate: new Date('1910-01-01').getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}`;
      } else if (type === 'month') {
        return `${value}`;
      }
      return value;
    },
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    selectArray: [{
        id: '1',
        value: '男士'
      }, {
        id: '2',
        value: '女士'
      }],
    loading: false,
    actions: [
      {
        name: '男士', className: "sexClass"
      },
      {
        name: '女士', className: "sexClass"
      },
      
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  onClose() {
    this.setData({ sexPickerShow: false });
  },

  onSelect(e) {
    const _sex = e.detail.name
    this.setData({
      sex: _sex
    })
  },
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.phoneNumber //app.globalData.phoneNumber //'13535606373'
    })
    this.initList()
    this.getUserInformation()
  },
  showLoading() {
    this.setData({
      loading: true
    })
  },
  hideLoading() {
    this.setData({
      loading: false
    })
  },
  getUserInformation() {
    this.showLoading()
    memberModel.getMemberOrStorage(this.data.phone).then(res=> {
      memberModel.setMemberStorage(res)
      this.hideLoading()
      this.setData({
        member: res,
        nickname: res.nickname,
        name: res.name,
        xing: res.xing,
        ming: res.ming,
        sex: res.sex == 1 ? '男士': '女士',
        date: res.birthday,
        province: res.province ? res.province : '',
        city: res.city ? res.city : '',
        area: res.district ? res.district : '',
        provinceId: res.customerCity ? res.customerCity : '',
        cityId: res.customerProvince ? res.customerProvince : '',
        areaId: res.areaId ? res.areaId : '',
        append1: res.append1,
        append2: res.append2,
        append3: res.append3
      })
      if(this.data.date === '' || this.data.date  === '1900-01-01') {
        this.setData({
          birthdayLockHidden: true,
          currentDate: this.data.minDate
        })
      } else {
        this.setData({
          currentDate: new Date(res.birthday).getTime()
        })
      }
      this.loadList()
    })
  },
  initList() {
    const wayList = getWayList();
    const productList = getProductList()
    const activityList = getActivityList()
    let list = []
    let list1 = []
    let list2 = []
    wayList.forEach(item => {
      let obj = { name: item, active: false}
      list.push(obj)
    })
    productList.forEach(item => {
      let obj = { name: item, active: false}
      list1.push(obj)
    })
    activityList.forEach(item => {
      let obj = { name: item, active: false}
      list2.push(obj)
    })
    this.setData({
      wayList: list,
      productList: list1,
      activityList: list2
    })
  },
  loadList() {
    if(this.data.append1) {
      let array = this.data.append1.split('、')
      let wayList = this.data.wayList
      let selectedWay = []
      wayList.forEach(item => {
        array.forEach(option => {
          if(item.name === option) {
            item.active = true
          }
        })
      })
      array.forEach(option => {
        let obj = { name: option, active: true}
        selectedWay.push(obj)
      })
      this.setData({
        wayList,
        selectedWay
      })
    } 
    if (this.data.append2) {
      let array = this.data.append2.split('、')
      let productList = this.data.productList
      let selectedProduct = []
      productList.forEach(item => {
        array.forEach(option => {
          if(item.name === option) {
            item.active = true
          }
        })
      })
      array.forEach(option => {
        let obj = { name: option, active: true}
        selectedProduct.push(obj)
      })
      this.setData({
        productList,
        selectedProduct
      })
    } 
    if (this.data.append3) {
      let array = this.data.append3.split('、')
      let activityList = this.data.activityList
      let selectedAcitivity = []
      activityList.forEach(item => {
        array.forEach(option => {
          if(item.name === option) {
            item.active = true
          }
        })
      })
      array.forEach(option => {
        let obj = { name: option, active: true}
        selectedAcitivity.push(obj)
      })
      this.setData({
        activityList,
        selectedAcitivity
      })
    }
  },
  openSexPicker() {
    this.setData({
      sexPickerShow: true
    })
  },
  confirmBirthdayPopup() {
    // const year = new Date(this.data.currentDate).toLocaleDateString().split('/')[0]
    // const month = Number(new Date(this.data.currentDate).toLocaleDateString().split('/')[1]) > 10 ? Number(new Date(this.data.currentDate).toLocaleDateString().split('/')[1]) : '0'+ new Date(this.data.currentDate).toLocaleDateString().split('/')[1]
    // const day =  Number(new Date(this.data.currentDate).toLocaleDateString().split('/')[2]) > 10 ? Number(new Date(this.data.currentDate).toLocaleDateString().split('/')[2]) : '0'+ new Date(this.data.currentDate).toLocaleDateString().split('/')[2]
    this.setData({
      date: this.data.selectedDate
    })
    this.hideBirthdayPopup()
  },
  bindDateChange: function(e) {
    const value = e.detail.getValues().join('-')
    console.log(value)
    this.setData({
      selectedDate: value
    })
  },
  sureSelectAreaListener:function(e){
    var that = this;
    that.setData({
      show: false,
      province: e.detail.currentTarget.dataset.province,
      city: e.detail.currentTarget.dataset.city,
      area: e.detail.currentTarget.dataset.area,
      provinceId: e.detail.currentTarget.dataset.provinceid,
      cityId: e.detail.currentTarget.dataset.cityid,
      areaId: e.detail.currentTarget.dataset.areaid
    })
  },
  chooseAddress:function(){
    var that = this;
    that.setData({
      show:true
    })
  },
  openWayModal(e) {
    const type = e.currentTarget.dataset.name;
    switch(type) {
      case 'way':
        this.setData({
          wayModalHidden: false
        })
        break;
      case 'product':
        this.setData({
          productModalHidden: false
        })
        break;
      case 'activity':
        this.setData({
          activityModalHidden: false
        })
        break;
      default:
        break;
    }
  },
  closeWayModal() {
    this.setData({
      wayList: [...this.data.wayList],
      selectedWay: [...this.data.selectedWay],
      wayModalHidden: true
    })
  },
  confirmWayModal(e) {
    const list = e.detail.list;
    const selected = e.detail.selected.length > 0 ? e.detail.selected.map(item => item.name) : [];
    let str = ''
    str = selected.length > 0 ? selected.join("、") : '';
    this.setData({
      append1 : str,
      selectedWay: e.detail.selected,
      wayList: [...list]
    })
    this.setData({
      wayModalHidden: true
    })
  },
  closeProductModal() {
    this.setData({
      productList: [...this.data.productList],
      selectedProduct: [...this.data.selectedProduct],
      productModalHidden: true
    })
  },
  confirmProductModal(e) {
    const list = e.detail.list;
    const selected = e.detail.selected.length > 0 ? e.detail.selected.map(item => item.name) : [];
    let str = ''
    str = selected.length > 0 ? selected.join("、") : '';
    this.setData({
      append2 : str,
      selectedProduct: e.detail.selected,
      productList: [...list],
      productModalHidden: true
    })
  },
  closeActivityModal() {
    this.setData({
      activityList: [...this.data.activityList],
      selectedAcitivity: [...this.data.selectedAcitivity],
      activityModalHidden: true
    })
  },
  confirmActivityModal(e) {
    const list = e.detail.list;
    const selected = e.detail.selected.length > 0 ? e.detail.selected.map(item => item.name) : [];
    let str = ''
    str = selected.length > 0 ? selected.join("、") : '';
    this.setData({
      append3 : str,
      selectedAcitivity: e.detail.selected,
      activityList: [...list],
      activityModalHidden: true
    })
  },
  validateEnterChar(value) {
    let reg = /^[\u0391-\uFFE5A-Za-z]+$/;
    let reg2 = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g
    if(reg.test(value) && !reg2.test(value)) {
      return true
    }
    return false
  },
  onSexSubmit(e) {
    const attr = e.currentTarget.id
    const value = e.detail.value
    this.setData({
      sexPickerShow: false,
      sex: value
    })
  },
  onSexCancel(e) {
    this.setData({
      sexPickerShow: false,
    })
  },
  updateInfo(e) {
    const attr = e.currentTarget.id
    const value = e.detail.value
    switch(attr) {
      case 'nickname':
        this.setData({
          nickname: value
        })
        break;
      case 'xing':
        this.setData({
          xing: value
        })
        if(!this.validateEnterChar(value)) {
          wx.showModal({
            content: '姓氏和名字不允许提交非法字符，还请重新填写后提交',
            showCancel: false,
            confirmText: '好的'
          })
        }
        break;
      case 'ming':
        this.setData({
          ming: value
        })
        if(!this.validateEnterChar(value)) {
          wx.showModal({
            content: '姓氏和名字不允许提交非法字符，还请重新填写后提交',
            showCancel: false,
            confirmText: '好的'
          })
        } 
      break;
      case 'sex':
        this.setData({
          sex: value
        })
        break;
      default:
        break
    }
  },
  validate() {
    let flag = true;
    if (!this.data.nickname || !this.data.xing || !this.data.ming) {
      flag =  false
      const content = !this.data.nickname ? '昵称' : !this.data.xing ? '姓': !this.data.ming? '名' : ''
      wx.showModal({
        content: `请输入${content}`,
        showCancel: false,
        confirmText: '好的'
      })
     } else if (!this.validateEnterChar(this.data.xing) || !this.validateEnterChar(this.data.ming)) {
      flag =  false
      wx.showModal({
        content: '姓氏和名字不允许提交非法字符，还请重新填写后提交',
        showCancel: false,
        confirmText: '好的'
      })
     }
     return flag
  },
  submit() {
   if(!this.validate()) {
      return;
   }
   const that = this
    console.log(this.data.birthdayLockHidden);
    if(!this.data.birthdayLockHidden) {
     this.updateInfoAsyc()
   } else if (this.data.date === '1900-01-01' || this.data.date !== '1900-01-01') {
    wx.showModal({
      content: `亲爱的会员，请填写正确生日信息。每位会员只有一次更新生日信息的机会。`,
      confirmText: '确认修改',
      cancelText: '再想一下',
      success: function(res) {
        if(res.confirm) {
          that.updateInfoAsyc()
        }
      },
      fail: function() {
      }
    })
   } else {
     this.updateInfoAsyc()
   }
  },
  updateInfoAsyc() {
    const params = {
      username: this.data.phone,
      openid: this.data.member.openid,
      nickname: this.data.nickname,
      xing: this.data.xing,
      ming: this.data.ming,
      name: this.data.xing + this.data.ming,
      sex: this.data.sex === '男士'? 1 : 2, 
      birthday: this.data.date,
      province: this.data.province,
      city: this.data.city,
      district: this.data.area,
      customerCity: this.data.provinceId,
      customerProvince: this.data.cityId,
      append1: this.data.append1,
      append2: this.data.append2,
      append3: this.data.append3
    };
    this.showLoading()
    const that = this
    console.log('更新个人信息参数', params)
    memberModel.updateMember({
      data: params
    }).then(res => {
      this.hideLoading()
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: '好的',
        content: '更新成功',
        complete: function() {
          that.setData({
              birthdayLockHidden: false
          })
          memberModel.getMember(that.data.phone).then(res => {
            memberModel.setMemberStorage(res)
          })
        }
      })
    })
  },
  showBirthdayPopup() {
    if(this.data.birthdayLockHidden) {
      this.setData({
        birthdayPopupShow: true
      })
    }
  },
  hideBirthdayPopup() {
    this.setData({
      birthdayPopupShow: false
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