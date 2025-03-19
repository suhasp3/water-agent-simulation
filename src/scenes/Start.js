export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    this.load.image("nature tiles", "assets/nature_tileset.png");
    this.load.tilemapTiledJSON("rivermap", "assets/river.json");
    this.load.spritesheet("farmer", "assets/farmer.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    console.log("create function started");
    const map = this.make.tilemap({ key: "rivermap" });
    const tileset = map.addTilesetImage("nature", "nature tiles");
    const groundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
    groundLayer.setCollision([152]); // Prevent walking on water
    const objectLayer = map.createLayer("Tile Layer 2", tileset, 0, 0);
    objectLayer.setCollision([21,3]);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.npc1 = this.physics.add.sprite(300, 300, "farmer");
    this.npc2 = this.physics.add.sprite(200, 200, "farmer");
    this.npc1.setCollideWorldBounds(true).setDepth(10);
    this.npc2.setCollideWorldBounds(true).setDepth(10);

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("farmer", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("farmer", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("farmer", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("farmer", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.npc1, objectLayer);
    this.physics.add.collider(this.npc2, objectLayer);
    this.physics.add.collider(this.npc1, groundLayer);
    this.physics.add.collider(this.npc2, groundLayer);

    this.physics.add.collider(this.npc1, this.npc2);

    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBackgroundColor("#87CEEB");

    this.cameraSpeed = 10;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.time.addEvent({
      delay: 2000,
      callback: this.moveNPC,
      args: [this.npc1],
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1800,
      callback: this.moveNPC,
      args: [this.npc2],
      callbackScope: this,
      loop: true,
    });

    this.moveNPC(this.npc1);
    this.moveNPC(this.npc2);
  }

  moveNPC(npc) {
    npc.body.setVelocity(0);

    const direction = Math.floor(Math.random() * 5);
    const speed = 100;

    switch (direction) {
      case 0:
        npc.body.setVelocityY(speed);
        npc.anims.play("walk-down", true);
        break;
      case 1:
        npc.body.setVelocityX(-speed);
        npc.anims.play("walk-left", true);
        break;
      case 2:
        npc.body.setVelocityX(speed);
        npc.anims.play("walk-right", true);
        break;
      case 3:
        npc.body.setVelocityY(-speed);
        npc.anims.play("walk-up", true);
        break;
      case 4:
        npc.anims.stop();
        break;
    }
  }

  update() {
    if (this.cursors.left.isDown) {
      this.cameras.main.scrollX -= this.cameraSpeed;
    } else if (this.cursors.right.isDown) {
      this.cameras.main.scrollX += this.cameraSpeed;
    }

    if (this.cursors.up.isDown) {
      this.cameras.main.scrollY -= this.cameraSpeed;
    } else if (this.cursors.down.isDown) {
      this.cameras.main.scrollY += this.cameraSpeed;
    }

    if (
      this.npc1.body.blocked.down ||
      this.npc1.body.blocked.up ||
      this.npc1.body.blocked.left ||
      this.npc1.body.blocked.right
    ) {
      this.moveNPC(this.npc1);
    }

    if (
      this.npc2.body.blocked.down ||
      this.npc2.body.blocked.up ||
      this.npc2.body.blocked.left ||
      this.npc2.body.blocked.right
    ) {
      this.moveNPC(this.npc2);
    }
  }
}
