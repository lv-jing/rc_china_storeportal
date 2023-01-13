var areaTool = require('../../utils/store.js');
var index = [0,0,0]
var provinces = areaTool.getProvinces();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{    //控制area_select显示隐藏
      type:Boolean,
      value:false
    },
    maskShow:{    //是否显示蒙层
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    provinces: areaTool.getProvinces(),
    citys: areaTool.getCitys(index[0]),
    areas: areaTool.getAreas(index[0], index[1]),
    value:[0,0,0],
    province: '北京市',
    city: '北京市',
    area: '国贸商城店',
    provinceId: '28',
    cityId: '40',
    areaId: '1102',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleNYZAreaChange:function(e){
      var that = this;
      // console.log("e:" + JSON.stringify(e));
      var value = e.detail.value;
      /**
       * 滚动的是省
       * 省改变 市、区都不变
       */
      if(index[0] != value[0]){
        index = [value[0],0,0]
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], 0);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0],0,0],
          province: provinces[index[0]].name,
          city: selectCitys[0].name,
          area: selectAreas[0].name,
          provinceId: provinces[index[0]].id,
          cityId: selectCitys[0].id,
          areaId: selectAreas[0].id
        })
      } else if (index[1] != value[1]){
        /**
         * 市改变了 省不变 区变
         */
        index = [value[0], value[1], 0]
        const selectCitys = areaTool.getCitys(index[0]);
        const selectAreas = areaTool.getAreas(index[0], value[1]);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], 0],
          province: provinces[index[0]].name ,
          city: selectCitys[index[1]].name,
          provinceId: provinces[index[0]].id,
          cityId: selectCitys[index[1]].id
        })
        if(that.data.areas && that.data.areas.length > 0) {
          that.setData({
            area: selectAreas[0].name ? selectAreas[0].name  : '',
            areaId: selectAreas[0].id
          }) 
        } else {
          that.setData({
            area: '',
            areaId: -1
          })
        }
      } else if (index[2] != value[2]){
        /**
         * 区改变了
         */
        index = [value[0], value[1], value[2]]
        let selectCitys = areaTool.getCitys(index[0]);
        let selectAreas = areaTool.getAreas(index[0], value[1]);
        that.setData({
          citys: selectCitys,
          areas: selectAreas,
          value: [index[0], index[1], index[2]],
          province: provinces[index[0]].name,
          city: selectCitys[index[1]].name,
          area: selectAreas[index[2]].name,
          provinceId: provinces[index[0]].id,
          cityId: selectCitys[index[1]].id,
          areaId: selectAreas[index[2]].id
        })
      }
      // console.log(this.data, "-----------")
    },
    /**
     * 确定按钮的点击事件
     */
    handleNYZAreaSelect:function(e){
      //console.log("e:" + JSON.stringify(e));
      var myEventDetail = e; // detail对象，提供给事件监听函数
      var myEventOption = {}; // 触发事件的选项
      this.triggerEvent('sureSelectArea', myEventDetail, myEventOption)
    },
    /**
     * 取消按钮的点击事件
     */
    handleNYZAreaCancle:function(e){
      var that = this;
      // console.log("e:" + JSON.stringify(e))
      that.setData({
        show:false
      })
    }
  }
})
