import * as Phaser from 'phaser';

import {type GameContext, SCENE} from '../context';
import {createShineButton, pressBounce} from './shared';

export class TitleScene extends Phaser.Scene {
    private ctx: GameContext;

    constructor(ctx: GameContext) {
        super({key: SCENE.title});
        this.ctx = ctx;
    }

    create(): void {
        const r = this.ctx.options.scaleRatio;
        const lang = this.ctx.lang;
        const cx = this.cameras.main.displayWidth * 0.5;
        const cy = this.cameras.main.displayHeight * 0.4;

        this.add.sprite(cx, cy, 'title-glow').setScale(r * 0.8);

        // created in this order so the draw order matches the original artwork layout
        const angpao01 = this.add.sprite(cx - 50 * r, cy - 350 * r, 'title-angpao').setScale(r * 0.4).setAlpha(0);
        const angpao02 = this.add.sprite(cx + 380 * r, cy + 250 * r, 'title-angpao').setScale(r * 0.6).setAlpha(0);
        const angpao03 = this.add.sprite(cx - 100 * r, cy + 300 * r, 'title-angpao').setScale(r).setAlpha(0);
        const coin01 = this.add.sprite(cx + 250 * r, cy - 250 * r, 'title-coin-01').setScale(r * 0.5).setAlpha(0);
        const coin02 = this.add.sprite(cx + 150 * r, cy + 320 * r, 'title-coin-02').setScale(r * 0.5).setAlpha(0);
        const coin03 = this.add.sprite(cx - 300 * r, cy - 200 * r, 'title-coin-03').setScale(r * 0.5).setAlpha(0);
        // animation order
        const angpaoList = [angpao03, angpao02, angpao01];
        const coinList = [coin02, coin03, coin01];
        const starList = [
            this.add.sprite(cx - 480 * r, cy + 250 * r, 'star-01').setScale(r * 0.5).setAlpha(0),
            this.add.sprite(cx - 350 * r, cy + 550 * r, 'star-01').setScale(r * 0.5).setAlpha(0),
        ];

        // masthead pops in
        const masthead = this.add.sprite(cx, cy, 'title-masthead').setScale(r * 0.15).setAlpha(0);
        this.tweens.add({
            targets: masthead,
            scale: 1.1 * r * 0.8,
            alpha: 1,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({targets: masthead, scale: r * 0.8, duration: 100, ease: 'Cubic.easeOut'});
            },
        });

        angpaoList.forEach((angpao, i) => {
            const originX = angpao.x;
            const originY = angpao.y;
            angpao.x += 150 * r;
            angpao.y -= 150 * r;
            this.tweens.add({
                targets: angpao,
                x: originX,
                y: originY,
                alpha: 1,
                duration: 300,
                delay: (i + 1) * 150,
                ease: 'Cubic.easeOut',
            });
        });

        coinList.forEach((coin, i) => {
            this.tweens.add({
                targets: coin,
                alpha: 1,
                duration: 300,
                delay: i * 150 + 600,
                ease: 'Cubic.easeOut',
                onComplete: () => this.floatingCoin(coin),
            });
        });

        starList.forEach((star, i) => {
            this.tweens.add({
                targets: star,
                scale: 1,
                alpha: 1,
                duration: 300,
                delay: i * 150 + 900,
                ease: 'Cubic.easeIn',
                onComplete: () => this.blinkingStar(star),
            });
        });

        // start button
        const start = createShineButton(this, cx, cy + 630 * r, `btn-start-${lang}`, r * 0.8, r * 0.7);
        this.tweens.add({
            targets: start.button,
            alpha: 1,
            duration: 500,
            delay: 900,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                start.startShine();
                start.enable(() => this.scene.start(SCENE.game));
            },
        });

        // close button
        const close = this.add.sprite(cx, cy + 750 * r, 'btn-close').setScale(r * 0.8).setAlpha(0);
        this.tweens.add({
            targets: close,
            alpha: 1,
            duration: 500,
            delay: 1150,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                close.setInteractive({useHandCursor: true});
                // ignore presses while the bounce plays, so one tap calls onClose once;
                // re-enabled afterwards in case the host keeps the game open
                close.on('pointerdown', () => {
                    close.disableInteractive();
                    pressBounce(this, [close], r * 0.8, r * 0.7, () => {
                        close.setInteractive({useHandCursor: true});
                        this.ctx.callbacks.current.onClose?.();
                    });
                });
            },
        });
    }

    private floatingCoin(coin: Phaser.GameObjects.Sprite): void {
        this.tweens.add({
            targets: coin,
            y: coin.y - 30 * this.ctx.options.scaleRatio,
            duration: 1000 + Phaser.Math.Between(500, 1000),
            yoyo: true,
            repeat: -1,
        });
    }

    private blinkingStar(star: Phaser.GameObjects.Sprite): void {
        const r = this.ctx.options.scaleRatio;
        this.tweens.add({
            targets: star,
            scale: r,
            duration: 100,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: star,
                    alpha: 0.2,
                    scale: r * 0.8,
                    duration: 1000 + Phaser.Math.Between(500, 1000),
                    yoyo: true,
                    repeat: -1,
                });
            },
        });
    }
}
