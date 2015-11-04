var TASK_NAME_UNLOCK = "TASK_NAME_UNLOCK"
var TASK_NAME_NAVIGATE_TO_NEXT_PAGE = "TASK_NAME_NAVIGATE_TO_NEXT_PAGE"

var pageObjects = (function() {
  var pages = [];

  pages.push({
    render: function() {
      Animator.fadeIn(this.find("#logo"), 0)
      Animator.fadeIn(this.find("#seperator_top"), 600)
      Animator.fadeIn(this.find("#seperator_bottom"), 1200)
      Animator.fadeIn(this.find("#text_left"), 1600)
      Animator.fadeIn(this.find("#text_righ"), 1900)
      Animator.fadeIn(this.find("#text_bottom"), 2100)
      Animator.fadeIn(this.find("#drop"), 2200)
    }
  })

  pages.push({
    render: function() {
      var self = this
      Animator.fadeIn(this.find("#drop"), 0)
      Animator.fadeIn(this.find("#inner_circle"), 600)
      Animator.fadeIn(this.find("#outter_circle"), 1200)
      Animator.fadeIn(this.find("#text"), 1600)
      Animator.fadeIn(this.find("#hand"), 1900, function() {
        self.find(".tapArea").on('click', function() {
          Animator.animate("fadeOutDown", self.find("#drop"));
          Animator.registerCustomAction(function() {
            Inbox.post(TASK_NAME_NAVIGATE_TO_NEXT_PAGE)
          }, 900)
        })
      })
    }
  })

  pages.push({
    render: function() {

      Animator.fadeIn(this.find("#info_container"), 0)
      Animator.fadeIn(this.find("#info_text"), 100)

      Animator.fadeIn(this.find("#step_1"), 600)
      Animator.fadeIn(this.find("#step_1_text"), 700)

      Animator.fadeIn(this.find("#step_2"), 1700)
      Animator.fadeIn(this.find("#step_2_text"), 1800)

      Animator.fadeIn(this.find("#step_3"), 2800)
      Animator.fadeIn(this.find("#step_3_text"), 2900)

      Animator.fadeIn(this.find("#arrow"), 3600)
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

  pages.push({
    render: function() {

    }
  })
  return pages;
})()

var Animator = (function() {
  var core = {}

  /*
   * Manage timeout actions
   */
  var TimeoutActionStore = (function() {
    var store = {}
    var timeoutIds = []
    store.addAction = function(action, delay) {
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
   *
   */
  core.animate = function(animationName, node, delay, callback, options) {
    var isInfinite = (options || {}).hasOwnProperty('infinite') ? options.infinite : false

    TimeoutActionStore.addAction(function() {
      $(node).addClass("animated" + (isInfinite ? ".infinite" : "") + " " + animationName);
      TimeoutActionStore.addAction(callback || function() {}, 1000)
    }, delay)
  }

  // MARK: - Custom
  core.fadeIn = function(node, delay, callback, options) {
    core.animate("fadeIn", node, delay, callback, options)
  }

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

~(function() {
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
          latestSectionNode.html(pageObjects[latestSectionIndex].htmlCache)
        }

        var indexFromZero = index - 1;
        var loadedSection = $(this);

        // cache
        latestSectionNode = loadedSection;
        latestSectionIndex = indexFromZero;

        if (!pageObjects[indexFromZero].htmlCache) {
          pageObjects[indexFromZero].htmlCache = loadedSection.html();
        }

        pageObjects[indexFromZero].render.call(loadedSection);
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
})()
