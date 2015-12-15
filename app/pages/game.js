pageStack.set('game', {
  render: function(self, incrementer, pageCompletionHandler) {
    var it = this
    try {
      this.game = (function() {
        var x = parseInt(self.width()) * 0.8
        var y = parseInt(self.height()) * 0.6
        var useSmallBall = parseInt(self.width()) <= 400
        var radius = useSmallBall ? 40 : 50
        var ballTexturePath = "images/game/ball_" + radius + ".png"
        return BallGame(self.find("#ball-container")[0], ballTexturePath, radius, x - radius, y - radius)
      })()
    } catch (e) {
      console.log("init game core failed")
    }
    this.game.init()

    Animator.fadeIn(self.find(".small-logo"), incrementer.next()).done()

    Animator.fadeIn(self.find("#chart-body"), incrementer.next()).done()
    Animator.fadeIn(self.find("#chart-text"), incrementer.next()).done()

    Animator.fadeIn(self.find("#phone"), incrementer.next()).done()
    Animator.fadeIn(self.find("#seperator"), incrementer.next(600)).done()
    Animator.fadeIn(self.find("#text"), incrementer.next(600)).done()
    Animator.shine(self.find("#vibration"), incrementer.next()).done()
    
    Animator.fadeIn(self.find("#guide-text"), incrementer.next()).done()
    Animator.fadeIn(self.find("#ball-container"), incrementer.next()).done()

    Animator.performAction(function() {
      it.game.setGravityEnabled(true)
    }, incrementer.last() + 2000)

    Animator.performAction(pageCompletionHandler, incrementer.next(3000))
  },
  deinit: function() {
    this.game.clear()
  }
})
