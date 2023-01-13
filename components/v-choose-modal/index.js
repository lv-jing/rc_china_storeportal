// components/choose-dialog/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ''
    },
    confimText: {
      type: String,
      value: '好的'
    },
    cancelText: {
      type: String,
      value: '返回'
    },
    list: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
            list_ : [...newVal]
          }
        ) 
      }
    },
    selected: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
            selected_ : [...newVal]
          }
        ) 
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list_: [],
    selected_: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
     this.triggerEvent('close')
    },
    confirm (e) {
      this.triggerEvent('confirm', {list: this.data.list_, selected: this.data.selected_})
    },
    chooseItem(e) {
      let array = [...this.data.list_];
      let selectedAarry = this.data.selected_;
      let selectedItem = e.currentTarget.dataset.item;
      selectedItem.active = !selectedItem.active;
      if(selectedItem.active) {
        selectedAarry.push(selectedItem);
      } else {
        if(selectedAarry.length > 0 ) {
          selectedAarry.forEach((item, index) => {
            if(item.name === selectedItem.name) {
              selectedAarry.splice(index, 1)
            }
          })
        }
      }
      array.forEach((item, index) => {
        if(item.name === selectedItem.name) {
          item.active = selectedItem.active;
        }
      })
      this.setData({
        list_: [...array],
        selected_: selectedAarry
      })
    },
    clear() {
      let list = this.data.list_;
      list.forEach(item => {
        item.active = false;
      })
      this.setData({
        list_: list,
        selected: []
      })
    }
  }
})
