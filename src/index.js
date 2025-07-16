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
    #targetEl__; // 所绑定的滚动目标
    #mountContainerEl__; // 被挂载到的元素
    #mountedToBody__ = true; // 是否挂载到了body上
    #targetIsWidow__ = true; // 绑定的滚动目标是否是window
    #scrollbarEl__;
    #scrollbarTargetEl__;
    #railX__;
    #railY__;
    get targetEl() {
        return this.#targetEl__;
    }
    set targetEl(value) {
        this.#targetEl__ = value;
    }
    get mountContainerEl() {
        return this.#mountContainerEl__;
    }
    set mountContainerEl(value) {
        this.#mountContainerEl__ = value;
    }
    get mountedToBody() {
        return this.#mountedToBody__;
    }
    set mountedToBody(value) {
        this.#mountedToBody__ = value;
    }
    get targetIsWidow() {
        return this.#targetIsWidow__;
    }
    set targetIsWidow(value) {
        this.#targetIsWidow__ = value;
    }
    get scrollbarEl() {
        return this.#scrollbarEl__;
    }
    set scrollbarEl(value) {
        this.#scrollbarEl__ = value;
    }
    get scrollbarTargetEl() {
        return this.#scrollbarTargetEl__;
    }
    set scrollbarTargetEl(value) {
        this.#scrollbarTargetEl__ = value;
    }
    get railX() {
        return this.#railX__;
    }
    set railX(value) {
        this.#railX__ = value;
    }
    get railY() {
        return this.#railY__;
    }
    set railY(value) {
        this.#railY__ = value;
    }
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
        this.#scrollbarEl__ = scrollbarEl;
        this.#scrollbarTargetEl__ = scrollbarTargetEl;
        this.#railX__ = railX;
        this.#railY__ = railY;
    }
    /** 将滚动条与一个元素绑定 */
    bind(targetEl) {
        if (this.isDestroyed) return;
        this.#targetEl__ = targetEl;
        this.#targetIsWidow__ = !targetEl;
        this.#railX__.bind(targetEl);
        this.#railY__.bind(targetEl);
    }
    /** 挂载到一个元素上 */
    mount(mountContainerEl) {
        if (this.isDestroyed) return;
        super.mount();
        this.#mountContainerEl__ = mountContainerEl;
        if (!mountContainerEl) {
            document.body.appendChild(this.#scrollbarEl__);
            this.#mountedToBody__ = true;
        } else {
            mountContainerEl.appendChild(this.#scrollbarEl__);
            this.#mountedToBody__ = false;
        }
        this.#setupActionClass();
        this.#computedPosition();
    }
    unmount() {
        if (this.isDestroyed) return;
        super.unmount();
        removeElement(this.#scrollbarEl__);
    }
    /** 添加类名 */
    #setupActionClass() {
        if (this.isDestroyed) return;
        const scrollbarEl = this.#scrollbarEl__;
        if (this.#mountedToBody__) {
            addElementClass(scrollbarEl, 'mounted-to-body');
        } else {
            removeElementClass(scrollbarEl, 'mounted-to-body');
        }
        if (this.#targetIsWidow__) {
            addElementClass(scrollbarEl, 'is-window');
        } else {
            removeElementClass(scrollbarEl, 'is-window');
        }
    }
    /** 更新 */
    update() {
        if (this.isDestroyed) return;
        const railX = this.#railX__;
        const railY = this.#railY__;
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
        const targetEl = this.#targetEl__;
        const mountContainerEl = this.#mountContainerEl__;
        const scrollbarEl = this.#scrollbarEl__;
        const scrollbarTargetEl = this.#scrollbarTargetEl__;
        if (this.#targetIsWidow__) {
            scrollbarTargetEl.style.width = '100%';
            scrollbarTargetEl.style.height = '100%';
            return;
        }
        if (this.#mountedToBody__) {
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
        this.#railX__.destroy();
        this.#railY__.destroy();
        this.#railX__ = undefined;
        this.#railY__ = undefined;
        this.#targetEl__ = undefined;
        this.#mountContainerEl__ = undefined;
        this.#scrollbarEl__ = undefined;
        this.#scrollbarTargetEl__ = undefined;
    }
}
