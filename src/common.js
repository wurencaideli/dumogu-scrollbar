export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
export class BaseTools {
    isMounted = true;
    isDestroyed = false;
    constructor() {}
    destroy() {
        this.isDestroyed = true;
    }
    mount() {
        this.isMounted = true;
    }
    unmount() {
        this.isMounted = false;
    }
}
