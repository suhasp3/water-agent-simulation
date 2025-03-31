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
    this.load.spritesheet("govagent", "assets/govagent.png", { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("brewer", "assets/brewer.png", { frameWidth: 32, frameHeight: 32 });

  }

  create() {
    const map = this.make.tilemap({ key: "rivermap" });
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

    this.createAnimations("farmer");
    this.createAnimations("govagent");
    this.createAnimations("brewer");


    this.npc1 = { sprite: this.physics.add.sprite(900, 400, "farmer"), path: [[900, 400], [900, 650], [680, 650]] }; 
    this.npc2 = { sprite: this.physics.add.sprite(320, 460, "govagent"), path: [[320, 460], [320, 600], [640, 600]] };
    this.npc3 = { sprite: this.physics.add.sprite(350, 650, "brewer"), path: [[640, 650]] };

    this.npc1.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    this.npc2.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    
    this.moveNPCOnce(this.npc1, 1500);
    this.moveNPCOnce(this.npc2, 1800);
    this.moveNPCOnce(this.npc3, 1800);

    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createAnimations(spriteKey) {
    this.anims.create({
      key: `${spriteKey}-walk-down`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: `${spriteKey}-walk-left`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: `${spriteKey}-walk-right`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: `${spriteKey}-walk-up`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
  }

  moveNPCOnce(npc, speed) {
    let index = 0;
    const moveNext = () => {
      if (index >= npc.path.length) {
        npc.sprite.setFrame(0).stop();
        return;
      }
      const [x, y] = npc.path[index];
      const prevX = npc.sprite.x;
      const prevY = npc.sprite.y;

      if (x > prevX) npc.sprite.play(`${npc.sprite.texture.key}-walk-right`, true);
      else if (x < prevX) npc.sprite.play(`${npc.sprite.texture.key}-walk-left`, true);
      else if (y > prevY) npc.sprite.play(`${npc.sprite.texture.key}-walk-down`, true);
      else if (y < prevY) npc.sprite.play(`${npc.sprite.texture.key}-walk-up`, true);

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

  update() {
    if (this.cursors.left.isDown) this.cameras.main.scrollX -= 10;
    if (this.cursors.right.isDown) this.cameras.main.scrollX += 10;
    if (this.cursors.up.isDown) this.cameras.main.scrollY -= 10;
    if (this.cursors.down.isDown) this.cameras.main.scrollY += 10;
  }
}
