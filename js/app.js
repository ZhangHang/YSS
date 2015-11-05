var TASK_NAME_UNLOCK = "TASK_NAME_UNLOCK"
var TASK_NAME_NAVIGATE_TO_NEXT_PAGE = "TASK_NAME_NAVIGATE_TO_NEXT_PAGE"

var Animator = (function() {
  var DEFAULT_ANIMATION_DURATION = 1000

  var core = {}

  /*
   * Manage timeout actions
   */
  var TimeoutActionStore = (function() {
    var store = {}
    var timeoutIds = []
    store.addAction = function(action, delay) {
      console.assert(action != undefined)
      console.assert(delay != undefined)
      timeoutIds.push(setTimeout(action, delay))
    }
    store.removeAllActions = function() {
      while (timeoutIds.length > 0) {
        clearTimeout(timeoutIds.pop())
      }
    }
    return store;
  })()

  /*
   * node    : JQuery node
   * delay   : millisecond
   * options :
   *   infinite: Bool
   *   callback: Function
   */
  core.animate = function(animationName, node, delay, options) {
    var _delay = delay || 0
    var _options = (function() {
      var _options = {
        infinite: false,
        callback: function() {}
      }
      for (var attrname in options || {}) {
        _options[attrname] = options[attrname];
      }
      return _options
    })()

    var core = {}
    var afterTimeOffset = 0;
    var afterActions = []
    core.after = function(__action, __delay) {
      afterActions.push({
        delay: afterTimeOffset + __delay,
        action: __action
      })
      afterTimeOffset += __delay;
      return core;
    }
    core.done = function() {
      TimeoutActionStore.addAction(function() {
        $(node).addClass("animated" + (_options.infinite ? " infinite" : "") + " " + animationName);
        TimeoutActionStore.addAction(_options.callback, DEFAULT_ANIMATION_DURATION)
        afterActions.forEach(function(actionPack) {
          TimeoutActionStore.addAction(actionPack.action, actionPack.delay)
        })
      }, _delay)
    }
    return core;
  }

  animateActionFactory = function(animationName) {
    return function() {
      var node = arguments[0]
      var delay = arguments[1]
      var options = arguments[2]
      console.assert(node != undefined)
      return core.animate(animationName, node, delay, options)
    }
  }

  // MARK: - Custom
  core.fadeIn = animateActionFactory("fadeIn")
  core.flash = animateActionFactory("flash")

  // MARK: -
  core.registerCustomAction = function(action, delay, callback) {
    TimeoutActionStore.addAction(function() {
      action()
      if (callback) {
        callback()
      }
    }, delay)
  }

  // MARK: Control
  core.clearAnimations = function() {
    TimeoutActionStore.removeAllActions()
  }

  return core;
})()

var Inbox = (function() {
  var core = {}
  var map = {}

  core.on = function(taskName, action) {
    map[taskName] = action
  }

  core.off = function(taskName) {
    // remove all event
    if (taskName === undefined) {
      map = {}
      return
    }

    map[taskName] = undefined
  }

  core.post = function(taskName) {
    var action = map[taskName]
    if (action) {
      action()
    }
  }

  return core
})()

