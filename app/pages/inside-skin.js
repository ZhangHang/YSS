pageStack.set('inside-skin', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this

    var hammertime = new Hammer(self[0])
    hammertime.on('swipe', function(ev) {
      if (it.swipeHandler) {
        it.swipeHandler(ev);
      }
    });

    it.enterSence1(self, incrementer, function() {
      it.dismissSence1(self, function() {
        it.enterSence2(self, incrementer, pageCompletionHandler)
      })
    })
  },
  swipeHandler: function(ev) {

  },
  enterSence1: function(self, incrementer, completionHandler) {
    var it = this;
    incrementer.reset()
    var container = self.find(".scene-1")
    Animator.fadeIn(container.find(".head"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done()
    Animator.fadeIn(container.find(".magnifier"), incrementer.next()).done()
    Animator.fadeIn(container.find(".hand"), incrementer.next()).done(function() {
      it.swipeHandler = function(ev) {
        if (ev.direction != Hammer.DIRECTION_LEFT) {
          return;
        }
        it.swipeHandler = undefined;
        Animator.fadeOut(container.find(".hand")).done()
        Animator.fadeOut(container.find(".arrow")).done(function() {
          container.find(".magnifier").css("left", "-26%")
          Animator.performAction(completionHandler, 1000)
        })
      }
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
    var it = this;
    var container = self.find(".scene-2")
    Animator.fadeIn(container.find(".magnifier"), incrementer.next()).done()
    Animator.fadeIn(container.find(".magnifier-mask"), incrementer.last()).done()
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".hand"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done(function() {
      it.swipeHandler = function(ev) {
        console.log(ev);
        if (ev.direction == Hammer.DIRECTION_LEFT || ev.direction == Hammer.DIRECTION_RIGHT) {
          it.swipeHandler = undefined;
          Animator.fadeOut(container.find(".hand")).done()
          Animator.fadeOut(container.find(".magnifier-mask")).done()
          Animator.fadeOut(container.find(".arrow")).done(completionHandler)
        }
      }
    })
  }
})