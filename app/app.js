~(function(pages, warperSelector, containerSelector) {
  var cleanUpTimeoutIdObject = undefined
  var hasCache = false

  Pace.once('done', function() {
    $(warperSelector).fullpage({
      controlArrows: false,
      loopHorizontal: false,
      afterLoad: afterLoad,
      onLeave: onLeave,
      afterSlideLoad: afterSlideLoad,
      onSlideLeave: onSlideLeave
    })
  });

  var BACKGROUND_HTML_STRING = "<img class='parallax-background' >"

  var NEXT_PAGE_ARROW_HTML_STRING = "<div class='next-arrow-container'>\
          <img class='arrow' />\
          <img class='arrow' />\
          <img class='arrow' />\
        </div>"

  // MARK FullPage event handlers

  function afterLoad(anchorLink, index) {
    $.fn.fullpage.setAllowScrolling(false, 'down')
    if (!hasCache) {
      for (var i = 0; i < pages.length; i++) {
        var currentContainer = $(warperSelector).find(".section").find(containerSelector).eq(i)
        pages[i].htmlCache = currentContainer.html()
        if (i != 0) {
          currentContainer.html(BACKGROUND_HTML_STRING)
        }
      }
      hasCache = true
    }

    var loadedSection = $(this).find(containerSelector)
    var currentPageObject = pages[index - 1];
    loadedSection.html(currentPageObject.htmlCache + BACKGROUND_HTML_STRING)

    currentPageObject.render(loadedSection, new Incrementer(200, 400), function() {
      $.fn.fullpage.setAllowScrolling(true, 'down')
      $.fn.fullpage.setAllowScrolling(true, 'up')

      var nextPageContainer = loadedSection.find(".next-arrow-container")
      if (nextPageContainer) {
        var arrows = nextPageContainer.find(".arrow")

        Animator.shine(arrows.eq(0), 0).done()
        Animator.shine(arrows.eq(1), 600).done()
        Animator.shine(arrows.eq(2), 1200).done()
      } else {
        console.log("no next page indicator found")
      }
    })

    //addtional options
    if (currentPageObject.disableScrollingUp) {
      $.fn.fullpage.setAllowScrolling(false, 'up')
    }

  }

  function onLeave(index, nextIndex, direction) {
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
      leavingSection.html(BACKGROUND_HTML_STRING)
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

  function afterSlideLoad(anchorLink, index, slideAnchor, slideIndex) {
    var targetEnterSelector = "enterSlide" + (slideIndex + 1)
    var page = pages[index - 1]
    var loadedSection = $("#fullpage").find(".section").eq(index - 1)

    if (page[targetEnterSelector] != undefined) {
      page[targetEnterSelector](loadedSection.find(".slide").eq(slideIndex).find(".sub-container"), new Incrementer(200, 500))
    }
  }

  function onSlideLeave(anchorLink, index, slideIndex, direction, nextSlideIndex) {
    var targetLeaveSelector = "leaveSlide" + (slideIndex + 1)
    var page = pages[index - 1]
    var loadedSection = $("#fullpage").find(".section").eq(index - 1)

    if (page[targetLeaveSelector] != undefined) {
      page[targetLeaveSelector](loadedSection.find(".slide").eq(slideIndex).find(".sub-container"))
    }
  }

})([
  pageStack.get('intro'),
  pageStack.get('chart'),
  pageStack.get('usage'),
  pageStack.get('inside-skin'),
  pageStack.get('power-skin-up'),
  pageStack.get('game'),
  pageStack.get('another-game'),
  pageStack.get('change'),
  pageStack.get('end')
], "#fullpage", ".container")

window.ondeviceorientation = function(event) {
  var gamma = Math.round(event.gamma)
  var beta = Math.round(event.beta)
  var direction = Math.round(event.alpha)

  $("#parallax_background").css("margin-top", "-" + Math.round(beta / 4) + "px")
  $("#parallax_background").css("margin-left", "-" + Math.round(gamma / 4) + "px")
}
