import { Http } from '../utils/http'

class CouponModel extends Http {
  //我的票券
  getCoupons(phone) { 
    return this.request({
      url: `/scrm/questionnaire/godivaCoupon/queryUserCoupons`,
      method: 'Post',
      data: {
        phone
      }
    })
  }
  // 商城所有票劵
  getAllShopCoupons(phone) {
    return this.request({
      url: `/scrm/mobile/web/shop/list`,
      method: 'Post',
      data: {
        phone
      }
    })
  }

  //使用优惠券
  useCoupon(cid) {
    return this.request({
      url: `/mobile/api/useCoupon`,
      method: 'Post',
      contentType: 'form',
      data: {
        cid
      }
    })
  }

  //兑换优惠券
  exchangeCoupon({id, num}) {
    return this.request({
      url: `/mobile/api/coupon_convert`,
      method: 'Post',
      contentType: 'form',
      data: {
        id,
        num
      }
    })
  }
}
export {
  CouponModel
}