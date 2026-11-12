import {useCallback, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

import styles from './angpao-rain.module.scss';
import AngpaoRain from './AngpaoRain';
import {defaultTheme} from './themes/default';
import type {AngpaoRainProps, DrawResult} from './types';

export interface AngpaoRainLauncherProps extends Omit<AngpaoRainProps, 'className' | 'style'> {
    /** Controlled open state. Leave undefined to let the launcher manage it. */
    open?: boolean
    /** Called whenever the launcher wants to open or close */
    onOpenChange?: (open: boolean) => void
    /** Initial open state when uncontrolled. Default false */
    defaultOpen?: boolean
    /** Close the overlay after the receive button is pressed. Default true */
    closeOnClaim?: boolean
    /** Hide the floating button, e.g. when opening through `open` only */
    hideButton?: boolean
    /** Image for the floating button. Defaults to the theme's `launcherImage` */
    buttonImage?: string
    /** Accessible label of the floating button. Default "Play angpao rain" */
    buttonLabel?: string
    /** Extra class on the floating button */
    buttonClassName?: string
}

/**
 * Floating button that opens the game in a full-screen overlay.
 */
const AngpaoRainLauncher = ({
    open: openProp,
    onOpenChange,
    defaultOpen = false,
    closeOnClaim = true,
    hideButton = false,
    buttonImage,
    buttonLabel = 'Play angpao rain',
    buttonClassName,
    onClose,
    onClaim,
    ...gameProps
}: AngpaoRainLauncherProps) => {
    const [openState, setOpenState] = useState(defaultOpen);
    const open = openProp ?? openState;
    const [defaultButtonImage, setDefaultButtonImage] = useState<string>();

    const setOpen = useCallback((value: boolean) => {
        if (openProp === undefined) setOpenState(value);
        onOpenChange?.(value);
    }, [openProp, onOpenChange]);

    const theme = gameProps.theme ?? defaultTheme;

    // the theme's button artwork, loaded lazily
    useEffect(() => {
        if (buttonImage || hideButton) return;
        const source = theme.launcherImage ?? defaultTheme.launcherImage;
        let cancelled = false;
        Promise.resolve(typeof source === 'function' ? source() : source)
            .then(url => {
                if (!cancelled) setDefaultButtonImage(url);
            })
            .catch(error => console.error(error));
        return () => {
            cancelled = true;
        };
    }, [buttonImage, hideButton, theme]);

    // lock page scroll while the game is open
    useEffect(() => {
        if (!open) return;
        const {overflow} = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [open]);

    const handleClose = useCallback(() => {
        setOpen(false);
        onClose?.();
    }, [setOpen, onClose]);

    const handleClaim = useCallback((result: DrawResult) => {
        onClaim?.(result);
        if (closeOnClaim) setOpen(false);
    }, [onClaim, closeOnClaim, setOpen]);

    const imageSrc = buttonImage ?? defaultButtonImage;

    return (
        <>
            {!hideButton && !open && imageSrc && (
                <button
                    type="button"
                    className={buttonClassName ? `${styles.launcherButton} ${buttonClassName}` : styles.launcherButton}
                    aria-label={buttonLabel}
                    onClick={() => setOpen(true)}
                >
                    <img src={imageSrc} alt="" draggable={false} />
                </button>
            )}

            {open && typeof document !== 'undefined' && createPortal(
                <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={buttonLabel}>
                    <AngpaoRain
                        {...gameProps}
                        onClose={handleClose}
                        onClaim={handleClaim}
                    />
                </div>,
                document.body,
            )}
        </>
    );
};

export default AngpaoRainLauncher;
