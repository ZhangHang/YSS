pageStack.set('change', {
  render: function(self, incrementer, pageCompletionHandler) {
    Animator.fadeIn(self.find("#head"), incrementer.next()).done()
    Animator.fadeIn(self.find("#hand"), incrementer.next()).done(function() {
      Animator.removeFadeIn(this)
      Animator.float(this, 0, {
        infinite: true
      }).done()
    })

    self.on("click", function() {
      $(this).off()
      incrementer.reset()
      Animator.fadeOut(self.find("#hand")).done(function() {
        this.remove()
        Animator.fadeIn(self.find(".next-page-arrow")).done(pageCompletionHandler)
      })


      function lightAnimation(element, delay, remove) {
        Animator.fadeIn(element, delay, {
          duration: "0.3s"
        }).done(function() {
          if (remove) {
            Animator.fadeOut(element).done(function() {
              this.remove()
            })
          }
        })
      }
      var delay = 250
      lightAnimation(self.find(".light").eq(0), incrementer.next(delay), true)
      lightAnimation(self.find(".light").eq(1), incrementer.next(delay), true)
      lightAnimation(self.find(".light").eq(2), incrementer.next(delay), true)
      lightAnimation(self.find(".light").eq(3), incrementer.next(delay), true)
      lightAnimation(self.find(".light").eq(4), incrementer.next(delay), true)
      lightAnimation(self.find(".light").eq(5), incrementer.next(delay), false)

      Animator.performAction(function() {
        Animator.fadeIn(self.find(".next-page-arrow")).done(pageCompletionHandler)
        self.find("#head").addClass("change")
      }, incrementer.next() - delay * 4)
    })
  }
})
