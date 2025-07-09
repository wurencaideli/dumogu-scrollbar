/** 从文档上清除一个元素 */
export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
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
