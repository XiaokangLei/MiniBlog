/**
 * 图片预加载组件
 */
Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    //默认图片
    defaultImage: String,
    //原始图片
    originalImage: String,
    width: String,
    height: String,
    finishLoadFlag: {
      type: Boolean,
      value: false
    },
    errorFlag: {
      type: Boolean,
      value: false
    },
    //图片剪裁mode，同Image组件的mode
    mode: {
      type: String,
      value: 'scaleToFill'
    }
  },
  methods: {
    finishLoad: function (e) {
      let finishLoadFlag = true;
      let errorFlag = false;
      this.triggerEvent('changeFlag', {
        finishLoadFlag,
        errorFlag
      });
    },
    errorLoad() {
      let finishLoadFlag = false;
      let errorFlag = true;
      this.triggerEvent('changeFlag', {
        finishLoadFlag,
        errorFlag
      });
    }
  }
})