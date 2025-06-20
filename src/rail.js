import { BaseTools } from './common';

/**
 * 滚动条导轨，可自行创建使用
 */
export class Rail extends BaseTools {
    isX;
    keepShow = false;
    stopClickPropagation = false;
    targetEl;
    railEl;
    railContainerEl;
    thumbEl;
    isDragging = false;
    isTransitioning = false;
    isHover = false;
    startX = 0;
    startY = 0;
    handleMousedown_;
    handleMouseMove_;
    handleMouseUp_;
    handleClick_;
    handleScroll_;
    handleMouseEnter_;
    handleMouseLeave_;
    constructor(targetEl, option) {
        super();
        this.targetEl = targetEl;
        this.isX = option.isX;
        this.keepShow = option.keepShow;
        this.stopClickPropagation = option.stopClickPropagation;
        this.railEl = document.createElement('div');
        this.railContainerEl = document.createElement('div');
        this.thumbEl = document.createElement('div');
        this.railEl.classList.add('dumogu-scrollbar-target-rail');
        this.railContainerEl.classList.add('dumogu-scrollbar-target-rail-container');
        this.thumbEl.classList.add('dumogu-scrollbar-target-thumb');
        this.railEl.classList.add('hidden');
        this.railEl.classList.add(this.isX ? 'x' : 'y');
        this.railContainerEl.classList.add(this.isX ? 'x' : 'y');
        this.thumbEl.classList.add(this.isX ? 'x' : 'y');
        if (this.keepShow) {
            this.railEl.classList.add('keep-show');
        }
        this.railEl.appendChild(this.railContainerEl);
        this.railContainerEl.appendChild(this.thumbEl);
        this.addEventListener();
    }
    updateStyle() {
        if (!this.isMounted || this.isDestroyed) return;
        const targetEl = this.targetEl;
        const railEl = this.railEl;
        const thumbEl = this.thumbEl;
        let proportion = 0; // 宽度或高度占比
        if (this.isX) {
            proportion = targetEl.clientWidth / targetEl.scrollWidth;
            const thumbElLeft = targetEl.scrollLeft / targetEl.scrollWidth;
            thumbEl.style.width = proportion * 100 + '%';
            thumbEl.style.left = thumbElLeft * 100 + '%';
        } else {
            proportion = targetEl.clientHeight / targetEl.scrollHeight;
            const thumbElTop = targetEl.scrollTop / targetEl.scrollHeight;
            thumbEl.style.height = Math.min(proportion * 100, 100) + '%';
            thumbEl.style.top = Math.min(thumbElTop * 100, 100) + '%';
        }
        if (proportion >= 1) {
            railEl.classList.add('hidden');
        } else {
            railEl.classList.remove('hidden');
            if (this.isDragging) {
                railEl.classList.add('dragging');
            } else {
                railEl.classList.remove('dragging');
            }
            if (this.isHover) {
                railEl.classList.add('hover');
            } else {
                railEl.classList.remove('hover');
            }
        }
    }
    handleMousedown(e) {
        if (!this.isMounted || this.isDestroyed) return;
        this.isDragging = true;
        this.startX = e.x;
        this.startY = e.y;
    }
    handleMouseMove(e) {
        if (!this.isMounted || this.isDestroyed) return;
        if (!this.isDragging) return;
        const targetEl = this.targetEl;
        const railContainerEl = this.railContainerEl;
        const railContainerElRect = railContainerEl.getBoundingClientRect();
        const targetElRect = targetEl.getBoundingClientRect();
        if (this.isX) {
            const currentX = e.x;
            const deltaX = currentX - this.startX;
            this.startX = currentX;
            if (targetEl.scrollLeft == 0 && currentX < railContainerElRect.x) return;
            if (targetEl.scrollLeft + targetElRect.width >= targetEl.scrollWidth) {
                if (currentX >= railContainerElRect.x + railContainerElRect.width) {
                    return;
                }
            }
            targetEl.scrollLeft =
                targetEl.scrollLeft + (deltaX / railContainerElRect.width) * targetEl.scrollWidth;
        } else {
            const currentY = e.y;
            const deltaY = currentY - this.startY;
            this.startY = currentY;
            if (targetEl.scrollTop == 0 && currentY < railContainerElRect.y) return;
            if (targetEl.scrollTop + targetElRect.height >= targetEl.scrollHeight) {
                if (currentY >= railContainerElRect.y + railContainerElRect.height) {
                    return;
                }
            }
            targetEl.scrollTop =
                targetEl.scrollTop + (deltaY / railContainerElRect.height) * targetEl.scrollHeight;
        }
    }
    handleMouseUp(e) {
        if (!this.isMounted || this.isDestroyed) return;
        this.isDragging = false;
    }
    handleScroll(e) {
        if (!this.isMounted || this.isDestroyed) return;
        this.updateStyle();
    }
    handleClick(e) {
        if (this.stopClickPropagation) {
            e.stopPropagation();
        }
        const targetEl = this.targetEl;
        const thumbEl = this.thumbEl;
        const thumbElRect = thumbEl.getBoundingClientRect();
        const targetElRect = targetEl.getBoundingClientRect();
        if (this.isX) {
            if (e.x < thumbElRect.x) {
                targetEl.scrollLeft = targetEl.scrollLeft - targetElRect.width;
            }
            if (e.x > thumbElRect.x + thumbElRect.width) {
                targetEl.scrollLeft = targetEl.scrollLeft + targetElRect.width;
            }
        } else {
            if (e.y < thumbElRect.y) {
                targetEl.scrollTop = targetEl.scrollTop - targetElRect.height;
            }
            if (e.y > thumbElRect.y + thumbElRect.height) {
                targetEl.scrollTop = targetEl.scrollTop + targetElRect.height;
            }
        }
    }
    handleMouseEnter() {
        this.isHover = true;
        this.updateStyle();
    }
    handleMouseLeave() {
        this.isHover = false;
        this.updateStyle();
    }
    handleTransitionStart() {
        this.isTransitioning = true;
        this.updateStyle();
    }
    handleTransitionEnd() {
        this.isTransitioning = false;
        this.updateStyle();
    }
    addEventListener() {
        this.removeEventListener();
        const targetEl = this.targetEl;
        const railEl = this.railEl;
        const thumbEl = this.thumbEl;
        const railContainerEl = this.railContainerEl;
        const that = this;
        that.handleMousedown_ = function (e) {
            that.handleMousedown(e);
        };
        that.handleMouseMove_ = function (e) {
            that.handleMouseMove(e);
        };
        that.handleMouseUp_ = function (e) {
            that.handleMouseUp(e);
        };
        that.handleScroll_ = function (e) {
            that.handleScroll(e);
        };
        that.handleClick_ = function (e) {
            that.handleClick(e);
        };
        that.handleMouseEnter_ = function (e) {
            that.handleMouseEnter(e);
        };
        that.handleMouseLeave_ = function (e) {
            that.handleMouseLeave(e);
        };
        that.handleTransitionStart_ = function (e) {
            that.handleTransitionStart(e);
        };
        that.handleTransitionEnd_ = function (e) {
            that.handleTransitionEnd(e);
        };
        thumbEl.addEventListener('mousedown', that.handleMousedown_);
        document.addEventListener('mousemove', that.handleMouseMove_);
        document.addEventListener('mouseup', that.handleMouseUp_);
        railContainerEl.addEventListener('click', that.handleClick_);
        targetEl.addEventListener('scroll', that.handleScroll_);
        railEl.addEventListener('mouseenter', that.handleMouseEnter_);
        railEl.addEventListener('mouseleave', that.handleMouseLeave_);
        railEl.addEventListener('transitionstart', that.handleTransitionStart_);
        railEl.addEventListener('transitionend', that.handleTransitionEnd_);
    }
    removeEventListener() {
        const targetEl = this.targetEl;
        const thumbEl = this.thumbEl;
        const railContainerEl = this.railContainerEl;
        thumbEl.removeEventListener('mousedown', this.handleMousedown_);
        document.removeEventListener('mousemove', this.handleMouseMove_);
        document.removeEventListener('mouseup', this.handleMouseUp_);
        railContainerEl.removeEventListener('click', this.handleClick_);
        targetEl.removeEventListener('scroll', this.handleScroll_);
        targetEl.removeEventListener('mouseenter', this.handleMouseEnter_);
        targetEl.removeEventListener('mouseleave', this.handleMouseLeave_);
    }
    destroy() {
        this.unmount();
        this.removeEventListener();
        this.railEl = undefined;
        this.railContainerEl = undefined;
        this.thumbEl = undefined;
        this.isDestroyed = true;
    }
}
