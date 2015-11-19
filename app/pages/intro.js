pageStack.set('intro', {
  render: function(self, incrementer, pageCompletionHandler) {
    function introductionScene() {
      Animator.fadeIn(self.find("#logo")).done()
      Animator.fadeIn(self.find("#seperator_top"), incrementer.next()).done()
      Animator.fadeIn(self.find("#seperator_bottom"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_right"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_left"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done(function() {
        Animator.performAction(dropperScene, 1000)
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
        }, false)
        backgrondAudio.play()
        introductionScene()
      })
    }

    function dropperScene() {
      ~(function() {
        Animator.fadeOut(self.find("#logo")).done()
        Animator.fadeOut(self.find("#seperator_top")).done()
        Animator.fadeOut(self.find("#seperator_bottom")).done()
        Animator.fadeOut(self.find("#text_right")).done()
        Animator.fadeOut(self.find("#text_left")).done()
        Animator.fadeOut(self.find("#text_bottom")).done()
      })()

      incrementer.reset()
      Animator.fadeIn(self.find("#drop")).done()
      Animator.fadeIn(self.find("#text"), incrementer.next()).done()
      Animator.shine(self.find("#inner_circle"), incrementer.next(), {
        infinite: true
      }).done()
      Animator.shine(self.find("#outter_circle"), incrementer.next(), {
        infinite: true
      }).done()
      Animator.fadeIn(self.find("#hand"), incrementer.last()).done(function() {
        Animator.removeFadeIn(this)
        Animator.float(this, 0, {
          infinite: true
        }).done()
      })

      var dropController = (function(drop) {
        var controller = {}
        var isDropReady = true

        controller.drop = function() {
          if (!isDropReady) {
            return
          }

          isDropReady = false

          Animator.fadeIn(self.find(".water_drop"), 0, {
            duration: 0.2
          }).done()

          controller.hasNeverDropAnything = false

          Animator.fadeOutDown(drop, 0.2, {
            duration: 3
          }).done()

          Animator.performAction(function() {
            drop.removeClass("fadeOutDown fadeIn")
            isDropReady = true
          }, 1700)
        }

        controller.hasNeverDropAnything = true

        return controller
      })(self.find(".water_drop"))

      self.find(".tapArea").on('click', function() {
        if (dropController.hasNeverDropAnything) {
          isDropperTaped = true
          Animator.shine(self.find(".next-page-arrow"), 1500).done(pageCompletionHandler)
        }
        dropController.drop()
      })
    }
  }
})
