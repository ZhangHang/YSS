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
        })
        backgrondAudio.play()
        introductionScene()
      })
    }

    function dropperScene() {

      ~(function() {
        $(".pace-inactive").remove()
      })()

      ~(function() {
        Animator.fadeOut(self.find("#logo")).done()
        Animator.fadeOut(self.find("#seperator_top")).done()
        Animator.fadeOut(self.find("#seperator_bottom")).done()
        Animator.fadeOut(self.find("#text_right")).done()
        Animator.fadeOut(self.find("#text_left")).done()
        Animator.fadeOut(self.find("#text_bottom")).done()
      })()

      incrementer.reset()
      Animator.fadeIn(self.find("#dropper_text")).done()
      Animator.fadeIn(self.find("#drop")).done()
      Animator.fadeIn(self.find("#inner_drop")).done()
      Animator.fadeIn(self.find("#text"), incrementer.next()).done()
      Animator.shine(self.find("#outter_circle"), incrementer.next(), {
        infinite: true
      }).done()
      Animator.shine(self.find("#inner_circle"), incrementer.next(), {
        infinite: true
      }).done()
      Animator.fadeIn(self.find("#hand"), incrementer.last()).done(function() {
        Animator.removeFadeIn(this, true)
        Animator.float(this, 0, {
          infinite: true
        }).done()
      })

      var dropController = (function(outerdrop, innerDrop) {
        var controller = {}
        controller.ready = true

        controller.drop = function() {
          if (!controller.ready) {
            return
          }

          controller.ready = false

          Animator.fadeOut(innerDrop, 0 , {
            duration: 800
          }).done()

          Animator.fadeIn(outerdrop, 800, {
            duration: 800
          }).done()

          controller.hasNeverDropAnything = false

          Animator.fadeOutDown(outerdrop, 1600, {
            duration: "3s"
          }).done()

          Animator.performAction(function() {
            outerdrop.removeClass("fadeOutDown fadeIn")
            innerDrop.removeClass("fadeOut")
            Animator.fadeIn(innerDrop).done(function(){
              controller.ready = true
            })
          }, 2500)
        }

        controller.hasNeverDropAnything = true

        return controller
      })(self.find("#water_drop"), self.find("#inner_drop"))

      self.find(".tapArea").on('click', function() {
        if (dropController.hasNeverDropAnything) {
          isDropperTaped = true
          Animator.performAction(pageCompletionHandler, 2000)
        }
        if(dropController.ready){
          Animator.performAction(function() {
            $("audio")[1].play()
          }, 800)
          dropController.drop()
        }
      })
    }
  }
})
