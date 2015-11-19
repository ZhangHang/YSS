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
      })
      self.find("#head").addClass("change")
      Animator.fadeIn(self.find("#light")).done()
      Animator.fadeIn(self.find(".next-page-arrow"), incrementer.next()).done(pageCompletionHandler)
    })
  }
})
