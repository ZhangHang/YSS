var _ = {
  extend: function(obj, source) {
    console.assert(obj != undefined)
    console.assert(source != undefined)
    for (var prop in source) {
      obj[prop] = source[prop]
    }
    return obj
  }
}

_.extend(_, {
  merge: function(obj, source) {
    var _obj = {}
    console.assert(obj != undefined)
    console.assert(source != undefined)
    for (var prop in obj) {
      _obj[prop] = obj[prop]
    }
    for (var prop in source) {
      _obj[prop] = source[prop]
    }
    return _obj
  }
})

_.extend(_, {
  capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
})


var Incrementer = function(baseDelayInMilliSecond, stepInMilliSecond) {
  var delay = 0
  this.next = function(customStepInMilliSecond) {
    delay += customStepInMilliSecond || this.stepInMilliSecond
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
   *   duration: String,
   *   remove: Bool
   */
  core.animate = function(animationClassName, node, delay, options) {
    console.assert(animationClassName != undefined)
    console.assert(node != undefined)
    var _delay = delay || 0
    var _options = _.merge({
      infinite: false,
      remove: false
    }, options || {})

    var core = {}

    core.done = function(completionHandler) {
      if (completionHandler) {
        if (typeof completionHandler != 'function') {
          console.log(completionHandler)
        }
        console.assert(typeof completionHandler === 'function')
      }

      TimeoutActionStore.addAction(function() {
        var timing = _options.infinite ? "infinite" : ""

        $(node).addClass("animated " + timing + " " + animationClassName)

        var duration = options["duration"] || "1s"
        $(node).css("animation-duration", duration)

        TimeoutActionStore.addAction(function() {
          if (completionHandler) {
            completionHandler.call($(node))
          }

          if (_options.remove) {
            $(node).remove()
          }
        }, parseFloat(duration) * 1000)

      }, _delay)
    }
    return core
  }

  /*
   * This function binds `@animationName` function and `remove@AnimationName` function to `core`
   */
  attachAnimation = function(animationClassName, defualtOptions) {
    console.assert(typeof animationClassName === 'string')

    var appendAnimationFunctionName = animationClassName
    var removeAnimationFunctionName = "remove" + _.capitalizeFirstLetter(animationClassName)

    core[appendAnimationFunctionName] = function(node, delay, options) {
      console.assert(node != undefined)
      return core.animate(animationClassName, node, delay, _.merge(defualtOptions || {}, options || {}))
    }

    core[removeAnimationFunctionName] = function(node, visible) {
      console.assert(node)
      node.removeClass("animated")
      node.removeClass(animationClassName)
      if (visible) {
        node.css("opacity", 1)
      }
    }
  }

  // MARK: - Custom
  ~(function() {
    attachAnimation("fadeIn", {
      duration: "1.4s"
    })
    attachAnimation("fadeInUp", {
      duration: "1.4s"
    })
    attachAnimation("fadeOut")
    attachAnimation("fadeOutDown")
    attachAnimation("flash")
    attachAnimation("shine", {
      duration: "3s",
      infinite: true
    })
    attachAnimation("float", {
      duration: "2s"
    })
    attachAnimation("bounceIn")
    attachAnimation("zoomIn", {
      duration: "1.4s"
    })
    attachAnimation("zoomInRight")
    attachAnimation("zoomInLeft")
    attachAnimation("zoomInDown")
    attachAnimation("zoomOutLeft", {
      duration: "1.4s"
    })
  })()

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
