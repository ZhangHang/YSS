~(function(pages, warperSelector, containerSelector) {
  Pace.once('done', function() {
    var cleanUpTimeoutIdObject = undefined
    var hasCache = false
    $(warperSelector).fullpage({
      controlArrows: false,
      loopHorizontal: false,

      afterLoad: function(anchorLink, index) {
        $.fn.fullpage.setAllowScrolling(false, 'down')
        if (!hasCache) {
          for (var i = 0; i < pages.length; i++) {
            var currentContainer = $(warperSelector).find(".section").find(containerSelector).eq(i)
            pages[i].htmlCache = currentContainer.html()
            if (i != 0) {
              currentContainer.html("")
            }
          }
          hasCache = true
          console.log(pages)
        }

        var indexFromZero = index - 1
        var loadedSection = $(this).find(containerSelector)
        console.log(loadedSection)
        loadedSection.html(pages[indexFromZero].htmlCache)
        pages[indexFromZero].render(loadedSection, new Incrementer(200, 500), function() {
          $.fn.fullpage.setAllowScrolling(true, 'down')

          var nextPageContainer = loadedSection.find(".next-arrow-container")
          if (nextPageContainer) {
            var arrows = nextPageContainer.find(".arrow")

            var options = {
              infinite: true,
              duration: "3s"
            }
            Animator.animate("guide", arrows.eq(0), 0, options).done()
            Animator.animate("guide", arrows.eq(1), 750, options).done()
            Animator.animate("guide", arrows.eq(2), 1500, options).done()
          } else {
            console.log("no next page indicator found")
          }

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
      },
      afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
        var targetEnterSelector = "enterSlide" + (slideIndex + 1)
        var page = pages[index - 1]
        var loadedSection = $("#fullpage").find(".section").eq(index - 1)
        if (page[targetEnterSelector] != undefined) {
          page[targetEnterSelector](loadedSection.find(".slide").eq(slideIndex).find(containerSelector), new Incrementer(200, 500))
        }
      },
      onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
        var targetLeaveSelector = "leaveSlide" + (slideIndex + 1)
        var page = pages[index - 1]
        var loadedSection = $("#fullpage").find(".section").eq(index - 1)

        if (page[targetLeaveSelector] != undefined) {
          page[targetLeaveSelector](loadedSection.find(".slide").eq(slideIndex).find(containerSelector))
        }
      }
    })
  })

})([
  pageStack.get('intro'),
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

  $("#parallax_background").css("margin-top", Math.round(beta / 4) + "px")
  $("#parallax_background").css("margin-left", Math.round(gamma / 4) + "px")
}
