import { Http } from '../utils/http'
const app = getApp()
class MemberModel extends Http {
  getLoginCode() {
    return new Promise ((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res.code)
        },
        fail: err=> {
          reject(err)
     
        }
      })
    })
  }
  isMember(loginCode) {
    return this.request({
      url: '/scrm/ismemberByCode',
      contentType: 'form',
      method: 'Post',
      data: {
        code: loginCode
      }
    })
  }
  getMemberOrStorage(phone) {
    return this.getMember(phone)
  }
  getMember(phone) {
    return this.request({
      url: `/scrm/getMemberAccountPage?phone=${phone}`,
      contentType: 'form'
    })
  }

  updateMember({data}) {
    return this.request({
      url: '/scrm/updateMember',
      method: 'Post',
      data
    })
  }

  updateMemberFavor(data){
    return this.request({
      url: `/scrm/godiva/godivaMember/complete`,
      method: 'Post',
      data
    })
  }

  decodePhone( { encryptedData, ivdata} ) {
    return this.request({
      url: '/scrm/decodePhone',
      contentType: 'form',
      method: 'Post',
      data: {
        encryptedData,
        ivdata
      }
    })
  }

  reqister(data) {
    return this.request({
      url: '/scrm/register',
      method: 'Post',
      data
    })
  }

  setMemberStorage(member) {
    wx.setStorageSync('member', member)
  }

  _getMemberStorage() {
    return wx.getStorageSync('member')
  }

  setMemberStatusStorage(status) { // 0：初始状态 1:是会员 2 ：不是会员
    wx.setStorageSync('memberStatus', status)
  }

  getMemberStatusStorage() {
    return wx.getStorageSync('memberStatus')
  }

  //更新用户白金礼篮信息
  updateGiftBaskets(data) {
    return this.request({
      url: '/scrm/questionnaire/godivaQuestionnaireHistory/bjllQuestionnaire',
      method: 'Post',
      data
    })
  }

   //同步CRM信息
  L100(data) {
    return this.request({
      url: '/consumer/member/sync',
      method: 'Post',
      data
    })
  }

  addGuidLog(data) {
    return this.request({
      url: `/scrm/drawStatistics?phone=${data.phone}&type=${data.type}`,
      method: 'Get'
    })
  }
}

export {
  MemberModel
}