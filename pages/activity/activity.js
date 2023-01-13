// pages/activity/activity.js
import request from './request.js'

const storeMockData = require('./storeData');
//获取应用实例
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showModal: false,
        showDrawer: false,
        canJoin: false,
        selectedStoreIndex: [0, 0, 0],
        selectedStoreVal: undefined,
        finalSelectedStoreIndex: [0, 0, 0],
        storeCollection: [],
        originalStoreData: [],
        dateRange: [],
        selectedDateRangeIndex: [0, 0, 0],
        popupText: '',
        popupButtonText: '关闭',
        phone: '',
        showBindMemberModal: false,
        showNoFollowModal: false,
        canReSelect: false,
        getQuanSuccess: false,
        source: 1, // 默认统计来源为小程序直接进入
        unionId: '',
        isMember: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取流量来源参数
        if (options.source) {
            this.setData({
                source: options.source
            })
        }
        // 获取用户基础信息，是否为会员
        this.checkUserInfo();
    },
    async initPicker() {
        wx.showLoading({
            title: '门店加载中',
        })
        // 获取门店数据，如果无数据返回，则表明活动名额已经发放完毕
        const storeData = await request({
            url: '/scrm/godiva/store/address',
            method: 'get',
        })
        wx.hideLoading();
        if (storeData.data.data.code !== 0) {
            this.setData({
                showModal: true,
                popupText: '活动礼券已全部领完，敬请期待其它活动，感谢',
                popupButtonText: '关闭',
                canJoin: false,
            })
            return Promise.resolve(100);
        }
        let result = [[], [], []];
        const originData = storeData.data.data.data;
        originData.forEach((item, index) => {
            result[0].push(item)
            if (item.elementList && index === 0) {
                item.elementList.forEach((sItem, sIndex) => {
                    result[1].push(sItem)
                    if (sItem.elementList) {
                        sItem.elementList.forEach((lItem) => {
                            result[2].push(lItem)
                        })
                    }
                })
            }
        })
        this.setData({
            storeCollection: result,
            originalStoreData: originData,
        })
        return Promise.resolve(200);
    },
    filterInvalidDate() {
        const currentTime = new Date();
        const temp = this.data.dateRange;
        const validTime = temp[1].filter((item) => {
            const ttOfend = new Date(item.value.applyEndTime).getTime()
            return ttOfend > currentTime.getTime();
        })
        temp[1] = validTime;
        this.setData({
            dateRange: temp
        })
    },
    // 门店选择picker change
    bindStoreMultiPickerChange(e) {
        const finalStoreIndex = e.detail.value;
        if (!this.data.originalStoreData[finalStoreIndex[0]].elementList[finalStoreIndex[1]].elementList.length) {
            return wx.showToast({
                title: '该城市已无可预约门店',
                icon: 'none'
            })
        }
        this.setData({
            finalSelectedStoreIndex: finalStoreIndex,
            selectedStoreVal: this.data.originalStoreData[finalStoreIndex[0]].elementList[finalStoreIndex[1]].elementList[finalStoreIndex[2]]
        })
        this.recordUserStep(5); // 记录门店选择
        // 根据门店获取合法的活动时段
        // 重置日期数据
        this.setData({
            dateRange: [],
            selectedDateRangeIndex: [0, 0, 0]
        })
        this.getValidDateRange();
    },
    bindStoreMultiPickerColumnChange(e) {
        const col = e.detail.column;
        const index = e.detail.value;
        if (col === 0) {
            const data = this.data.storeCollection;
            data[1] = this.data.originalStoreData[index].elementList;
            data[2] = this.data.originalStoreData[index].elementList[0].elementList;
            this.setData({
                storeCollection: data,
                selectedStoreIndex: [index, 0, 0]
            })
        } else if (col === 1) {
            const storeCollection = this.data.storeCollection;
            const firstSelectedIndex = this.data.selectedStoreIndex[0]
            storeCollection[2] = this.data.originalStoreData[firstSelectedIndex].elementList[index].elementList;
            const selectedStoreIndex = this.data.selectedStoreIndex;
            selectedStoreIndex[1] = index;
            this.setData({
                storeCollection,
                selectedStoreIndex
            })
        } else if (col === 2) {
            const selectedStoreIndex = this.data.selectedStoreIndex;
            selectedStoreIndex[2] = index;
            this.setData({
                selectedStoreIndex
            })
        }
    },
    // 日期选择picker change
    bindDateRangePickerChange(e) {
        this.setData({
            selectedDateRangeIndex: e.detail.value
        })
        this.recordUserStep(6); // 记录确认时间
    },
    bindDateRangePickerColumnChange(e) {
        const col = e.detail.column;
        const index = e.detail.value;
        let tmp = this.data.selectedDateRangeIndex;
        tmp[col] = index;
    },
    async getValidDateRange() {
        const ret = await request({
            url: `/scrm/godiva/store/getActivityTime?storeCode=${this.data.selectedStoreVal.code}`,
        })
        this.setData({
            dateRange: ret.data.data
        })
    },
    // for test
    // async onJoin() {
    //   // this.setData({
    //   //   showModal: true,
    //   //   canJoin: true
    //   // })
    //   await this.initPicker();
    //   this.setData({
    //     showDrawer: true,
    //   })
    // },
    // 报名参加验证逻辑
    async onJoin() {
        this.recordUserStep(1); // 记录点击参加
        // 查询非会员，显示注册弹窗
        if (!this.data.isMember) {
            this.setData({
                showBindMemberModal: true
            })
            return;
        }
        // * 成功获取用户手机号后，向服务器回传用户来源统计
        await request({
            url: '/scrm/godiva/godivaSoftIceStatistics/saveGodivaSoftIceStatistics',
            data: {
                phone: this.data.phone,
                sourceType: this.data.source
            }
        })
        // * 检查注册时间是否合法
        wx.showLoading({
            title: '校验中...',
        })
        const res = await request({
            url: '/scrm/godiva/godivaSoftIceCoupon/is21DayBeforRegisterMember',
            data: {
                phone: this.data.phone,
            },
        })
        // * 测试用 正常条件应为!res.data.result
        // 注册时间不满足需求时弹框提示关注公众号
        if (!res.data.result) {
            this.setData({
                showNoFollowModal: true
            })
            wx.hideLoading();
            return;
        }
        // 校验通过，进入选择门店流程
        this.setData({
            popupText: '还差一步：请立即选择活动门店与时间（必选），领取您的专属软冰淇淋礼券！',
            popupButtonText: '选择活动门店',
            canJoin: true
        })
        const storePickerRet = await this.initPicker();
        if (storePickerRet === 200) {
            // 开启门店选择的弹窗
            this.toggleModal();
        }
        wx.hideLoading();
    },
    // 绑定会员按钮
    onBindBtnClick() {
        this.recordUserStep(4)
        // await....
        this.setData({
            showBindMemberModal: false,
        })
        this.getUserProfile();
    },
    // 用户关闭绑定弹窗
    onUserCloseBindModal() {
        this.setData({
            showBindMemberModal: false
        })
    },
    onGetPhoneNumber(e) {
        console.log('cccc', e);
        const that = this;
        if (e.detail.errMsg.startsWith("getPhoneNumber:fail Error:")) { //微信会自动给出提示
            return
        }
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {//用户点击拒绝
            console.log('user deny');
        } else {//用户点击接受
            request({
                url: '/scrm/decodePhone',
                contentType: 'form',
                data: {
                    encrypdata: e.detail.encryptedData,
                    ivdata: e.detail.iv
                },
            })
                .then(res => {
                    if (res && res.data && res.data.code == 1) {
                        app.globalData.phoneNumber = res.data.data.phoneNumber;
                        that.setData({
                            phone: res.data.data.phoneNumber
                        })
                        that.onJoin();
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data && res.data.msg || '手机号解码失败，请稍后重试'
                        })
                    }
                })
                .catch(err => {
                    wx.showModal({
                        title: '提示',
                        content: '手机号解码失败，请稍后重试！'
                    })
                })
        }
    },
    getUserProfile(e) {
        const that = this;
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log("获取用户信息成功", res);
                app.globalData.userInfo = res.userInfo;
                that.toRegister();
            },
            fail(res) {
                wx.showModal({
                    content: '获取用户信息失败',
                    confirmText: '好的',
                    showCancel: false
                })
            }
        })
    },
    // 注册
    toRegister() {
        const that = this;
        let param = {
            avatarUrl: '',
            city: '',
            country: '',
            gender: '',
            language: '',
            nickName: '',
            province: '',
            unionid: app.globalData.unionId,
            registerChannel: 'dev_deloitte',
            recommendId: null,
            inviteId: null,
        }
        param = Object.assign({}, param, app.globalData.userInfo || {})
        let duration = 2000;
        console.log(param, '注册参数');
        request({
            url: '/scrm/register',
            data: param,
        })
            .then(res => {
                that.processRegister = false
                if (res && res.data && res.data.code == 1) {
                    wx.showToast({
                        title: '注册成功',
                    })
                    this.setData({
                        isMember: true
                    })
                } else if (res && res.data && res.data.code == 2) {
                    // 老用户=> 数据有但是需要微信需要重新授权,直接同步微信信息，跳转主页
                    wx.showModal({
                        title: '提示',
                        content: res && res.data && res.data.msg || '注册失败，请稍后重试。',
                        showCancel: false,
                        confirmText: '好的',
                    })
                } else if (res && res.data && res.data.code == 3) {
                    wx.showModal({
                        title: '提示',
                        content: '该微信已绑定相关会员，请使用原先手机号登录，如需使用新手机号登录，还请联系在线客服。',
                        showCancel: false,
                        confirmText: '好的'
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res && res.data && res.data.msg || '注册失败，请稍后重试。'
                    })
                }
            })
            .catch(err => {
                wx.showModal({
                    title: '提示',
                    content: err && err.msg || '注册失败，请稍后重试。'
                })
            })
    },
    normalizeUserCookie(cookies = '') {
        let __cookies = [];
        (cookies.match(/([\w\-.]*)=([^\s=]+);/g) || []).forEach((str) => {
            if (str !== 'Path=/;' && str.indexOf('csrfToken=') !== 0) {
                __cookies.push(str);
            }
        });
        return __cookies.join(' ')
    },
    // 获取用户信息或注册
    checkUserInfo() {
        return new Promise((resolve, reject) => {
            let that = this;
            wx.setStorageSync('cookieKey', '');
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            wx.login({
                success: ret => {
                    wx.hideLoading();
                    let loginCode = ret.code;
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (loginCode) {
                        setTimeout(function () {
                            //发起网络请求
                            request({
                                url: '/scrm/ismemberByCode',
                                contentType: 'form',
                                data: {
                                    code: loginCode
                                },
                                showLoading: true,
                            }).then(res => {
                                if (res && res.header) {
                                    let cookit = res.header['set-cookie'] || res.header['Set-Cookie']
                                    if (cookit) {
                                        wx.setStorageSync('cookieKey', that.normalizeUserCookie(cookit)); //保存Cookie到Storage
                                    }
                                }
                                if (res && res.data && res.data.code == 1) {
                                    app.globalData.unionId = res.data.data.unionid;
                                    app.globalData.phoneNumber = res.data.data.phone;
                                    that.setData({
                                        unionId: res.data.data.unionid,
                                        phone: res.data.data.phone,
                                        isMember: res.data.data.ismember.toLowerCase() == 'true',
                                    })
                                    if (res.data.data.ismember.toLowerCase() == 'true') {
                                        resolve({
                                            code: 1,
                                            msg: '成功获取用户信息'
                                        });
                                    }
                                } else {
                                    reject();
                                    wx.showModal({
                                        title: '提示',
                                        content: res && res.data && res.data.msg || 'ismemberByCode接口失败，请稍后重试。'
                                    })
                                }
                            }).catch(err => {
                                console.log(err)
                                wx.showModal({
                                    title: '提示',
                                    content: err && err.msg || 'ismemberByCode接口错误，请稍后重试。'
                                })
                            })
                        }, 0)
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                },
                fail: err => {
                    if (err && err.errMsg) {
                        wx.showModal({
                            title: '提示',
                            content: err.errMsg ? err.errMsg : '获取登录码失败，请退出重试'
                        })
                        reject();
                    }
                }
            })
        })

    },
    onModalBtnClick() {
        this.toggleModal();
        // 符合预约资格弹起picker面板
        if (this.data.canJoin) {
            this.toggelDrawer();
            this.recordUserStep(3); // 记录注册成功可选择门店
        } else if (this.data.canReSelect) {
            this.toggelDrawer();
            this.recordUserStep(8); // 记录重新选择门店
        }
    },
    gotoCoupon() {
        wx.switchTab({
            url: '/pages/coupon/coupon',
        })
    },
    onNoFollowBtnClick() {
        this.setData({
            showNoFollowModal: false,
        })
    },
    toggelDrawer() {
        this.setData({
            showDrawer: !this.data.showDrawer
        })
    },
    // 提交预约
    async onSumbit() {
        if (!this.data.selectedStoreVal) {
            wx.showToast({
                title: '请先选择门店',
                icon: 'error'
            })
            return;
        }
        this.recordUserStep(7)
        const apiData = {
            "memberUserName": this.data.phone,
            "storeId": this.data.originalStoreData[this.data.finalSelectedStoreIndex[0]].elementList[this.data.finalSelectedStoreIndex[1]].elementList[this.data.finalSelectedStoreIndex[2]].code,
            ...this.data.dateRange[1][this.data.selectedDateRangeIndex[1]].value
        };
        // console.log(apiData);
        const ret = await request({
            url: '/scrm/godiva/godivaSoftIceCoupon/sendCoupon',
            data: apiData
        })
        const resCode = ret.data.data.code;
        switch (resCode) {
            case 3:
                this.setData({
                    popupText: ret.data.data.msg,
                    popupButtonText: '重新选择',
                    canReSelect: true
                })
                break;
            case 4:
                this.setData({
                    popupText: ret.data.data.msg,
                    popupButtonText: '关闭',
                    canJoin: false
                })
                break;
            case 2:
                this.setData({
                    popupText: ret.data.data.msg,
                    popupButtonText: '关闭',
                    canJoin: false
                });
                break;
            case 0:
                this.setData({
                    popupText: ret.data.data.msg,
                    popupButtonText: '确定',
                    canJoin: false,
                    getQuanSuccess: true,
                    showModal: false
                });
                break;
            // 领取成功
            default:
                this.setData({
                    popupText: ret.data.data.msg,
                    popupButtonText: '关闭',
                    canJoin: false,
                });
        }
        this.toggelDrawer();
        this.toggleModal();
    },
    // 操作埋点反馈
    recordUserStep(step = 1) {
        request({
            url: '/scrm/godiva/click/buried',
            data: {
                phone: this.data.phone,
                clickStepCode: step
            }
        })
    },
    // 跳转注册页
    toRegisterPage() {
        this.recordUserStep(2)
        wx.navigateTo({
            url: '/pages/index/index',
        })
    },
    // 跳转用户协议页
    toAgreementPage() {
        wx.navigateTo({
            url: '/pages/agreement/agreement',
        })
    },
    // 跳转公众号引流页
    toGZH() {
        this.recordUserStep(11);
        wx.navigateTo({
            url: '/pages/gzh/gzh',
        })
    },
    // 遮罩层控制器
    toggleModal() {
        if (this.data.showModal) {
            this.animate('.modal', [{
                opacity: 1
            }, {
                opacity: 0
            }], 300)
            setTimeout(() => {
                this.setData({
                    showModal: false
                })
            }, 350);
        } else {
            this.setData({
                showModal: true
            })
            this.animate('.modal', [{
                opacity: 0
            }, {
                opacity: 1
            }], 300)
        }
    }
})