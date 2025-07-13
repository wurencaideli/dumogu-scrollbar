import {
    BaseTools,
    removeElement,
    addElementClass,
    removeElementClass,
    getElementRect,
} from './common';
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
        const scrollbarEl = document.createElement('div');
        const scrollbarTargetEl = document.createElement('div');
        const railX = new Rail({
            isX: true,
            keepShow: option.keepShow,
            stopClickPropagation: option.stopClickPropagation,
        });
        const railY = new Rail({
            isX: false,
            keepShow: option.keepShow,
            stopClickPropagation: option.stopClickPropagation,
        });
        addElementClass(scrollbarEl, 'dumogu-scrollbar');
        addElementClass(scrollbarTargetEl, 'dumogu-scrollbar-target');
        scrollbarTargetEl.appendChild(railX.railEl);
        scrollbarTargetEl.appendChild(railY.railEl);
        scrollbarEl.appendChild(scrollbarTargetEl);
        this.scrollbarEl = scrollbarEl;
        this.scrollbarTargetEl = scrollbarTargetEl;
        this.railX = railX;
        this.railY = railY;
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
        this.#setupActionClass();
        this.#computedPosition();
    }
    unmount() {
        if (this.isDestroyed) return;
        super.unmount();
        removeElement(this.scrollbarEl);
    }
    /** 添加类名 */
    #setupActionClass() {
        if (this.isDestroyed) return;
        const scrollbarEl = this.scrollbarEl;
        if (this.mountedToBody) {
            addElementClass(scrollbarEl, 'mounted-to-body');
        } else {
            removeElementClass(scrollbarEl, 'mounted-to-body');
        }
        if (this.targetIsWidow) {
            addElementClass(scrollbarEl, 'is-window');
        } else {
            removeElementClass(scrollbarEl, 'is-window');
        }
    }
    /** 更新 */
    update() {
        if (this.isDestroyed) return;
        const railX = this.railX;
        const railY = this.railY;
        this.#computedPosition();
        if (!railX.isDragging) {
            railX.update();
        }
        if (!railY.isDragging) {
            railY.update();
        }
    }
    /** 计算位置 */
    #computedPosition() {
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
            const targetElRect = getElementRect(targetEl);
            scrollbarTargetEl.style.width = targetElRect.width + 'px';
            scrollbarTargetEl.style.height = targetElRect.height + 'px';
            scrollbarTargetEl.style.top = targetElRect.y + 'px';
            scrollbarTargetEl.style.left = targetElRect.x + 'px';
            return;
        }
        const scrollbarElRect = getElementRect(scrollbarEl);
        const targetElRect = getElementRect(targetEl);
        const mountContainerElRect = getElementRect(mountContainerEl);
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
