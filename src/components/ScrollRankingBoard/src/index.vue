<template>
  <div class="ql-scroll-ranking-board" :ref="ref">
    <div
      class="row-item"
      v-for="(item, i) in rows"
      :key="item.toString() + item.scroll"
      :style="`height: ${heights[i]}px;`"
    >
      <div class="ranking-info">
        <!--<div class="rank">No.{{ item.ranking }}</div>-->
        <div class="info-name" v-html="item.name" />
        <div class="ranking-value">{{ formatter ? valueFormatter(item.value) + mergedConfig.unit : item.value + mergedConfig.unit }}</div>
      </div>

      <div class="ranking-column">
        <div
          class="inside-column"
          :style="`width: ${item.percent}%;`"
        >
          <div class="shine" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import autoResize from '../index'

  import { deepMerge } from '@jiaminghi/charts/lib/util/index'

  import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'

  export default {
    name: 'DvScrollRankingBoard',
    mixins: [autoResize],
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        ref: 'scroll-ranking-board',

        defaultConfig: {
          /**
           * @description Board data
           * @type {Array<Object>}
           * @default data = []
           */
          data: [],
          /**
           * @description Row num
           * @type {Number}
           * @default rowNum = 5
           */
          rowNum: 5,
          /**
           * @description Scroll wait time
           * @type {Number}
           * @default waitTime = 2000
           */
          waitTime: 3000,
          /**
           * @description Carousel type
           * @type {String}
           * @default carousel = 'single'
           * @example carousel = 'single' | 'page'
           */
          carousel: 'single',
          /**
           * @description Value unit
           * @type {String}
           * @default unit = ''
           * @example unit = 'ton'
           */
          unit: '',
          /**
           * @description Auto sort by value
           * @type {Boolean}
           * @default sort = true
           */
          sort: true,
          /**
           * @description value Format
           * @type {Boolean}
           * @default formatter = false
           */
          formatter: false
        },

        formatter: false,

        mergedConfig: null,

        rowsData: [],

        rows: [],

        heights: [],

        animationIndex: 0,

        animationHandler: '',

        updater: 0
      }
    },
    watch: {
      config () {
        const { stopAnimation, calcData } = this

        this.formatter = this.config.formatter

        stopAnimation()

        calcData()
      }
    },
    methods: {
      valueFormatter (str) {
        let reg =/(?=(?!\b)(\d{3})+$)/g
        return str.toString().replace(reg, ',')
      },

      afterAutoResizeMixinInit () {
        const { calcData } = this

        calcData()
      },
      onResize () {
        const { mergedConfig, calcHeights } = this

        if (!mergedConfig) return

        calcHeights(true)
      },
      calcData () {
        const { mergeConfig, calcRowsData } = this

        mergeConfig()

        calcRowsData()

        const { calcHeights } = this

        calcHeights()

        const { animation } = this

        animation(true)
      },
      mergeConfig () {
        let { config, defaultConfig } = this

        this.mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {})
      },
      calcRowsData () {
        let { data, rowNum, sort } = this.mergedConfig

        sort && data.sort(({ value: a }, { value: b }) => {
          if (a > b) return -1
          if (a < b) return 1
          if (a === b) return 0
        })

        const value = data.map(({ value }) => value)

        const max = Math.max(...value) || 0

        data = data.map((row, i) => ({ ...row, ranking: i + 1, percent: row.value / max * 100 }))

        const rowLength = data.length

        if (rowLength > rowNum && rowLength < 2 * rowNum) {
          data = [...data, ...data]
        }

        data = data.map((d, i) => ({ ...d, scroll: i }))

        this.rowsData = data
        this.rows = data
      },
      calcHeights (onresize = false) {
        const { mergedConfig } = this

        const { data } = mergedConfig


        this.avgHeight = 50

        if (!onresize) this.heights = new Array(data.length).fill(this.avgHeight)

      },
      async animation (start = false) {
        let { avgHeight, animationIndex, mergedConfig, rowsData, animation, updater } = this

        const { waitTime, carousel, rowNum } = mergedConfig

        const rowLength = rowsData.length

        if (rowNum >= rowLength) return

        if (start) {
          await new Promise(resolve => setTimeout(resolve, waitTime))
          if (updater !== this.updater) return
        }

        const animationNum = carousel === 'single' ? 1 : rowNum

        let rows = rowsData.slice(animationIndex)
        rows.push(...rowsData.slice(0, animationIndex))

        this.rows = rows
        this.heights = new Array(rowLength).fill(avgHeight)

        await new Promise(resolve => setTimeout(resolve, 300))
        if (updater !== this.updater) return

        this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))

        animationIndex += animationNum

        const back = animationIndex - rowLength
        if (back >= 0) animationIndex = back

        this.animationIndex = animationIndex
        this.animationHandler = setTimeout(animation, waitTime - 300)
      },
      stopAnimation () {
        const { animationHandler, updater } = this

        this.updater = (updater + 1) % 999999

        if (!animationHandler) return

        clearTimeout(animationHandler)
      }
    },
    destroyed () {
      const { stopAnimation } = this

      stopAnimation()
    }
  }
</script>

<style lang="stylus">
  .ql-scroll-ranking-board {
    width: 100%;
    height: 100%;
    color: #fff;
    overflow: hidden;
  }
  .ql-scroll-ranking-board .row-item {
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  .ql-scroll-ranking-board .ranking-info {
    display: flex;
    width: 100%;
    font-size: 13px;
  }
  .ql-scroll-ranking-board .ranking-info .rank {
    width: 40px;
    color: #1370fb;
  }
  .ql-scroll-ranking-board .ranking-info .info-name {
    color: rgba(255, 255, 255, 0.8);
    flex: 1;
  }
  .ql-scroll-ranking-board .ranking-info .ranking-value{
    margin-right 5px
  }
  .ql-scroll-ranking-board .ranking-column {
    /*border-bottom: 2px solid rgba(19, 112, 251, 0.5);*/
    /*margin-top: 5px;*/
    display flex
    box-shadow: 0 0 3px #999;
    height: 7px;
    margin: 5px 5px 0 0;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2)
  }
  .ql-scroll-ranking-board .ranking-column .inside-column {
    position: relative;
    height: 100%;
    background: linear-gradient(90deg, #1572D5 0%, #4AE8FF 100%);
    margin-bottom: 2px;
    border-radius: 20px;
    overflow: hidden;
  }
  .ql-scroll-ranking-board .ranking-column .shine {
    position: absolute;
    left: 0%;
    top: 2px;
    height: 2px;
    width: 50px;
    transform: translateX(-100%);
    background: radial-gradient(#28f8ff 5%, transparent 80%);
    animation: shine 3s ease-in-out infinite alternate;
  }
  @keyframes shine {
    80% {
      left: 0%;
      transform: translateX(-100%);
    }
    100% {
      left: 100%;
      transform: translateX(0%);
    }
  }
</style>
