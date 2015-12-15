pageStack.set("change", {
  render: function(self, incrementer, pageCompletionHandler) {

    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done();
    Animator.fadeIn(self.find("#chart-body"), incrementer.next()).done();
    Animator.fadeIn(self.find("#chart-text"), incrementer.next()).done();

    Animator.fadeIn(self.find("#hand"), incrementer.next()).done();
    Animator.fadeIn(self.find("#line"), incrementer.next()).done();

    Animator.fadeIn(self.find("#scratch"), incrementer.next()).done()
    Animator.fadeIn(self.find("#picture"), incrementer.last()).done()

    Animator.fadeIn(self.find("#guide-text"), incrementer.next()).done();

    LuckyCard.case({
      ratio: .3,
      coverColor: "rgba(255,255,255,0.9)"
    }, function() {

      Animator.fadeOut(self.find("#hand"), 0, {
        remove: true
      }).done()
      Animator.fadeOut(self.find("#line"), 0, {
        remove: true
      }).done()
      Animator.fadeOut(self.find("#guide-text")).done(function() {
        Animator.fadeOut(self.find("#chart-body")).done()
        Animator.fadeOut(self.find("#chart-text")).done()
        Animator.fadeIn(self.find("#text-1")).done()
        Animator.fadeIn(self.find("#text-2"), 200).done()
      })
      self.find("#scratch").remove();
    })
  }
})
