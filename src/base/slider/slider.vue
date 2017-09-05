<template>
  <div class="slider" ref="slider">
    <div class="wrapper" ref="sliderList">
      <slot>
      </slot>
    </div>
    <div class="num">
      <span class="defaultDot" v-show="!dot">1</span><span class="big">{{dot}}</span><span class="numCount">/{{dots}}</span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  name: 'slider',
  data () {
    return {
      dot: '',
      dots: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      this._initDots()
    }, 20)
    // 监听事件，当屏幕尺寸发生改变时触发
    window.addEventListener('resize', () => {
      // 如果slider没有没有加载时
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      // better-scroll的方法，刷新
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderList.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        child.className = 'item-slider'
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      this.$refs.sliderList.style.width = width + 'px'
    },
    _initDots () {
      this.dots = this.$refs.sliderList.children.length
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapThreshold: 0.3,
        snapSpeed: 400
      })

      this.slider.on('scrollEnd', () => {
        this.dot = this.slider.getCurrentPage().pageX + 1
      })
    },
    // 组件销毁时期，记得进行资源清理，优化部分
    destroyed () {
      clearTimeout(this.timer)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slider{
  min-height: 1px
}
  .wrapper{
  	position: relative
    overflow: hidden
    white-space: nowrap
    text-align: center
  }
    .item-slider{
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
    }
      a{
      	display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      }
      img{
      	display: block
        width: 100%
      }
    .num{
      position: absolute
      z-index: 2
      bottom: 20px
      right: 20px
      width: 40px
      height: 40px
      line-height: 40px
      font-size: 0
      text-align: center
      border-radius: 50%
      background-color: #D9D9D9
      color: white
    }
      .defaultDot{
        font-size: 18px
      }
      .big{
        font-size: 18px
      }
      .numCount{
        font-size: 13px
      }
</style>