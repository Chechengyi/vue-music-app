<template>
  <transition name="slide">
    <div class="singer-detail">
      dd
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import {ERR_OK} from "api/config";
  import { createSong } from 'common/js/song'

  export default {
    data () {
      return {
        song: []
      }
    },
    computed: {
      ...mapGetters(['singer'])
    },
    // computed: {
    //   ...mapGetters({
    //     getSinger: 'singer'
    //   })
    // },
    created () {
      this._getDetail()
    },
    methods: {
      _getDetail () {
        if ( !this.singer.id ) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id)
          .then( res=> {
            if ( res.code === ERR_OK ) {
              console.log(res)
            }
          })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach( (item)=> {
          let { musicData } = item

        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer-detail
    position fixed
    width 100%
    top 0
    bottom 0
    background-color black
    z-index 100
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
