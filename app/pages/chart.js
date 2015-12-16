pageStack.set("chart", {
  render: function(self, incrementer, pageCompletionHandler) {
    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()

    Animator.fadeIn(self.find(".chart-body").eq(0), incrementer.next(1000)).done()
    Animator.fadeIn(self.find(".chart-body").eq(1), incrementer.next(500)).done()
    Animator.fadeIn(self.find(".chart-body").eq(2), incrementer.next(500)).done()

    Animator.fadeIn(self.find(".chart-text").eq(0), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-text").eq(1), incrementer.last()).done()
    Animator.fadeIn(self.find(".chart-text").eq(2), incrementer.last()).done()
    Animator.fadeIn(self.find(".chart-text").eq(3), incrementer.last()).done()
    Animator.fadeIn(self.find(".chart-text").eq(4), incrementer.last()).done()

    Animator.fadeIn(self.find(".description").eq(0), incrementer.next(1000)).done()
    Animator.fadeIn(self.find(".description").eq(1), incrementer.next()).done()
    Animator.fadeIn(self.find(".description").eq(2), incrementer.next()).done(pageCompletionHandler)
  }
})
