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

pageStack = new (function() {
  var map = {}
  this.set = function(name, object) {
    map[name] = object
  }

  this.get = function(name){
    return map[name]
  }
})()
