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
    this.load.spritesheet("govagent", "assets/govagent.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("brewer", "assets/brewer.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
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

    // NPC definitions
    this.npc1 = {
      sprite: this.physics.add.sprite(900, 400, "farmer"),
      path: [
        [900, 400],
        [900, 650],
        [680, 650],
      ],
    };
    this.npc2 = {
      sprite: this.physics.add.sprite(320, 460, "govagent"),
      path: [
        [320, 460],
        [320, 600],
        [640, 600],
      ],
    };
    this.npc3 = {
      sprite: this.physics.add.sprite(350, 650, "brewer"),
      path: [[640, 650]],
    };

    this.npc1.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    this.npc2.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    this.npc3.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);

    // Move each NPC
    this.moveNPCOnce(this.npc1, 1500);
    this.moveNPCOnce(this.npc2, 1800);
    this.moveNPCOnce(this.npc3, 1800);

    // Camera setup
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.dialogueShown = false;
    this.dialogueTexts = [];
  }

  createAnimations(spriteKey) {
    this.anims.create({
      key: `${spriteKey}-walk-down`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: `${spriteKey}-walk-left`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: `${spriteKey}-walk-right`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: `${spriteKey}-walk-up`,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  moveNPCOnce(npc, speed) {
    let index = 0;
    const moveNext = () => {
      if (index >= npc.path.length) {
        npc.sprite.setFrame(0).stop();
        npc.sprite.arrived = true; // Mark arrival on the sprite
        return;
      }
      const [x, y] = npc.path[index];
      const prevX = npc.sprite.x;
      const prevY = npc.sprite.y;

      if (x > prevX) {
        npc.sprite.play(`${npc.sprite.texture.key}-walk-right`, true);
      } else if (x < prevX) {
        npc.sprite.play(`${npc.sprite.texture.key}-walk-left`, true);
      } else if (y > prevY) {
        npc.sprite.play(`${npc.sprite.texture.key}-walk-down`, true);
      } else if (y < prevY) {
        npc.sprite.play(`${npc.sprite.texture.key}-walk-up`, true);
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

  // Reusable function to draw a pointer bubble at the bottom-left corner
  drawPointerBubbleLeft(g, width, height) {
    // Rounded rect
    g.beginPath();
    g.fillRoundedRect(0, 0, width, height, 8);
    g.closePath();
    g.fillPath();

    // Pointer triangle at bottom-left
    g.beginPath();
    g.moveTo(12, height);
    g.lineTo(0, height + 12);
    g.lineTo(24, height);
    g.closePath();
    g.fillPath();
  }

  // Reusable function to draw a pointer bubble at the bottom-center
  drawPointerBubbleCenter(g, width, height) {
    // Rounded rect
    g.beginPath();
    g.fillRoundedRect(0, 0, width, height, 8);
    g.closePath();
    g.fillPath();

    // Pointer triangle at bottom center
    const pointerSize = 10;
    g.beginPath();
    g.moveTo(width / 2 - pointerSize, height);
    g.lineTo(width / 2, height + pointerSize);
    g.lineTo(width / 2 + pointerSize, height);
    g.closePath();
    g.fillPath();
  }

  showDialogueAbove(sprite, text, delay = 0) {
    this.time.delayedCall(delay, () => {
      // 1) Create the text object with higher resolution to reduce blur.
      const bubbleText = this.add.text(0, 0, text, {
        font: "16px Arial",  // Larger font
        color: "#000000",
        wordWrap: { width: 150 },
        resolution: 2        // Crisp text
      });

      // 2) Calculate needed bubble size for the text + padding
      const padding = 10;
      const bubbleWidth = bubbleText.width + padding * 2;
      const bubbleHeight = bubbleText.height + padding * 2;

      // 3) Graphics object to draw bubble background
      const bubbleBg = this.add.graphics();
      bubbleBg.fillStyle(0xffffff, 0.7); // white, 70% opacity

      // 4) Container to hold text + bubble background
      const bubbleContainer = this.add.container(0, 0);
      bubbleContainer.add(bubbleBg);
      bubbleContainer.add(bubbleText);
      bubbleContainer.setSize(bubbleWidth, bubbleHeight);
      bubbleContainer.setDepth(20);

      // Position text in the container
      bubbleText.setPosition(padding, padding);

      // 5) Decide which pointer style & offset to use
      if (sprite.texture.key === "farmer") {
        // Farmer pointer at bottom-left, moved "up and to the right"
        this.drawPointerBubbleLeft(bubbleBg, bubbleWidth, bubbleHeight);
        const offsetX = 30;   // shift right
        const offsetY = -80;  // shift up
        bubbleContainer.x = sprite.x + offsetX;
        bubbleContainer.y = sprite.y + offsetY;
      }
      else if (sprite.texture.key === "govagent") {
        // Gov Agent pointer at bottom-center, placed above head
        this.drawPointerBubbleCenter(bubbleBg, bubbleWidth, bubbleHeight);
        bubbleContainer.x = sprite.x - bubbleWidth / 2;
        bubbleContainer.y = sprite.y - (bubbleHeight + 50);
      }
      else {
        // Default bubble (for brewer), no pointer
        bubbleBg.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);
        bubbleContainer.x = sprite.x - bubbleWidth / 2;
        bubbleContainer.y = sprite.y - (bubbleHeight + 50);
      }

      // 6) Store reference to remove after 3s
      this.dialogueTexts.push(bubbleContainer);

      this.time.delayedCall(3000, () => {
        bubbleContainer.destroy();
      });
    });
  }

  update() {
    // Move camera with arrow keys (for debugging)
    if (this.cursors.left.isDown) this.cameras.main.scrollX -= 10;
    if (this.cursors.right.isDown) this.cameras.main.scrollX += 10;
    if (this.cursors.up.isDown) this.cameras.main.scrollY -= 10;
    if (this.cursors.down.isDown) this.cameras.main.scrollY += 10;

    // Show dialogue after NPCs arrive
    if (!this.dialogueShown) {
      const a = this.npc1.sprite;
      const b = this.npc2.sprite;
      const c = this.npc3.sprite;

      if (a.arrived && b.arrived && c.arrived) {
        this.dialogueShown = true;

        this.showDialogueAbove(a, "👨‍🌾 If we don’t irrigate now, we’ll lose the entire yield.", 0);
        this.showDialogueAbove(b, "🧑‍🏢 I’ll see if we can divert some from non-essential sectors and we can prioritize your zones.", 1500);
       
      }
    }
  }
}
