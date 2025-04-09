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
    // Create tilemap & layers
    const map = this.make.tilemap({ key: "rivermap" });
    const tilesets = [
      map.addTilesetImage("nature", "nature_tiles"),
      map.addTilesetImage("barn", "barn_tiles"),
      map.addTilesetImage("barn_objects", "barn_object_tiles"),
      map.addTilesetImage("city_hall", "city_hall_tiles"),
      map.addTilesetImage("fence", "fence_tiles"),
      map.addTilesetImage("town_square", "town_square_tiles"),
    ].filter(Boolean);

    map.createLayer("ground", tilesets, 0, 0);
    map.createLayer("buildings", tilesets, 0, 0);
    map.createLayer("objects", tilesets, 0, 0);

    // Set up animations
    this.createAnimations("farmer");
    this.createAnimations("govagent");
    this.createAnimations("brewer");

    // NPCs with initial positions & paths
    this.npc1 = {
      sprite: this.physics.add.sprite(900, 400, "farmer"),
      path: [
        [900, 400],
        [900, 650],
        [680, 650], // The meeting spot
      ],
    };
    this.npc2 = {
      sprite: this.physics.add.sprite(320, 460, "govagent"),
      path: [
        [320, 460],
        [320, 600],
        [640, 600], // The meeting spot
      ],
    };
    this.npc3 = {
      sprite: this.physics.add.sprite(350, 650, "brewer"),
      path: [
        [640, 650], // The meeting spot
      ],
    };

    // NPC sprite properties
    this.npc1.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    this.npc2.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);
    this.npc3.sprite.setFrame(0).setCollideWorldBounds(true).setDepth(10);

    // Move them into position
    this.moveNPCOnce(this.npc1, 1500);
    this.moveNPCOnce(this.npc2, 1800);
    this.moveNPCOnce(this.npc3, 1800);

    // Camera
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();

    // Dialogue flags
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
        npc.sprite.arrived = true;
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

  // Pointer bubble at bottom-left
  drawPointerBubbleLeft(g, width, height) {
    // Rounded rect
    g.beginPath();
    g.fillRoundedRect(0, 0, width, height, 8);
    g.closePath();
    g.fillPath();

    // Pointer triangle (bottom-left)
    g.beginPath();
    g.moveTo(12, height);
    g.lineTo(0, height + 12);
    g.lineTo(24, height);
    g.closePath();
    g.fillPath();
  }

  // Pointer bubble at bottom-center
  drawPointerBubbleCenter(g, width, height) {
    // Rounded rect
    g.beginPath();
    g.fillRoundedRect(0, 0, width, height, 8);
    g.closePath();
    g.fillPath();

    // Pointer triangle (bottom-center)
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
      // Create a crisp text (resolution=2)
      const bubbleText = this.add.text(0, 0, text, {
        font: "16px Arial",
        color: "#000000",
        wordWrap: { width: 150 },
        resolution: 2
      });

      const padding = 10;
      const bubbleWidth = bubbleText.width + padding * 2;
      const bubbleHeight = bubbleText.height + padding * 2;

      const bubbleBg = this.add.graphics();
      bubbleBg.fillStyle(0xffffff, 0.7);

      // Container to hold bubble + text
      const bubbleContainer = this.add.container(0, 0);
      bubbleContainer.add(bubbleBg);
      bubbleContainer.add(bubbleText);
      bubbleContainer.setSize(bubbleWidth, bubbleHeight);
      bubbleContainer.setDepth(20);

      bubbleText.setPosition(padding, padding);

      // Decide bubble style & offsets
      if (sprite.texture.key === "farmer") {
        // Farmer: pointer at bottom-left, offset up & right
        this.drawPointerBubbleLeft(bubbleBg, bubbleWidth, bubbleHeight);
        bubbleContainer.x = sprite.x + 30;
        bubbleContainer.y = sprite.y - 80;
      }
      else if (sprite.texture.key === "govagent") {
        // Gov Official: pointer at bottom-center, above head
        this.drawPointerBubbleCenter(bubbleBg, bubbleWidth, bubbleHeight);
        bubbleContainer.x = sprite.x - bubbleWidth / 2;
        bubbleContainer.y = sprite.y - (bubbleHeight + 50);
      }
      else {
        // Brewer: no pointer
        bubbleBg.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 8);
        bubbleContainer.x = sprite.x - bubbleWidth / 2;
        bubbleContainer.y = sprite.y - (bubbleHeight + 50);
      }

      // Destroy after 3 seconds
      this.dialogueTexts.push(bubbleContainer);
      this.time.delayedCall(3000, () => {
        bubbleContainer.destroy();
      });
    });
  }

  update() {
    // Simple camera controls
    if (this.cursors.left.isDown) this.cameras.main.scrollX -= 10;
    if (this.cursors.right.isDown) this.cameras.main.scrollX += 10;
    if (this.cursors.up.isDown) this.cameras.main.scrollY -= 10;
    if (this.cursors.down.isDown) this.cameras.main.scrollY += 10;

    // Wait until all arrived
    if (!this.dialogueShown) {
      const farmer = this.npc1.sprite;
      const gov = this.npc2.sprite;
      const brewer = this.npc3.sprite; // silent

      if (farmer.arrived && gov.arrived && brewer.arrived) {
        this.dialogueShown = true;

        // 1) Farmer
        this.showDialogueAbove(
          farmer,
          "👨‍🌾 We need more water for the crops for this year's harvest.",
          0
        );

        // 2) Gov Official
        this.showDialogueAbove(
          gov,
          "🧑‍🏢 We can discuss adjustments.",
          1500
        );

        // 3) Farmer
        this.showDialogueAbove(
          farmer,
          "👨‍🌾 If we don't irrigate now, we'll lose the entire yield.",
          3000
        );

        // 4) Gov Official
        this.showDialogueAbove(
          gov,
          "🧑‍🏢 I'll see if we can divert some from non-essential sectors and we can prioritize your zones.",
          4500
        );

        // After last bubble disappears (~7500ms from now), walk them back
        this.time.delayedCall(7500, () => {
          // Reset their "arrived" so they can move again
          farmer.arrived = false;
          gov.arrived = false;
          brewer.arrived = false;

          // Reverse paths to go back:
          // Farmer originally: [900,400] => [900,650] => [680,650]
          // So reversed: [680,650] => [900,650] => [900,400]
          this.npc1.path = [
            [680, 650],
            [900, 650],
            [900, 400],
          ];
          this.moveNPCOnce(this.npc1, 1500);

          // Gov: [320,460] => [320,600] => [640,600]
          // Reversed: [640,600] => [320,600] => [320,460]
          this.npc2.path = [
            [640, 600],
            [320, 600],
            [320, 460],
          ];
          this.moveNPCOnce(this.npc2, 1800);

          // Brewer: [350,650], path: [640,650]
          // Reversed: [640,650] => [350,650]
          this.npc3.path = [
            [640, 650],
            [350, 650],
          ];
          this.moveNPCOnce(this.npc3, 1800);
        });
      }
    }
  }
}
