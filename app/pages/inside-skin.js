pageStack.set('inside-skin', {
  disableScrollingUp: true,
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    it.enterSence1(self, incrementer, function() {
      it.dismissSence1(self, function() {
        it.enterSence2(self, incrementer, pageCompletionHandler)
      })
    })
  },
  enterSence1: function(self, incrementer, completionHandler) {
    var it = this;
    incrementer.reset()
    var container = self.find(".scene-1")
    Animator.fadeIn(container.find(".head"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done()
    Animator.fadeIn(container.find("#scene-1-magnifier"), incrementer.next()).done()
    Animator.fadeIn(container.find(".hand"), incrementer.next()).done(function() {
      var firstMove = true
      var offset = -$(self).height() * 0.2
      var HIDE_GUIDE_CONTROL_DISTANCE = 10
      var controller = MagnifierController("#scene-1-magnifier", offset, 0, offset, function(x) {
        if (Math.abs(x) >= HIDE_GUIDE_CONTROL_DISTANCE) {
          firstMove = false;
          Animator.fadeOut(container.find(".hand")).done()
          Animator.fadeOut(container.find(".arrow")).done()
        }
      }, function() {
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
    var it = this;
    var container = self.find(".scene-2")
    Animator.fadeIn(container.find(".magnifier"), incrementer.next()).done()
    Animator.fadeIn(container.find("#scratch"), incrementer.last()).done()
    Animator.fadeIn(container.find(".cell"), incrementer.next()).done()
    Animator.fadeIn(container.find(".hand"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.next()).done()
    LuckyCard.case({
      ratio: .3,
      coverImg: "images/inside-skin/2/magnifier_mask.png"
    }, function() {
      Animator.fadeOut(container.find(".hand")).done()
      Animator.fadeOut(container.find(".arrow")).done(completionHandler)
      self.find("#scratch").remove();
    });
  }
})

function MagnifierController(selector, minOffsetX, maxOffsetX, targetOffsetX, onUpdate, completionHandler) {
  var reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  var el = document.querySelector(selector);

  var START_X = 0;

  var ticking = false;
  var transform;
  var timer;

  var mc = new Hammer.Manager(el);

  mc.add(new Hammer.Pan({
    threshold: 0,
    pointers: 0
  }));
  mc.on("panstart panmove", onPan);
  mc.on("panend", onPanEnd);

  function resetElement() {
    transform = {
      translate: {
        x: START_X
      }
    };
    requestElementUpdate();
  }

  var destroy = false;

  function updateElementTransform() {
    var translateX = Math.min(Math.max(minOffsetX, transform.translate.x), maxOffsetX)

    if(translateX == targetOffsetX){
      completionHandler.call(el)
      mc.destroy();
    }

    var value = [
      'translate3d(' + translateX + 'px, 0px, 0)'
    ];

    value = value.join(" ");
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;

    onUpdate.call(el, translateX)
  }

  function requestElementUpdate() {
    if (!ticking) {
      reqAnimationFrame(updateElementTransform);
      ticking = true;
    }
  }

  function onPan(ev) {
    transform.translate = {
      x: START_X + ev.deltaX
    };

    requestElementUpdate();
  }

  function onPanEnd(ev) {
    el.className += " animated_magnifier"
    transform.translate = {
      x: targetOffsetX
    };

    requestElementUpdate();
  }

  resetElement();
}
