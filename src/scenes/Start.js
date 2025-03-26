export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    this.load.image("nature_tiles", "assets/nature.png");
    this.load.image("barn_tiles", "assets/barn.png");
    this.load.image("barn_object_tiles", "assets/barn_objects.png");
    this.load.image("city_hall_tiles", "assets/city_hall.png");
    this.load.image("fence_tiles", "assets/fence.png");
    this.load.image("town_square_tiles", "assets/townsquare.png");
    this.load.tilemapTiledJSON("rivermap", "assets/new_river.json");
    this.load.spritesheet("farmer", "assets/farmer.png", { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    const map = this.make.tilemap({ key: "rivermap" });

    // Create walking animations
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('farmer', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('farmer', { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('farmer', { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('farmer', { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    // Create text bubble style
    this.textBubbleStyle = {
      font: '16px Arial',
      fill: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 },
      borderRadius: 5
    };

    const tilesets = [
      map.addTilesetImage("nature", "nature_tiles"),
      map.addTilesetImage("barn", "barn_tiles"),
      map.addTilesetImage("barn_objects", "barn_object_tiles"),
      map.addTilesetImage("city_hall", "city_hall_tiles"),
      map.addTilesetImage("fence", "fence_tiles"),
      map.addTilesetImage("town_square", "town_square_tiles"),
    ].filter(Boolean);

    const groundLayer = map.createLayer("ground", tilesets, 0, 0);
    const buildingLayer = map.createLayer("buildings", tilesets, 0, 0);
    const objectLayer = map.createLayer("objects", tilesets, 0, 0);

    groundLayer.setCollision([164, 54]);
    buildingLayer.setCollision([1, 5, 13, 33]);
    objectLayer.setCollision([11, 194, 197, 200, 198, 201]);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.npc1 = { sprite: this.physics.add.sprite(900, 400, "farmer"), path: [[900, 400], [900, 650], [680, 650]] }; 
    this.npc2 = { sprite: this.physics.add.sprite(320, 460, "farmer"), path: [[320, 460], [320, 600], [640,600]] };
//width, height
    // Set initial frames and enable animations
    this.npc1.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    this.npc2.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    
    this.moveNPCOnce(this.npc1, 1500);
    this.moveNPCOnce(this.npc2, 1500);

    this.physics.add.collider(this.npc1.sprite, groundLayer);
    this.physics.add.collider(this.npc2.sprite, groundLayer);
    this.physics.add.collider(this.npc1.sprite, buildingLayer);
    this.physics.add.collider(this.npc2.sprite, buildingLayer);
    this.physics.add.collider(this.npc1.sprite, objectLayer);
    this.physics.add.collider(this.npc2.sprite, objectLayer);
    this.physics.add.collider(this.npc1.sprite, this.npc2.sprite);

    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  moveNPCOnce(npc, speed) {
    let index = 0;
    const moveNext = () => {
      if (index >= npc.path.length) {
        // When reaching destination, face front and stop animation
        npc.sprite.setFrame(0).stop();
        
        // If both NPCs have reached their destination, start the conversation
        if (this.npc1.sprite.x === 680 && this.npc2.sprite.x === 640) {
          this.startWeatherConversation();
        }
        return;
      } 
      const [x, y] = npc.path[index];
      const prevX = npc.sprite.x;
      const prevY = npc.sprite.y;

      // Determine direction and play appropriate animation
      if (x > prevX) {
        npc.sprite.setFlipX(false).play('walk-right', true);
      } else if (x < prevX) {
        npc.sprite.setFlipX(false).play('walk-left', true);
      } else if (y > prevY) {
        npc.sprite.setFlipX(false).play('walk-down', true);
      } else if (y < prevY) {
        npc.sprite.setFlipX(false).play('walk-up', true);
      }

      this.tweens.add({
        targets: npc.sprite,
        x: x,
        y: y,
        duration: speed,
        onComplete: () => {
          index++;
          moveNext();
        },
      });
    };
    moveNext();
  }

  startWeatherConversation() {
    // Create text bubbles
    const bubble1 = this.add.text(this.npc2.sprite.x, this.npc2.sprite.y - 40, 
      "Beautiful day for farming!", this.textBubbleStyle);
    const bubble2 = this.add.text(this.npc1.sprite.x, this.npc1.sprite.y - 40, 
      "Yes, perfect weather!", this.textBubbleStyle);

    // Set depth to appear above sprites
    bubble1.setDepth(20);
    bubble2.setDepth(20);

    // Add second part of conversation after a delay
    this.time.delayedCall(3000, () => {
      bubble1.setText("Hope it stays this nice!");
      bubble2.setText("Me too!");
    });

    // Remove bubbles after conversation
    this.time.delayedCall(6000, () => {
      bubble1.destroy();
      bubble2.destroy();
    });
  }

  moveNPCLoop(npc, speed) {
    let index = 0;
    const moveNext = () => {
      const [x, y] = npc.path[index];
      const prevX = npc.sprite.x;
      const prevY = npc.sprite.y;

      // Determine direction and play appropriate animation
      if (x > prevX) {
        npc.sprite.setFlipX(false).play('walk-right', true);
      } else if (x < prevX) {
        npc.sprite.setFlipX(false).play('walk-left', true);
      } else if (y > prevY) {
        npc.sprite.setFlipX(false).play('walk-down', true);
      } else if (y < prevY) {
        npc.sprite.setFlipX(false).play('walk-up', true);
      }

      this.tweens.add({
        targets: npc.sprite,
        x: x,
        y: y,
        duration: speed,
        onComplete: () => {
          index = (index + 1) % npc.path.length;
          moveNext();
        },
      });
    };
    moveNext();
  }

  update() {
    if (this.cursors.left.isDown) this.cameras.main.scrollX -= 10;
    if (this.cursors.right.isDown) this.cameras.main.scrollX += 10;
    if (this.cursors.up.isDown) this.cameras.main.scrollY -= 10;
    if (this.cursors.down.isDown) this.cameras.main.scrollY += 10;
  }
}
