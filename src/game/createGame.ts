import * as Phaser from 'phaser';

import type {GameContext} from './context';
import {GameScene} from './scenes/GameScene';
import {PreloadScene} from './scenes/PreloadScene';
import {ResultScene} from './scenes/ResultScene';
import {SummaryScene} from './scenes/SummaryScene';
import {TitleScene} from './scenes/TitleScene';

export const createGame = (parent: HTMLElement, ctx: GameContext, width: number, height: number) => {
    return new Phaser.Game({
        type: Phaser.WEBGL,
        parent,
        backgroundColor: '#00000000',
        transparent: true,
        banner: false,
        physics: {
            default: 'arcade',
            arcade: {gravity: {x: 0, y: 0}, debug: false},
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width,
            height,
        },
        fps: {target: 60, forceSetTimeOut: true},
        scene: [
            new PreloadScene(ctx),
            new TitleScene(ctx),
            new GameScene(ctx),
            new SummaryScene(ctx),
            new ResultScene(ctx),
        ],
    });
};
