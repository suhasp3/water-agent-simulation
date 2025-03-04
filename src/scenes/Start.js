export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/river.png');
        this.load.image('logo', 'assets/phaser.png');

        // The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {
        // Background
        this.background = this.add.tileSprite(640, 500, 1280, 1000, 'background');
        this.background.setDepth(0);
        // Button
        let button = this.add.rectangle(130, 650, 200, 200, 0xffffff, 0);
        button.setInteractive();
        button.setDepth(1);
        // Popup container
        const popup = this.add.container(640, 400);
        const box = this.add.rectangle(0, 0, 400, 300, 0xffffff, 0.8);
        const person = this.add.text(0, 0, "Name: ", {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        const description = this.add.text(0, 40, "Description: This is the description", {
            fontSize: '24px',
            color: '#000000',
            wordWrap: { width: 400, useAdvancedWrap: true }, // Set max width and enable advanced wrapping
        }).setOrigin(0.5);
        const age = this.add.text(0, 80, "Age: They are __ years old.", {
            fontSize: '24px',
            color: '#000000',
            wordWrap: { width: 400, useAdvancedWrap: true }, // Set max width and enable advanced wrapping

        }).setOrigin(0.5);

        popup.add([box, person, description, age]);
        popup.setVisible(false);
        popup.setDepth(2);

        // Define interactive hit area for the popup
        popup.setInteractive(new Phaser.Geom.Rectangle(-200, -150, 400, 300), Phaser.Geom.Rectangle.Contains);

        // Button click event
        button.on('pointerdown', () => {
            console.log('Button clicked!');
            button.setVisible(false);
            popup.setVisible(true);
        });

        // Close the popup when clicked
        popup.on('pointerdown', () => {
            console.log('Popup clicked, closing...');
            button.setVisible(true);
            popup.setVisible(false);
        });

        // Button hover effects
        button.on('pointerover', () => {
            button.setFillStyle(0xffffff, 0.5);
        });

        button.on('pointerout', () => {
            button.setFillStyle(0xffffff, 0);
        });
    }

    update() {
        // No updates needed for now
    }
}
