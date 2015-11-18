pageStack.set('another-game', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    Animator.fadeIn(self.find("#mask-old"), incrementer.next()).done()
    Animator.fadeIn(self.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(self.find("#hand"), incrementer.next()).done(function() {
      Animator.removeFadeIn(this)
      Animator.float(this, 0, {
        infinite: true
      }).done()
      self.on('click', function() {
        $(this).off()
        Animator.fadeOut(self.find("#hand")).done(function() {
          this.remove()
        })
        Animator.fadeOut(self.find("#mask-old")).done()
        Animator.shine(self.find("#hand")).done()
        Animator.fadeIn(self.find("#mask-new")).done()
        it.enterRepaireScene(self, incrementer, pageCompletionHandler)
      })
    })
  },
  enterRepaireScene: function(self, incrementer, pageCompletionHandler) {
    incrementer.reset()
    self.find("#cell-container").addClass("repaire")
    Animator.performAction(pageCompletionHandler, 2000)
  }
})
