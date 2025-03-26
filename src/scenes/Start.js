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
    console.log("Starting create function");
    const map = this.make.tilemap({ key: "rivermap" });

    console.log("Full map data:", map);

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

    console.log("Tilesets loaded:", {
      natureTileset,
      barnTileset,
      barnObjectsTileset,
      cityHallTileset,
      fenceTileset,
      townSquareTileset,
    });

    const allTilesets = [
      natureTileset,
      barnTileset,
      barnObjectsTileset,
      cityHallTileset,
      fenceTileset,
      townSquareTileset,
    ].filter((tileset) => tileset !== null);

    const groundLayer = map.createLayer("ground", allTilesets, 0, 0);
    const buildingLayer = map.createLayer("buildings", allTilesets, 0, 0);
    const objectLayer = map.createLayer("objects", allTilesets, 0, 0);

    console.log("Ground layer data:", groundLayer.layer.data);
    console.log("Building layer data:", buildingLayer.layer.data);
    console.log("Object layer data:", objectLayer.layer.data);

    groundLayer.setCollision([164, 54]);
    buildingLayer.setCollision([1, 5, 13, 33]);
    objectLayer.setCollision([11, 194, 197, 200, 198, 201]);

    // groundLayer.setCollisionByExclusion([-1]);
    // buildingLayer.setCollisionByExclusion([-1]);
    // objectLayer.setCollisionByExclusion([-1]);

    groundLayer.setDepth(0);
    buildingLayer.setDepth(1);
    objectLayer.setDepth(2);
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

    this.input.on("pointerdown", (pointer) => {
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const tileX = Math.floor(worldPoint.x / 32);
      const tileY = Math.floor(worldPoint.y / 32);
      console.log(
        `Clicked - World: (${Math.floor(worldPoint.x)}, ${Math.floor(
          worldPoint.y
        )}) Tile: (${tileX}, ${tileY})`
      );
    });

    this.input.keyboard.on("keydown-T", () => {
      if (!this.tileDebug) {
        this.tileDebug = this.add.graphics();
        this.updateTileDebug();
      } else {
        this.tileDebug.destroy();
        this.tileDebug = null;
      }
    });

    // Create coordinate display text (centered at top of screen)
    this.coordinatesText = this.add.text(
      400, // Center position X
      20, // Near top of screen
      "Mouse Position: X: 0 Y: 0\nTile Position: X: 0 Y: 0",
      {
        font: "16px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
        align: "center",
      }
    );
    this.coordinatesText.setOrigin(0.5, 0); // Center align the text
    this.coordinatesText.setScrollFactor(0); // Fix to camera
    this.coordinatesText.setDepth(1000); // Make sure it's on top

    // Add mouse move listener
    this.input.on("pointermove", (pointer) => {
      // Get world position (accounts for camera)
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

      // Calculate tile position (32 is your tile size)
      const tileX = Math.floor(worldPoint.x / 32);
      const tileY = Math.floor(worldPoint.y / 32);

      // Update text with both world coordinates and tile coordinates
      this.coordinatesText.setText(
        `Mouse Position: X: ${Math.floor(worldPoint.x)} Y: ${Math.floor(
          worldPoint.y
        )}\n` + `Tile Position: X: ${tileX} Y: ${tileY}`
      );
    });

    // Handle window resize to keep coordinates text in correct position
    this.scale.on("resize", (gameSize) => {
      this.coordinatesText.setPosition(gameSize.width / 2, 20);
    });

    // Add toggle for coordinate display with C key
    this.input.keyboard.on("keydown-C", () => {
      this.coordinatesText.setVisible(!this.coordinatesText.visible);
    });

    console.log("Created coordinates text:", this.coordinatesText);

    // Force text to update immediately
    this.coordinatesText.setText("TEST - If you see this, text is working");
    console.log("Text visibility:", this.coordinatesText.visible);
    console.log(
      "Text position:",
      this.coordinatesText.x,
      this.coordinatesText.y
    );
    console.log("Text depth:", this.coordinatesText.depth);
  }

  updateTileDebug() {
    if (!this.tileDebug) return;

    this.tileDebug.clear();

    const camera = this.cameras.main;
    const map = this.make.tilemap({ key: "rivermap" });

    const startX = Math.floor(camera.scrollX / 32);
    const startY = Math.floor(camera.scrollY / 32);
    const endX = startX + Math.ceil(camera.width / 32 / camera.zoom);
    const endY = startY + Math.ceil(camera.height / 32 / camera.zoom);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const worldX = x * 32;
        const worldY = y * 32;

        this.tileDebug.lineStyle(1, 0xff0000, 0.5);
        this.tileDebug.strokeRect(worldX, worldY, 32, 32);

        const buildingTile = map.getTileAt(x, y, false, "buildings");
        if (buildingTile) {
          const text = this.add.text(
            worldX + 2,
            worldY + 2,
            buildingTile.index.toString(),
            { fontSize: "10px", color: "#ff0000" }
          );
          text.depth = 100;
          if (!this.tileTexts) this.tileTexts = [];
          this.tileTexts.push(text);
        }
      }
    }
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

    if (this.tileDebug) {
      this.updateTileDebug();
    }
  }
}
