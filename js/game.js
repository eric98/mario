
var map;
var layer;
var player;
var cursors;
var maxVides = 5
var lives
var monedes = 0

var menu = {
  preload() {
    game.load.spritesheet('button', 'assets/buttons/comencarJoc.png', 193, 71);
  },
  create() {
    game.stage.backgroundColor = "#523aaa"

    game.add.text(game.width/2-220, game.height/2*0.25, 'Megaman Bros', { font: '64px Arial', fill: '#ffff00' })
    game.add.text(game.width-150, game.height-40, 'ERIC 2N DAM', { font: '20px Arial', fill: '#ffff00' })

    game.add.button(game.width/2-193/2 , game.height/2, 'button', this.startGameButton, this, 2, 1, 0)
  },
  startGameButton() {
    game.state.start('level2')
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
  cors: [],
  monedesText: '',
  jumping: false,
  preload() {

    game.load.tilemap('mario', 'assets/tilemaps/maps/super_cub.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/maps/super_cub.png');
    game.load.spritesheet('player','assets/megaman_bo.png', 16, 21)
    game.load.spritesheet('heart', 'assets/hearts.png', 300, 300, 3);
    game.load.image('dust','assets/dust.png')


    game.load.audio('coin', ['assets/coin.wav','assets/coin.mp3'])
    game.load.audio('dust', ['assets/dust.wav','assets/dust.mp3'])
    game.load.audio('jump', ['assets/jump.wav','assets/jump.mp3'])
    game.load.audio('dead', ['assets/dead.wav','assets/dead.mp3'])

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

    this.coinSound = game.add.audio('coin',0.1)
    this.dustSound = game.add.audio('dust',0.1)
    this.jumpSound = game.add.audio('jump',0.1)
    this.deadSound = game.add.audio('dead',0.1)

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

    player.animations.add('right',[0,1,2,3,4],5,true)
    player.animations.add('left',[5,6,7,8,9],5,true)

    game.physics.enable(player);

    game.physics.arcade.gravity.y = 250;

    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    this.drawHearts()
    this.monedesText = game.add.text(20, 20, 'MONEDES: '+monedes, { font: '20px Arial', fill: '#ffff00' })
    this.monedesText.fixedToCamera = true

    // Particles
    this.dustParticles = game.add.emitter(0,0,150)
    this.dustParticles.makeParticles('dust')
    this.dustParticles.setYSpeed(-200,200)
    this.dustParticles.setXSpeed(-200,200)
    this.dustParticles.gravity = 500

  },
  regenerarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    lives = maxVides

    this.cors.forEach(function(cor) {
      cor.frame = 0
    })

    layer.dirty = true;
    return false
  },
  badMushroomCollide: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    this.cors[--lives].frame = 2

    layer.dirty = true;
    return false
  },
  getLive: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    if (lives < maxVides) {
      this.cors[lives++].frame = 0
    }

    layer.dirty = true;
    return false
  },
  hitCoin: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    this.monedesText.text ='MONEDES: '+ ++monedes

    layer.dirty = true;
    return false
  },
  drawHearts: function () {
    this.cors = []

    var scale = 0.1
    for (var i = 0; i < lives; i++) {
      this.cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',0))
      this.cors[i].scale.setTo(scale)
      this.cors[i].fixedToCamera = true
    }

    for (var i = lives; i < maxVides; i++) {
      this.cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',2))
      this.cors[i].scale.setTo(scale)
      this.cors[i].fixedToCamera = true
    }
  },
  render: function () {
    //game.debug.text('playerY: '+player.body.y,40,20,"#00ff00")
  },
  update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    if (player.body.onFloor()) {
      if (this.jumping){
        this.dustSound.play()
        this.dustParticles.x = player.x + player.height/2
        this.dustParticles.y = player.y + player.height/2
        this.dustParticles.start(true,300, null, 30)
        this.jumping = false
      }
      if (cursors.up.isDown)
      {
        if (player.body.onFloor())
        {
          player.body.velocity.y = -200;
          this.jumping = true
          this.jumpSound.play()
        }
      }
    } else {
      this.jumping = true
    }

    if (player.body.y >= 219){
      lives--
      this.cors[lives].frame = 2
      player.body.y = 50
      player.body.x = player.body.x - 50
    }

    if (player.body.x >= 3162){
      game.state.start('level2')
    }

    if (lives == 0){
      this.deadSound.play()
      game.state.start('gameOver')
    }

    if (cursors.left.isDown)
    {
      player.animations.play('left')
      player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
      player.animations.play('right')
      player.body.velocity.x = 150;
    } else {
      player.animations.stop()
    }
  }
}

