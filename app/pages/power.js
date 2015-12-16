pageStack.set("power", {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this;


    var textIndex = 0

    function fadeInText(completionHandler) {
      var index = textIndex + 0
      textIndex += 1
      Animator.fadeIn(self.find(".text-right").eq(index)).done()
      Animator.fadeIn(self.find(".text-left").eq(index), 200).done(completionHandler)
    }

    function fadeLatestOutText(completionHandler, delay) {
      var _delay = delay || 0
      Animator.performAction(function() {
        var index = textIndex - 1
        Animator.fadeOut(self.find(".text-left").eq(index)).done()
        Animator.fadeOut(self.find(".text-right").eq(index)).done(completionHandler)
      }, _delay)
    }

    function introSecen(completionHandler) {
      Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()
      Animator.fadeIn(self.find("#bad-cell"), incrementer.next(1000)).done()
      Animator.fadeIn(self.find("#bad-factory"), incrementer.next()).done()
      Animator.fadeIn(self.find("#factory-line"), incrementer.next()).done()

      Animator.performAction(function() {
        fadeInText(function() {
          fadeLatestOutText(function() {
            fadeInText(completionHandler)
          }, 1000)
        })
      }, incrementer.next())
    }

    function dropSecen(completionHandler) {
      fadeLatestOutText(function() {
        fadeInText()
        incrementer.reset()
        Animator.fadeIn(self.find("#droper"), incrementer.next()).done()
        Animator.fadeIn(self.find("#hand"), incrementer.next()).done()
        Animator.fadeIn(self.find("#droper-line"), incrementer.next()).done()
        setupDrop(function() {
          Animator.fadeOut(self.find("#droper")).done()
          Animator.fadeOut(self.find("#factory-line")).done()
          Animator.fadeIn(self.find("#drop-after"), 400).done()
          Animator.fadeIn(self.find("#drop-after-bottom"), 600).done()
          Animator.fadeIn(self.find("#light"), 1000).done(function(){
            fadeLatestOutText(function() {
              fadeInText(function(){
                fadeLatestOutText(completionHandler)
              })
            })
          })
        })
      }, 1000)
    }

    function finalSecen(completionHandler) {
      Animator.fadeIn(self.find("#good-cell")).done()
      Animator.fadeOut(self.find("#bad-cell")).done()
      Animator.fadeOut(self.find("#drop-after")).done()
      Animator.fadeIn(self.find("#chart-body")).done()
      Animator.fadeIn(self.find("#chart-text")).done(function(){
        fadeInText(pageCompletionHandler)
      })
    }

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

    introSecen(function() {
      dropSecen(function() {
        finalSecen(pageCompletionHandler)
      })
    })

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
      return;
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
