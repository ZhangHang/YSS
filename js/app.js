var TASK_NAME_UNLOCK_PAGE = "TASK_NAME_UNLOCK_PAGE"
var TASK_NAME_NAVIGATE_TO_PAGE = "TASK_NAME_NAVIGATE_TO_PAGE"
var TASK_NAME_DEVICE_ORIENTATION = "TASK_NAME_DEVICE_ORIENTATION"

var isWeixinWebView = (function() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
})()

var isBackgroundAudioInited = false
$("audio").on('play', function() {
  isBackgroundAudioInited = true
})

var Incrementer = function(baseDelayInMilliSecond, stepInMilliSecond) {
  var delay = 0
  this.next = function(customStepInMilliSecond) {
    delay += (customStepInMilliSecond === undefined) ? this.stepInMilliSecond : this.stepInMilliSecond
    return delay
  }
  this.reset = function() {
    delay = 0
  }
  this.last = function() {
    return delay
  }
  this.stepInMilliSecond = stepInMilliSecond
}

var Animator = (function() {

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

        var duration = 1
        if (options["duration"] != undefined) {
          duration = options["duration"];
          $(node).css("animation-duration", duration + "s")

        }

        if (completionHandler) {
          TimeoutActionStore.addAction(function() {
            completionHandler.call($(node))
          }, duration * 1000)
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
  animateActionFactory(core, "fadeIn", {
    duration: 2
  })
  animateActionFactory(core, "fadeOut")
  animateActionFactory(core, "fadeOutDown")
  animateActionFactory(core, "flash")
  animateActionFactory(core, "shine", {
    duration: 4
  })
  animateActionFactory(core, "float", {
    duration: 2
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

~(function(pages, containerSelector) {
  Pace.once('done', function() {
    var cleanUpTimeoutIdObject = undefined;
    $('#fullpage').fullpage({
      afterRender: function() {
        var containers = $(".section " + containerSelector);
        for (var i = 0; i < pages.length; i++) {
          pages[i].htmlCache = containers.eq(i).html()
          if (i != 0) {
            containers.eq(i).html("")
          }
        }
      },
      afterLoad: function(anchorLink, index) {
        $.fn.fullpage.setAllowScrolling(false, 'down');

        var indexFromZero = index - 1;
        var loadedSection = $(this).find(containerSelector);

        loadedSection.html(pages[indexFromZero].htmlCache)
        pages[indexFromZero].render(loadedSection, new Incrementer(200, 800));
      },
      onLeave: function(index, nextIndex, direction) {
        if (cleanUpTimeoutIdObject) {
          if ((nextIndex - 1) === cleanUpTimeoutIdObject.index) {
            clearTimeout(cleanUpTimeoutIdObject.id);
            cleanUpTimeoutIdObject.clean()
            cleanUpTimeoutIdObject = undefined;
          }
        }

        Animator.clearAnimations();
        var leavingSection = $(this).find(containerSelector);
        var indexFromZero = index - 1;

        function cleanUp() {
          leavingSection.html("")
          if (pages[indexFromZero].deinit) {
            pages[indexFromZero].deinit();
          }
        }

        cleanUpTimeoutIdObject = {
          id: setTimeout(cleanUp, 1000),
          index: indexFromZero,
          clean: cleanUp
        }
      }
    })
  })

  // MARK: - Register task handler
  ~(function() {
    Inbox.on(TASK_NAME_UNLOCK_PAGE, function() {
      $.fn.fullpage.setAllowScrolling(true, 'down');
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

  pages.push({
    render: function(self, incrementer) {
      function introductionScene() {
        Animator.fadeIn(self.find("#logo")).done()
        Animator.fadeIn(self.find("#seperator_top"), incrementer.next()).done()
        Animator.fadeIn(self.find("#seperator_bottom"), incrementer.next()).done()
        Animator.fadeIn(self.find("#text_right"), incrementer.next()).done()
        Animator.fadeIn(self.find("#text_left"), incrementer.next()).done()
        Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done(function() {
          Animator.registerCustomAction(dropperScene, 100)
        })
      }

      if (isWeixinWebView || isBackgroundAudioInited) {
        introductionScene()
      } else {
        self.on('click', function() {
          isBackgroundAudioInited = true
          var backgrondAudio = $('audio')[0]
          backgrondAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play()
          }, false)
          backgrondAudio.play()
          introductionScene()
        })
      }

      function dropperScene() {
        ~(function() {
          Animator.fadeOut(self.find("#logo")).done()
          Animator.fadeOut(self.find("#seperator_top")).done()
          Animator.fadeOut(self.find("#seperator_bottom")).done()
          Animator.fadeOut(self.find("#text_right")).done()
          Animator.fadeOut(self.find("#text_left")).done()
          Animator.fadeOut(self.find("#text_bottom")).done()
        })()

        incrementer.reset()
        Animator.fadeIn(self.find("#drop")).done()
        Animator.fadeIn(self.find("#text"), incrementer.next()).done()
        Animator.shine(self.find("#inner_circle"), incrementer.next(), {
          infinite: true
        }).done()
        Animator.shine(self.find("#outter_circle"), incrementer.next(), {
          infinite: true
        }).done()
        Animator.fadeIn(self.find("#hand"), incrementer.next()).done(function() {
          Animator.removeFadeIn(this)
          Animator.float(this, 0, {
            infinite: true
          }).done()
        })

        var dropController = (function(drop) {
          var controller = {}
          var isDropReady = true

          controller.drop = function() {
            if (!isDropReady) {
              return
            }

            isDropReady = false

            Animator.fadeIn(self.find(".water_drop"),0, {
              duration: 0.2
            }).done()

            controller.hasNeverDropAnything = false

            Animator.fadeOutDown(drop, 0.2, {
              duration: 3
            }).done()

            Animator.registerCustomAction(function() {
              drop.removeClass("fadeOutDown fadeIn")
              isDropReady = true
            }, 1700)
          }

          controller.hasNeverDropAnything = true

          return controller
        })(self.find(".water_drop"))

        self.find(".tapArea").on('click', function() {
          if(dropController.hasNeverDropAnything){
            isDropperTaped = true
            Animator.shine(self.find(".next-page-arrow"), 1500).done(function() {
              Inbox.post(TASK_NAME_UNLOCK_PAGE)
            })
          }
          self.find("#hand").remove()
          dropController.drop()
        })
      }
    }
  })

  pages.push({
    render: function(self, incrementer) {
      Animator.fadeIn(self.find("#info_container")).done()
      Animator.fadeIn(self.find("#info_text"), incrementer.next()).done()

      Animator.fadeIn(self.find("#step_1"), incrementer.next()).done()
      Animator.fadeIn(self.find("#step_1_text"), incrementer.next(600)).done()

      Animator.fadeIn(self.find("#step_2"), incrementer.next()).done()
      Animator.fadeIn(self.find("#step_2_text"), incrementer.next(600)).done()

      Animator.fadeIn(self.find("#step_3"), incrementer.next()).done()
      Animator.fadeIn(self.find("#step_3_text"), incrementer.next(600)).done()

      Animator.shine(self.find(".next-page-arrow"), incrementer.next()).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    }
  })

  pages.push({
    render: function(self, incrementer) {
      Animator.fadeIn(self.find("#main")).done()
      Animator.fadeIn(self.find("#dot"), incrementer.next()).done()
      Animator.fadeIn(self.find("#skin_bag"), incrementer.next()).done()
      Animator.fadeIn(self.find("#skin_bag_inner"), incrementer.next()).done()
      Animator.fadeIn(self.find("#drop"), incrementer.next()).done(function() {
        Animator.registerCustomAction(nextScene, 1000)
      })

      function nextScene() {
        incrementer.reset()
          // Drop Water
        Animator.fadeIn(self.find("#scene-1-drop")).done()
        Animator.fadeOut(self.find("#drop")).done()
        Animator.fadeIn(self.find("#scene-1-main_bottom"), incrementer.next()).done()

        // Transformation Light Enter
        Animator.fadeIn(self.find("#scene-1-light"), incrementer.next()).done()

        // Renew
        Animator.fadeIn(self.find("#scene-1-dot"), incrementer.next()).done()
        Animator.fadeOut(self.find("#dot"), incrementer.last()).done()

        //
        Animator.fadeOut(self.find("#skin_bag_inner"), incrementer.next()).done()
        Animator.fadeOut(self.find("#skin_bag"), incrementer.last()).done()

        Animator.bounceIn(self.find("#scene-1_bag"), incrementer.next()).done()

        Animator.shine(self.find(".next-page-arrow"), incrementer.next()).done(function() {
          Inbox.post(TASK_NAME_UNLOCK_PAGE)
        })
      }
    }
  })

  pages.push({
    render: function(self, incrementer) {
      Animator.fadeIn(self.find("#main")).done()
      Animator.fadeIn(self.find("#dot"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text"), incrementer.next()).done()
      Animator.fadeIn(self.find("#hand"), incrementer.next()).done(function() {
        Animator.removeFadeIn(self.find("#hand"))
        Animator.float(self.find("#hand"), 0, {
          infinite: true
        }).done()
      })

      self.on("click", function() {
        self.off()
        incrementer.reset()
        Animator.fadeOut(self.find("#text")).done()
        Animator.fadeOut(self.find("#hand")).done(function() {
          this.remove()
        })
        Animator.fadeIn(self.find("#scene-1-flash"), incrementer.next()).done()

        Animator.fadeOut(self.find("#dot"), incrementer.next()).done()
        Animator.fadeIn(self.find("#scene-1-dot"), incrementer.next()).done()
        Animator.bounceIn(self.find("#scene-1-text"), incrementer.next()).done(function() {
          Animator.shine(self.find(".next-page-arrow")).done(function() {
            Inbox.post(TASK_NAME_UNLOCK_PAGE)
          })
        })
      })
    }
  })

  pages.push({
    render: function(self, incrementer) {
      Animator.fadeIn(self.find("#face")).done()
      Animator.fadeIn(self.find("#arrow_big"), incrementer.next()).done()
      Animator.fadeIn(self.find("#zoom"), incrementer.next()).done()
      Animator.fadeIn(self.find("#arrow_middle"), incrementer.next()).done()

      Animator.shine(self.find(".next-page-arrow"), incrementer.next()).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    }
  })

  pages.push({

    render: function(self, incrementer) {
      var game = (function() {
        var x = parseInt(self.width()) * 0.8
        var y = parseInt(self.height()) * 0.6
        var useSmallBall = parseInt(self.width()) <= 400
        var radius = useSmallBall ? 80 : 100
        var ballTexturePath = "images/ball-" + radius + ".png"
        return BallGame(self.find("#ball-container")[0], ballTexturePath, radius, x - radius, y - radius)
      })()
      game.init()
      this.game = game

      Animator.fadeIn(self.find("#phone")).done()
      Animator.fadeIn(self.find("#seperator"), incrementer.next(600)).done()
      Animator.fadeIn(self.find("#text"), incrementer.next(600)).done()
      Animator.shine(self.find("#vibration"), incrementer.next()).done()
      Animator.fadeIn(self.find("#ball-container"), incrementer.next()).done()

      Animator.registerCustomAction(function() {
        game.setGravityEnabled(true)
      }, incrementer.last() + 2000)

      Animator.shine(self.find(".next-page-arrow"), incrementer.next()).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    },
    deinit: function() {
      this.game.clear()
    }
  })

  pages.push({
    render: function(self, incrementer) {
      Animator.shine(self.find("#sun")).done()
      Animator.fadeIn(self.find("#head"), incrementer.next()).done()
      Animator.fadeIn(self.find("#hand"), incrementer.next()).done(function() {
        Animator.removeFadeIn(this)
        Animator.float(this, 0, {
          infinite: true
        }).done()
      })
      Animator.fadeIn(self.find("#arrow"), incrementer.next()).done()

      self.find(".tapArea").on("click", function() {
        $(this).off()
        incrementer.reset()
        Animator.fadeOut(self.find("#sun")).done()
        Animator.fadeOut(self.find("#hand")).done(function() {
          this.remove()
        })
        Animator.fadeOut(self.find("#head")).done()

        Animator.fadeIn(self.find("#scene-1-sun"), incrementer.next()).done()
        Animator.fadeIn(self.find("#scene-1-head"), incrementer.next()).done()

        Animator.fadeIn(self.find(".next-page-arrow"), incrementer.next()).done(function() {
          Inbox.post(TASK_NAME_UNLOCK_PAGE)
        })
      })
    }
  })

  pages.push({
    render: function(self, incrementer) {
      Animator.fadeIn(self.find("#logo")).done()
      Animator.fadeIn(self.find("#text_top"), incrementer.next()).done()
      Animator.fadeIn(self.find("#seperator_top"), incrementer.next()).done()
      Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done()
      Animator.fadeIn(self.find("#seperator_bottom"), incrementer.next()).done()
      Animator.fadeIn(self.find("#video_container"), incrementer.next()).done()
      Animator.fadeIn(self.find("#video_play"), incrementer.next()).done()
    }
  })

  return pages;
})(), ".container")

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
