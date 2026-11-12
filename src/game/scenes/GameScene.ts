import * as Phaser from 'phaser';

import {EMPTY_DRAW_RESULT, FONT_FAMILY, formatRemainingTime, normalizeDrawResult} from '../../config';
import type {DrawResult} from '../../types';
import {ANIM, type GameContext, SCENE} from '../context';

type Bag = Phaser.Physics.Arcade.Sprite & {
    speed: number,
    collected: boolean,
    animate: boolean,
}

type Star = Phaser.GameObjects.Sprite & {
    speed: number,
    shine?: Phaser.Tweens.Tween,
}

type GameStatus = 'countdown' | 'started' | 'ended';

/** Countdown steps: "ready" → 3 → 2 → 1 → "go" */
const COUNTDOWN_STEPS: {sprite: string, type: 'text' | 'num'}[] = [
    {sprite: 'countdown-ready', type: 'text'},
    {sprite: 'countdown-03', type: 'num'},
    {sprite: 'countdown-02', type: 'num'},
    {sprite: 'countdown-01', type: 'num'},
    {sprite: 'countdown-go', type: 'text'},
];

/**
 * Main gameplay: angpao fall from the sky, the player moves left / right to catch them.
 */
export class GameScene extends Phaser.Scene {
    private ctx: GameContext;

    private status: GameStatus = 'countdown';
    private r = 1;
    private speed = 0;
    private screenWidth = 0;
    private screenHeight = 0;
    private destX = 0;
    private destDirection = 1;
    private score = 0;
    private remainingTime = 0;
    private countdownIndex = 0;
    private drawPromise: Promise<DrawResult> | null = null;

    private bagGroup!: Phaser.Physics.Arcade.Group;
    private starGroup!: Phaser.GameObjects.Group;
    private overlay!: Phaser.GameObjects.Group;
    private player!: Phaser.GameObjects.Container;
    private playerGlow!: Phaser.GameObjects.Sprite;
    private playerBagGlow!: Phaser.GameObjects.Sprite;
    private bagFront!: Phaser.GameObjects.Sprite;
    private catchArea!: Phaser.GameObjects.Rectangle;
    private playerSweat!: Phaser.GameObjects.Sprite;

    private scoreText!: Phaser.GameObjects.Text;
    private timerBarTop!: Phaser.GameObjects.Sprite;
    private timeText!: Phaser.GameObjects.Text;
    private gameTimer!: Phaser.Time.TimerEvent;
    private gameTimeProgress!: Phaser.Time.TimerEvent;

    private countdownText!: Phaser.GameObjects.Sprite;
    private countdownAngpao!: Phaser.GameObjects.Sprite;
    private countdownCoin!: Phaser.GameObjects.Sprite;
    private countdownStar!: Phaser.GameObjects.Sprite;
    private countdownLine!: Phaser.GameObjects.Sprite;
    private countdownRing!: Phaser.GameObjects.Sprite;
    private countdownFunnel!: Phaser.GameObjects.Sprite;
    private timeUpWrapper!: Phaser.GameObjects.Container;

    constructor(ctx: GameContext) {
        super({key: SCENE.game});
        this.ctx = ctx;
    }

