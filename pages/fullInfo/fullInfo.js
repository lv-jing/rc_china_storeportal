import { MemberModel } from '../../models/member'
let memberModel = new MemberModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   bgImage: `background-image: url(${app.globalData.apiConfig.API_BASE}/assets/godiva/images/member/c_topbg.png)`,
   currentPage: 0, //第1页
   email: '',
   wayList: [
    {
      value: 'wechat',
      text: '微信',
      displayText: '微信（WeChat）',
      checked: false
    },
    {
      value: 'sms',
      text: '短信',
      displayText: '短信（SMS）',
      checked: false
    },
    {
      value: 'email',
      text: '邮件',
      displayText: '邮件（Email）',
      checked: false
    },
    {
      value: 'emailSend',
      text: '邮寄',
      displayText: '邮寄',
      checked: false
    }
  ],
  productList: [
    {
      value: 'jinzhuang',
      text: '金装巧克力礼盒',
      checked: false
    },
    {
      value: 'songlu',
      text: '松露形巧克力',
      checked: false
    },
    {
      value: 'pianzhuang',
      text: '片装巧克力',
      checked: false
    },
    {
      value: 'sanzhuang',
      text: '散装巧克力',
      checked: false
    },
    {
      value: 'youxuan',
      text: '优选礼盒',
      checked: false
    },
    {
      value: 'ruan',
      text: '软冰淇淋',
      checked: false
    },
    {
      value: 'xianliang',
      text: '限量季节新品',
      checked: false
    },
    {
      value: 'hot',
      text: '热巧克力',
      checked: false
    },
    {
      value: 'bingan',
      text: '饼干/夹心糕',
      checked: false
    },
    {
      value: 'beizhuang',
      text: '杯装冰淇淋',
      checked: false
    },
    {
      value: 'binying',
      text: '冰莹',
      checked: false
    },
    {
      value: 'dangao',
      text: '蛋糕',
      checked: false
    },
    {
      value: 'coffee',
      text: '咖啡',
      checked: false
    },
    {
      value: 'qiakelitiao',
      text: '巧克力条',
      checked: false
    },
    {
      value: 'xianzhi',
      text: '鲜制巧克力水果/干果',
      checked: false
    },
    {
      value: 'suixiang',
      text: '随享巧克力系列',
      checked: false
    }
  ],
  buyList: [
    {
      value: 'me',
      text: '自享',
      checked: false
    },
    {
      value: 'lover',
      text: '爱人',
      checked: false
    },
    {
      value: 'child',
      text: '孩子',
      checked: false
    },
    {
      value: 'relatives',
      text: '亲戚',
      checked: false
    },
    {
      value: 'closer',
      text: '亲密好友',
      checked: false
    },
    {
      value: 'friends',
      text: '朋友',
      checked: false
    },
    {
      value: 'wendding',
      text: '婚礼',
      checked: false
    },
    {
      value: 'business',
      text: '商务',
      checked: false
    },
    {
      value: 'other',
      text: '其他',
      otherValue: '',
      checked: false
    }
  ],
  wordList: [
    {
      value: 'luxurious',
      text: '高贵奢华',
      checked: false
    },
    {
      value: 'delicacy',
      text: '精致',
      checked: false
    },
    {
      value: 'holiday',
      text: '节日',
      checked: false
    },
    {
      value: 'wedding',
      text: '婚礼',
      checked: false
    },{
      value: 'expensive',
      text: '昂贵',
      checked: false
    },
    {
      value: 'share',
      text: '分享',
      checked: false
    },
    {
      value: 'self-gratification',
      text: '自享',
      checked: false
    },
    {
      value: 'master',
      text: '巧克力大师',
      checked: false
    },
    {
      value: 'health',
      text: '健康',
      checked: false
    },
    {
      value: 'innovation',
      text: '创新',
      checked: false
    },
    {
      value: 'expert',
      text: '甜品专家',
      checked: false
    },
    {
      value: 'sweet',
      text: '甜蜜',
      checked: false
    },
    {
      value: 'other',
      text: '其他',
      checked: false,
      otherValue: ''
    }
  ],
  isAgree: true,
  member: {},
  phone:'',
  submitDisaled: false,
  submitLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUserInformation()
    
    this.setData({
      phone: app.globalData.phoneNumber
    })
    if(wx.getStorageSync('member')) {
      this.setData({
        member: wx.getStorageSync('member'),
      })
      this.initData()
    } else {
      this.getUserInformation()
    }
  },
  initData() {
    // const arr = JSON.parse(this.data.member.complete)
    if(!this.data.member.complete) {
      return
    }
    let arr = this.data.member.complete.split('{')
    let list1 = this.data.wayList
    let list2 = this.data.productList
    let list3 = this.data.buyList
    let list4 = this.data.wordList
    const _list1 = arr[1].split(',')[2].split('=')[1].split('}')[0].split('|')
    const _list2 = arr[2].split(',')[2].split('=')[1].split('}')[0].split('|')
    const _list3 = arr[3].split(',')[2].split('=')[1].split('}')[0].split('|')
    const _list4 = arr[4].split(',')[2].split('=')[1].split('}')[0].split('|')
    // console.log(arr, 'arr-----------')
    list1.forEach(item => {
      _list1.forEach(option => {
        if(item.text === option) {
          item.checked = true
        }
      })
    })
    list2.forEach(item => {
      _list2.forEach(option => {
        if(item.text === option) {
          item.checked = true
        }
      })
    })
    list3.forEach(item => {
      _list3.forEach(option => {
        if(item.text === option) {
          item.checked = true
        }
      })
    })
    list4.forEach(item => {
      _list4.forEach(option => {
        if(item.text === option) {
          item.checked = true
        }
      })
    })
    this.setData({
      email: this.data.member.email,
      wayList: list1,
      productList: list2,
      buyList: list3,
      wordList: list4
    })
  },
  emailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },
  checkEmail (email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true
    } 
    return false
  }, 
  wayCheckboxChange(e) {
    const value = e.currentTarget.dataset.item.value
    const list = this.data.wayList
    list.forEach(item => {
      if(item.value === value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      wayList: list
    })
  },
  productCheckboxChange(e) {
    const value = e.currentTarget.dataset.item.value
    const list = this.data.productList
    list.forEach(item => {
      if(item.value === value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      productList: list
    })
  },
  buyCheckboxChange(e) {
    const value = e.currentTarget.dataset.item.value
    const list = this.data.buyList
    list.forEach(item => {
      if(item.value === value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      buyList: list
    })
  },
  wordCheckboxChange(e) {
    const value = e.currentTarget.dataset.item.value
    const list = this.data.wordList
    list.forEach(item => {
      if(item.value === value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      wordList: list
    })
  },
  buyOtherChange(e) {
    const value = e.detail.value
    let list = this.data.buyList
    list.forEach(item => {
      if(item.value === 'other') {
        item.otherValue = value
      }
    })
    this.setData({
      buyList: list
    })
  },
  wordOtherChange(e) {
    const value = e.detail.value
    let list = this.data.wordList
    list.forEach(item => {
      if(item.value === 'other') {
        item.otherValue = value
      }
    })
    this.setData({
      wordList: list
    })
  },
  getSelectedParams(type) {
    const arr = []
    const list = type === 1 ? this.data.wayList : type === 2 ? this.data.productList : type === 3 ? this.data.buyList : type === 4 ? this.data.wordList : ''
    list.forEach(item => {
      if(item.checked) {
        if(item.value === 'other') {
          arr.push(item.text + item.otherValue)
        } else {
          arr.push(item.text)
        }
      }
    })
    return arr.join('|')
  },
  prevPage() {
    const page = this.data.currentPage
    if(page === 0) {
      return
    }
    this.setData({
      currentPage: page - 1
    })
  },
  nextPage() {
    const page = this.data.currentPage
    if(this.data.email && this.checkEmail(this.data.email)) {
      if(page === 2) {
        return
      }
      this.setData({
        currentPage: page + 1
      })
    } else if (!this.data.email) {
      wx.showModal({
        content: '请先填写您的邮箱地址',
        showCancel: false,
        confirmText: '好的'
      })
    } else {
      wx.showModal({
        content: '请先填写正确的邮箱地址',
        showCancel: false,
        confirmText: '好的'
      })
    }
  },
  agreeChange() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  submit() {
    if(this.data.isAgree) {
      this.setData({
        submitDisaled: true,
        submitLoading: true
      })
      const arr = [
        { id: "t1",
          title: '请选择偏爱接受信息渠道：（可多选）',
          data: this.getSelectedParams(1) // 如： 微信|短信
        },
        { id: "t2",
          title: '您会对GDOIVA哪些产品感兴趣？（可多选）',
          data: this.getSelectedParams(2)
        },
        { id: "t3",
          title: '您通常购买GOviewA产品的用途：（可多选）',
          data: this.getSelectedParams(3)
        },
        { id: "t4",
          title: '请选出适合GOviewA品牌的形容词：（可多选）',
          data: this.getSelectedParams(4) 
        }
      ]
      const params = {
        openid: app.globalData.publicopenid,
        email: this.data.email,
        json: arr, //JSON.stringify(arr)
      }
      // console.log(params,  't提交参数-------')
      memberModel.updateMemberFavor(params)
      .then(res=> {
        this.setData({
          submitDisaled: false,
          submitLoading: false
        })
        if(res.code === 0) {
          wx.showModal({
            content: '更新成功',
            showCancel: false,
           complete: res => {
            // this.getUserInformation()
            memberModel.getMember(this.data.phone).then(res => {
              memberModel.setMemberStorage(res)
            })
           }
          })
        } else {
          wx.showModal({
            content: err.message ? err.message : 'godivaCoupon/queryUserCoupons接口错误',
            showCancel: false,
            confirmText: '好的'
          })
        }
      })
    } else {
      wx.showModal({
        content: '请先勾选同意接收歌帝梵产品及活动相关信息',
        showCancel: false,
        confirmText: '好的'
      })
    }
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
    let that = this;
    that.showLoading()
    memberModel.getMemberOrStorage(that.data.phone)
    .then(res => {
      //用户信息存到cookie
      memberModel.setMemberStorage(res)
      that.hideLoading()
      const member = res
      console.log(member.complete, '勾选xinx----------')
      app.globalData.member = member
      that.setData({
        member: member
      })
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