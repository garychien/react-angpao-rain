import type * as Phaser from 'phaser';

export interface ShineButton {
    button: Phaser.GameObjects.Sprite
    /** Highlight sweep across the button, repeated forever */
    startShine: () => void
    /** Enable the button; `onPress` runs once, after the press-and-bounce animation */
    enable: (onPress: () => void) => void
}

/**
 * Image button with a highlight sweeping across it, clipped to the button shape by `btn-mask`.
 * Starts invisible and disabled.
 */
export const createShineButton = (
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    scale: number,
    pressedScale: number,
): ShineButton => {
    const button = scene.add.sprite(x, y, key).setScale(scale).setAlpha(0);

    const container = scene.add.container(x, y);
    const maskImage = scene.make.image({x, y, key: 'btn-mask'}, false).setScale(scale);
    container.setMask(maskImage.createBitmapMask());
    const highlight = scene.add.sprite(0, 0, 'button-highlight').setScale(scale).setAlpha(0);
    container.add(highlight);

    return {
        button,
        startShine: () => {
            highlight.x = -290;
            highlight.setAlpha(1);
            scene.tweens.add({
                targets: highlight,
                x: 290,
                duration: 1500,
                delay: 1500,
                ease: 'Cubic.easeIn',
                repeat: -1,
            });
        },
        enable: (onPress) => {
            button.setInteractive({useHandCursor: true});
            button.once('pointerdown', () => {
                button.disableInteractive();
                pressBounce(scene, [button, maskImage], scale, pressedScale, onPress);
            });
        },
    };
};

/** Shrink to `pressedScale`, bounce back to `scale`, then run `onDone` */
export const pressBounce = (
    scene: Phaser.Scene,
    targets: Phaser.GameObjects.GameObject[],
    scale: number,
    pressedScale: number,
    onDone: () => void,
) => {
    scene.tweens.add({
        targets,
        scale: pressedScale,
        duration: 150,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            scene.tweens.add({
                targets,
                scale,
                duration: 150,
                ease: 'Cubic.easeOut',
                onComplete: onDone,
            });
        },
    });
};
