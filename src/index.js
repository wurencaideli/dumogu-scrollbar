import { BaseTools, removeElement } from './common';
import { Rail } from './rail';
export * from './rail';
export class DumoguScrollbar extends BaseTools {
    targetEl; // 所绑定的滚动目标
    mountContainerEl; // 被挂载到的元素
    mountedToBody = true; // 是否挂载到了body上
    targetIsWidow = true; // 绑定的滚动目标是否是window
    scrollbarEl;
    scrollbarTargetEl;
    railX;
    railY;
    constructor(option = {}) {
        super();
        this.scrollbarEl = document.createElement('div');
        this.scrollbarTargetEl = document.createElement('div');
        this.scrollbarEl.classList.add('dumogu-scrollbar');
        this.scrollbarTargetEl.classList.add('dumogu-scrollbar-target');
        this.railX = new Rail({
            isX: true,
            keepShow: option.keepShow,
            stopClickPropagation: option.stopClickPropagation,
        });
        this.railY = new Rail({
            isX: false,
            keepShow: option.keepShow,
            stopClickPropagation: option.stopClickPropagation,
        });
        this.scrollbarTargetEl.appendChild(this.railX.railEl);
        this.scrollbarTargetEl.appendChild(this.railY.railEl);
        this.scrollbarEl.appendChild(this.scrollbarTargetEl);
    }
    /** 将滚动条与一个元素绑定 */
    bind(targetEl) {
        if (this.isDestroyed) return;
        this.targetEl = targetEl;
        this.targetIsWidow = !targetEl;
        this.railX.bind(targetEl);
        this.railY.bind(targetEl);
    }
    /** 挂载到一个元素上 */
    mount(mountContainerEl) {
        if (this.isDestroyed) return;
        super.mount();
        this.mountContainerEl = mountContainerEl;
        if (!mountContainerEl) {
            document.body.appendChild(this.scrollbarEl);
            this.mountedToBody = true;
        } else {
            mountContainerEl.appendChild(this.scrollbarEl);
            this.mountedToBody = false;
        }
        this.setupActionClass();
        this.computedPosition();
    }
    unmount() {
        if (this.isDestroyed) return;
        super.unmount();
        removeElement(this.scrollbarEl);
    }
    /** 添加类名 */
    setupActionClass() {
        if (this.isDestroyed) return;
        const scrollbarEl = this.scrollbarEl;
        if (this.mountedToBody) {
            scrollbarEl.classList.add('mounted-to-body');
        } else {
            scrollbarEl.classList.remove('mounted-to-body');
        }
        if (this.targetIsWidow) {
            scrollbarEl.classList.add('is-window');
        } else {
            scrollbarEl.classList.remove('is-window');
        }
    }
    /** 更新 */
    update() {
        if (this.isDestroyed) return;
        this.computedPosition();
        if (!this.railX.isDragging) {
            this.railX.update();
        }
        if (!this.railY.isDragging) {
            this.railY.update();
        }
    }
    /** 计算位置 */
    computedPosition() {
        if (this.isDestroyed) return;
        const targetEl = this.targetEl;
        const mountContainerEl = this.mountContainerEl;
        const scrollbarEl = this.scrollbarEl;
        const scrollbarTargetEl = this.scrollbarTargetEl;
        if (this.targetIsWidow) {
            scrollbarTargetEl.style.width = '100%';
            scrollbarTargetEl.style.height = '100%';
            return;
        }
        if (this.mountedToBody) {
            const targetElRect = targetEl.getBoundingClientRect();
            scrollbarTargetEl.style.width = targetElRect.width + 'px';
            scrollbarTargetEl.style.height = targetElRect.height + 'px';
            scrollbarTargetEl.style.top = targetElRect.y + 'px';
            scrollbarTargetEl.style.left = targetElRect.x + 'px';
            return;
        }
        const scrollbarElRect = scrollbarEl.getBoundingClientRect();
        const targetElRect = targetEl.getBoundingClientRect();
        const mountContainerElRect = mountContainerEl.getBoundingClientRect();
        scrollbarTargetEl.style.width = targetElRect.width + 'px';
        scrollbarTargetEl.style.height = targetElRect.height + 'px';
        scrollbarTargetEl.style.top =
            targetElRect.y -
            mountContainerElRect.y -
            (scrollbarElRect.y - mountContainerElRect.y) +
            'px';
        scrollbarTargetEl.style.left =
            targetElRect.x -
            mountContainerElRect.x -
            (scrollbarElRect.x - mountContainerElRect.x) +
            'px';
    }
    destroy() {
        if (this.isDestroyed) return;
        this.unmount();
        super.destroy();
        this.railX.destroy();
        this.railY.destroy();
        this.railX = undefined;
        this.railY = undefined;
        this.targetEl = undefined;
        this.mountContainerEl = undefined;
        this.scrollbarEl = undefined;
        this.scrollbarTargetEl = undefined;
    }
}
