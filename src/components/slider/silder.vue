<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: index===currentPageIndex}" v-for="(item, index) in dots" >

      </span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'

  export default {
    props: {
      loop: {  // 是否无缝切换
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    activated () {
      if (this.autoPlay) {
        this._autoPlay()
      }
      window.addEventListener('resize', this._resize)
    },
    deactivated () {
      clearTimeout(this.autoTimer)
      window.removeEventListener('resize', this._resize)
    },
    destroyed () {
      clearTimeout(this.autoTimer)
      window.removeEventListener('resize', this._resize)
    },
    mounted () {
      setTimeout( ()=>{
        this._setSLiderWidth()
        this._initDots()
        this._initSlider()
        if ( this.autoPlay ) {
          this._autoPlay()
        }
      }, 20)
      window.addEventListener('resize', this._resize)
    },
    methods: {
      _resize () {
        if (!this.silder) {
          return
        }
        this._setSLiderWidth(true)
        this.silder.refresh()
      },
      _autoPlay () {
        this.autoTimer = setTimeout( ()=>{
          let pageIndex = (this.currentPageIndex+1) % (this.children.length - 2)
          this.silder.goToPage(pageIndex)
          this.currentPageIndex = pageIndex
        }, this.interval)
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _setSLiderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let silderWidth = this.$refs.slider.clientWidth
        for ( let i=0; i<this.children.length; i++ ) {
          addClass(this.children[i], 'slider-item')
          this.children[i].style.width = silderWidth + 'px'
          width += silderWidth
        }
        if ( this.loop && !isResize ) {
          //如果需要做无缝切换的话， 要加克隆两个div 所以 总的width应该要在加两个
          width += 2 * silderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        this.silder = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3
          },
          snapSpeed: 400,
        })
        // 每次滚动结束之后调用的事件
        this.silder.on('scrollEnd', ()=> {
          let pageIndex = this.silder.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          // 判断自动轮播是否开启， 开启的话就要在这里在调用autoPlay函数
          if (this.autoPlay) {
            clearTimeout(this.autoTimer)
            this._autoPlay()
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
