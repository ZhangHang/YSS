pageStack.set('inside-skin', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    it.enterSence1(self, incrementer, function() {
      it.dismissSence1(self, function() {
        Animator.fadeOut(self.find(".scene-1"))
        it.enterSence2(self, incrementer, pageCompletionHandler)
      })
    })
  },
  enterSence1: function(self, incrementer, completionHandler) {
    incrementer.reset()
    var container = self.find(".scene-1")
    Animator.fadeIn(container.find(".head"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done()
    Animator.fadeIn(container.find(".magnifier"), incrementer.next()).done()
    Animator.fadeIn(container.find(".hand"), incrementer.next()).done()

    self.on('click', function() {
      completionHandler()
      $(this).off('click')
    })
  },
  dismissSence1: function(self, completionHandler) {
    var container = self.find(".scene-1")
    Animator.fadeOut(container.find(".head")).done()
    Animator.fadeOut(container.find(".arrow")).done()
    Animator.fadeOut(container.find(".magnifier")).done()
    Animator.fadeOut(container.find(".hand")).done(function() {
      container.remove()
      completionHandler()
    })
  },
  enterSence2: function(self, incrementer, completionHandler) {
    incrementer.reset()
    var container = self.find(".scene-2")
    Animator.fadeIn(container.find(".magnifier"), incrementer.next()).done()
    Animator.fadeIn(container.find(".magnifier-mask"), incrementer.last()).done()
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".hand"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done(function() {
      self.on('click', function() {
        Animator.fadeOut(self.find(".magnifier-mask")).done(completionHandler)
        Animator.fadeOut(self.find(".hand")).done(completionHandler)
        Animator.fadeOut(self.find(".arrow")).done(completionHandler)
        $(this).off('click')
      })
    })
  }
})
