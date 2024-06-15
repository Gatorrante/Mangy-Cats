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
        
        // Primer jugador
        this.pata1 = this.physics.add.sprite(70, 320, 'pata1');
        this.pata1.body.immovable = true;
        this.bola.setBounce(10);
        this.pata1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.pata1);
        this.pata1.setCollideWorldBounds(true);

        // Segundo jugador
        this.pata2 = this.physics.add.sprite(882, 320, 'pata2');
        this.pata2.flipX = true; // Voltear horizontalmente
        this.pata2.body.immovable = true;
        this.pata2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.pata2);
        this.pata2.setCollideWorldBounds(true);

        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

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
        // Rotación de la bola
        this.bola.rotation += 0.1;
    
        // Verificación de colisión con los bordes y actualización del marcador
        if (this.bola.x < 0 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata2.text = parseInt(this.marcadorPata2.text) + 1;
            if (parseInt(this.marcadorPata2.text) >= 3) {
                alert('¡Jugador 2 ha ganado!');
                this.music.stop();
                this.scene.start('Nivel2', { marcadorPata1: this.marcadorPata1.text, marcadorPata2: this.marcadorPata2.text });
            } else {
                this.resetRound();
            }
        } else if (this.bola.x > 960 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata1.text = parseInt(this.marcadorPata1.text) + 1;
            if (parseInt(this.marcadorPata1.text) >= 3) {
                alert('¡Jugador 1 ha ganado!');
                this.music.stop();
                this.scene.start('Nivel2', { marcadorPata1: this.marcadorPata1.text, marcadorPata2: this.marcadorPata2.text });
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

        // Limitar el movimiento de pata1 y pata2 para que no salgan de la escena
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

    resetGame() {
        // Reiniciar el marcador y colocar la pelota en el centro
        this.marcadorPata1.text = '0';
        this.marcadorPata2.text = '0';
        this.bola.setPosition(480, 320);
    }

    resetRound() {
        // Reiniciar la posición de la bola
        this.bola.setPosition(480, 320);
        
        // Generar un nuevo ángulo y velocidad
        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        // Establecer la nueva velocidad
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        // Reiniciar el estado del juego
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
        this.load.image('pata1', 'img/mano1.png');
        this.load.image('pata3', 'img/mano3.png');
        this.load.audio('minigame2', 'music/Minigame2.wav');
    }

    create(data) {
        this.music = this.sound.add('minigame2');
        this.music.play({ loop: true });

        this.add.sprite(480, 320, 'fondo2');

        // Reiniciar el marcador al iniciar el nivel 2
        this.marcadorPata1 = 0;
        this.marcadorPata2 = 0;

        // Pintar el marcador
        this.pintarMarcador();

        // Creación de las bolas
        this.bola1 = this.physics.add.sprite(200, 320, 'bola');
        this.bola1.setBounce(1);
        this.bola1.setCollideWorldBounds(true);

        this.bola2 = this.physics.add.sprite(760, 320, 'bola');
        this.bola2.setBounce(1);
        this.bola2.setCollideWorldBounds(true);

        // Primer jugador
        this.pata1 = this.physics.add.sprite(70, 320, 'pata1');
        this.pata1.body.immovable = true;
        this.pata1.setSize(60, 250);
        this.physics.add.collider(this.bola1, this.pata1);
        this.physics.add.collider(this.bola2, this.pata1);
        this.pata1.setCollideWorldBounds(true);

        // Segundo jugador
        this.pata2 = this.physics.add.sprite(882, 320, 'pata3');
        this.pata2.flipX = true; // Voltear horizontalmente
        this.pata2.body.immovable = true;
        this.pata2.setSize(60, 250);
        this.physics.add.collider(this.bola1, this.pata2);
        this.physics.add.collider(this.bola2, this.pata2);
        this.pata2.setCollideWorldBounds(true);

        const velocidad = 500;
        let anguloInicial1 = Math.random() * Math.PI / 2 + Math.PI / 4;
        let anguloInicial2 = Math.random() * Math.PI / 2 + Math.PI / 4;

        // Direcciones opuestas para las bolas
        const vx1 = Math.sin(anguloInicial1) * velocidad;
        const vy1 = Math.cos(anguloInicial1) * velocidad;
        const vx2 = -Math.sin(anguloInicial2) * velocidad; // Dirección opuesta
        const vy2 = -Math.cos(anguloInicial2) * velocidad; // Dirección opuesta

        this.bola1.body.velocity.x = vx1;
        this.bola1.body.velocity.y = vy1;
        this.bola2.body.velocity.x = vx2;
        this.bola2.body.velocity.y = vy2;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({ x: 50, y: 50 }, { x: 50, y: 590 }, this.pata1);
        this.controlesVisuales({ x: 910, y: 50 }, { x: 910, y: 590 }, this.pata2);

        this.alguienGano = false;
        this.limitePuntos = 5;
    }

    update() {
        // Rotación de las bolas
        this.bola1.rotation += 0.1;
        this.bola2.rotation += 0.1;
    
        // Verificar si alguien ganó
        if (this.bola1.x < 0 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata2++; // Aumentar el marcador del jugador 2
            this.actualizarMarcador(); // Actualizar el marcador en pantalla
            if (this.marcadorPata2 >= this.limitePuntos) {
                this.terminarJuego(); // Terminar el juego si el jugador 2 alcanza el límite de puntos
            } else {
                this.resetRound(); // Reiniciar la ronda si nadie ha ganado
            }
        } else if (this.bola1.x > 960 && !this.alguienGano) {
            this.alguienGano = true;
            this.marcadorPata1++; // Aumentar el marcador del jugador 1
            this.actualizarMarcador(); // Actualizar el marcador en pantalla
            if (this.marcadorPata1 >= this.limitePuntos) {
                this.terminarJuego(); // Terminar el juego si el jugador 1 alcanza el límite de puntos
            } else {
                this.resetRound(); // Reiniciar la ronda si nadie ha ganado
            }
        }
    
        // Actualizar la posición de las manos según las teclas presionadas
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
    
        // Limitar el movimiento de las manos para que no salgan de la escena
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
    
    actualizarMarcador() {
        // Actualizar el marcador en pantalla
        this.textoMarcadorPata1.setText(this.marcadorPata1.toString());
        this.textoMarcadorPata2.setText(this.marcadorPata2.toString());
    }
    
    

    pintarMarcador() {
        // Pintar el marcador en pantalla
        this.textoMarcadorPata1 = this.add.text(440, 75, this.marcadorPata1.toString(), {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.textoMarcadorPata2 = this.add.text(520, 75, this.marcadorPata2.toString(), {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    actualizarMarcador() {
        // Actualizar el marcador en pantalla
        this.textoMarcadorPata1.setText(this.marcadorPata1.toString());
        this.textoMarcadorPata2.setText(this.marcadorPata2.toString());
    }

    resetRound() {
        // Reiniciar la posición de las bolas
        this.bola1.setPosition(200, 320);
        this.bola2.setPosition(760, 320);
        
        // Generar nuevas velocidades para las bolas
        const velocidad = 500;
        let anguloInicial1 = Math.random() * Math.PI / 2 + Math.PI / 4;
        let anguloInicial2 = Math.random() * Math.PI / 2 + Math.PI / 4;

        // Direcciones opuestas para las bolas
        const vx1 = Math.sin(anguloInicial1) * velocidad;
        const vy1 = Math.cos(anguloInicial1) * velocidad;
        const vx2 = -Math.sin(anguloInicial2) * velocidad; // Dirección opuesta
        const vy2 = -Math.cos(anguloInicial2) * velocidad; // Dirección opuesta

        this.bola1.body.velocity.x = vx1;
        this.bola1.body.velocity.y = vy1;
        this.bola2.body.velocity.x = vx2;
        this.bola2.body.velocity.y = vy2;

        // Reiniciar el estado del juego
        this.alguienGano = false;
    }

    terminarJuego() {
        // Detener la música
        this.music.stop();

        // Reiniciar el marcador
        this.marcadorPata1 = 0;
        this.marcadorPata2 = 0;

        // Volver al nivel 1
        this.scene.start('Escena');
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
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Escena, Nivel2],
    pixelArt: true
};

const game = new Phaser.Game(config);
