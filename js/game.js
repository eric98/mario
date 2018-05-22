
var map;
var layer;
var player;
var cursors;
var maxVides = 5
var lives
var monedes = 0
var cors = []

var menu = {
  preload() {
    game.load.spritesheet('button', 'assets/buttons/comencarJoc.png', 193, 71);
  },
  create() {
    game.stage.backgroundColor = "#523aaa"

    game.add.text(game.width/2-130, game.height/2*0.25, 'Cub Bros', { font: '64px Arial', fill: '#ffff00' })
    game.add.text(game.width-150, game.height-40, 'ERIC 2N DAM', { font: '20px Arial', fill: '#ffff00' })

    game.add.button(game.width/2-193/2 , game.height/2, 'button', this.startGameButton, this, 2, 1, 0)
  },
  startGameButton() {
    game.state.start('level1')
  },
  render: function () {
  },
  update() {
  }
}

var final = {
  preload() {
    game.load.spritesheet('button', 'assets/buttons/tornarJugar.png', 193, 71);
  },
  create() {
    game.stage.backgroundColor = "#523aaa"

    game.add.text(game.width/2-130, game.height/2*0.25, 'Has guanyat!', { font: '64px Arial', fill: '#ffff00' })
    game.add.text(game.width/2-130, game.height/2, 'Puntuacio: '+monedes, { font: '25px Arial', fill: '#ffff00' })
    game.add.text(game.width/2-130, game.height/2*1.5, 'Vides restants: '+lives, { font: '25px Arial', fill: '#ffff00' })
    game.add.text(game.width-150, game.height-40, 'ERIC 2N DAM', { font: '20px Arial', fill: '#ffff00' })

    game.add.button(30 , game.height/2-20, 'button', this.goMenuButton, this, 2, 1, 0)
  },
  goMenuButton() {
    game.state.start('menu')
  },
  render: function () {
  },
  update() {
  }
}

var gameOver = {
  preload() {
    game.load.spritesheet('button', 'assets/buttons/tornarJugar.png', 193, 71);
  },
  create() {
    game.stage.backgroundColor = "#523aaa"

    game.add.text(game.width/2-130, game.height/2*0.25, 'Has mort!', { font: '64px Arial', fill: '#ffff00' })
    game.add.text(game.width/2-130, game.height/2, 'Puntuacio: '+monedes, { font: '25px Arial', fill: '#ffff00' })
    game.add.text(game.width/2-130, game.height/2*1.5, 'Vides restants: '+lives, { font: '25px Arial', fill: '#ffff00' })
    game.add.text(game.width-150, game.height-40, 'ERIC 2N DAM', { font: '20px Arial', fill: '#ffff00' })

    game.add.button(30 , game.height/2-20, 'button', this.goMenuButton, this, 2, 1, 0)
  },
  goMenuButton() {
    game.state.start('menu')
  },
  render: function () {
  },
  update() {
  }
}

var level1 = {
  preload() {

    game.load.tilemap('mario', 'assets/tilemaps/maps/super_cub.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/maps/super_cub.png');
    game.load.spritesheet('player','assets/player16x16.png', 14, 11)
    game.load.spritesheet('heart', 'assets/hearts.png', 300, 300, 3);

  },
  create() {

    lives = 3
    monedes = 0

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperCub1-1', 'tiles');

    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    cursors = game.input.keyboard.createCursorKeys();

    map.setCollisionBetween(15, 16);
    map.setCollisionBetween(20, 25);
    map.setCollisionBetween(27, 29);
    map.setCollision(40);

    // funció per a les monedes
    map.setTileIndexCallback(11, this.hitCoin, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.hitCoin, this)

    // funció per als bolets de 1up
    map.setTileIndexCallback(18, this.getLive, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.getLive, this)

    // funció per als bolets dolents
    map.setTileIndexCallback(12, this.badMushroomCollide, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.badMushroomCollide, this)

    // funció per a les estrelles
    map.setTileIndexCallback(19, this.regenerarVida, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.regenerarVida, this)

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
  regenerarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    lives = maxVides

    cors.forEach(function(cor) {
      cor.frame = 0
    })

    //this.drawHearts()

    layer.dirty = true;
    return false
  },
  badMushroomCollide: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    cors[--lives].frame = 2

    layer.dirty = true;
    return false
  },
  getLive: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    if (lives < maxVides) {
      cors[lives++].frame = 0
    }

    layer.dirty = true;
    return false
  },
  hitCoin: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1
    monedes++

    layer.dirty = true;
    return false
  },
  drawHearts: function () {
    console.log('33333 ', lives)
    console.log(game.height-30)
    cors.forEach(function(cor) {
      // game.world.remove(cor)
      cor.kill()
    })

    var scale = 0.1
    for (var i = 0; i < lives; i++) {
      cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',0))
      cors[i].scale.setTo(scale)
      cors[i].fixedToCamera = true
    }

    for (var i = lives; i < maxVides; i++) {
      cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',2))
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
      player.body.y = 50
      player.body.x = player.body.x - 50
    }

    if (player.body.x >= 3162){
      game.state.start('level2')
    }

    if (lives == 0){
      // game.paused = true
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
    game.load.tilemap('mario', 'assets/tilemaps/maps/final_cub.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/maps/final_cub.png');
    game.load.spritesheet('player','assets/player16x16.png', 14, 11)
    game.load.spritesheet('heart', 'assets/hearts.png', 300, 300, 3);
  },
  create() {
    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperCubFinal1-1', 'tiles');

    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    cursors = game.input.keyboard.createCursorKeys();

    map.setCollisionBetween(15, 16);
    map.setCollisionBetween(20, 25);
    map.setCollisionBetween(27, 29);
    map.setCollision(40);

    // funció per a les monedes
    map.setTileIndexCallback(11, this.hitCoin, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.hitCoin, this)

    // funció per als bolets de 1up
    map.setTileIndexCallback(18, this.getLive, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.getLive, this)

    // funció per als bolets dolents
    map.setTileIndexCallback(12, this.badMushroomCollide, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.badMushroomCollide, this)

    // funció per a les estrelles
    map.setTileIndexCallback(19, this.regenerarVida, this)
    map.setTileLocationCallback(2, 0, 1, 1, this.regenerarVida, this)

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
  regenerarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    lives = maxVides

    cors.forEach(function(cor) {
      cor.frame = 0
    })

    //this.drawHearts()

    layer.dirty = true;
    return false
  },
  badMushroomCollide: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    cors[--lives].frame = 2

    layer.dirty = true;
    return false
  },
  getLive: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    if (lives < maxVides) {
      cors[lives++].frame = 0
    }

    layer.dirty = true;
    return false
  },
  hitCoin: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1
    monedes++

    layer.dirty = true;
    return false
  },
  drawHearts: function () {
    cors.forEach(function(cor) {
      cor.kill()
    })

    var scale = 0.1
    for (var i = 0; i < lives; i++) {
      cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',0))
      cors[i].scale.setTo(scale)
      cors[i].fixedToCamera = true
    }

    for (var i = lives; i < maxVides; i++) {
      cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',2))
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
      player.body.y = 50
      player.body.x = player.body.x - 50
    }

    if (player.body.x >= 1404){
      game.state.start('final')
    }

    if (lives == 0){
      game.paused = true
      // game.state.start('gameOver')
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

var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game', menu);
game.state.add('menu',menu)
game.state.add('gameOver',gameOver)
game.state.add('final',final)
game.state.add('level1',level1)
game.state.add('level2',level2)
//game.state.start('menu')