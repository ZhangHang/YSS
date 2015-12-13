pageStack.set("chart", {
  render: function(self, incrementer, pageCompletionHandler) {
    Animator.fadeIn(self.find("#logo"), incrementer.next()).done()

    Animator.fadeIn(self.find(".chart-body").eq(0), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-body").eq(1), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-body").eq(2), incrementer.next()).done()

    Animator.fadeIn(self.find(".chart-text").eq(0), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-text").eq(1), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-text").eq(2), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-text").eq(3), incrementer.next()).done()
    Animator.fadeIn(self.find(".chart-text").eq(4), incrementer.next()).done()

    Animator.fadeIn(self.find(".description").eq(2), incrementer.next()).done()
    Animator.fadeIn(self.find(".description").eq(1), incrementer.next()).done()
    Animator.fadeIn(self.find(".description").eq(0), incrementer.next()).done(pageCompletionHandler)
  }
})
