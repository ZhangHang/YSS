pageStack.set('power-skin-up', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    it.enterScene1(self, incrementer, function() {
      it.dismissScene1(self, function() {
        it.enterScene2(self, incrementer, pageCompletionHandler)
      })
    })
  },
  enterScene1: function(self, incrementer, completionHandler) {
    var container = self.find(".scene-1")
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".drop"), incrementer.next()).done(function() {
      self.on('click', function() {
        $(this).off()
        Animator.fadeOut(container.find(".drop")).done()
        Animator.fadeIn(container.find(".drop-down")).done(completionHandler)
      })
    })
  },
  dismissScene1: function(self, completionHandler) {
    var container = self.find(".scene-1")
    Animator.fadeOut(container.find(".cell")).done()
    Animator.fadeOut(container.find(".drop-down")).done(function() {
      container.remove()
      completionHandler()
    })
  },
  enterScene2: function(self, incrementer, completionHandler) {
    incrementer.reset()
    var container = self.find(".scene-2")
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".drop"), incrementer.next()).done()
    Animator.fadeIn(container.find(".light"), incrementer.next()).done()
    Animator.bounceIn(container.find(".text"), incrementer.next()).done(completionHandler)
  }
})
