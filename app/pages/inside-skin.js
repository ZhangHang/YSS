pageStack.set('inside-skin', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    it.enterSence1(self, incrementer, function() {
      it.dismissSence1(self, function() {
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

    var hammertime = new Hammer(self[0])
    hammertime.on('swipeleft', function(ev) {
      hammertime.destroy()
      console.log("swipe")
      Animator.fadeOut(container.find(".hand")).done()
      Animator.fadeOut(container.find(".arrow")).done(function() {
        container.find(".magnifier").css("left", "-23%")
        Animator.performAction(completionHandler, 1000)
      })
    })
  },
  dismissSence1: function(self, completionHandler) {
    var container = self.find(".scene-1")
    Animator.fadeOut(container).done(function() {
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
      var hammertime = new Hammer(self[0])
      hammertime.on('swipe', function(ev) {
        if (event.direction == 'right' || event.direction == 'left') {
          hammertime.destroy()
          console.log("swipe")
          Animator.fadeOut(container.find(".hand")).done()
          Animator.fadeOut(container.find(".magnifier-mask")).done()
          Animator.fadeOut(container.find(".arrow")).done(completionHandler)
        }
      })
    })
  }
})
