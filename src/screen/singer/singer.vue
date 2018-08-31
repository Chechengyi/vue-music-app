<template>
  <div class="singer">
    <list-view
      @select="selectSinger"
      :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import { getSingerList } from 'api/singer.js'
  import { ERR_OK } from 'api/config'
  import Singer from '../../common/js/singer'
  import ListView from '../../components/listView/listView'
  import { mapMutations } from 'vuex'

  const HOT_NAME = '热门'
  const HOT_LEN = 10

  export default {
    components: {
      ListView
    },
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getDiscList()
    },
    methods: {
      selectSinger (item) {
        this.$router.push(`/singer/${item.id}`)
        this.setSinger(item)
      },
      _getDiscList () {
        getSingerList()
          .then( res=> {
            if (res.code === ERR_OK) {
              this.singers = this._normalizeSinger(res.data.list)
            }
          })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.map( (item, index)=> {
          if ( index < HOT_LEN ) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }
          const key = item.Findex
          if ( !map[key] ) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key]['items'].push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        })

        // 将map转换为有序列表 数组
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    background-color: black
</style>
