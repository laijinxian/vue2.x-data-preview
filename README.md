
## Project setup \ Compiles and minifies for production
```
yarn install \ yarn serve
```

原文： [掘金文章](https://juejin.im/post/6891179944018182158/)

关注公众号： 微信搜索 `web全栈进阶` ; 收货更多的干货

## 一、效果图
**由于屏幕录制的原因吧。有点卡顿，实际项目不卡顿**  加载视频可能有点慢, `可放大查看`...

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be77885202b49cdad428ab282dad359~tplv-k3u1fbpfcp-watermark.image)

## 二、开篇
- 个人推荐可视化插件：很强大的阿里开源 [antv(G2、G6、F2、L7)](https://antv-l7.gitee.io/zh/examples/gallery) 系列，[百度图表echarts](https://echarts.apache.org/examples/zh/index.html) 和 [地图mapv](https://mapv.baidu.com/v1/v1/demo/build/index.html), [大屏装饰 DataV](http://datav.jiaminghi.com/guide/), [D3.js](https://observablehq.com/@d3/gallery)、[three.js](https://threejs.org/examples/#webgl_animation_cloth)
- 大屏数据可视化需求说难挺简单的，说简单挺难的；我认为`选对可视化插件`可以说成功了一半；不过选型期间往往挺废时间的，因为还要不断的测试看符不符合需求；
- 本文分享介绍我使用`vue2.x` 开发大屏数据可视化需求的一些`套路`及`常用插件`
- 觉得对各位猿友有用的，`博客点个赞`；`github`点个`star`；谢谢
- [github地址](https://github.com/laijinxian/vue2.x-data-preview)

## 三、项目功能介绍
- 1）**由于真是数据来源于登录过后的后台接口、这里把接口部分去了。数据本地保存了**
- 2）**可交互气泡地图 (使用的是阿里开源的 [antvL7](https://antv-l7.gitee.io/zh/examples/gallery) )**
- 3）**自定义数字滚动器、数据圆环**
- 4）**表格、列表滚动（自定义了部分）（[DataV](http://datav.jiaminghi.com/guide/)）**
- 5）**饼图、圆环图（使用的是百度 [echarts](https://echarts.apache.org/examples/zh/index.html)）**

## 四、项目源码
- **在这就没对这些需求功能做代码细分展示 （`说实在的代码没什么亮点、只是作为分享`）**
- **请移步点击 [github 文章](https://github.com/laijinxian/vue2.x-data-preview) 查源码**

## 五、结语
以上为个人实际项目开发总结， 有问题欢迎留言一起交流学习


