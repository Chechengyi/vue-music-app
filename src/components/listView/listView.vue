<template>
  <scroll
    :listenScroll ="true"
    @scroll ="listenScroll"
    class ="listview"
    :data ="data"
    ref ="listview"
    :probeType ='3'
  >
    <!--歌曲列表dom-->
    <ul>
      <li v-for="(group, index) in data" ref="listGroup" class="list-group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.items"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img v-lazy ="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--左侧导航dom-->
    <div class="list-shortcut"
         @touchmove.stop.prevent="onShortcutTouchMove"
         @touchstart="onShortcutTouchStart"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :class="{current: currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <Loading></Loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import { getData } from 'common/js/dom'
  import Loading from '../../components/loading/loading'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    components: {
      Loading,
      Scroll
    },
    created () {
      this.touch = {}
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    computed: {
      // 从数据中提取处 A，B，C这样的标题
      shortcutList () {
        return this.data.map ( (group)=> {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY>0) return ''
        return this.data[this.currentIndex]?this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        if (anchorIndex === null) return
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = parseInt(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        if ( this.touch.y1 === undefined ) return
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = Math.floor((this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT)
        let anchorIndex = this.touch.anchorIndex + delta
        this.currentIndex =   parseInt(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      _scrollTo (index) {
         if (index===null) return
        if ( parseInt(index) < 0 ) {
          index = 0
        }
        if ( parseInt(index) > this.listHeight.length-2  ) {
          index = this.listHeight.length-2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        this.currentIndex = index
      },
      listenScroll (pos) {
        this.scrollY = pos.y
        if (pos.y>0) return
        for ( let i=0; i<this.listHeight.length; i++ ) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i+1]
          if ( (-pos.y)>=height1 && (-pos.y) < height2 ) {
            this.currentIndex = i
            this.diff = height2 + pos.y
          }
        }
      },
      // 算出每一栏歌手列表的高度
      _calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for ( let i=0; i<list.length; i++ ) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data () {
        // 因为dom更新是需要时间的， 所有延迟20秒执行
        setTimeout( ()=> {
          this._calculateHeight()
        }, 20)
      },
      diff (newVal) {
        let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) return
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
