import * as Phaser from 'phaser';

import {EMPTY_DRAW_RESULT, FONT_FAMILY} from '../../config';
import type {DrawResult} from '../../types';
import {ANIM, type GameContext, SCENE} from '../context';
import {createShineButton} from './shared';

/**
 * "Congratulations" screen with the total prize and the receive button.
 */
export class ResultScene extends Phaser.Scene {
    private ctx: GameContext;
    private result: DrawResult = EMPTY_DRAW_RESULT;

    constructor(ctx: GameContext) {
        super({key: SCENE.result});
        this.ctx = ctx;
    }

    init(data: {result?: DrawResult}) {
        this.result = data.result ?? EMPTY_DRAW_RESULT;
    }

    create(): void {
        const r = this.ctx.options.scaleRatio;
        const lang = this.ctx.lang;
        const cx = this.cameras.main.displayWidth * 0.5;
        const h = this.cameras.main.displayHeight;

        // glare
        const glareContainer = this.add.container(cx, h * 0.6);
        const glare = this.add.sprite(0, 0, 'glare').setScale(r * 0.95).setAlpha(0);
        glareContainer.add(glare);

        // background
        const frame = this.add.sprite(cx, h * 0.6, 'result-box-bg').setScale(r).setAlpha(0);
        const angpao = this.add.sprite(cx, h * 0.25, 'result-angpao-bg').setScale(r * 0.1).setAlpha(0);

        // player running
        const player = this.add.sprite(cx, h * 0.25 + 90, 'player-run').setOrigin(0.5, 1).setScale(r * 0.1).setAlpha(0);
        player.play(ANIM.playerRunning);

        // banner
        const congratulations = this.add.sprite(cx, h * 0.45 - 20 * r, 'result-congratulations').setScale(r * 1.8).setAlpha(0);
        const received = this.add.sprite(cx, h * 0.6 - 40 * r, `result-text-received-${lang}`).setScale(r).setAlpha(0);

        // total
        const total = this.add.text(cx, h * 0.6 + 70 * r, this.ctx.formatAmount(this.result.result), {
            fontStyle: 'bold',
            fontSize: `${70 * r}px`,
            fontFamily: FONT_FAMILY,
            color: this.ctx.colors.total,
        }).setOrigin(0.5, 0.5).setAlpha(0).setScale(0.1);

        // receive button
        const receive = createShineButton(this, cx, h * 0.6 + 220 * r, `btn-receive-${lang}`, r * 0.65, r * 0.6);
        receive.startShine();

        // animations
        this.tweens.add({targets: glareContainer, alpha: 0.5, duration: 1000, yoyo: true, repeat: -1});
        this.tweens.add({targets: glare, alpha: 1, duration: 500, delay: 450, ease: 'Cubic.easeOut'});

        const frameY = frame.y;
        frame.y += 200 * r;
        this.tweens.add({targets: frame, alpha: 1, y: frameY, duration: 300, ease: 'Cubic.easeOut'});

        this.tweens.add({
            targets: angpao,
            scale: r * 1.3,
            alpha: 1,
            duration: 500,
            delay: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({targets: angpao, scale: r * 1.2, duration: 1500, yoyo: true, repeat: -1});
            },
        });

        this.time.delayedCall(450, () => player.setAlpha(1));
        this.tweens.add({
            targets: player,
            scale: r,
            y: player.y + 40,
            duration: 2000,
            delay: 450,
            ease: 'Cubic.easeOut',
            onComplete: () => player.stop(),
        });

        this.tweens.add({targets: congratulations, scale: r, alpha: 1, duration: 500, delay: 800, ease: 'Cubic.easeOut'});
        this.tweens.add({targets: received, alpha: 1, duration: 400, delay: 1200, ease: 'Cubic.easeOut'});
        this.tweens.add({
            targets: total,
            scale: 1.1,
            alpha: 1,
            duration: 400,
            delay: 1600,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({targets: total, scale: 1, duration: 200});
            },
        });
        this.tweens.add({
            targets: receive.button,
            alpha: 1,
            duration: 400,
            delay: 1800,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                receive.enable(() => this.ctx.callbacks.current.onClaim?.(this.result));
            },
        });
    }
}
