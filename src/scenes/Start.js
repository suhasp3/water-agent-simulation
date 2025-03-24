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
    this.load.spritesheet("farmer", "assets/farmer.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    console.log("create function started");
    const map = this.make.tilemap({ key: "rivermap" });

    console.log("Map data:", map);
    console.log("Map layers:", map.layers);
    console.log("Map tilesets:", map.tilesets);

    const natureTileset = map.addTilesetImage("nature", "nature_tiles");
    const barnTileset = map.addTilesetImage("barn", "barn_tiles");
    const barnObjectsTileset = map.addTilesetImage(
      "barn_objects",
      "barn_object_tiles"
    );
    const cityHallTileset = map.addTilesetImage("city_hall", "city_hall_tiles");
    const fenceTileset = map.addTilesetImage("fence", "fence_tiles");
    const townSquareTileset = map.addTilesetImage(
      "town_square",
      "town_square_tiles"
    );

    console.log("Nature tileset:", natureTileset);

    const groundLayer = map.createLayer("ground", [natureTileset], 0, 0);

    console.log("Ground layer:", groundLayer);

    const buildingLayer = map.createLayer(
      "buildings",
      [barnTileset, cityHallTileset, townSquareTileset],
      0,
      0
    );
    const objectLayer = map.createLayer(
      "objects",
      [
        barnObjectsTileset,
        cityHallTileset,
        barnTileset,
        fenceTileset,
        townSquareTileset,
      ],
      0,
      0
    );

    groundLayer.setCollisionByProperty({ collides: true });
    buildingLayer.setCollisionByProperty({ collides: true });
    objectLayer.setCollisionByProperty({ collides: true });

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

    this.physics.add.collider(this.npc1, groundLayer);
    this.physics.add.collider(this.npc2, groundLayer);
    this.physics.add.collider(this.npc1, buildingLayer);
    this.physics.add.collider(this.npc2, buildingLayer);
    this.physics.add.collider(this.npc1, objectLayer);
    this.physics.add.collider(this.npc2, objectLayer);

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

    this.input.keyboard.on("keydown-D", () => {
      this.physics.world.drawDebug = !this.physics.world.drawDebug;
      if (!this.physics.world.drawDebug) {
        this.physics.world.debugGraphic.clear();
      }
    });
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
