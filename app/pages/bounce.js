pageStack.set("bounce", {
  render: function(self, incrementer, pageCompletionHandler) {

    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()

    Animator.fadeIn(self.find("#chart-body-bottom"), incrementer.next()).done()
    Animator.fadeIn(self.find("#chart-body"), incrementer.next()).done()
    Animator.fadeIn(self.find("#chart-text"), incrementer.next()).done()


    Animator.fadeIn(self.find("#ball"), incrementer.next()).done(function(){
      Animator.removeFadeIn(this, true)
    })
    Animator.fadeIn(self.find("#guide"), incrementer.next()).done()
    Animator.fadeIn(self.find("#hand"), incrementer.next()).done()

    Animator.performAction(function() {
      self.on('click',function(){
        $(this).off()
        Animator.animate("skin-bounce", self.find("#ball"), 0, {
          duration: "2s"
        }).done(function() {
          Animator.fadeOut(self.find("#guide")).done()
            Animator.fadeOut(self.find("#hand")).done()
          Animator.fadeIn(self.find("#text"), incrementer.next()).done()
          Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done(pageCompletionHandler)
        })
      })
    }, incrementer.next())

  }
})
