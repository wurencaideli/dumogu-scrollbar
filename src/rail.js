import { BaseTools } from './common';
/**
 * 滚动条导轨，可自行创建使用
 */
export class Rail extends BaseTools {
    targetEl;
    railEl;
    railContainerEl;
    thumbEl;
    targetIsWidow = false;
    isX__ = true;
    keepShow__ = false;
    stopClickPropagation = false;
    isTransitioning = false;
    isDragging__ = false;
    isHover__ = false;
    isTargetHover__ = false;
    proportion__ = 0;
    startX = 0;
    startY = 0;
    handleMousedown_;
    handleMouseMove_;
    handleMouseUp_;
    handleClick_;
    handleScroll_;
    handleMouseEnter_;
    handleMouseLeave_;
    handleTargetMouseEnter_;
    handleTargetMouseLeave_;
    constructor(option) {
        super();
        this.railEl = document.createElement('div');
        this.railContainerEl = document.createElement('div');
        this.thumbEl = document.createElement('div');
        this.railEl.classList.add('dumogu-scrollbar-target-rail');
        this.railContainerEl.classList.add('dumogu-scrollbar-target-rail-container');
        this.thumbEl.classList.add('dumogu-scrollbar-target-thumb');
        this.railEl.classList.add('hidden');
        this.railEl.appendChild(this.railContainerEl);
        this.railContainerEl.appendChild(this.thumbEl);
        this.stopClickPropagation = option.stopClickPropagation;
        this.isX = option.isX;
        this.keepShow = option.keepShow;
    }
    /** 将滚动条与一个元素绑定 */
    bind(targetEl) {
        if (this.isDestroyed) return;
        this.targetEl = targetEl;
        this.targetIsWidow = !targetEl;
        this.removeEventListener();
        this.addEventListener();
    }
    set isX(value) {
        this.isX__ = value;
        this.setupActionClass();
    }
    get isX() {
        return this.isX__;
    }
    set keepShow(value) {
        this.keepShow__ = value;
        this.setupActionClass();
    }
    get keepShow() {
        return this.keepShow__;
    }
    set isDragging(value) {
        this.isDragging__ = value;
        this.setupActionClass();
    }
    get isDragging() {
        return this.isDragging__;
    }
    set isHover(value) {
        this.isHover__ = value;
        this.setupActionClass();
    }
    get isHover() {
        return this.isHover__;
    }
    set isTargetHover(value) {
        this.isTargetHover__ = value;
        this.setupActionClass();
    }
    get isTargetHover() {
        return this.isTargetHover__;
    }
    set proportion(value) {
        this.proportion__ = value;
        this.setupHidden();
        this.setupPosition();
    }
    get proportion() {
        return this.proportion__;
    }
    setupHidden() {
        if (this.isDestroyed) return;
        const railEl = this.railEl;
        if (this.proportion >= 1) {
            railEl.classList.add('hidden');
        } else {
            railEl.classList.remove('hidden');
        }
    }
    setupActionClass() {
        if (this.isDestroyed) return;
        const railEl = this.railEl;
        const railContainerEl = this.railContainerEl;
        const thumbEl = this.thumbEl;
        if (this.keepShow) {
            railEl.classList.add('keep-show');
        } else {
            railEl.classList.remove('keep-show');
        }
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
        if (this.isTargetHover) {
            railEl.classList.add('target-hover');
        } else {
            railEl.classList.remove('target-hover');
        }
        if (this.isX) {
            railEl.classList.remove('y');
            railContainerEl.classList.remove('y');
            thumbEl.classList.remove('y');
            railEl.classList.add('x');
            railContainerEl.classList.add('x');
            thumbEl.classList.add('x');
        } else {
            railEl.classList.remove('x');
            railContainerEl.classList.remove('x');
            thumbEl.classList.remove('x');
            railEl.classList.add('y');
            railContainerEl.classList.add('y');
            thumbEl.classList.add('y');
        }
    }
    /** 获取目标元素的属性 */
    getTargetAttributes() {
        const targetEl = this.targetEl;
        let clientSize = 0;
        let scrollSize = 0;
        let scrollStart = 0;
        if (this.isX) {
            clientSize = this.targetIsWidow ? window.innerWidth : targetEl.clientWidth;
            scrollSize = this.targetIsWidow
                ? document.documentElement.scrollWidth
                : targetEl.scrollWidth;
            scrollStart = this.targetIsWidow ? window.scrollX : targetEl.scrollLeft;
        } else {
            clientSize = this.targetIsWidow ? window.innerHeight : targetEl.clientHeight;
            scrollSize = this.targetIsWidow
                ? document.documentElement.scrollHeight
                : targetEl.scrollHeight;
            scrollStart = this.targetIsWidow ? window.scrollY : targetEl.scrollTop;
        }
        return {
            clientSize,
            scrollSize,
            scrollStart,
        };
    }
    /** 设置目标元素滚动位置 */
    targetScrollTo(start) {
        if (this.isDestroyed) return;
        const targetEl = this.targetEl;
        if (this.isX) {
            if (this.targetIsWidow) {
                window.scrollTo(start, window.scrollY);
            } else {
                targetEl.scrollLeft = start;
            }
        } else {
            if (this.targetIsWidow) {
                window.scrollTo(window.scrollX, start);
            } else {
                targetEl.scrollTop = start;
            }
        }
    }
    /** 更新样式 */
    update() {
        this.computedProportion();
    }
    /** 计算比例，滚动比例(采用空白区域的计算方式) */
    computedProportion() {
        if (this.isDestroyed) return;
        const targetAttributes = this.getTargetAttributes();
        let proportion = 0;
        let scrollProportion = 0;
        proportion = targetAttributes.clientSize / targetAttributes.scrollSize;
        scrollProportion =
            targetAttributes.scrollStart /
            (targetAttributes.scrollSize - targetAttributes.clientSize);
        this.scrollProportion = Math.min(scrollProportion, 1);
        this.proportion = Math.min(proportion, 1);
    }
    /** 设置滚动条显示的位置 */
    setupPosition() {
        if (this.isDestroyed) return;
        const railContainerEl = this.railContainerEl;
        const thumbEl = this.thumbEl;
        const proportion = this.proportion;
        const scrollProportion = this.scrollProportion;
        const railClientSize = this.isX
            ? railContainerEl.clientWidth
            : railContainerEl.clientHeight;
        const size = Math.max(railClientSize * proportion, 30); // 设置最小size
        const start = (((railClientSize - size) * scrollProportion) / railClientSize) * 100;
        if (this.isX) {
            thumbEl.style.width = size + 'px';
            thumbEl.style.left = start + '%';
        } else {
            thumbEl.style.height = size + 'px';
            thumbEl.style.top = start + '%';
        }
    }
    handleMousedown(e) {
        if (this.isDestroyed) return;
        this.isDragging = true;
        this.startX = e.x;
        this.startY = e.y;
    }
    handleMouseMove(e) {
        if (this.isDestroyed) return;
        if (!this.isDragging) return;
        const targetAttributes = this.getTargetAttributes();
        const railContainerEl = this.railContainerEl;
        const railContainerElRect = railContainerEl.getBoundingClientRect();
        const thumbEl = this.thumbEl;
        let deltaLength = 0;
        const currentX = e.x;
        const currentY = e.y;
        if (this.isX) {
            deltaLength = currentX - this.startX;
            this.startX = currentX;
            if (targetAttributes.scrollStart == 0 && currentX < railContainerElRect.x) return;
            if (
                targetAttributes.scrollStart + targetAttributes.clientSize >=
                targetAttributes.scrollSize
            ) {
                if (currentX >= railContainerElRect.x + railContainerElRect.width) {
                    return;
                }
            }
            const width =
                (deltaLength / (railContainerEl.clientWidth - thumbEl.offsetWidth)) *
                (targetAttributes.scrollSize - targetAttributes.clientSize);
            this.targetScrollTo(targetAttributes.scrollStart + width);
        } else {
            deltaLength = currentY - this.startY;
            this.startY = currentY;
            if (targetAttributes.scrollStart == 0 && currentY < railContainerElRect.y) return;
            if (
                targetAttributes.scrollStart + targetAttributes.clientSize >=
                targetAttributes.scrollSize
            ) {
                if (currentY >= railContainerElRect.y + railContainerElRect.height) {
                    return;
                }
            }
            const height =
                (deltaLength / (railContainerEl.clientHeight - thumbEl.offsetHeight)) *
                (targetAttributes.scrollSize - targetAttributes.clientSize);
            this.targetScrollTo(targetAttributes.scrollStart + height);
        }
    }
    handleMouseUp() {
        if (this.isDestroyed) return;
        this.isDragging = false;
    }
    handleScroll() {
        if (this.isDestroyed) return;
        this.computedProportion();
    }
    handleClick(e) {
        if (this.isDestroyed) return;
        if (this.stopClickPropagation) {
            e.stopPropagation();
        }
        const targetAttributes = this.getTargetAttributes();
        const thumbEl = this.thumbEl;
        const thumbElRect = thumbEl.getBoundingClientRect();
        let isAdd = false;
        if (this.isX) {
            if (e.x > thumbElRect.x + thumbElRect.width) {
                isAdd = true;
            }
        } else {
            if (e.y > thumbElRect.y + thumbElRect.width) {
                isAdd = true;
            }
        }
        if (isAdd) {
            this.targetScrollTo(targetAttributes.scrollStart + targetAttributes.clientSize);
        } else {
            this.targetScrollTo(targetAttributes.scrollStart - targetAttributes.clientSize);
        }
    }
    handleMouseEnter() {
        this.isHover = true;
        this.computedProportion();
    }
    handleMouseLeave() {
        this.isHover = false;
        this.computedProportion();
    }
    handleTransitionStart(e) {
        const railEl = this.railEl;
        if (!e || e.target !== railEl) return;
        this.isTransitioning = true;
        this.computedProportion();
    }
    handleTransitionEnd(e) {
        const railEl = this.railEl;
        if (!e || e.target !== railEl) return;
        this.isTransitioning = false;
        this.computedProportion();
    }
    handleTargetMouseEnter() {
        this.isTargetHover = true;
        this.computedProportion();
    }
    handleTargetMouseLeave() {
        this.isTargetHover = false;
        this.computedProportion();
    }
    addEventListener() {
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
        that.handleTargetMouseEnter_ = function (e) {
            that.handleTargetMouseEnter(e);
        };
        that.handleTargetMouseLeave_ = function (e) {
            that.handleTargetMouseLeave(e);
        };
        thumbEl.addEventListener('mousedown', that.handleMousedown_);
        document.addEventListener('mousemove', that.handleMouseMove_);
        document.addEventListener('mouseup', that.handleMouseUp_);
        railContainerEl.addEventListener('click', that.handleClick_);
        if (this.targetIsWidow) {
            window.addEventListener('scroll', that.handleScroll_);
            document.addEventListener('mouseenter', that.handleTargetMouseEnter_);
            document.addEventListener('mouseleave', that.handleTargetMouseLeave_);
        } else {
            targetEl.addEventListener('scroll', that.handleScroll_);
            targetEl.addEventListener('mouseenter', that.handleTargetMouseEnter_);
            targetEl.addEventListener('mouseleave', that.handleTargetMouseLeave_);
        }
        railEl.addEventListener('mouseenter', that.handleMouseEnter_);
        railEl.addEventListener('mouseleave', that.handleMouseLeave_);
        railEl.addEventListener('transitionstart', that.handleTransitionStart_);
        railEl.addEventListener('transitionend', that.handleTransitionEnd_);
    }
    removeEventListener() {
        const targetEl = this.targetEl;
        const railEl = this.railEl;
        const thumbEl = this.thumbEl;
        const railContainerEl = this.railContainerEl;
        thumbEl.removeEventListener('mousedown', this.handleMousedown_);
        document.removeEventListener('mousemove', this.handleMouseMove_);
        document.removeEventListener('mouseup', this.handleMouseUp_);
        railContainerEl.removeEventListener('click', this.handleClick_);
        if (this.targetIsWidow) {
            window.removeEventListener('scroll', this.handleScroll_);
            document.removeEventListener('mouseenter', this.handleTargetMouseEnter_);
            document.removeEventListener('mouseleave', this.handleTargetMouseLeave_);
        } else {
            targetEl.removeEventListener('scroll', this.handleScroll_);
            targetEl.removeEventListener('mouseenter', this.handleTargetMouseEnter_);
            targetEl.removeEventListener('mouseleave', this.handleTargetMouseLeave_);
        }
        railEl.removeEventListener('mouseenter', this.handleMouseEnter_);
        railEl.removeEventListener('mouseleave', this.handleMouseLeave_);
        railEl.removeEventListener('transitionstart', this.handleTransitionStart_);
        railEl.removeEventListener('transitionend', this.handleTransitionEnd_);
    }
    destroy() {
        if (this.isDestroyed) return;
        super.unmount();
        super.destroy();
        this.removeEventListener();
        this.railEl = undefined;
        this.railContainerEl = undefined;
        this.thumbEl = undefined;
    }
}
