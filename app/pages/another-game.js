pageStack.set('another-game', {
  render: function(self, incrementer) {
    var it = this
    Animator.fadeIn(self.find("#mask-old"), incrementer.next()).done()
    Animator.fadeIn(self.find(".cell"), incrementer.next()).done(function() {
      self.on('click', function() {
        $(this).off()
        Animator.fadeOut(self.find("#mask-old")).done()
        Animator.fadeIn(self.find("#mask-new")).done()
        it.enterRepaireScene(self, incrementer)
      })
    })
  },
  enterRepaireScene: function(self, incrementer) {
    incrementer.reset()
    self.find("#cell-container").addClass("repaire")
  }
})
