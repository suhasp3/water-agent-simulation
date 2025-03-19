export class Start extends Phaser.Scene {
    constructor() {
        super("Start");
    }

    preload() {
        this.load.image("nature tiles", "assets/nature_tileset.png");
        this.load.tilemapTiledJSON("rivermap", "assets/river.json");
        this.load.spritesheet("farmer", "assets/farmer.png", { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        console.log("create function started");
        const map = this.make.tilemap({ key: "rivermap" });
        const tileset = map.addTilesetImage("nature", "nature tiles");
        const groundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
        groundLayer.setCollision([152]); // Prevent walking on water
        const objectLayer = map.createLayer("Tile Layer 2", tileset, 0, 0);
        objectLayer.setCollision([21,3]); // Prevent walking into trees

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = this.physics.add.sprite(300, 300, "farmer");
        this.player2 = this.physics.add.sprite(200, 200, "farmer");
        this.player.setCollideWorldBounds(true).setDepth(10);
        this.player2.setCollideWorldBounds(true).setDepth(10);

        this.anims.create({ key: "walk-down", frames: this.anims.generateFrameNumbers("farmer", { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: "walk-left", frames: this.anims.generateFrameNumbers("farmer", { start: 3, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: "walk-right", frames: this.anims.generateFrameNumbers("farmer", { start: 6, end: 8 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: "walk-up", frames: this.anims.generateFrameNumbers("farmer", { start: 9, end: 11 }), frameRate: 10, repeat: -1 });

        this.physics.add.collider(this.player, objectLayer);
        this.physics.add.collider(this.player2, objectLayer); // Add collider for player2
        this.physics.add.collider(this.player, groundLayer); // Player collides with water
        this.physics.add.collider(this.player2, groundLayer); // NPC collides with water


        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBackgroundColor("#87CEEB");
        this.cursors = this.input.keyboard.createCursorKeys();

        this.nextMoveTime = 0;
        this.player2Directions = ["left", "right", "up", "down"];
        this.currentPlayer2Direction = Phaser.Math.RND.pick(this.player2Directions);
    }

    update(time) {
        const speed = 100;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed).anims.play("walk-left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed).anims.play("walk-right", true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed).anims.play("walk-up", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed).anims.play("walk-down", true);
        } else {
            this.player.anims.stop();
        }

        if (time > this.nextMoveTime) {
            this.currentPlayer2Direction = Phaser.Math.RND.pick(this.player2Directions);
            this.nextMoveTime = time + 2000;
        }

        this.player2.setVelocity(0);
        if (this.currentPlayer2Direction === "left") {
            this.player2.setVelocityX(-speed).anims.play("walk-left", true);
        } else if (this.currentPlayer2Direction === "right") {
            this.player2.setVelocityX(speed).anims.play("walk-right", true);
        } else if (this.currentPlayer2Direction === "up") {
            this.player2.setVelocityY(-speed).anims.play("walk-up", true);
        } else if (this.currentPlayer2Direction === "down") {
            this.player2.setVelocityY(speed).anims.play("walk-down", true);
        }
    }
}
