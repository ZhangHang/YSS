pageStack.set('end', {
  render: function(self, incrementer, pageCompletionHandler) {
    pageCompletionHandler()
    
    Animator.fadeIn(self.find("#logo")).done()
    Animator.fadeIn(self.find("#text_top"), incrementer.next()).done()
    Animator.fadeIn(self.find("#seperator_top"), incrementer.next()).done()
    Animator.fadeIn(self.find("#text_bottom"), incrementer.next()).done()
    Animator.fadeIn(self.find("#seperator_bottom"), incrementer.next()).done()
    Animator.fadeIn(self.find("#video_container"), incrementer.next()).done()
    Animator.fadeIn(self.find("#video_play"), incrementer.next()).done()
  }
})
