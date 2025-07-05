import { BaseTools } from './common';

/**
 * 滚动容器的body
 */
export class Scrollbar extends BaseTools {
    targetEl;
    scrollbarEl;
    scrollbarTargetEl;
    constructor(targetEl, option) {
        super();
        this.targetEl = targetEl;
        this.scrollbarEl = document.createElement('div');
        this.scrollbarTargetEl = document.createElement('div');
        this.scrollbarEl.classList.add('dumogu-scrollbar');
        this.scrollbarTargetEl.classList.add('dumogu-scrollbar-target');
    }
    /** 计算位置 */
    computedPosition(params) {
        if (!this.isMounted || this.isDestroyed) return;
        const targetEl = this.targetEl;
        const scrollbarTargetEl = this.scrollbarTargetEl;
        const targetElRect = params.targetElRect || targetEl.getBoundingClientRect();
        scrollbarTargetEl.style.width = targetElRect.width + 'px';
        scrollbarTargetEl.style.height = targetElRect.height + 'px';
        scrollbarTargetEl.style.top = targetElRect.y + 'px';
        scrollbarTargetEl.style.left = targetElRect.x + 'px';
    }
    destroy() {
        this.unmount();
        this.targetEl = undefined;
        this.scrollbarEl = undefined;
        this.scrollbarTargetEl = undefined;
        this.isDestroyed = true;
    }
}
