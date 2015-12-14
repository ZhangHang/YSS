pageStack.set("power", {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this;

    function fadeInText(completionHandler) {
      incrementer.reset()
      Animator.fadeInUp(self.find(".text-right").eq(0), incrementer.next()).done()
      Animator.fadeInUp(self.find(".text-left").eq(0), incrementer.next()).done(completionHandler)
    }

    function fadeLatestOutText(completionHandler) {
      function first(queryResult) {
        if (queryResult['length'] != undefined) {
          return queryResult.eq(0)
        } else {
          return queryResult
        }
      }
      Animator.fadeOut(first(self.find(".text-left"))).done()
      Animator.fadeOut(first(self.find(".text-right"))).done(function() {
        if (completionHandler) {
          completionHandler()
        }
      })
    }

    function introSecen(completionHandler) {
      fadeInText(function() {
        fadeLatestOutText(function() {
          fadeInText(completionHandler)
        })
      })
    }

    function dropSecen(completionHandler) {
      fadeLatestOutText(function() {
        fadeInText(function() {
          incrementer.reset()
          Animator.fadeIn(self.find("#droper"), incrementer.next()).done()
          Animator.fadeIn(self.find("#hand"), incrementer.next()).done()
          Animator.fadeIn(self.find("#droper-line"), incrementer.next()).done(function() {
            setupDrop(function() {
              Animator.fadeOut(self.find("#droper")).done()
              Animator.fadeOut(self.find("#factory-line")).done()
              fadeLatestOutText(function() {
                fadeInText()
              })
              Animator.fadeIn(self.find("#drop-after"), 400).done()
              Animator.fadeIn(self.find("#drop-after-bottom"), 600).done()
              Animator.fadeIn(self.find("#light"), 1000).done(completionHandler)
            })
          })
        })
      })
    }

    function finalSecen(completionHandler) {
      Animator.fadeIn(self.find("#good-cell")).done()
      Animator.fadeOut(self.find("#bad-cell")).done()
      Animator.fadeOut(self.find("#drop-after")).done()
      Animator.fadeIn(self.find("#chart-body")).done()
      Animator.fadeIn(self.find("#chart-text")).done()
      fadeLatestOutText(function() {
        fadeInText(pageCompletionHandler)
      })
    }

    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()
    Animator.fadeIn(self.find("#bad-cell"), incrementer.next()).done()
    Animator.fadeIn(self.find("#bad-factory"), incrementer.next()).done()
    Animator.fadeIn(self.find("#factory-line"), incrementer.next()).done()

    function setupDrop(completionHandler) {
      var firstMove = true
      var offset = $(self).height() * 0.06
      var HIDE_GUIDE_CONTROL_DISTANCE = $(self).height() * 0.01
      var controller = dropControllerFactory(self[0], self.find("#droper")[0], {
        targetOffsetY: offset,
        minOffsetY: 0,
        maxOffsetY: offset,
        onUpdate: function(y) {
          if (Math.abs(y) >= HIDE_GUIDE_CONTROL_DISTANCE) {
            firstMove = false;
            Animator.fadeOut(self.find("#hand")).done()
            Animator.fadeOut(self.find("#droper-line")).done()
          }
        },
        completionHandler: function() {
          Animator.performAction(completionHandler, 1000)
        }
      })
    }

    Animator.performAction(function() {
      introSecen(function() {
        dropSecen(function() {
          finalSecen(function() {

          })
        })
      })
    }, incrementer.next())

  }
})


function dropControllerFactory(sourceNode, targetNode, options) {
  var reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  var minOffsetY = options.minOffsetY
  var maxOffsetY = options.maxOffsetY
  var targetOffsetY = options.targetOffsetY
  var onUpdate = options.onUpdate
  var completionHandler = options.completionHandler

  var sel = sourceNode
  var el = targetNode

  var START_Y = 0;

  var ticking = false;
  var transform;
  var timer;

  var mc = new Hammer.Manager(sel);

  mc.add(new Hammer.Pan({
    threshold: 0,
    pointers: 0
  }));
  mc.on("panstart panmove", onPan);
  mc.on("panend", onPanEnd);

  function resetElement() {
    transform = {
      translate: {
        y: START_Y
      }
    };
    requestElementUpdate();
  }

  var destroy = false;

  function updateElementTransform() {
    var translateY = Math.min(Math.max(minOffsetY, transform.translate.y), maxOffsetY)

    if (translateY === targetOffsetY) {
      completionHandler.call(el)
      mc.destroy();
    }

    var value = [
      'translate3d(0px, ' + translateY + 'px, 0)'
    ];

    value = value.join(" ");
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;

    onUpdate.call(el, translateY)
  }

  function requestElementUpdate() {
    if (!ticking) {
      reqAnimationFrame(updateElementTransform);
      ticking = true;
    }
  }

  function onPan(ev) {
    transform.translate = {
      y: START_Y + ev.deltaY
    };

    requestElementUpdate();
  }

  function onPanEnd(ev) {
    el.className += " animated-0dot5s"
    transform.translate = {
      y: targetOffsetY
    };

    requestElementUpdate();
  }

  resetElement();
}
