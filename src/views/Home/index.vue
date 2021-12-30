<template>
  <div id="demo" style="height: 100%"></div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      demo: '',
      data: require('@/assets/json/homePage.json')
    }
  },
  mounted () {
    // 延迟echarts绘制
    setTimeout(() => {
      this.setDemo()
    })
    // 浏览器页面缩放后echarts大小重设
    window.onresize = () => {
      this.demo.resize()
    }
  },
  methods: {
    setDemo () {
      this.demo = this.$echarts.init(document.getElementById('demo'))
      const option = {
        title: {
          text: 'Beijing AQI',
          left: '1%'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '15%',
          bottom: '10%'
        },
        xAxis: {
          data: this.data.map(function (item) {
            return item[0]
          })
        },
        yAxis: {},
        toolbox: {
          right: 20,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
          startValue: '2014-06-01'
        }, {
          type: 'inside'
        }],
        visualMap: {
          top: 50,
          right: 10,
          pieces: [{
            gt: 0,
            lte: 50,
            color: '#93CE07'
          }, {
            gt: 50,
            lte: 100,
            color: '#FBDB0F'
          }, {
            gt: 100,
            lte: 150,
            color: '#FC7D02'
          }, {
            gt: 150,
            lte: 200,
            color: '#FD0100'
          }, {
            gt: 200,
            lte: 300,
            color: '#AA069F'
          }, {
            gt: 300,
            color: '#AC3B2A'
          }],
          outOfRange: {
            color: '#999'
          }
        },
        series: {
          name: 'Beijing AQI',
          type: 'line',
          data: this.data.map(function (item) {
            return item[1]
          }),
          markLine: {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [{
              yAxis: 50
            }, {
              yAxis: 100
            }, {
              yAxis: 150
            }, {
              yAxis: 200
            }, {
              yAxis: 300
            }]
          }
        }
      }
      this.demo.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
