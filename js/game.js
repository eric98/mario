
var map;
var layer;
var player;
var cursors;
var lives = 5
var monedes = 0
var cors = []

var menu = {
  button: null,
  titol: '',
  copyright: '',
  preload() {
    game.load.spritesheet('button', 'assets/buttons/comencarJoc.png', 193, 71);
  },
  create() {
    // game.stage.backgroundColor = "#523aaa"
    game.stage.backgroundColor = "#523aaa"
    // var fondo = game.add.image(0, 0, 'background')
    // fondo.width = game.width
    // fondo.height = game.height

    titol = game.add.text(game.world.centerX-130, game.world.centerY*0.25, 'Cub Bros', { font: '64px Arial', fill: '#ffff00' })
    copyright = game.add.text(game.world.width-150, game.world.height-40, 'ERIC 2N DAM', { font: '20px Arial', fill: '#ffff00' })

    button = game.add.button(game.world.centerX-193/2 , game.world.centerY, 'button', this.startGameButton, this, 2, 1, 0)
  },
  startGameButton() {
    game.state.start('level1')
  },
  render: function () {

  },
  update() {

  }
}

var level1 = {
  preload() {

    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('player','assets/player16x16.png', 14, 11)
    game.load.spritesheet('heart', 'assets/hearts.png', 300, 300, 3);

  },
  create() {

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    cursors = game.input.keyboard.createCursorKeys();

    map.setCollisionBetween(15, 16);
    map.setCollisionBetween(20, 25);
    map.setCollisionBetween(27, 29);
    map.setCollision(40);



    map.setTileIndexCallback(11, this.hitCoin, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.hitCoin, this)

    player = game.add.sprite(250,50,'player')

    game.physics.arcade.enable(player)

    player.animations.add('idle',[3,4,5,4],5,true)

    game.physics.enable(player);

    game.physics.arcade.gravity.y = 250;

    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    this.drawHearts()

  },
  hitCoin: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    monedes++

    // console.log(tile)
    // console.log(tile.x)
    // console.log(tile.y)

    layer.dirty = true;
    return false
  },
  drawHearts: function () {
    var scale = 0.1
    for (var i = 0; i < lives; i++) {
      cors.push(game.add.sprite(10+(30*i), game.world.height-30, 'heart',0))
      cors[i].scale.setTo(scale)
      cors[i].fixedToCamera = true
    }
  },
  render: function () {
    game.debug.text('FPS: '+game.time.fps || 'FPS: --',40,20,"#00ff00")
    game.debug.text('player_X: '+player.body.x,40,40,"#00ff00")
    game.debug.text('player_Y: '+player.body.y,40,60,"#00ff00")
    game.debug.text('lives: '+lives,40,80,"#00ff00")
    game.debug.text('monedes: '+monedes,40,100,"#00ff00")
  },
  update() {
    player.animations.play('idle')

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
      if (player.body.onFloor())
      {
        player.body.velocity.y = -200;
      }
    }

    if (player.body.y >= 229){
      lives--
      cors[lives].frame = 2
      player.body.y = 175
      player.body.x = player.body.x - 50
    }

    if (player.body.x >= 3162){
      console.log('nextLevel')
    }

    if (lives == 3){
      game.state.start('menu')
    }

    if (cursors.left.isDown)
    {
      player.body.velocity.x = -150;
      player.frame = 2
    }
    else if (cursors.right.isDown)
    {
      player.body.velocity.x = 150;
      player.frame = 1
    }
  }
}

var level2 = {
  preload() {
  },
  create() {
  },
  hitCoin(sprite, tile) {
  },
  render: function () {
  },
  update() {
  }
}

var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game', menu);
game.state.add('menu',menu)
game.state.add('level1',level1)
//game.state.add('level2',level2)
//game.state.start('menu')