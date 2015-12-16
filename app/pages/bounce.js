pageStack.set("bounce", {
  render: function(self, incrementer, pageCompletionHandler) {
    var ball = self.find("#ball")

    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()

    Animator.fadeIn(self.find("#chart-body-bottom"), incrementer.next()).done()
    Animator.fadeIn(self.find("#chart-body"), incrementer.next()).done()
    Animator.fadeIn(self.find("#chart-text"), incrementer.next()).done()


    Animator.fadeIn(ball, incrementer.next()).done(function() {
      Animator.removeFadeIn(this, true)
      this.addClass("stay-bounce")
    })
    Animator.fadeIn(self.find("#guide"), incrementer.next()).done()
    Animator.fadeIn(self.find("#hand"), incrementer.next()).done()

    var animating = false
    var firstTimeAnimating = true
    Animator.performAction(function() {
      self.on('click', function() {
        if (animating) {
          return
        }

        animating = true
        if (firstTimeAnimating) {
          firstTimeAnimating = false
          Animator.fadeOut(self.find("#guide")).done()
          Animator.fadeOut(self.find("#hand")).done()

          Animator.performAction(function() {
            Animator.fadeIn(self.find("#text")).done()
            Animator.fadeIn(self.find("#text_bottom"), 200).done(pageCompletionHandler)
          }, 1000)
        }
        ball[0].className = "compressed"
        Animator.performAction(function() {
          Animator.animate("skin-bounce", ball, 0, {
            duration: "2s"
          }).done(function() {
            animating = false
            ball[0].className = "stay-bounce"
          })
        }, 1000)

      })
    }, incrementer.next())
  },
  deinit: function(self) {
    self.off('click')
  }
})
