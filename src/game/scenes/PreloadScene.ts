import * as Phaser from 'phaser';

import {FONT_FAMILY} from '../../config';
import {THEME_IMAGE_SPEC} from '../../themes/spec';
import {IMAGE_FILES, SPRITESHEET_FILES, textureFileName,type TextureKey} from '../assets';
import {ANIM, type GameContext, SCENE} from '../context';

const LOADING_BAR_KEYS = ['loadingbar_bg', 'loadingbar_fill'] as const;

export class PreloadScene extends Phaser.Scene {
    private ctx: GameContext;
    private loadingText!: Phaser.GameObjects.Text;
    private loadingBarBg!: Phaser.GameObjects.Sprite;
    private loadingBarFill!: Phaser.GameObjects.Sprite;

    constructor(ctx: GameContext) {
        super({
            key: SCENE.preload,
            // the loading bar itself has to be available before preload() runs
            pack: {
                files: LOADING_BAR_KEYS.map(key => ({type: 'image', key, url: ctx.textures[key]})),
            },
        });
        this.ctx = ctx;
    }

    preload(): void {
        const camera = this.cameras.main;

        this.loadingText = this.add.text(camera.centerX, camera.centerY - 36, 'Loading: 0%', {
            fontSize: '24px',
            fontFamily: FONT_FAMILY,
            color: this.ctx.colors.text,
        }).setOrigin(0.5, 0.5);
        this.loadingBarBg = this.add.sprite(camera.centerX, camera.centerY, 'loadingbar_bg').setScale(0.5);
        this.loadingBarFill = this.add.sprite(camera.centerX, camera.centerY, 'loadingbar_fill').setScale(0.5);
        this.onProgress(0);
        this.load.on('progress', this.onProgress, this);

        for (const key of Object.keys(IMAGE_FILES) as (keyof typeof IMAGE_FILES)[]) {
            if ((LOADING_BAR_KEYS as readonly string[]).includes(key)) continue;
            this.load.image(key, this.ctx.textures[key]);
        }
        for (const [key, sheet] of Object.entries(SPRITESHEET_FILES) as [keyof typeof SPRITESHEET_FILES, typeof SPRITESHEET_FILES[keyof typeof SPRITESHEET_FILES]][]) {
            this.load.spritesheet(key, this.ctx.textures[key], {frameWidth: sheet.frameWidth, frameHeight: sheet.frameHeight});
        }
    }

    create(): void {
        this.anims.create({
            key: ANIM.playerSweat,
            frames: this.anims.generateFrameNumbers('player-sweat', {}),
            frameRate: 2,
            repeat: -1,
        });
        this.anims.create({
            key: ANIM.playerRunning,
            frames: this.anims.generateFrameNumbers('player-run', {}),
            frameRate: 4,
            repeat: -1,
        });

        this.load.off('progress', this.onProgress, this);
        this.checkTextures();
        this.loadingBarBg.destroy();
        this.loadingBarFill.destroy();
        this.loadingText.destroy();

        this.scene.start(SCENE.title);
    }

    /** Report images that failed to load (onError) and images whose size differs from the spec (console warning) */
    private checkTextures(): void {
        const prefix = `[react-angpao-rain] theme "${this.ctx.themeName}"`;
        const keys = [...Object.keys(IMAGE_FILES), ...Object.keys(SPRITESHEET_FILES)] as TextureKey[];
        // covers network errors as well as files that aren't valid images (which Phaser reports with no event)
        const failed = keys.filter(key => !this.textures.exists(key));
        if (failed.length) {
            const files = failed.map(textureFileName);
            const error = new Error(`${prefix}: ${files.length} image(s) failed to load: ${files.join(', ')}`);
            const {onError} = this.ctx.callbacks.current;
            if (onError) onError(error);
            else console.error(error);
        }

        const wrongSize: string[] = [];
        for (const key of keys) {
            if (failed.includes(key)) continue;
            const file = textureFileName(key);
            const {width, height} = this.textures.get(key).getSourceImage();
            const spec = THEME_IMAGE_SPEC[file];
            if (width !== spec.width || height !== spec.height) {
                wrongSize.push(`${file} is ${width}x${height}, expected ${spec.width}x${spec.height}`);
            }
        }
        if (wrongSize.length) console.warn(`${prefix}: image size differs from the spec:\n${wrongSize.join('\n')}`);
    }

    private onProgress(value: number): void {
        // crop instead of resizing the texture frame, so the shared frame is never mutated
        this.loadingBarFill.setCrop(0, 0, Math.max(1, Math.floor(this.loadingBarFill.width * value)), this.loadingBarFill.height);
        this.loadingText.setText(`Loading: ${Math.floor(value * 100)}%`);
    }
}
