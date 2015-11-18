isWeixinWebView = (function() {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true
  } else {
    return false
  }
})()

isBackgroundAudioInited = false
$("audio").on('play', function() {
  isBackgroundAudioInited = true
})

pageStack = {
  map: {},
  set: function(key, value){
    this.map[key] = value
  },
  get: function(key){
    return this.map[key]
  }
}
