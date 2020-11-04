import Vue from 'vue'

Vue.mixin({
  methods: {
    // 错误
    $LoopShowTooltip (chart, chartOption, options) {
      let defaultOptions = {
        interval: 2000,
        loopSeries: false,
        seriesIndex: 0,
        updateData: null
      };
  
      if (!chart || !chartOption) {
        return {};
      }
  
      let dataIndex = 0; // 数据索引，初始化为-1，是为了判断是否是第一次执行
      let seriesIndex = 0; // 系列索引
      let timeTicket = 0;
      let seriesLen = chartOption.series.length; // 系列个数
      let dataLen = 0; // 某个系列数据个数
      let chartType; // 系列类型
      let first = true;
  
      // 不循环series时seriesIndex指定显示tooltip的系列，不指定默认为0，指定多个则默认为第一个
      // 循环series时seriesIndex指定循环的series，不指定则从0开始循环所有series，指定单个则相当于不循环，指定多个
      // 要不要添加开始series索引和开始的data索引？
  
      if (options) {
        options.interval = options.interval || defaultOptions.interval;
        options.loopSeries = options.loopSeries || defaultOptions.loopSeries;
        options.seriesIndex = options.seriesIndex || defaultOptions.seriesIndex;
        options.updateData = options.updateData || defaultOptions.updateData;
      } else {
        options = defaultOptions;
      }
  
      // 如果设置的seriesIndex无效，则默认为0
      if (options.seriesIndex < 0 || options.seriesIndex >= seriesLen) {
        seriesIndex = 0;
      } else {
        seriesIndex = options.seriesIndex;
      }
  
      function autoShowTip() {
        function showTip() {
          // 判断是否更新数据
          if (dataIndex === 0 && !first && typeof options.updateData === "function") {
            options.updateData();
            chart.setOption(chartOption);
          }
  
          let series = chartOption.series;
          chartType = series[seriesIndex].type; // 系列类型
          dataLen = series[seriesIndex].data.length; // 某个系列的数据个数
  
          let tipParams = {seriesIndex: seriesIndex};
          switch (chartType) {
            case 'map':
            case 'pie':
            case 'chord':
              tipParams.name = series[seriesIndex].data[dataIndex].name;
              break;
            case 'radar': // 雷达图
              tipParams.seriesIndex = seriesIndex;
              tipParams.dataIndex = dataIndex;
              break;
            default:
              tipParams.dataIndex = dataIndex;
              break;
          }
  
          if (chartType === 'pie' || chartType === 'radar') {
            // 取消之前高亮的图形
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: options.loopSeries ? (seriesIndex === 0 ? seriesLen - 1 : seriesIndex - 1) : seriesIndex,
              dataIndex: dataIndex === 0 ? dataLen - 1 : dataIndex - 1
            });
  
            // 高亮当前图形
            chart.dispatchAction({
              type: 'highlight',
              seriesIndex: seriesIndex,
              dataIndex: dataIndex
            });
          }
  
          // 显示 tooltip
          tipParams.type = 'showTip';
          chart.dispatchAction(tipParams);
  
          dataIndex = (dataIndex + 1) % dataLen;
          if (options.loopSeries && dataIndex === 0 && !first) { // 数据索引归0表示当前系列数据已经循环完
            seriesIndex = (seriesIndex + 1) % seriesLen;
          }
  
          first = false;
        }
  
        showTip();
        timeTicket = setInterval(showTip, options.interval);
      }
  
      // 关闭轮播
      function stopAutoShow() {
        if (timeTicket) {
          clearInterval(timeTicket);
          timeTicket = 0;
  
          if (chartType === 'pie' || chartType === 'radar') {
            // 取消高亮的图形
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: options.loopSeries ? (seriesIndex === 0 ? seriesLen - 1 : seriesIndex - 1) : seriesIndex,
              dataIndex: dataIndex === 0 ? dataLen - 1 : dataIndex - 1
            });
          }
        }
      }
  
      let zRender = chart.getZr();
  
      function zRenderMouseMove(param) {
        if (param.event) {
          // 阻止canvas上的鼠标移动事件冒泡
          param.event.cancelBubble = true;
        }
  
        stopAutoShow();
      }
  
      // 离开echarts图时恢复自动轮播
      function zRenderGlobalOut() {
        if (!timeTicket) {
          autoShowTip();
        }
      }
  
      // 鼠标在echarts图上时停止轮播
      chart.on('mousemove', stopAutoShow);
      zRender.on('mousemove', zRenderMouseMove);
      zRender.on('globalout', zRenderGlobalOut);
  
      autoShowTip();
  
      return {
        clearLoop: function () {
          if (timeTicket) {
            clearInterval(timeTicket);
            timeTicket = 0;
          }
  
          chart.off('mousemove', stopAutoShow);
          zRender.off('mousemove', zRenderMouseMove);
          zRender.off('globalout', zRenderGlobalOut);
        }
      };
    }
  }
})
