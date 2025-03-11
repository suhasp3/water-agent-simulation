export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/river.png');
        this.load.image('logo', 'assets/phaser.png');
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {
        // Background
        this.background = this.add.tileSprite(500, 500, 1000, 800, 'background');
        this.background.setDepth(0);
//MEXICO MEETING PLACE
        // Button (Invisible Rectangle)
        let mexico_meeting_place = this.add.rectangle(130, 700, 150, 175, 0xffffff, 0);
        mexico_meeting_place.setInteractive({ useHandCursor: true }); // Enables hover effect
        mexico_meeting_place.setDepth(1);

        // Popup container
        const mexico_meeting_place_popup = this.add.container(110, 500);

        // Popup background box
        const mexico_meeting_place_box = this.add.rectangle(0, 0, 200, 250, 0xffffff, 0.8);

        // Text elements (adjusted relative to the new box position)
        const mexico_meeting_place_place_name = this.add.text(-90, -100, "Mexico Meeting Place", { fontSize: '16px', color: '#000000' , wordWrap: { width: 180, useAdvancedWrap: true }});

        const mexico_meeting_place_description = this.add.text(-90, -60, "Description: This is the description", {
            fontSize: '16px', color: '#000000', wordWrap: { width: 180, useAdvancedWrap: true }
        });
        mexico_meeting_place_popup.add([mexico_meeting_place_box, mexico_meeting_place_place_name, mexico_meeting_place_description]);
        mexico_meeting_place_popup.setVisible(false);
        mexico_meeting_place_popup.setDepth(2);

        // Button hover effects
        mexico_meeting_place.on('pointerover', () => {
            mexico_meeting_place_popup.setVisible(true);
        });

        mexico_meeting_place.on('pointerout', () => {
            mexico_meeting_place_popup.setVisible(false);
        });

        mexico_meeting_place.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation(); // Prevents click from triggering hover effects
        });


//USA MEETING PLACE
        // Button (Invisible Rectangle)
        let usa_meeting_place = this.add.rectangle(360, 250, 200, 130, 0xffffff, 0);
        usa_meeting_place.setInteractive({ useHandCursor: true }); // Enables hover effect
        usa_meeting_place.setDepth(1);

        // Popup container
        const usa_meeting_popup = this.add.container(150, 250);

        // Popup background box
        const usa_meeting_place_box = this.add.rectangle(0, 0, 200, 250, 0xffffff, 0.8);

        // Text elements (adjusted relative to the new box position)
        const usa_meeting_place_place_name = this.add.text(-90, -100, "USA Meeting Place", { fontSize: '16px', color: '#000000' , wordWrap: { width: 180, useAdvancedWrap: true }});

        const usa_meeting_place_description = this.add.text(-90, -60, "Description: This is the description", {
            fontSize: '16px', color: '#000000', wordWrap: { width: 180, useAdvancedWrap: true }
        });
        usa_meeting_popup.add([usa_meeting_place_box, usa_meeting_place_place_name, usa_meeting_place_description]);
        usa_meeting_popup.setVisible(false);
        usa_meeting_popup.setDepth(2);

        // Button hover effects
        usa_meeting_place.on('pointerover', () => {
            usa_meeting_popup.setVisible(true);
        });

        usa_meeting_place.on('pointerout', () => {
            usa_meeting_popup.setVisible(false);
        });

        usa_meeting_place.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation(); // Prevents click from triggering hover effects
        });

//BARN OR FARM
        // Button (Invisible Rectangle)
        let farm = this.add.rectangle(800, 220, 170, 150, 0xffffff, 0);
        farm.setInteractive({ useHandCursor: true }); // Enables hover effect
        farm.setDepth(1);

        // Popup container
        const farm_popup = this.add.container(600, 250);

        // Popup background box
        const farm_box = this.add.rectangle(0, 0, 200, 250, 0xffffff, 0.8);

        // Text elements (adjusted relative to the new box position)
        const farm_place_name = this.add.text(-90, -100, "USA Meeting Place", { fontSize: '16px', color: '#000000' , wordWrap: { width: 180, useAdvancedWrap: true }});

        const farm_description = this.add.text(-90, -60, "Description: This is the description", {
            fontSize: '16px', color: '#000000', wordWrap: { width: 180, useAdvancedWrap: true }
        });
        farm_popup.add([farm_box, farm_place_name, farm_description]);
        farm_popup.setVisible(false);
        farm_popup.setDepth(2);

        // Button hover effects
        farm.on('pointerover', () => {
            farm_popup.setVisible(true);
        });

        farm.on('pointerout', () => {
            farm_popup.setVisible(false);
        });

        farm.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation(); // Prevents click from triggering hover effects
        });
    }

    update() {
        // No updates needed for now
    }
}
