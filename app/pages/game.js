pageStack.set('game', {
  render: function(self, incrementer) {
    var game = (function() {
      var x = parseInt(self.width()) * 0.8
      var y = parseInt(self.height()) * 0.6
      var useSmallBall = parseInt(self.width()) <= 400
      var radius = useSmallBall ? 80 : 100
      var ballTexturePath = "images/game/ball-" + radius + ".png"
      return BallGame(self.find("#ball-container")[0], ballTexturePath, radius, x - radius, y - radius)
    })()
    game.init()
    this.game = game

    Animator.fadeIn(self.find("#phone")).done()
    Animator.fadeIn(self.find("#seperator"), incrementer.next(600)).done()
    Animator.fadeIn(self.find("#text"), incrementer.next(600)).done()
    Animator.shine(self.find("#vibration"), incrementer.next()).done()
    Animator.fadeIn(self.find("#ball-container"), incrementer.next()).done()

    Animator.performAction(function() {
      game.setGravityEnabled(true)
    }, incrementer.last() + 2000)

    Animator.shine(self.find(".next-page-arrow"), incrementer.next()).done(function() {
      Inbox.post(TASK_NAME_UNLOCK_PAGE)
    })
  },
  deinit: function() {
    this.game.clear()
  }
})
