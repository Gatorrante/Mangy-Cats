class Escena extends Phaser.Scene {
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('bola', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.image('pata1', 'img/mano1.png');
        this.load.image('pata2', 'img/mano2.png');
        this.load.image('leftbtn', 'img/flecha.png');
        this.load.audio('minigame', 'music/Minigame.wav');
    }

    create() {
        this.music = this.sound.add('minigame');
        this.music.play({ loop: true });

        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.sprite(480, 320, 'fondo');
        this.bola = this.physics.add.sprite(480, 320, 'bola');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');
        this.bola.setBounce(1);

        this.pata1 = this.physics.add.sprite(70, 320, 'pata1');
        this.pata1.body.immovable = true;
        this.pata1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.pata1);
        this.pata1.setCollideWorldBounds(true);

        this.pata2 = this.physics.add.sprite(882, 320, 'pata2');
        this.pata2.flipX = true; // voltear pata pa usar varias
        this.pata2.body.immovable = true;
        this.pata2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.pata2);
        this.pata2.setCollideWorldBounds(true);

        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({ x: 50, y: 50 }, { x: 50, y: 590 }, this.pata1);
        this.controlesVisuales({ x: 910, y: 50 }, { x: 910, y: 590 }, this.pata2);

        this.alguienGano = false;
        this.pintarMarcador();
    }

    update() {
        // Rotación 
        this.bola.rotation += 0.1;

        // colisión de los bordes pe causa
        if (this.bola.x < 0 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata2.text = parseInt(this.marcadorPata2.text) + 1;
            if (parseInt(this.marcadorPata2.text) >= 3) {
                alert('¡Jugador 2 ha ganado!');
                this.music.stop();
                this.scene.start('Nivel2');
            } else {
                this.resetRound();
            }
        } else if (this.bola.x > 960 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata1.text = parseInt(this.marcadorPata1.text) + 1;
            if (parseInt(this.marcadorPata1.text) >= 3) {
                alert('¡Jugador 1 ha ganado!');
                this.music.stop();
                this.scene.start('Nivel2');
            } else {
                this.resetRound();
            }
        }

        if (this.cursors.up.isDown || this.pata1.getData('direccionVertical') === 1) {
            this.pata1.y -= 5;
        } else if (this.cursors.down.isDown || this.pata1.getData('direccionVertical') === -1) {
            this.pata1.y += 5;
        }

        if (this.cursors.up.isDown || this.pata2.getData('direccionVertical') === 1) {
            this.pata2.y -= 5;
        } else if (this.cursors.down.isDown || this.pata2.getData('direccionVertical') === -1) {
            this.pata2.y += 5;
        }

        if (this.pata1.y < 0) {
            this.pata1.y = 0;
        } else if (this.pata1.y > this.sys.game.config.height) {
            this.pata1.y = this.sys.game.config.height;
        }

        if (this.pata2.y < 0) {
            this.pata2.y = 0;
        } else if (this.pata2.y > this.sys.game.config.height) {
            this.pata2.y = this.sys.game.config.height;
        }
    }

    pintarMarcador() {
        this.marcadorPata1 = this.add.text(440, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.marcadorPata2 = this.add.text(520, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    resetRound() {
        this.bola.setPosition(480, 320);

        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {
        const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
        const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
        downbtn.flipY = true;

        downbtn.on('pointerdown', () => {
            player.setData('direccionVertical', -1);
        });

        upbtn.on('pointerdown', () => {
            player.setData('direccionVertical', 1);
        });

        downbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });

        upbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
    }
}

class Nivel2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel2' });
    }

    preload() {
        this.load.image('fondo2', 'img/fondolvl2.jpg');
        this.load.spritesheet('bola', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('pata1', 'img/mano1.png');
        this.load.image('pata3', 'img/mano3.png');
        this.load.image('leftbtn', 'img/flecha.png');
        this.load.audio('minigame2', 'music/Minigame2.wav');
    }

    create() {
        this.music = this.sound.add('minigame2');
        this.music.play({ loop: true });

        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.sprite(480, 320, 'fondo2');
        this.bola = this.physics.add.sprite(480, 320, 'bola');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');
        this.bola.setBounce(1);

        // Jugador 1
        this.pata1 = this.physics.add.sprite(70, 320, 'pata1');
        this.pata1.body.immovable = true;
        this.pata1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.pata1);
        this.pata1.setCollideWorldBounds(true);

        // Jugador 2
        this.pata2 = this.physics.add.sprite(882, 320, 'pata3');
        this.pata2.flipX = true; 
        this.pata2.body.immovable = true;
        this.pata2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.pata2);
        this.pata2.setCollideWorldBounds(true);

        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({ x: 50, y: 50 }, { x: 50, y: 590 }, this.pata1);
        this.controlesVisuales({ x: 910, y: 50 }, { x: 910, y: 590 }, this.pata2);

        this.alguienGano = false;
        this.pintarMarcador();
    }

    update() {
        this.bola.rotation += 0.1;

        if (this.bola.x < 0 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata2.text = parseInt(this.marcadorPata2.text) + 1;
            if (parseInt(this.marcadorPata2.text) >= 3) {
                alert('¡Jugador 2 ha ganado el Nivel 2!');
                this.music.stop();
                this.scene.start('Escena');
            } else {
                this.resetRound();
            }
        } else if (this.bola.x > 960 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata1.text = parseInt(this.marcadorPata1.text) + 1;
            if (parseInt(this.marcadorPata1.text) >= 3) {
                alert('¡Jugador 1 ha ganado el Nivel 2!');
                this.music.stop();
                this.scene.start('Escena');
            } else {
                this.resetRound();
            }
        }

        if (this.cursors.up.isDown || this.pata1.getData('direccionVertical') === 1) {
            this.pata1.y -= 5;
        } else if (this.cursors.down.isDown || this.pata1.getData('direccionVertical') === -1) {
            this.pata1.y += 5;
        }

        if (this.cursors.up.isDown || this.pata2.getData('direccionVertical') === 1) {
            this.pata2.y -= 5;
        } else if (this.cursors.down.isDown || this.pata2.getData('direccionVertical') === -1) {
            this.pata2.y += 5;
        }
//Pata 1 y 2 bounces o como se llamen 
        if (this.pata1.y < 0) {
            this.pata1.y = 0;
        } else if (this.pata1.y > this.sys.game.config.height) {
            this.pata1.y = this.sys.game.config.height;
        }

        if (this.pata2.y < 0) {
            this.pata2.y = 0;
        } else if (this.pata2.y > this.sys.game.config.height) {
            this.pata2.y = this.sys.game.config.height;
        }
    }

    pintarMarcador() {
        this.marcadorPata1 = this.add.text(440, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.marcadorPata2 = this.add.text(520, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    resetRound() {
        this.bola.setPosition(480, 320);

        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        // Reiniciar el jueguito
        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {
        const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
        const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
        downbtn.flipY = true;

        downbtn.on('pointerdown', () => {
            player.setData('direccionVertical', -1);
        });

        upbtn.on('pointerdown', () => {
            player.setData('direccionVertical', 1);
        });

        downbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });

        upbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: [Escena, Nivel2],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
