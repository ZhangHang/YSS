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
    return store
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
        _options[attrname] = options[attrname]
      }
      return _options
    })()

    var core = {}
    var afterTimeOffset = 0
    var afterActions = []

    core.after = function(__action, __delay) {
      afterActions.push({
        delay: afterTimeOffset + __delay,
        action: __action
      })
      afterTimeOffset += __delay
      return core
    }

    core.done = function(completionHandler) {
      TimeoutActionStore.addAction(function() {
        var timing = (_options.infinite ? " infinite" : "") + " "

        $(node).addClass("animated" + timing + animationClassName)

        var duration = 1
        if (options["duration"] != undefined) {
          duration = options["duration"]
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
    return core
  }

  /*
   * This function binds `@animationName` function and `remove@AnimationName` function to @bindingObject
   */
  animateActionFactory = function(bindingObject, animationClassName, defualtOptions) {
    bindingObject[animationClassName] = function() {
      var node = arguments[0]
      var delay = arguments[1]
      var options = arguments[2] || {}
      console.assert(node != undefined)

      for (var attrname in (defualtOptions || {})) {
        if (options[attrname] == undefined) {
          options[attrname] = defualtOptions[attrname]
        }
      }
      return core.animate(animationClassName, node, delay, options)
    }
    bindingObject["remove" + capitalizeFirstLetter(animationClassName)] = function(node) {
      node.removeClass("animate")
      node.removeClass(animationClassName)
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
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
  core.performAction = function(action, delay) {
    console.assert(typeof action === 'function')
    console.assert(delay >= 0)
    TimeoutActionStore.addAction(action, delay)
  }

  // MARK: Control
  core.clearAnimations = function() {
    TimeoutActionStore.removeAllActions()
  }

  return core
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