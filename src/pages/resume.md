# React Native 内的webview重新封装并添加图片上传
Rn中的webview相比与原生的安卓的webview，有许多原生很容易实现的功能没有接入，但当我们需要使用到那些功能，例如去添加网页的加载进度百分比，添加对网页中type为file的input的支持等，rn中并没有与这些相关的api支持我们去做这些，当这样的时候，最好的方式就是在rn的代码基础上，重新去封装一个webview，利用原生的api去实现一个功能。
## 如何去封装一个webview
1. 拷贝reactnative内部的webview（ReactWebViewManager.class，WebViewConfig.class）实现代码到安卓目录下