pageStack.set("change", {
  render: function(self, incrementer, pageCompletionHandler) {

    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done();

    Animator.fadeIn(self.find("#scratch"), incrementer.next()).done()
    Animator.fadeIn(self.find("#picture"), incrementer.last()).done()

    Animator.fadeIn(self.find("#chart-body"), incrementer.next()).done();
    Animator.fadeIn(self.find("#chart-text"), incrementer.next()).done();

    // LuckyCard.case({
    //   ratio: .1,
    //   coverColor: "rgba(255,255,255,0.9)"
    // }, function() {
    //   changedSecen()
    //   self.find("#scratch").remove();
    // })

    function changedSecen() {
      Animator.fadeOut(self.find("#chart-body")).done()
      Animator.fadeOut(self.find("#chart-text")).done()
      Animator.fadeIn(self.find("#text-1"), 100).done()
      Animator.fadeIn(self.find("#text-2"), 300).done(pageCompletionHandler)
    }

    Animator.performAction(changedSecen, 3000)
  }
})
