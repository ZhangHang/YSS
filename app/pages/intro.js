pageStack.set('intro', {
  render: function(self, incrementer, pageCompletionHandler) {

    function introductionScene() {
      Animator.fadeIn(self.find("#logo")).done()
      Animator.fadeIn(self.find("#seperator_top"), incrementer.next()).done()
      Animator.fadeIn(self.find("#seperator_bottom"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_right"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_left"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done(function() {
        Animator.performAction(pageCompletionHandler, 1000)
      })
    }

    if (isWeixinWebView || isBackgroundAudioInited) {
      introductionScene()
    } else {
      self.on('click', function() {
        isBackgroundAudioInited = true
        var backgrondAudio = $('audio')[0]
        backgrondAudio.addEventListener('ended', function() {
          this.currentTime = 0
          this.play()
        })
        backgrondAudio.play()
        introductionScene()
      })
    }
  }
})
