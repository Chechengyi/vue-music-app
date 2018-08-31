<template>
  <!--<div class="recommend">-->
    <scroll ref="scroll" :data="discList" class="recommend">
      <div>
        <div class="recommend-content">
          <div v-if="recommends.length" class="slider-wrapper">
            <slider>
              <div v-for="item in recommends" >
                <a :href="item.linkUrl">
                  <img @load="_imgLoad" :src="item.picUrl" alt="">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
  <!--</div>-->
</template>

<script>
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import Slider from '../../components/slider/silder'
  import Scroll from '../../components/scroll/scroll'
  import Loading from '../../components/loading/loading'

  export default {
    components: {
      Slider,
      Scroll,
      Loading
    },
    data () {
      return {
        recommends: [],
        discList: []
      }
    },
    created () {
      this._getRecommend()
      setTimeout( this._getDiscList, 1000)
    },
    methods: {
      _getDiscList(){
        getDiscList()
          .then( res=> {
            if ( res.code == ERR_OK ) {
              this.discList = res.data.list
            }
          })
      },
      _getRecommend(){
        getRecommend()
          .then( res=>{
            if ( res.code === ERR_OK ) {
              // console.log(res.data.slider)
              this.recommends = res.data.slider
            }
          })
      },
      _imgLoad() {
        if ( !this.checkLoaded ) {
          this.$refs.scroll._refresh()
          this.checkLoaded = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" >
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    background-color: #000
    overflow-y: auto
    .recommend-content
      /*height: 100%*/
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
</style>
