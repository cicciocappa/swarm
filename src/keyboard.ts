// input
type KeyState = { [key: string]: boolean };
const keys: KeyState = {};

export function setupInput(): void {
    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
        //console.log(event.key);
    });

    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });
}

export function isKeyPressed(key: string): boolean {
    return keys[key] || false;
}