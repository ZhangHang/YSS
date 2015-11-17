pageStack.set('usage', {
  currentSceneIndex: 0,
  animating: false,
  render: function(self, incrementer) {
    var it = this
    Animator.fadeIn(self.find("#scroll-container"), incrementer.next()).done()
    Animator.fadeIn(self.find("#scroll-text"), incrementer.next()).done()
    Animator.fadeIn(self.find("#mask"), incrementer.next()).done()
    Animator.fadeIn(self.find("#face"), incrementer.next()).done(function() {

      it.nextScene(self, incrementer)

      self.on('click', function() {
        if (it.animating) {
          return
        }
        if (it.currentSceneIndex === 3) {
          self.off('click')
          return
        }
        it.nextScene(self, incrementer)
      })
    })
  },
  nextScene: function(self, incrementer) {
    incrementer.reset()
    var it = this
    it.animating = true
    it.currentSceneIndex++
    var container = self.find(".scene-" + it.currentSceneIndex)

    function dismissScene(index) {
      var container = self.find(".scene-" + index)
      Animator.fadeOut(container.find(".left-hand")).done()
      Animator.fadeOut(container.find(".right-hand")).done()
      Animator.fadeOut(container.find(".text")).done()
      Animator.fadeOut(container.find(".arrow")).done()
    }

    if (it.currentSceneIndex > 1) {
      dismissScene(it.currentSceneIndex - 1)
    }

    Animator.fadeIn(container.find(".left-hand"), incrementer.next()).done()
    Animator.fadeIn(container.find(".right-hand"), incrementer.last()).done()
    Animator.fadeIn(container.find(".text"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done(function() {
      it.animating = false
    })
  }
})
