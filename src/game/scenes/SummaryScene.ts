import * as Phaser from 'phaser';

import {EMPTY_DRAW_RESULT, FONT_FAMILY} from '../../config';
import type {DrawResult} from '../../types';
import {type GameContext, SCENE} from '../context';

/** How long the prize breakdown stays on screen before the result screen */
const SUMMARY_DURATION = 5000;

/**
 * Prize breakdown: one floating bubble per `DrawResult.counts` row.
 */
export class SummaryScene extends Phaser.Scene {
    private ctx: GameContext;
    private result: DrawResult = EMPTY_DRAW_RESULT;

    constructor(ctx: GameContext) {
        super({key: SCENE.summary});
        this.ctx = ctx;
    }

    init(data: {result?: DrawResult}) {
        this.result = data.result ?? EMPTY_DRAW_RESULT;
    }

    create(): void {
        const r = this.ctx.options.scaleRatio;
        const cx = this.cameras.main.displayWidth * 0.5;
        const top = this.cameras.main.displayHeight * 0.35;

        const title = this.add.sprite(cx, this.cameras.main.displayHeight * 0.2, 'result-title').setScale(r * 0.8).setAlpha(0);
        const titleY = title.y;
        title.y -= 200 * r;
        this.tweens.add({targets: title, alpha: 1, y: titleY, duration: 400, ease: 'Cubic.easeOut'});

        const positions = [
            [0, 0], [0, 260], [-260, 160], [260, 160], [-260, 360], [260, 360], [0, 460],
            [-260, 560], [260, 560], [0, 660], [-260, 760], [260, 760], [0, 860],
        ].map(([dx, dy]) => ({x: cx + dx * r, y: top + dy * r}));

        this.result.counts.slice(0, positions.length).forEach((row, i) => {
            const key = `result-angpao-${String(row.type + 1).padStart(2, '0')}`;
            const container = this.add.container(positions[i].x, positions[i].y).setAlpha(0);
            const bubble = this.add.sprite(0, 0, key).setScale(r * 0.6);
            const amount = this.add.text(bubble.displayWidth * 0.25, bubble.displayHeight * 0.25, `x${row.amount}`, {
                fontSize: `${40 * r}px`,
                fontFamily: FONT_FAMILY,
                color: this.ctx.colors.text,
            }).setAlpha(0);
            container.add([bubble, amount]);

            const destY = container.y;
            container.y += (100 + Phaser.Math.Between(0, 200)) * r;
            this.tweens.add({
                targets: container,
                alpha: 1,
                y: destY,
                duration: 500 + Phaser.Math.Between(0, 500),
                delay: 300 + i * 200 + Phaser.Math.Between(0, 100),
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.tweens.add({targets: amount, alpha: 1, duration: 400, ease: 'Cubic.easeOut'});
                    this.tweens.add({
                        targets: container,
                        y: container.y - (10 + Phaser.Math.Between(0, 10)) * r,
                        duration: 2000 + Phaser.Math.Between(0, 1000),
                        yoyo: true,
                        repeat: -1,
                    });
                },
            });
        });

        this.time.delayedCall(SUMMARY_DURATION, () => {
            this.scene.start(SCENE.result, {result: this.result});
        });
    }
}
