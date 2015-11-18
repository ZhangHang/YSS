~(function(pages, containerSelector) {
  Pace.once('done', function() {
    var cleanUpTimeoutIdObject = undefined
    $('#fullpage').fullpage({
      afterRender: function() {
        var containers = $(".section " + containerSelector)
        for (var i = 0; i < pages.length; i++) {
          pages[i].htmlCache = containers.eq(i).html()
          if (i != 0) {
            containers.eq(i).html("")
          }
        }
      },
      afterLoad: function(anchorLink, index) {
        $.fn.fullpage.setAllowScrolling(false, 'down')

        var indexFromZero = index - 1
        var loadedSection = $(this).find(containerSelector)

        loadedSection.html(pages[indexFromZero].htmlCache)
        pages[indexFromZero].render(loadedSection, new Incrementer(200, 500), function(){
          $.fn.fullpage.setAllowScrolling(true, 'down')
        })
      },
      onLeave: function(index, nextIndex, direction) {
        if (cleanUpTimeoutIdObject) {
          if ((nextIndex - 1) === cleanUpTimeoutIdObject.index) {
            clearTimeout(cleanUpTimeoutIdObject.id)
            cleanUpTimeoutIdObject.clean()
            cleanUpTimeoutIdObject = undefined
          }
        }

        Animator.clearAnimations()
        var leavingSection = $(this).find(containerSelector)
        var indexFromZero = index - 1

        function cleanUp() {
          leavingSection.html("")
          if (pages[indexFromZero].deinit) {
            pages[indexFromZero].deinit()
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
      $.fn.fullpage.setAllowScrolling(true, 'down')
    })

    Inbox.on(TASK_NAME_NAVIGATE_TO_PAGE, function(options) {
      var anchor = options["anchor"]
      if (options["silent"]) {
        $.fn.fullpage.silentMoveTo(anchor, 0)
      } else {
        $.fn.fullpage.moveTo(anchor, 0)
      }
    })
  })()

})([
  pageStack.get('intro'),
  pageStack.get('usage'),
  pageStack.get('inside-skin'),
  pageStack.get('power-skin-up'),
  pageStack.get('game'),
  pageStack.get('another-game'),
  pageStack.get('change'),
  pageStack.get('end')
], ".container")

window.ondeviceorientation = function(event) {
  Inbox.post(TASK_NAME_DEVICE_ORIENTATION, event)
  var gamma = Math.round(event.gamma)
  var beta = Math.round(event.beta)
  var direction = Math.round(event.alpha)

  $("#parallax_background").css("margin-top", Math.round(beta / 2) + "px")
  $("#parallax_background").css("margin-left", Math.round(gamma / 2) + "px")
}
