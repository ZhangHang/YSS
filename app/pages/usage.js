pageStack.set('usage', {
  cache: [],
  self: undefined,
  completionHandler: undefined,
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    this.self = self
    this.cacheAllSlide()
    this.completionHandler = pageCompletionHandler
    Animator.fadeIn(self.find("#scroll-container"), incrementer.next()).done()
    Animator.fadeIn(self.find("#scroll-text"), incrementer.next()).done()
    Animator.fadeIn(self.find("#mask"), incrementer.next()).done()
    Animator.fadeIn(self.find("#face"), incrementer.next()).done(function() {
    })
    Animator.performAction(function(){
      incrementer.reset()
      it.enterSlide1(self.find(".slide").eq(0).find(".sub-container"), incrementer)
    },incrementer.last())
  },
  cacheAllSlide: function() {
    for (var i = 0; i < 3; i++) {
      var container = this.slideContainer(i)
      this.cache[i] = container.html()
      container.html("")
    }
  },
  slideContainer: function(index) {
    return this.self.find(".slide").eq(index).find(".sub-container")
  },
  enterSlide1: function(container, incrementer) {
    this.enterScene(1, container, incrementer)
  },
  enterSlide2: function(container, incrementer) {
    this.enterScene(2, container, incrementer)
  },
  enterSlide3: function(container, incrementer) {
    this.enterScene(3, container, incrementer, this.completionHandler)
  },
  dismissScene: function(container) {
    Animator.fadeOut(container).done(function() {
      this.remove()
    })
    Animator.fadeOut(container.find(".left-hand")).done()
    Animator.fadeOut(container.find(".right-hand")).done()
    Animator.fadeOut(container.find(".text")).done()
    Animator.fadeOut(container.find(".arrow")).done()
  },
  enterScene: function(index, container, incrementer, completionHandler) {
    for (var i = 0; i < 3; i++) {
      if (i != (index - 1)) {
        this.slideContainer(i).html("")
      }else{
        container.html(this.cache[i])
      }
    }

    var it = this
    var handAnimationOption = {
      duration: '3s',
      infinite: true
    }

    Animator.fadeIn(container.find(".text"), incrementer.next()).done()
    Animator.fadeIn(container.find(".arrow-indicator"), incrementer.last()).done()
    Animator.fadeIn(container.find(".arrow"), incrementer.last()).done()

    Animator.animate("usage-type-" + index + "-right", container.find(".right-hand"), incrementer.next(), handAnimationOption).done()
    Animator.animate("usage-type-" + index + "-left", container.find(".left-hand"), incrementer.last(), handAnimationOption).done(completionHandler)

  }
})
