var pageObjects = (function() {
  var pages = [];

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

function fadeOut(node, durationInMS, callback) {
  animation(node, "fade-out", durationInMS, callback)
}

function fadeIn(node, durationInMS, callback) {
  animation(node, "fade-in", durationInMS, callback)
}

function shake(node, durationInMS, callback) {
  animation(node, "skin-shake", durationInMS, callback)
}


function animation(node, animationName, durationInMS, callback) {
  $(node).css("-webkit-animation", animationName + " " + durationInMS + "ms forwards")

  setTimeout(function() {
    if (callback) {
      callback()
    }
  }, durationInMS)

}


var backgroundAudio = undefined;
var latestSectionNode = undefined;
var latestSectionIndex = undefined;
$(document).ready(function() {
  backgroundAudio = $('audio')[0];
  $('#fullpage').fullpage({
    afterLoad: function(anchorLink, index) {
      $.fn.fullpage.setAllowScrolling(false);
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

function unlockCurrentPage() {
  $.fn.fullpage.setAllowScrolling(true);
}
