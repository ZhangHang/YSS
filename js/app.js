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

  pages.push({
    render: function() {
      var self = this
      Animator.fadeIn(self.find("#logo"))
        .after(function() {
          Animator.fadeIn(self.find("#seperator_top")).done()
        }, 600)
        .after(function() {
          Animator.fadeIn(self.find("#seperator_bottom")).done()
        }, 500)
        .after(function() {
          Animator.fadeIn(self.find("#text_left")).done()
        }, 400)
        .after(function() {
          Animator.fadeIn(self.find("#text_righ")).done()
        }, 300)
        .after(function() {
          Animator.fadeIn(self.find("#text_bottom")).done()
        }, 200)
        .after(function() {
          Animator.fadeIn(self.find("#drop")).done()
        }, 100)
        .done()
    }
  })

  pages.push({
    render: function() {

      var self = this

      Animator.fadeIn(self.find("#drop"))
        .after(function() {
          Animator.fadeIn(self.find("#text")).done()
        }, 600)
        .after(function() {
          Animator.fadeIn(self.find("#hand")).done()
        }, 600)
        .after(function() {
          Animator.fadeIn(self.find("#inner_circle"), 0, {
            infinite: true
          }).done()
          Animator.fadeIn(self.find("#outter_circle"), 500, {
            infinite: true
          }).done()
          self.find(".tapArea").on('click', function() {
            Animator.animate("fadeOutDown", self.find("#drop")).done()
            Animator.registerCustomAction(function() {
              Inbox.post(TASK_NAME_NAVIGATE_TO_NEXT_PAGE)
            }, 900)
          })
        },600)
        .done()
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
      Animator.fadeIn(this.find("#drop"), 600).done()
      Animator.fadeIn(this.find("#skin_bag"), 500).done()
      Animator.fadeIn(this.find("#skin_bag_inner"), 400).done()
    }
  })

  pages.push({
    render: function() {

    }
  })

  pages.push({
    render: function() {

    }
  })

  pages.push({
    render: function() {

    }
  })

  pages.push({
    render: function() {

    }
  })

  pages.push({
    render: function() {

    }
  })

  return pages;
})())
