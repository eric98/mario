
var map;
var layer;
var player;
var cursors;
var level1 = {
  preload() {

    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('player','assets/player16x16.png', 14, 11)

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

    player = game.add.sprite(250,50,'player')

    game.physics.arcade.enable(player)

    player.animations.add('idle',[3,4,5,4],5,true)

    game.physics.enable(player);

    game.physics.arcade.gravity.y = 250;

    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

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

var game = new Phaser.Game(800, 240, Phaser.AUTO, 'game', level1);

game.state.add('menu',menu)
game.state.add('level1',level1)
game.state.add('level2',level2)
game.state.start('level1')