var level2 = {
  cors: [],
  preload() {
    game.load.tilemap('mario', 'assets/tilemaps/maps/final_cub.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/maps/final_cub.png');
    game.load.spritesheet('player','assets/megaman_bo.png', 16, 21)
    game.load.spritesheet('heart', 'assets/hearts.png', 300, 300, 3);
    game.load.image('dust','assets/dust.png')

    game.load.audio('coin', ['assets/coin.wav','assets/coin.mp3'])
    game.load.audio('dust', ['assets/dust.wav','assets/dust.mp3'])
    game.load.audio('jump', ['assets/jump.wav','assets/jump.mp3'])
    game.load.audio('dead', ['assets/dead.wav','assets/dead.mp3'])
  },
  create() {
    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperCubFinal1-1', 'tiles');

    layer = map.createLayer('World1');

    layer.resizeWorld();

    layer.wrap = true;

    cursors = game.input.keyboard.createCursorKeys();

    this.coinSound = game.add.audio('coin',0.1)
    this.dustSound = game.add.audio('dust',0.1)
    this.jumpSound = game.add.audio('jump',0.1)
    this.deadSound = game.add.audio('dead',0.1)

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

    player.animations.add('right',[0,1,2,3,4],5,true)
    player.animations.add('left',[5,6,7,8,9],5,true)

    game.physics.enable(player);

    game.physics.arcade.gravity.y = 250;

    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    this.drawHearts()
    this.monedesText = game.add.text(20, 20, 'MONEDES: '+monedes, { font: '20px Arial', fill: '#ffff00' })
    this.monedesText.fixedToCamera = true

    // Particles
    this.dustParticles = game.add.emitter(0,0,150)
    this.dustParticles.makeParticles('dust')
    this.dustParticles.setYSpeed(-200,200)
    this.dustParticles.setXSpeed(-200,200)
    this.dustParticles.gravity = 500

  },
  regenerarVida: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    lives = maxVides

    this.cors.forEach(function(cor) {
      cor.frame = 0
    })

    //this.drawHearts()

    layer.dirty = true;
    return false
  },
  badMushroomCollide: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    this.cors[--lives].frame = 2

    layer.dirty = true;
    return false
  },
  getLive: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    if (lives < maxVides) {
      this.cors[lives++].frame = 0
    }

    layer.dirty = true;
    return false
  },
  hitCoin: function (sprite, tile) {
    tile.alpha = 1
    tile.index = 1

    this.monedesText.text ='MONEDES: '+ ++monedes

    layer.dirty = true;
    return false
  },
  drawHearts: function () {
    this.cors = []

    var scale = 0.1
    for (var i = 0; i < lives; i++) {
      this.cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',0))
      this.cors[i].scale.setTo(scale)
      this.cors[i].fixedToCamera = true
    }

    for (var i = lives; i < maxVides; i++) {
      this.cors.push(game.add.sprite(10+(30*i), game.height-30, 'heart',2))
      this.cors[i].scale.setTo(scale)
      this.cors[i].fixedToCamera = true
    }
  },
  render: function () {
    //game.debug.text('playerY: '+player.body.y,40,20,"#00ff00")
  },
  update() {
    player.animations.play('idle')

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    if (player.body.onFloor()) {
      if (this.jumping){
        this.dustSound.play()
        this.dustParticles.x = player.x + player.height/2
        this.dustParticles.y = player.y + player.height/2
        this.dustParticles.start(true,300, null, 30)
        this.jumping = false
      }
      if (cursors.up.isDown)
      {
        if (player.body.onFloor())
        {
          player.body.velocity.y = -200;
          this.jumping = true
          this.jumpSound.play()
        }
      }
    } else {
      this.jumping = true
    }

    if (player.body.y >= 219){
      lives--
      this.cors[lives].frame = 2
      player.body.y = 50
      player.body.x = player.body.x - 50
    }

    if (player.body.x >= 1404){
      game.state.start('final')
    }

    if (lives == 0){
      this.deadSound.play()
      game.state.start('gameOver')
    }

    if (cursors.left.isDown)
    {
      player.animations.play('left')
      player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
      player.animations.play('right')
      player.body.velocity.x = 150;
    } else {
      player.animations.stop()
    }
  }
}

var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game', menu);
game.state.add('menu',menu)
game.state.add('gameOver',gameOver)
game.state.add('final',final)
game.state.add('level1',level1)
game.state.add('level2',level2)