    create(): void {
        const options = this.ctx.options;
        const r = options.scaleRatio;
        this.r = r;
        this.status = 'countdown';
        this.speed = options.baseSpeed * r;
        this.score = 0;
        this.countdownIndex = 0;
        this.drawPromise = null;
        this.screenWidth = this.cameras.main.displayWidth;
        this.screenHeight = this.cameras.main.displayHeight;
        this.destX = this.screenWidth * 0.5;

        this.bagGroup = this.physics.add.group({maxSize: 100});
        this.starGroup = this.add.group({defaultKey: 'star-01', maxSize: 100});
        this.overlay = this.add.group();

        // player and catch area (the player starts below the screen and jumps in on "go")
        this.player = this.add.container(this.destX, this.screenHeight + 300 * r);
        this.playerGlow = this.add.sprite(0, 0, 'player-glow').setScale(r).setAlpha(0);
        const basket = this.add.sprite(0, 0, 'player').setScale(r);
        this.playerBagGlow = this.add.sprite(this.player.x, this.player.y, 'player-bag-glow').setScale(r).setAlpha(0).setDepth(1);
        this.bagFront = this.add.sprite(this.player.x, this.player.y, 'player-bag').setScale(r).setDepth(1);
        this.catchArea = this.add.rectangle(85 * r, 30 * r, 120, 10, 0xff6699).setScale(r).setAlpha(0);
        this.player.add([this.playerGlow, basket, this.catchArea]);
        this.physics.add.existing(this.catchArea);
        this.physics.add.overlap(this.catchArea, this.bagGroup, (_area, bag) => this.catchBag(bag as Bag));

        // score
        this.overlay.add(this.add.sprite(this.screenWidth - 200 * r, 60 * r, 'icon-score').setScale(r));
        this.scoreText = this.add.text(this.screenWidth - 150 * r, 30 * r, 'x 00', {
            fontStyle: 'bold',
            fontSize: `${50 * r}px`,
            fontFamily: FONT_FAMILY,
            color: this.ctx.colors.text,
        });
        this.overlay.add(this.scoreText);

        // timer
        this.overlay.add(this.add.sprite(85 * r, 60 * r, 'timer-bar-bottom').setScale(r).setOrigin(0, 0.5));
        this.timerBarTop = this.add.sprite(85 * r, 60 * r, 'timer-bar-top').setScale(r).setOrigin(0, 0.5);
        this.overlay.add(this.timerBarTop);
        this.overlay.add(this.add.sprite(60 * r, 60 * r, 'timer-icon').setScale(r));
        this.timeText = this.add.text(30 * r, 100 * r, formatRemainingTime(options.totalTime), {
            fontSize: `${30 * r}px`,
            fontFamily: `"Arial", ${FONT_FAMILY}`,
            color: this.ctx.colors.text,
        });
        this.overlay.add(this.timeText);

        this.input.topOnly = true;

        // shown when time is up, parked off-screen until then
        this.playerSweat = this.add.sprite(this.screenWidth * 2, this.screenHeight * 2, 'player-sweat').setScale(r);

        this.startCountDown();
    }

    update(): void {
        if (this.status !== 'started') return;

        // move the basket towards the pointer
        if (this.player.x !== this.destX) {
            this.player.x += this.ctx.options.basketSpeed * this.r * this.destDirection;
            if (this.destDirection === -1 ? this.player.x < this.destX : this.player.x > this.destX) {
                this.player.x = this.destX;
            }
            this.bagFront.x = this.player.x;
            this.playerBagGlow.x = this.player.x;
        }

        this.bagGroup.children.iterate((child) => {
            const bag = child as Bag;
            if (!bag.active || bag.animate) return true;
            bag.y += bag.speed;
            if (bag.y >= this.player.y + 20 * this.r - bag.displayHeight * 0.4) {
                // too low, can no longer be caught; fall in front of the bag
                bag.collected = true;
                bag.setDepth(2);
            }
            if (bag.y > this.screenHeight) this.bagGroup.killAndHide(bag);
            return true;
        });

        this.starGroup.children.iterate((child) => {
            const star = child as Star;
            if (!star.active) return true;
            star.y += star.speed;
            if (star.y > this.screenHeight) this.starGroup.killAndHide(star);
            return true;
        });

        const remaining = 1 - this.gameTimeProgress.getProgress();
        this.timerBarTop.setCrop(0, 0, this.timerBarTop.width * remaining, this.timerBarTop.height);
    }

