pageStack.set("chart", {
  render: function(self, incrementer, pageCompletionHandler) {
    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()

    Animator.zoomIn(self.find(".chart-body").eq(2), incrementer.next()).done()
    Animator.zoomIn(self.find(".chart-body").eq(1), incrementer.next(150)).done()
    Animator.zoomIn(self.find(".chart-body").eq(0), incrementer.next(250)).done()

    var chartTextStep = 400
    var mi = 0.9
    Animator.fadeIn(self.find(".chart-text").eq(0), incrementer.next(chartTextStep * 1)).done()
    Animator.fadeIn(self.find(".chart-text").eq(1), incrementer.next(chartTextStep * Math.pow(mi, 1))).done()
    Animator.fadeIn(self.find(".chart-text").eq(2), incrementer.next(chartTextStep * Math.pow(mi, 2))).done()
    Animator.fadeIn(self.find(".chart-text").eq(3), incrementer.next(chartTextStep * Math.pow(mi, 3))).done()
    Animator.fadeIn(self.find(".chart-text").eq(4), incrementer.next(chartTextStep * Math.pow(mi, 4))).done()

    Animator.zoomIn(self.find(".description").eq(0), incrementer.next()).done()
    Animator.zoomIn(self.find(".description").eq(1), incrementer.next()).done()
    Animator.zoomIn(self.find(".description").eq(2), incrementer.next()).done(pageCompletionHandler)
  }
})
