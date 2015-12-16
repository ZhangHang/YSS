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
    // MARK FullPage event handlers

  function afterLoad(anchorLink, index) {
    $.fn.fullpage.setAllowScrolling(false, 'down')
    $.fn.fullpage.setAllowScrolling(false, 'up')
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
    loadedSection.html(BACKGROUND_HTML_STRING + currentPageObject.htmlCache)

    currentPageObject.render(loadedSection, new Incrementer(200, 300), function() {
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
  pageStack.get('power'),
  pageStack.get('bounce'),
  pageStack.get('game'),
  pageStack.get('change'),
  pageStack.get('end')
], "#fullpage", ".container")

window.ondeviceorientation = function(event) {
  var gamma = Math.round(event.gamma)
  var beta = Math.round(event.beta)
  var direction = Math.round(event.alpha)

  // $(".parallax-background").css("margin-top", "-" + Math.round(beta / 4) + "px")
  $(".parallax-background").css("margin-left", "-" + Math.round(gamma / 4) + "px")
}
