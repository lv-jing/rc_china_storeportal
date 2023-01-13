import { Http } from '../utils/http'
const app = getApp()
class LuckyModel extends Http {
  luckyAciont(memberId) {
    return this.request({
      url: `/scrm/luckDraw?memberId=${memberId}&activityId=87168aebc6614ee5ab0df95d1d287211`,
      method: 'Post'
    })
  }

  getLuckyRecords(memberId) {
    return this.request({
      url: `/scrm/memberDrawRecordList?memberId=${memberId}`,
      method: 'Get'
    })
  }

  addLuckyLog(data) {
    return this.request({
      url: `/scrm/drawSource?phone=${data.phone}&type=${data.type}`,
      method: 'Get'
    })
  }
}
export {
  LuckyModel
}