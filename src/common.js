export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
export function addElementClass(el, className) {
    el.classList.add(className);
}
export function removeElementClass(el, className) {
    el.classList.remove(className);
}
export function getElementRect(el) {
    return el.getBoundingClientRect();
}
export class BaseTools {
    isMounted = false;
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
