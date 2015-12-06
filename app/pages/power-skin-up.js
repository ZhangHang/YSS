pageStack.set('power-skin-up', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    it.enterScene1(self, incrementer, function() {
      it.dismissScene1(self)
      it.enterScene2(self, incrementer, pageCompletionHandler)
    })
  },
  enterScene1: function(self, incrementer, completionHandler) {
    var container = self.find(".scene-1")
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".drop"), incrementer.last()).done(function() {
      Animator.fadeOut(container.find(".drop")).done()
      Animator.fadeIn(container.find(".drop-down")).done()
      Animator.fadeIn(container.find(".drop-down-bottom"),400).done()
      Animator.performAction(completionHandler, 1600)
    })
  },
  dismissScene1: function(self) {
    var container = self.find(".scene-1")
    Animator.fadeOut(container).done()
  },
  enterScene2: function(self, incrementer, completionHandler) {
    incrementer.reset()
    var container = self.find(".scene-2")
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".mitochondria"), incrementer.next(300)).done()
    Animator.performAction(function() {
      container.find(".mitochondria").removeClass("fadeIn")
      Animator.bounceIn(container.find(".mitochondria")).done()
    }, incrementer.next(1000))
    Animator.fadeIn(container.find(".light"), incrementer.next()).done()
    Animator.bounceIn(container.find(".text"), incrementer.next()).done(completionHandler)
  }
})
