import { removeElement, BaseTools } from './common';
import { Rail } from './rail';
import { Scrollbar } from './scrollbar';

/**
 * 毒蘑菇滚动条，自定义滚动条，添加到body上
 */
export class DumoguScrollbar extends BaseTools {
    targetEl;
    scrollbar;
    railX;
    railY;
    isHover = false;
    handleMouseEnter_;
    handleMouseLeave_;
    constructor(targetEl, option = {}) {
        super();
        this.targetEl = targetEl;
        this.scrollbar = new Scrollbar(targetEl);
        this.railX = new Rail(targetEl, {
            isX: true,
            keepShow: option.keepShow,
            stopClickPropagation: option.stopClickPropagation,
        });
        this.railY = new Rail(targetEl, {
            isX: false,
            keepShow: option.keepShow,
            stopClickPropagation: option.stopClickPropagation,
        });
        const scrollbarEl = this.scrollbar.scrollbarEl;
        const scrollbarTargetEl = this.scrollbar.scrollbarTargetEl;
        scrollbarTargetEl.appendChild(this.railX.railEl);
        scrollbarTargetEl.appendChild(this.railY.railEl);
        scrollbarEl.appendChild(scrollbarTargetEl);
        this.addEventListener();
        this.mount();
        this.update();
    }
    handleMouseEnter() {
        this.isHover = true;
        this.update();
    }
    handleMouseLeave() {
        this.isHover = false;
        this.update();
    }
    addEventListener() {
        const targetEl = this.targetEl;
        const that = this;
        this.handleMouseEnter_ = function () {
            that.handleMouseEnter();
        };
        this.handleMouseLeave_ = function () {
            that.handleMouseLeave();
        };
        targetEl.addEventListener('mouseenter', this.handleMouseEnter_);
        targetEl.addEventListener('mouseleave', this.handleMouseLeave_);
    }
    removeEventListener() {
        this.targetEl.removeEventListener('mouseenter', this.handleMouseEnter);
        this.targetEl.removeEventListener('mouseleave', this.handleMouseLeave);
    }
    update() {
        if (this.isDestroyed) return;
        const targetElRect = this.targetEl.getBoundingClientRect();
        this.scrollbar.computedPosition({
            targetElRect: targetElRect,
        });
        this.railX.computedProportion();
        this.railY.computedProportion();
        if (this.isHover) {
            this.railX.railEl.classList.add('target-hover');
            this.railY.railEl.classList.add('target-hover');
        } else {
            this.railY.railEl.classList.remove('target-hover');
            this.railX.railEl.classList.remove('target-hover');
        }
    }
    mount() {
        document.body.appendChild(this.scrollbar.scrollbarEl);
        this.isMounted = true;
    }
    unmount() {
        removeElement(this.scrollbar.scrollbarEl);
        this.isMounted = false;
    }
    destroy() {
        this.unmount();
        this.scrollbar.destroy();
        this.railX.destroy();
        this.railY.destroy();
        this.removeEventListener();
        this.targetEl = undefined;
        this.scrollbar = undefined;
        this.railX = undefined;
        this.railY = undefined;
        this.isDestroyed = true;
    }
}
