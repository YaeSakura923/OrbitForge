/* Copyright (C) 2025 orbitforge contributors */

export const delayedExecute = <T>(func: () => T, fast?: boolean): Promise<T> => {
    return new Promise(resolve => {
        window.setTimeout(
            () => {
                resolve(func());
            },
            fast ? 1 : 50
        );
    });
};
