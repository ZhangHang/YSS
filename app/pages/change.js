pageStack.set('change', {
  render: function(self, incrementer) {
    Animator.fadeIn(self.find("#sun"), incrementer.next()).done()
    Animator.fadeIn(self.find("#head"), incrementer.next()).done()
    Animator.fadeIn(self.find("#hand"), incrementer.next()).done(function() {
      Animator.removeFadeIn(this)
      Animator.float(this, 0, {
        infinite: true
      }).done()
    })
    Animator.fadeIn(self.find("#arrow"), incrementer.next()).done()

    self.find(".tapArea").on("click", function() {
      $(this).off()
      incrementer.reset()
      Animator.fadeOut(self.find("#sun")).done()
      Animator.fadeOut(self.find("#hand")).done(function() {
        this.remove()
      })
      Animator.fadeOut(self.find("#head")).done()

      Animator.fadeIn(self.find("#scene-1-sun"), incrementer.next()).done()
      Animator.fadeIn(self.find("#scene-1-head"), incrementer.next()).done()

      Animator.fadeIn(self.find(".next-page-arrow"), incrementer.next()).done(function() {
        Inbox.post(TASK_NAME_UNLOCK_PAGE)
      })
    })
  }
})
