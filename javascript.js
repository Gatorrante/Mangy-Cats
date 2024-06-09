class Escena extends Phaser.Scene {
    preload(){
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('bola', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.image('mano1', 'img/mano1.png');
        this.load.image('mano2', 'img/mano2.png');
        this.load.image('leftbtn', 'img/flecha.png');
    }

    create(){
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.sprite(480,320, 'fondo');
        this.bola = this.physics.add.sprite(480,320,'bola');

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

        this.mano1 = this.physics.add.sprite(70,320, 'mano1');
        this.mano1.body.immovable = true;
        this.physics.add.collider(this.bola, this.mano1);

        this.mano2 = this.physics.add.sprite(882,320, 'mano2');
        this.mano2.body.immovable = true;
        this.physics.add.collider(this.bola, this.mano2);

        const velocidad = 500;
        let anguloInicial = Math.random()*Math.PI / 2 + Math.PI /4;
        const derechaOIzq = Math.floor(Math.random()*2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial)*velocidad;
        const vy = Math.cos(anguloInicial)*velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({ x:50, y:50 }, { x:50, y:590 }, this.mano1);
        this.controlesVisuales({ x:910, y:50 }, { x:910, y:590 }, this.mano2);

        this.alguienGano = false;
    }

    update(){
        this.bola.rotation += 0.1;

        if(this.bola.x < 0 && this.alguienGano === false) {
            alert('Player 1 has perdido');
            this.ColocarPelota();
        } else if (this.bola.x > 960 && this.alguienGano === false){
            alert('Player 2 has perdido');
            this.alguienGano = true;
            this.ColocarPelota();
        }

        if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1){
            this.mano1.y -= 5;
        } else if (this.cursors.down.isDown || this.mano1.getData('direccionVertical') === -1){
            this.mano1.y += 5;
        }

        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1){
            this.mano2.y -= 5;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1){
            this.mano2.y += 5;
        }

        // Limitar el movimiento de mano1 y mano2 para que no salgan de la escena
        if (this.mano1.y < 0) {
            this.mano1.y = 0;
        } else if (this.mano1.y > this.sys.game.config.height) {
            this.mano1.y = this.sys.game.config.height;
        }

        if (this.mano2.y < 0) {
            this.mano2.y = 0;
        } else if (this.mano2.y > this.sys.game.config.height) {
            this.mano2.y = this.sys.game.config.height;
        }
    }

    ColocarPelota() {
        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola.play('brillar');

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.physics.add.collider(this.bola, this.mano1);
        this.physics.add.collider(this.bola, this.mano2);

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
    scene: Escena,
    physics: {
        default: 'arcade',
    },
};

new Phaser.Game(config);