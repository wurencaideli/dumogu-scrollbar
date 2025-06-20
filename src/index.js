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
    handleTransitionEnd_;
    isAutoUnmount = false;
    constructor(targetEl, option = {}) {
        super();
        this.isAutoUnmount = option.isAutoUnmount;
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
        const that = this;
        this.handleMouseEnter_ = function () {
            that.handleMouseEnter();
        };
        this.handleMouseLeave_ = function () {
            that.handleMouseLeave();
        };
        this.handleMouseLeave_ = function () {
            that.handleMouseLeave();
        };
        this.handleTransitionEnd_ = function () {
            that.handleTransitionEnd();
        };
        targetEl.addEventListener('mouseenter', this.handleMouseEnter_);
        targetEl.addEventListener('mouseleave', this.handleMouseLeave_);
        this.railX.railEl.addEventListener('transitionend', this.handleTransitionEnd_);
        this.railY.railEl.addEventListener('transitionend', this.handleTransitionEnd_);
        this.mount();
        this.updateStyle();
    }
    handleMouseEnter() {
        this.isHover = true;
        this.autoUnmount();
        this.updateStyle();
    }
    handleMouseLeave() {
        this.isHover = false;
        this.updateStyle();
    }
    handleTransitionEnd() {
        this.autoUnmount();
    }
    updateStyle() {
        if (!this.isMounted || this.isDestroyed) return;
        const targetElRect = this.targetEl.getBoundingClientRect();
        this.scrollbar.updateStyle({
            targetElRect: targetElRect,
        });
        this.railX.updateStyle({ targetElRect: targetElRect });
        this.railY.updateStyle({ targetElRect: targetElRect });
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
    autoUnmount() {
        if (!this.isAutoUnmount) return;
        if (this.isDestroyed) return;
        let xMount = true;
        let yMount = true;
        if (
            !this.isHover &&
            !this.railX.isTransitioning &&
            !this.railX.isDragging &&
            !this.railX.isHover
        ) {
            xMount = false;
        }
        if (
            !this.isHover &&
            !this.railY.isTransitioning &&
            !this.railY.isDragging &&
            !this.railY.isHover
        ) {
            yMount = false;
        }
        if (!xMount && !yMount) {
            this.unmount();
        } else {
            this.mount();
        }
    }
    destroy() {
        this.unmount();
        this.scrollbar.destroy();
        this.railX.destroy();
        this.railY.destroy();
        this.targetEl.removeEventListener('mouseenter', this.handleMouseEnter);
        this.targetEl.removeEventListener('mouseleave', this.handleMouseLeave);
        this.targetEl = undefined;
        this.scrollbar = undefined;
        this.railX = undefined;
        this.railY = undefined;
        this.isDestroyed = true;
    }
}
