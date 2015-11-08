var TASK_NAME_UNLOCK_PAGE = "TASK_NAME_UNLOCK_PAGE"
var TASK_NAME_NAVIGATE_TO_NEXT_PAGE = "TASK_NAME_NAVIGATE_TO_NEXT_PAGE"
var TASK_NAME_NAVIGATE_TO_PAGE = "TASK_NAME_NAVIGATE_TO_PAGE"
var TASK_NAME_DEVICE_ORIENTATION = "TASK_NAME_DEVICE_ORIENTATION"

var isBackgroundAudioInited = false

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
   * @node    : JQuery node
   * @delay   : millisecond
   * @options :
   *   infinite: Bool
   *   duration: String
   */
  core.animate = function(animationClassName, node, delay, options) {
    var _delay = delay || 0
    var _options = (function() {
      var _options = {
        infinite: false,
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

    core.done = function(completionHandler) {
      TimeoutActionStore.addAction(function() {
        var timing = (_options.infinite ? " infinite" : "") + " "

        $(node).addClass("animated" + timing + animationClassName);

        if (options["duration"] != undefined) {
          $(node).css("animation-duration", options["duration"])
        }

        // Use real custom duration if it does exsit in options
        if (completionHandler) {
          TimeoutActionStore.addAction(function(){
            completionHandler.call($(node))
          }, DEFAULT_ANIMATION_DURATION)
        }

        afterActions.forEach(function(actionPack) {
          TimeoutActionStore.addAction(actionPack.action, actionPack.delay)
        })
      }, _delay)
    }
    return core;
  }

  /*
   * This function binds `@animationName` function and `remove@AnimationName` function to @bindingObject
   */
  animateActionFactory = function(bindingObject, animationClassName, defualtOptions) {
    var addAnimationAction = function() {
      var node = arguments[0]
      var delay = arguments[1]
      var options = arguments[2]
      console.assert(node != undefined)

      var _defualtoption = defualtOptions || {}
      for (var attrname in options || {}) {
        _defualtoption[attrname] = options[attrname];
      }
      return core.animate(animationClassName, node, delay, _defualtoption)
    }

    var removeAnimationAction = function(node) {
      node.removeClass("animate")
      node.removeClass(animationClassName)
    }

    bindingObject[animationClassName] = addAnimationAction
    bindingObject["remove" + capitalizeFirstLetter(animationClassName)] = removeAnimationAction

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  // MARK: - Custom
  animateActionFactory(core, "fadeIn")
  animateActionFactory(core, "fadeOut")
  animateActionFactory(core, "fadeOutDown")
  animateActionFactory(core, "flash")
  animateActionFactory(core, "shine", {
    duration: "4s"
  })
  animateActionFactory(core, "float", {
    duration: "2s"
  })
  animateActionFactory(core, "bounceIn")

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

  core.post = function(taskName, options) {
    var action = map[taskName]
    if (action) {
      action(options)
    }
  }

  return core
})()

~(function(pages) {

  Pace.once('done', function() {
    var latestSectionNode = undefined;
    var latestSectionIndex = undefined;
    var backgroundAudio = $('audio')[0];
    backgroundAudio.play()

    $('#fullpage').fullpage({
      afterLoad: function(anchorLink, index) {
        $.fn.fullpage.setAllowScrolling(false, 'down');

        //remove all animation actions
        Animator.clearAnimations();

        if (latestSectionNode) {
          latestSectionNode.html(pages[latestSectionIndex].htmlCache);
        }
        if (latestSectionIndex) {
          if (pages[latestSectionIndex].deinit){
            pages[latestSectionIndex].deinit();
          }
        }

        var indexFromZero = index - 1;
        var loadedSection = $(this);

        // cache
        latestSectionNode = loadedSection;
        latestSectionIndex = indexFromZero;

        if (!pages[indexFromZero].htmlCache) {
          pages[indexFromZero].htmlCache = loadedSection.html();
        }

        pages[indexFromZero].render(loadedSection);
      }
    })

    // $.fn.fullpage.moveTo("ball-slide", 0)

  })


  // MARK: - Register task handler
  ~(function() {
    Inbox.on(TASK_NAME_UNLOCK_PAGE, function() {
      $.fn.fullpage.setAllowScrolling(true, 'down');
    })

    Inbox.on(TASK_NAME_NAVIGATE_TO_NEXT_PAGE, function() {
      $.fn.fullpage.moveSectionDown();
    })

    Inbox.on(TASK_NAME_NAVIGATE_TO_PAGE, function(options) {
      var anchor = options["anchor"]
      if (options["silent"]) {
        $.fn.fullpage.silentMoveTo(anchor, 0);
      } else {
        $.fn.fullpage.moveTo(anchor, 0);
      }
    })
  })()

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
      return baseDelayInMilliSecond
    }
  }

  pages.push({
    render: function(self) {
      function scene() {
        var incrementer = new Incrementer(200, 300)
        Animator.fadeIn(self.find("#logo"), incrementer.next()).done()
        Animator.fadeIn(self.find("#seperator_top", incrementer.next())).done()
        Animator.fadeIn(self.find("#seperator_bottom", incrementer.next())).done()
        Animator.fadeIn(self.find("#text_left"), incrementer.next()).done()
        Animator.fadeIn(self.find("#text_righ"), incrementer.next()).done()
        Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done()
        Animator.fadeIn(self.find("#drop"), incrementer.next()).done(function() {
          setTimeout(function() {
            Inbox.post(TASK_NAME_NAVIGATE_TO_PAGE, {
              anchor: "slide2",
              silent: true
            })
          }, 2000)
        })
      }
      if (!isBackgroundAudioInited) {
        self.on('click', function() {
          isBackgroundAudioInited = true
          var backgrondAudio = $('audio')[0]
          backgrondAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play()
          }, false)
          backgrondAudio.play()
          scene()
        })
      } else {
        scene()
      }
    }
  })

  pages.push({
    render: function(self) {
      Animator.fadeIn(self.find("#drop")).done()
      Animator.fadeIn(self.find("#water_drop")).done()
      Animator.fadeIn(self.find("#text"), 600).done()
      Animator.fadeIn(self.find("#hand"), 1200).done(function() {
        Animator.removeFadeIn(this)
        Animator.float(this, 0, {
          infinite: true
        }).done()
      })
      Animator.shine(self.find("#inner_circle"), 1800, {
        infinite: true
      }).done()
      Animator.shine(self.find("#outter_circle"), 2300, {
        infinite: true
      }).done()

      self.find(".tapArea").on('click', function() {
        $(this).off()
        Animator.fadeOut(self.find("#hand")).done(function(){
          this.remove();
        })
        Animator.fadeOutDown(self.find("#water_drop"), 0, {
          duration: "3s"
        }).done()
        Animator.registerCustomAction(function() {
          Inbox.post(TASK_NAME_NAVIGATE_TO_NEXT_PAGE)
        }, 1000)
      })
    }
  })

  pages.push({
    render: function(self) {
      Animator.fadeIn(self.find("#info_container")).done()
      Animator.fadeIn(self.find("#info_text"), 100).done()

      Animator.fadeIn(self.find("#step_1"), 300).done()
      Animator.fadeIn(self.find("#step_1_text"), 400).done()

      Animator.fadeIn(self.find("#step_2"), 600).done()
      Animator.fadeIn(self.find("#step_2_text"), 800).done()

      Animator.fadeIn(self.find("#step_3"), 1000).done()
      Animator.fadeIn(self.find("#step_3_text"), 1100).done()

      Animator.shine(self.find(".next-page-arrow"), 2000).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    }
  })

  pages.push({
    render: function(self) {
      Animator.fadeIn(self.find("#main")).done()
      Animator.fadeIn(self.find("#dot"), 300).done()
      Animator.fadeIn(self.find("#skin_bag_inner"), 400).done()
      Animator.fadeIn(self.find("#drop"), 600).done()
      Animator.fadeIn(self.find("#skin_bag"), 700).done(function() {
        nextScene()
      })

      function nextScene() {
        // Drop Water
        Animator.fadeIn(self.find("#scene-1-drop")).done()
        Animator.fadeOut(self.find("#drop")).done()
        Animator.fadeIn(self.find("#scene-1-main_bottom"), 200).done()

        // Transformation Light Enter
        Animator.fadeIn(self.find("#scene-1-light"), 400).done()

        // Renew
        Animator.fadeIn(self.find("#scene-1-dot"), 600).done()
        Animator.fadeOut(self.find("#dot"), 600).done()

        //
        Animator.fadeOut(self.find("#skin_bag_inner"), 1000).done()
        Animator.fadeOut(self.find("#skin_bag"), 1000).done()

        Animator.bounceIn(self.find("#scene-1_bag"), 1100).done()

        Animator.shine(self.find(".next-page-arrow"), 2100).done(function() {
          Inbox.post(TASK_NAME_UNLOCK_PAGE)
        })
      }
    }
  })

  pages.push({
    render: function(self) {
      Animator.fadeIn(self.find("#main")).done()
      Animator.fadeIn(self.find("#dot"), 300).done()
      Animator.fadeIn(self.find("#text"), 400).done()
      Animator.fadeIn(self.find("#hand"), 500).done(function() {
        Animator.removeFadeIn(self.find("#hand"))
        Animator.float(self.find("#hand"), 0, {
          infinite: true
        }).done()
      })

      $(self).on("click", function() {
        Animator.fadeOut(self.find("#text")).done()
        Animator.fadeOut(self.find("#hand")).done(function(){
          this.remove()
        })
        Animator.fadeIn(self.find("#scene-1-flash"), 600).done()

        Animator.fadeOut(self.find("#dot"), 1200).done()
        Animator.fadeIn(self.find("#scene-1-dot"), 1300).done()
        Animator.bounceIn(self.find("#scene-1-text"), 2300).done(function() {
          Animator.shine(self.find(".next-page-arrow")).done(function() {
            Inbox.post(TASK_NAME_UNLOCK_PAGE)
          })
        })
      })
    }
  })

  pages.push({
    render: function(self) {
      Animator.fadeIn(self.find("#face")).done()
      Animator.fadeIn(self.find("#arrow_big"), 300).done()
      Animator.fadeIn(self.find("#zoom"), 400).done()
      Animator.fadeIn(self.find("#arrow_middle"), 500).done()

      Animator.shine(self.find(".next-page-arrow"), 600).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    }
  })

  pages.push({

    render: function(self) {
      this.game = BallGame(self.find("#ball-container")[0], "images/ball.png", 150)
      this.game.init();

      Animator.fadeIn(self.find("#phone")).done()
      Animator.fadeIn(self.find("#seperator"), 300).done()
      Animator.fadeIn(self.find("#text"), 400).done()
      Animator.fadeIn(self.find("#ball"), 500).done(function() {
        Animator.fadeOut(this).done()
        Animator.fadeIn(self.find("#ball-container"),500).done()
      })
      Animator.shine(self.find("#vibration"), 1000).done()

      Animator.shine(self.find(".next-page-arrow"), 2000).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    },
    deinit: function(){
      this.game.clear()
    }
  })

  pages.push({
    render: function(self) {
      Animator.shine(self.find("#sun")).done()
      Animator.fadeIn(self.find("#head"), 300).done()
      Animator.fadeIn(self.find("#hand"), 400).done(function() {
        Animator.removeFadeIn(this)
        Animator.float(this, 0, {
          infinite: true
        }).done()
      })
      Animator.fadeIn(self.find("#arrow"), 400).done()

      self.find(".tapArea").on("click", function() {
        $(this).off()

        Animator.fadeOut(self.find("#sun")).done()
        Animator.fadeOut(self.find("#hand")).done(function(){
          this.remove()
        })
        Animator.fadeOut(self.find("#head")).done()

        Animator.fadeIn(self.find("#scene-1-sun"), 200).done()
        Animator.fadeIn(self.find("#scene-1-head"), 600).done()

        Animator.fadeIn(self.find(".next-page-arrow"), 1600).done(function() {
          Inbox.post(TASK_NAME_UNLOCK_PAGE)
        })
      })
    }
  })

  pages.push({
    render: function(self) {
      Animator.fadeIn(self.find("#logo")).done()
      Animator.fadeIn(self.find("#text_top"), 300).done()
      Animator.fadeIn(self.find("#seperator_top"), 400).done()
      Animator.fadeIn(self.find("#text_bottom"), 500).done()
      Animator.fadeIn(self.find("#seperator_bottom"), 600).done()
      Animator.fadeIn(self.find("#video_container"), 700).done()
      Animator.fadeIn(self.find("#video_play"), 800).done()
    }
  })

  return pages;
})())

window.ondeviceorientation = function(event) {
  Inbox.post(TASK_NAME_DEVICE_ORIENTATION, event)
  parallax(event)
};

function parallax(event) {
  var gamma = Math.round(event.gamma);
  var beta = Math.round(event.beta);
  var direction = Math.round(event.alpha);

  $(".parallax").css("margin-top", beta + "px");
  $(".parallax").css("margin-left", gamma + "px");

  $(".parallax.more").css("margin-top", Math.round(beta * 2) + "px");
  $(".parallax.more").css("margin-left", Math.round(gamma * 2) + "px");

  $(".parallax.less").css("margin-top", Math.round(beta / 2) + "px");
  $(".parallax.less").css("margin-left", Math.round(gamma / 2) + "px");

  $(".parallax.subtle").css("margin-top", Math.round(beta * 0.2) + "px");
  $(".parallax.subtle").css("margin-left", Math.round(gamma * 0.2) + "px");
}
