export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    // Load the tileset image
    this.load.image("nature_tileset", "assets/nature_tileset.png");

    // Load the tilemap JSON exported from Tiled
    this.load.tilemapTiledJSON("rivermap", "assets/rivermap.json");
  }

  create() {
    // Load the tilemap
    const map = this.make.tilemap({ key: "rivermap" });

    // Load the tileset - the name must match what you used in Tiled!
    const tileset = map.addTilesetImage("RPG Nature Tileset", "nature_tileset");

    // Create layers (Make sure "Ground" matches a layer in your Tiled map!)
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    const objectLayer = map.createLayer("Objects", tileset, 0, 0);

    // Optional: Adjust camera to fit the map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }
}
