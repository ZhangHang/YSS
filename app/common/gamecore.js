function BallGame(container, ballTexturePath, radius, x, y) {

  // Matter aliases
  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint;

  var GameCore = {};

  var _engine,
    _sceneName = 'mixed',
    _sceneWidth,
    _sceneHeight,
    _deviceOrientationEvent,
    _isGravityEnabled;

  GameCore.init = function() {
    _isGravityEnabled = false;

    _engine = Engine.create(container, {
      render: {
        options: {
          wireframes: false,
          showAngleIndicator: false,
          showDebug: false,
          background: 'rbga(0,0,0,0)'
        }
      },
      timeScale: 0.8
    });


    setTimeout(function() {
      var runner = Engine.run(_engine);

      // pass through runner as timing for debug rendering
      _engine.metrics.timing = runner;

      GameCore.updateScene();
    }, 800);

    window.addEventListener('deviceorientation', function(event) {
      _deviceOrientationEvent = event;
      GameCore.updateGravity(event);
    }, true);

    window.addEventListener('orientationchange', function() {
      GameCore.updateGravity(_deviceOrientationEvent);
      GameCore.updateScene();
    }, false);
  };

  GameCore.mixed = function() {
    GameCore.reset();

    var engine = _engine,
      world = engine.world,
      offset = 10,
      options = {
        isStatic: true,
        render: {
          visible: true
        }
      };

    offset = 0;

    World.add(world, [Bodies.circle(x, y, radius, {
      density: 1,
      frictionAir: 0,
      restitution: 0.2,
      friction: 1,
      render: {
        isStatic: false,
        sprite: {
          texture: ballTexturePath
        }
      }
    })])
  };

  GameCore.updateScene = function() {
    if (!_engine)
      return;

    _sceneWidth = Math.abs(parseInt($(container).width()));
    _sceneHeight = Math.abs(parseInt($(container).height()));

    var boundsMax = _engine.world.bounds.max,
      renderOptions = _engine.render.options,
      canvas = _engine.render.canvas;

    boundsMax.x = _sceneWidth;
    boundsMax.y = _sceneHeight;

    canvas.width = renderOptions.width = _sceneWidth;
    canvas.height = renderOptions.height = _sceneHeight;

    GameCore[_sceneName]();
  };

  GameCore.updateGravity = function(event) {
    if (!_engine)
      return;

    var orientation = window.orientation,
      gravity = _engine.world.gravity;

    if (!_isGravityEnabled) {
      gravity.x = 0;
      gravity.y = 0;
      return;
    }

    if (orientation === 0) {
      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
      gravity.y = Common.clamp(event.beta, -90, 90) / 90;
    } else if (orientation === 180) {
      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
      gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
    } else if (orientation === 90) {
      gravity.x = Common.clamp(event.beta, -90, 90) / 90;
      gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
    } else if (orientation === -90) {
      gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
      gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
    }
  };

  GameCore.reset = function() {
    var _world = _engine.world;

    Common._seed = 2;

    World.clear(_world);
    Engine.clear(_engine);

    var offset = 0;
    var renderOptions = {
      isStatic: true,
      render: {
        strokeStyle: 'rgba(0,0,0,0)'
      }
    }
    World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 1, renderOptions));
    World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 1, renderOptions));
    World.addBody(_world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 1, _sceneHeight + 0.5, renderOptions));
    World.addBody(_world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 1, _sceneHeight + 0.5, renderOptions));
  };

  GameCore.clear = function() {
    if (_engine) {
      Engine.clear(_engine)
    }
  }

  GameCore.setGravityEnabled = function(enabled) {
    _isGravityEnabled = enabled;
    GameCore.updateGravity();
  }

  return GameCore
};