~(function(pages) {
  var backgroundAudio = undefined;
  var latestSectionNode = undefined;
  var latestSectionIndex = undefined;

  $(document).ready(function() {
    backgroundAudio = $('audio')[0];
    $('#fullpage').fullpage({
      afterLoad: function(anchorLink, index) {
        $.fn.fullpage.setAllowScrolling(false);

        //remove all animation actions
        Animator.clearAnimations()

        if (latestSectionNode) {
          latestSectionNode.html(pages[latestSectionIndex].htmlCache)
        }

        var indexFromZero = index - 1;
        var loadedSection = $(this);

        // cache
        latestSectionNode = loadedSection;
        latestSectionIndex = indexFromZero;

        if (!pages[indexFromZero].htmlCache) {
          pages[indexFromZero].htmlCache = loadedSection.html();
        }

        pages[indexFromZero].render.call(loadedSection);
      }
    });
  });

  // MARK: - Register task handler
  Inbox.on(TASK_NAME_UNLOCK, function() {
    $.fn.fullpage.setAllowScrolling(true);
  })

  Inbox.on(TASK_NAME_NAVIGATE_TO_NEXT_PAGE, function() {
    $.fn.fullpage.moveSectionDown();
  })
})((function() {
  var pages = [];

  var Incrementer = function(baseDelayInMilliSecond, stepInMilliSecond) {
    var firstTimeCall = true
    this.next = function(customStepInMilliSecond) {
      if (firstTimeCall) {
        firstTimeCall = false
        console.assert(customStepInMilliSecond === undefined)
        return baseDelayInMilliSecond
      }
      var step = (customStepInMilliSecond === undefined) ? stepInMilliSecond : customStepInMilliSecond
      baseDelayInMilliSecond += step
      console.log(baseDelayInMilliSecond)
      return baseDelayInMilliSecond
    }
  }

  pages.push({
    render: function() {
      var self = this
      var incrementer = new Incrementer(200, 300)
      Animator.fadeIn(self.find("#logo"), incrementer.next()).done()
      Animator.fadeIn(self.find("#seperator_top", incrementer.next())).done()
      Animator.fadeIn(self.find("#seperator_bottom", incrementer.next())).done()
      Animator.fadeIn(self.find("#text_left"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_righ"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done()
      Animator.fadeIn(self.find("#drop"), incrementer.next()).done()
    }
  })

  pages.push({
    render: function() {
      var self = this

      Animator.fadeIn(self.find("#drop")).done()
      Animator.fadeIn(self.find("#text"), 600).done()
      Animator.fadeIn(self.find("#hand"), 1200).done()
      Animator.fadeIn(self.find("#inner_circle"), 1800, {
        infinite: true
      }).done()
      Animator.fadeIn(self.find("#outter_circle"), 2300, {
        infinite: true
      }).done()

      self.find(".tapArea").on('click', function() {
        Animator.animate("fadeOutDown", self.find("#drop")).done()
        Animator.registerCustomAction(function() {
          Inbox.post(TASK_NAME_NAVIGATE_TO_NEXT_PAGE)
        }, 900)
      })
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#info_container")).done()
      Animator.fadeIn(this.find("#info_text"), 100).done()

      Animator.fadeIn(this.find("#step_1"), 600).done()
      Animator.fadeIn(this.find("#step_1_text"), 700).done()

      Animator.fadeIn(this.find("#step_2"), 1700).done()
      Animator.fadeIn(this.find("#step_2_text"), 1800).done()

      Animator.fadeIn(this.find("#step_3"), 2800).done()
      Animator.fadeIn(this.find("#step_3_text"), 2900).done()

      Animator.fadeIn(this.find("#arrow"), 3600).done()
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#main")).done()
      Animator.fadeIn(this.find("#dot"), 300).done()
      Animator.fadeIn(this.find("#skin_bag_inner"), 400).done()
      Animator.fadeIn(this.find("#drop"), 600).done()
      Animator.fadeIn(this.find("#skin_bag"), 500).done()
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#main")).done()
      Animator.fadeIn(this.find("#dot"), 300).done()
      Animator.fadeIn(this.find("#text"), 400).done()
      Animator.fadeIn(this.find("#hand"), 500).done()
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#face")).done()
      Animator.fadeIn(this.find("#arrow_big"), 300).done()
      Animator.fadeIn(this.find("#zoom"), 400).done()
      Animator.fadeIn(this.find("#arrow_middle"), 500).done()
      Animator.fadeIn(this.find("#arrow"), 600).done()
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#phone")).done()
      Animator.fadeIn(this.find("#seperator"), 300).done()
      Animator.fadeIn(this.find("#text"), 400).done()
      Animator.fadeIn(this.find("#vibration"), 500).done()
      Animator.fadeIn(this.find("#ball"), 600).done()
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#sun")).done()
      Animator.fadeIn(this.find("#head"), 300).done()
      Animator.fadeIn(this.find("#hand"), 400).done()
      Animator.fadeIn(this.find("#arrow"), 500).done()
    }
  })

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#logo")).done()
      Animator.fadeIn(this.find("#text_top"), 300).done()
      Animator.fadeIn(this.find("#seperator_top"), 400).done()
      Animator.fadeIn(this.find("#text_bottom"), 500).done()
      Animator.fadeIn(this.find("#seperator_bottom"), 600).done()
      Animator.fadeIn(this.find("#video_container"), 700).done()
      Animator.fadeIn(this.find("#video_play"), 800).done()
    }
  })

  return pages;
})())