    private catchBag(bag: Bag): void {
        if (bag.collected) return;
        bag.collected = true;
        bag.animate = true;
        const r = this.r;

        this.score += 1;
        this.scoreText.setText(`x ${String(this.score).padStart(2, '0')}`);

        // bag flies into the player's sack
        this.tweens.add({
            targets: bag,
            x: this.player.x + 50 * r,
            y: bag.y + 80 * r,
            scale: 0.2,
            alpha: 0,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => this.bagGroup.killAndHide(bag),
        });

        // +1
        const plusOne = this.add.sprite(this.player.x + 135 * r, this.player.y + 30 * r, 'plus-one').setAlpha(0).setScale(r * 0.5);
        this.tweens.add({
            targets: plusOne,
            y: plusOne.y - 100 * r,
            alpha: 1,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: plusOne,
                    alpha: 0,
                    delay: 300,
                    duration: 300,
                    ease: 'Cubic.easeOut',
                    onComplete: () => plusOne.destroy(),
                });
            },
        });

        // player glow
        for (const glow of [this.playerGlow, this.playerBagGlow]) {
            this.tweens.killTweensOf(glow);
            this.tweens.add({
                targets: glow,
                alpha: 1,
                duration: 200,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.tweens.add({targets: glow, alpha: 0, duration: 300, ease: 'Cubic.easeIn'});
                },
            });
        }
    }

    /* ---------- countdown ---------- */

    private startCountDown(): void {
        const r = this.r;
        const cx = this.screenWidth * 0.5;
        const cy = this.screenHeight * 0.5;
        const step = COUNTDOWN_STEPS[0];

        this.countdownFunnel = this.add.sprite(cx + 100, cy - 170, 'countdown-funnel').setScale(r * 0.1).setAlpha(0);
        this.countdownRing = this.add.sprite(cx - 100, cy + 30, 'countdown-blue-ring').setScale(r * 0.1).setAlpha(0);
        this.countdownLine = this.add.sprite(cx, cy, `countdown-line-${step.type}`).setScale(r * 0.1).setAlpha(0);
        this.countdownAngpao = this.add.sprite(cx, cy, `countdown-angpao-${step.type}`).setScale(r * 0.1).setAlpha(0);
        this.countdownCoin = this.add.sprite(cx, cy, `countdown-coin-${step.type}`).setScale(r * 0.1).setAlpha(0);
        this.countdownStar = this.add.sprite(cx, cy, `countdown-star-${step.type}`).setScale(r).setAlpha(0);
        this.countdownText = this.add.sprite(cx, cy, step.sprite).setScale(r * 0.1).setAlpha(0);

        this.animateCountDown();
    }

    private animateCountDown(): void {
        this.tweens.killTweensOf([
            this.countdownFunnel, this.countdownRing, this.countdownAngpao, this.countdownCoin,
            this.countdownLine, this.countdownStar, this.countdownText,
        ]);

        if (COUNTDOWN_STEPS[this.countdownIndex].type === 'text') {
            this.animTextIn();
        } else {
            this.animBounceIn(this.countdownAngpao, 200, 0);
            this.animBounceIn(this.countdownCoin, 200, 80);
            this.animBounceIn(this.countdownLine, 200, 50);
            this.animFadeIn(this.countdownStar, 200, 50);
            this.animBounceIn(this.countdownText, 200, 100);
        }

        this.time.delayedCall(600, this.animateCountDownOut, [], this);
        this.time.delayedCall(1000, this.nextCountDown, [], this);

        // the player jumps in on "go"
        if (this.countdownIndex === COUNTDOWN_STEPS.length - 1) {
            this.tweens.add({
                targets: this.player,
                y: this.screenHeight - 120 * this.r,
                duration: 300,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.bagFront.y = this.player.y;
                    this.playerBagGlow.y = this.player.y;
                },
            });
        }
    }

    private animateCountDownOut(): void {
        if (COUNTDOWN_STEPS[this.countdownIndex].type === 'text') {
            this.animBounceOut(this.countdownCoin, 300, 0);
            this.animBounceOut(this.countdownFunnel, 300, 50);
            this.animOut(this.countdownRing, 300, 100);
        } else {
            this.animBounceOut(this.countdownCoin, 300, 0);
        }
        this.animOut(this.countdownAngpao, 300, COUNTDOWN_STEPS[this.countdownIndex].type === 'text' ? 100 : 50);
        this.animOut(this.countdownLine, 300, 100);
        this.animFadeOut(this.countdownStar, 300, 100);
        this.animOut(this.countdownText, 300, 150);
    }

    private nextCountDown(): void {
        this.countdownIndex++;
        if (this.countdownIndex >= COUNTDOWN_STEPS.length) {
            this.gameStart();
            return;
        }

        const r = this.r;
        const step = COUNTDOWN_STEPS[this.countdownIndex];
        this.countdownLine.setTexture(`countdown-line-${step.type}`).setAlpha(0).setScale(r * 0.1);
        this.countdownAngpao.setTexture(`countdown-angpao-${step.type}`).setAlpha(0).setScale(r * 0.1);
        this.countdownCoin.setTexture(`countdown-coin-${step.type}`).setAlpha(0).setScale(r * 0.1);
        this.countdownStar.setTexture(`countdown-star-${step.type}`).setAlpha(0);
        this.countdownText.setTexture(step.sprite).setAlpha(0).setScale(r * 0.1);
        this.countdownRing.setScale(r * 0.1);
        this.countdownFunnel.setScale(r * 0.1);

        this.animateCountDown();
    }

    /** Full "text" pop-in (ready / go / time up) */
    private animTextIn(): void {
        this.animBounceIn(this.countdownFunnel, 200, 0);
        this.animBounceIn(this.countdownRing, 200, 50);
        this.animBounceIn(this.countdownAngpao, 200, 150);
        this.animBounceIn(this.countdownCoin, 200, 180);
        this.animBounceIn(this.countdownLine, 200, 150);
        this.animFadeIn(this.countdownStar, 200, 150);
        this.animBounceIn(this.countdownText, 200, 200);
    }

    private animBounceIn(sprite: Phaser.GameObjects.Sprite, duration: number, delay: number): void {
        this.tweens.add({
            targets: sprite,
            alpha: 1,
            scale: this.r * 1.1,
            duration,
            delay,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({targets: sprite, scale: this.r, duration: 100, ease: 'Cubic.easeOut'});
            },
        });
    }

    private animFadeIn(sprite: Phaser.GameObjects.Sprite, duration: number, delay: number): void {
        this.tweens.add({targets: sprite, alpha: 1, duration, delay, ease: 'Cubic.easeIn'});
    }

    private animBounceOut(sprite: Phaser.GameObjects.Sprite, duration: number, delay: number): void {
        this.tweens.add({
            targets: sprite,
            scale: this.r * 0.9,
            alpha: 0,
            duration: 200,
            delay,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.tweens.add({targets: sprite, scale: 1, alpha: 0, duration, ease: 'Cubic.easeOut'});
            },
        });
    }

    private animOut(sprite: Phaser.GameObjects.Sprite, duration: number, delay: number): void {
        this.tweens.add({targets: sprite, scale: 1, alpha: 0, duration, delay, ease: 'Cubic.easeIn'});
    }

    private animFadeOut(sprite: Phaser.GameObjects.Sprite, duration: number, delay: number): void {
        this.tweens.add({targets: sprite, alpha: 0, duration, delay, ease: 'Cubic.easeIn'});
    }

    /* ---------- gameplay ---------- */

    private gameStart(): void {
        const totalTime = this.ctx.options.totalTime;
        this.status = 'started';
        this.remainingTime = totalTime;
        this.gameTimer = this.time.addEvent({delay: 1000, callback: this.onTick, callbackScope: this, loop: true});
        this.gameTimeProgress = this.time.addEvent({delay: totalTime * 1000});

        // move with mouse, finger drag, or tap
        this.input.on('pointermove', this.onPointer, this);
        this.input.on('pointerdown', this.onPointer, this);

        this.scheduleBag();
        this.scheduleStar();
    }

    private onPointer(pointer: Phaser.Input.Pointer): void {
        this.destX = Phaser.Math.Clamp(pointer.x, 100, this.screenWidth - 100);
        this.destDirection = this.destX > this.player.x ? 1 : -1;
    }

    private onTick(): void {
        this.remainingTime--;
        this.timeText.setText(formatRemainingTime(this.remainingTime));

        if (this.remainingTime <= 0) {
            this.gameTimer.remove(false);
            this.gameOver();
        }
    }

    private scheduleBag(): void {
        this.time.delayedCall(168 * Phaser.Math.Between(5, 11), this.addBag, [], this);
    }

    private scheduleStar(): void {
        this.time.delayedCall(100 * Phaser.Math.Between(3, 7), this.addStar, [], this);
    }

    private addBag(): void {
        if (this.status !== 'started') return;
        const bag = this.bagGroup.get(Phaser.Math.Between(80, this.screenWidth - 80), Phaser.Math.Between(-150, -50), 'angpao') as Bag | null;
        if (bag) this.activateBag(bag);
        this.scheduleBag();
    }

    private activateBag(bag: Bag): void {
        const options = this.ctx.options;
        this.speed *= options.incrementRatio;

        bag.speed = this.speed + Phaser.Math.Between(options.minSpeedOffset, options.maxSpeedOffset) * 0.2;
        bag.collected = false;
        bag.animate = false;

        if (bag.x + bag.displayWidth > this.screenWidth) bag.x -= bag.displayWidth;
        if (bag.x < 0) bag.x += bag.displayWidth;

        bag
            .setTexture('angpao')
            .setActive(true)
            .setVisible(true)
            .setAlpha(1)
            .setDepth(0)
            .setScale(this.r)
            .setOrigin(0.5);
        bag.rotation = 0;
        bag.setAngularVelocity(Phaser.Math.Between(0, 1) === 1 ? -80 : 80);
        (bag.body as Phaser.Physics.Arcade.Body).setSize(150, 195, false);

        // HUD always on top
        this.overlay.setDepth(10);
    }

    private addStar(): void {
        if (this.status !== 'started') return;
        const star = this.starGroup.get(Phaser.Math.Between(60, this.screenWidth - 60), Phaser.Math.Between(-150, -50)) as Star | null;
        if (star) this.activateStar(star);
        this.scheduleStar();
    }

    private activateStar(star: Star): void {
        const options = this.ctx.options;
        star
            .setActive(true)
            .setVisible(true)
            .setAlpha(0.5)
            .setScale(this.r * 0.1)
            .setOrigin(0.5);
        star.speed = this.speed + Phaser.Math.Between(options.minSpeedOffset, options.maxSpeedOffset) * 0.2;
        star.shine?.remove();
        star.shine = this.tweens.add({
            targets: star,
            alpha: 1,
            scale: (0.3 + Math.random() * 0.5) * this.r * 0.8,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Cubic.easeOut',
        });
    }

    /* ---------- game over ---------- */

    private gameOver(): void {
        this.status = 'ended';
        this.input.off('pointermove', this.onPointer, this);
        this.input.off('pointerdown', this.onPointer, this);

        const score = this.score;
        this.ctx.callbacks.current.onGameOver?.({score, time: this.ctx.options.totalTime - this.remainingTime});
        // ask for the prize right away, so it is usually ready by the time the animation ends
        this.drawPromise = this.requestDraw(score);

        this.bagGroup.children.iterate((child) => {
            const bag = child as Bag;
            bag.setAngularVelocity(0);
            bag.setAlpha(0.5);
            return true;
        });
        this.starGroup.children.iterate((child) => {
            const star = child as Star;
            star.shine?.pause();
            star.setAlpha(0);
            return true;
        });
        this.overlay.children.iterate((child) => {
            (child as Phaser.GameObjects.Sprite).setAlpha(0.5);
            return true;
        });

        // swap in the sweating player
        this.playerSweat.setDepth(10);
        this.playerSweat.x = this.player.x;
        this.playerSweat.y = this.player.y + 38 * this.r;
        this.playerSweat.play(ANIM.playerSweat);
        this.player.y = this.screenHeight * 2;
        this.bagFront.y = this.player.y;
        this.playerBagGlow.y = this.player.y;
        this.catchArea.x = -9999;

        // everything of the "time up" message goes in one container for the exit transition
        this.timeUpWrapper = this.add.container(this.screenWidth * 0.5, this.screenHeight * 0.5 - 100 * this.r);
        this.timeUpWrapper.add(this.countdownText);
        this.countdownText.setPosition(0, 0);

        this.animateTimeUp();
    }

    private async requestDraw(score: number): Promise<DrawResult> {
        const {onDraw, onError} = this.ctx.callbacks.current;
        try {
            return normalizeDrawResult(await onDraw({score}));
        } catch (error) {
            onError?.(error);
            return EMPTY_DRAW_RESULT;
        }
    }

    private animateTimeUp(): void {
        const r = this.r;
        this.countdownText.setTexture('text-time-up');
        for (const sprite of [this.countdownLine, this.countdownAngpao, this.countdownCoin, this.countdownText]) {
            sprite.setAlpha(0).setScale(r * 0.1);
        }
        this.countdownStar.setAlpha(0);
        this.countdownRing.setScale(r * 0.1);
        this.countdownFunnel.setScale(r * 0.1);

        this.animTextIn();

        // shake
        this.timeUpWrapper.angle = -5;
        this.tweens.add({
            targets: this.timeUpWrapper,
            angle: 5,
            duration: 100,
            yoyo: true,
            repeat: 20,
            onComplete: () => {
                this.timeUpWrapper.angle = 0;
                this.wrapTimeUpElements();
                this.exitToSummary();
            },
        });
    }

    private wrapTimeUpElements(): void {
        this.timeUpWrapper.add([
            this.countdownFunnel, this.countdownRing, this.countdownLine,
            this.countdownAngpao, this.countdownCoin, this.countdownStar,
        ]);
        this.countdownFunnel.setPosition(100, -170);
        this.countdownRing.setPosition(-100, 30);
        for (const sprite of [this.countdownLine, this.countdownAngpao, this.countdownCoin, this.countdownStar]) {
            sprite.setPosition(0, 0);
        }
    }

    private exitToSummary(): void {
        const drop = this.screenHeight * 1.5;
        const fallTargets = [
            ...this.bagGroup.getChildren(),
            ...this.starGroup.getChildren(),
            this.playerSweat,
        ] as Phaser.GameObjects.Sprite[];
        for (const target of fallTargets) {
            this.tweens.add({targets: target, y: target.y + drop, duration: 1000});
        }
        this.tweens.add({targets: this.overlay.getChildren(), alpha: 0, duration: 500});

        this.tweens.add({
            targets: this.timeUpWrapper,
            y: this.timeUpWrapper.y + drop,
            duration: 1000,
            onComplete: async () => {
                const result = await (this.drawPromise ?? this.requestDraw(this.score));
                if (!this.ctx.alive) return;
                this.scene.start(SCENE.summary, {result});
            },
        });
    }
}
