export class Start extends Phaser.Scene {
    constructor() {
        super("Start");
    }

    preload() {
        // Load the tileset image
        this.load.image("nature_tileset", "assets/nature_tileset.png");

        // Load the tilemap JSON exported from Tiled
        this.load.tilemapTiledJSON("rivermap", "assets/rivermap.json");

        // Load the player sprite sheet
        this.load.spritesheet("farmer", "assets/farmer.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // Load the tilemap
        console.log("create fuction started");
        const map = this.make.tilemap({ key: "rivermap" });
        const tileset = map.addTilesetImage("RPG Nature Tileset", "nature_tileset");
    
        // Create layers
        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        const objectLayer = map.createLayer("Objects", tileset, 0, 0);
    
        objectLayer.setCollisionByProperty({ collides: true });
    
        // ✅ Create the player (force it to appear)
        this.player = this.physics.add.sprite(300, 300, "farmer");
        console.log("Player Created:", this.player);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10); // Ensure it's drawn on top
        
        // Create animations
        this.anims.create({
            key: "walk-down",
            frames: this.anims.generateFrameNumbers("farmer", { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNumbers("farmer", { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: "walk-right",
            frames: this.anims.generateFrameNumbers("farmer", { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: "walk-up",
            frames: this.anims.generateFrameNumbers("farmer", { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        
        console.log("Animations created!"); // Debugging check
        
        
    
        // Enable collision
        this.physics.add.collider(this.player, objectLayer);
    
        // Camera settings
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);
    
        // Set background color (to check if it's rendering at all)
        this.cameras.main.setBackgroundColor("#87CEEB");
    
        // Input handling
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    

    update() {
        const speed = 100;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk-left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk-right", true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("walk-up", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk-down", true);
        } else {
            this.player.anims.stop();
        }
    }
}
