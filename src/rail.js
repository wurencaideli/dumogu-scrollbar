import { BaseTools, addElementClass, removeElementClass, getElementRect } from './common';
/**
 * 滚动条导轨，可自行创建使用
 */
export class Rail extends BaseTools {
    #targetEl__;
    #railEl__;
    #railContainerEl__;
    #thumbEl__;
    #targetIsWidow__ = false;
    #isX__ = true;
    #keepShow__ = false;
    #stopClickPropagation__ = false;
    #isDragging__ = false;
    #isDragging_1__ = false; // 用作防止点击事件冲突的特殊属性
    #isHover__ = false;
    #isTargetHover__ = false;
    #proportion__ = 0;
    #startX__ = 0;
    #startY__ = 0;
    #scrollProportion__;
    #handleMousedown_;
    #handleMouseMove_;
    #handleMouseUp_;
    #handleClick_;
    #handleScroll_;
    #handleMouseEnter_;
    #handleMouseLeave_;
    #handleTargetMouseEnter_;
    #handleTargetMouseLeave_;
    #handleTransitionStart_;
    #handleTransitionEnd_;
    constructor(option) {
        super();
        const railEl = document.createElement('div');
        const railContainerEl = document.createElement('div');
        const thumbEl = document.createElement('div');
        addElementClass(railEl, 'dumogu-scrollbar-target-rail');
        addElementClass(railContainerEl, 'dumogu-scrollbar-target-rail-container');
        addElementClass(thumbEl, 'dumogu-scrollbar-target-thumb');
        addElementClass(railEl, 'hidden');
        railEl.appendChild(railContainerEl);
        railContainerEl.appendChild(thumbEl);
        this.#railEl__ = railEl;
        this.#railContainerEl__ = railContainerEl;
        this.#thumbEl__ = thumbEl;
        this.#stopClickPropagation__ = option.stopClickPropagation;
        this.#isX__ = option.isX;
        this.#keepShow__ = option.keepShow;
        this.#setupActionClass();
    }
    set targetEl(value) {
        this.#targetEl__ = value;
    }
    get targetEl() {
        return this.#targetEl__;
    }
    set railEl(value) {
        this.#railEl__ = value;
    }
    get railEl() {
        return this.#railEl__;
    }
    set railContainerEl(value) {
        this.#railContainerEl__ = value;
    }
    get railContainerEl() {
        return this.#railContainerEl__;
    }
    set thumbEl(value) {
        this.#thumbEl__ = value;
    }
    get thumbEl() {
        return this.#thumbEl__;
    }
    set targetIsWidow(value) {
        this.#targetIsWidow__ = value;
    }
    get targetIsWidow() {
        return this.#targetIsWidow__;
    }
    set stopClickPropagation(value) {
        this.#stopClickPropagation__ = value;
    }
    get stopClickPropagation() {
        return this.#stopClickPropagation__;
    }
    set isX(value) {
        this.#isX__ = value;
        this.#setupActionClass();
    }
    get isX() {
        return this.#isX__;
    }
    set keepShow(value) {
        this.#keepShow__ = value;
        this.#setupActionClass();
    }
    get keepShow() {
        return this.#keepShow__;
    }
    set isDragging(value) {
        this.#isDragging__ = value;
        this.#setupActionClass();
    }
    get isDragging() {
        return this.#isDragging__;
    }
    set isHover(value) {
        this.#isHover__ = value;
        this.#setupActionClass();
    }
    get isHover() {
        return this.#isHover__;
    }
    set isTargetHover(value) {
        this.#isTargetHover__ = value;
        this.#setupActionClass();
    }
    get isTargetHover() {
        return this.#isTargetHover__;
    }
    set proportion(value) {
        this.#proportion__ = value;
        this.#setupHidden();
        this.#setupPosition();
    }
    get proportion() {
        return this.#proportion__;
    }
    /** 将滚动条与一个元素绑定 */
    bind(targetEl) {
        if (this.isDestroyed) return;
        this.#targetEl__ = targetEl;
        this.#targetIsWidow__ = !targetEl;
        this.#removeEventListener();
        this.#addEventListener();
    }
    #setupHidden() {
        if (this.isDestroyed) return;
        const railEl = this.#railEl__;
        if (this.#proportion__ >= 1) {
            addElementClass(railEl, 'hidden');
        } else {
            removeElementClass(railEl, 'hidden');
        }
    }
    #setupActionClass() {
        if (this.isDestroyed) return;
        const railEl = this.#railEl__;
        const railContainerEl = this.#railContainerEl__;
        const thumbEl = this.#thumbEl__;
        if (this.#keepShow__) {
            addElementClass(railEl, 'keep-show');
        } else {
            removeElementClass(railEl, 'keep-show');
        }
        if (this.#isDragging__) {
            addElementClass(railEl, 'dragging');
        } else {
            removeElementClass(railEl, 'dragging');
        }
        if (this.#isHover__) {
            addElementClass(railEl, 'hover');
        } else {
            removeElementClass(railEl, 'hover');
        }
        if (this.#isTargetHover__) {
            addElementClass(railEl, 'target-hover');
        } else {
            removeElementClass(railEl, 'target-hover');
        }
        if (this.#isX__) {
            removeElementClass(railEl, 'y');
            removeElementClass(railContainerEl, 'y');
            removeElementClass(thumbEl, 'y');
            addElementClass(railEl, 'x');
            addElementClass(railContainerEl, 'x');
            addElementClass(thumbEl, 'x');
        } else {
            removeElementClass(railEl, 'x');
            removeElementClass(railContainerEl, 'x');
            removeElementClass(thumbEl, 'x');
            addElementClass(railEl, 'y');
            addElementClass(railContainerEl, 'y');
            addElementClass(thumbEl, 'y');
        }
    }
    /** 获取目标元素的属性 */
    #getTargetAttributes() {
        const targetEl = this.#targetEl__;
        const targetIsWidow = this.#targetIsWidow__;
        let clientSize = 0;
        let scrollSize = 0;
        let scrollStart = 0;
        if (this.#isX__) {
            clientSize = targetIsWidow ? window.innerWidth : targetEl.clientWidth;
            scrollSize = targetIsWidow
                ? document.documentElement.scrollWidth
                : targetEl.scrollWidth;
            scrollStart = targetIsWidow ? window.scrollX : targetEl.scrollLeft;
        } else {
            clientSize = targetIsWidow ? window.innerHeight : targetEl.clientHeight;
            scrollSize = targetIsWidow
                ? document.documentElement.scrollHeight
                : targetEl.scrollHeight;
            scrollStart = targetIsWidow ? window.scrollY : targetEl.scrollTop;
        }
        return {
            clientSize,
            scrollSize,
            scrollStart,
        };
    }
    /** 设置目标元素滚动位置 */
    #targetScrollTo(start) {
        if (this.isDestroyed) return;
        const targetEl = this.#targetEl__;
        const targetIsWidow = this.#targetIsWidow__;
        if (this.#isX__) {
            if (targetIsWidow) {
                window.scrollTo(start, window.scrollY);
            } else {
                targetEl.scrollLeft = start;
            }
        } else {
            if (targetIsWidow) {
                window.scrollTo(window.scrollX, start);
            } else {
                targetEl.scrollTop = start;
            }
        }
    }
    /** 更新样式 */
    update() {
        this.#computedProportion();
    }
    /** 计算比例，滚动比例(采用空白区域的计算方式) */
    #computedProportion() {
        if (this.isDestroyed) return;
        const targetAttributes = this.#getTargetAttributes();
        let proportion = 0;
        let scrollProportion = 0;
        proportion = targetAttributes.clientSize / targetAttributes.scrollSize;
        scrollProportion =
            targetAttributes.scrollStart /
            (targetAttributes.scrollSize - targetAttributes.clientSize);
        this.#scrollProportion__ = Math.min(scrollProportion, 1);
        this.proportion = Math.min(proportion, 1);
    }
    /** 设置滚动条显示的位置 */
    #setupPosition() {
        if (this.isDestroyed) return;
        const railContainerEl = this.#railContainerEl__;
        const thumbEl = this.#thumbEl__;
        const proportion = this.#proportion__;
        const scrollProportion = this.#scrollProportion__;
        const railClientSize = this.#isX__
            ? railContainerEl.clientWidth
            : railContainerEl.clientHeight;
        const size = Math.max(railClientSize * proportion, 30); // 设置最小size
        const start = (((railClientSize - size) * scrollProportion) / railClientSize) * 100;
        if (this.#isX__) {
            thumbEl.style.width = size + 'px';
            thumbEl.style.left = start + '%';
        } else {
            thumbEl.style.height = size + 'px';
            thumbEl.style.top = start + '%';
        }
    }
    #handleMousedown(e) {
        if (this.isDestroyed) return;
        this.isDragging = true;
        this.#isDragging_1__ = true;
        const thumbEl = this.#thumbEl__;
        const thumbElRect = getElementRect(thumbEl);
        // 记录点击时候的占比
        if (this.#isX__) {
            this.#startX__ = (e.x - thumbElRect.x) / thumbElRect.width;
        } else {
            this.#startY__ = (e.y - thumbElRect.y) / thumbElRect.height;
        }
    }
    #handleMouseMove(e) {
        if (this.isDestroyed) return;
        if (!this.#isDragging__) return;
        const targetAttributes = this.#getTargetAttributes();
        const railContainerEl = this.#railContainerEl__;
        const thumbEl = this.#thumbEl__;
        const railContainerElRect = getElementRect(railContainerEl);
        const thumbElRect = getElementRect(thumbEl);
        const currentX = e.x;
        const currentY = e.y;
        let scrollSize;
        /** 使用点击时候的占比计算鼠标位置滚动条的占比 */
        if (this.#isX__) {
            scrollSize =
                (currentX - railContainerElRect.x - thumbElRect.width * this.#startX__) /
                (railContainerElRect.width - thumbElRect.width);
        } else {
            scrollSize =
                (currentY - railContainerElRect.y - thumbElRect.height * this.#startY__) /
                (railContainerElRect.height - thumbElRect.height);
        }
        scrollSize = scrollSize * (targetAttributes.scrollSize - targetAttributes.clientSize);
        this.#targetScrollTo(scrollSize);
    }
    #handleMouseUp() {
        if (this.isDestroyed) return;
        this.isDragging = false;
        setTimeout(() => {
            this.#isDragging_1__ = false;
        });
    }
    #handleScroll() {
        if (this.isDestroyed) return;
        this.#computedProportion();
    }
    #handleClick(e) {
        if (this.isDestroyed) return;
        if (this.#isDragging_1__) return;
        if (this.#stopClickPropagation__) {
            e.stopPropagation();
        }
        const targetAttributes = this.#getTargetAttributes();
        const thumbEl = this.#thumbEl__;
        const thumbElRect = getElementRect(thumbEl);
        let isAdd = undefined;
        if (this.#isX__) {
            if (e.x > thumbElRect.x + thumbElRect.width) {
                isAdd = true;
            }
            if (e.x < thumbElRect.x) {
                isAdd = false;
            }
        } else {
            if (e.y > thumbElRect.y + thumbElRect.height) {
                isAdd = true;
            }
            if (e.y < thumbElRect.y) {
                isAdd = false;
            }
        }
        if (isAdd === undefined) return;
        if (isAdd) {
            this.#targetScrollTo(targetAttributes.scrollStart + targetAttributes.clientSize);
        } else {
            this.#targetScrollTo(targetAttributes.scrollStart - targetAttributes.clientSize);
        }
    }
    #handleMouseEnter() {
        this.isHover = true;
        this.#computedProportion();
    }
    #handleMouseLeave() {
        this.isHover = false;
        this.#computedProportion();
    }
    #handleTransitionStart(e) {
        const railEl = this.#railEl__;
        if (!e || e.target !== railEl || e.propertyName !== 'opacity') return;
        this.#computedProportion();
    }
    #handleTransitionEnd(e) {
        const railEl = this.#railEl__;
        if (!e || e.target !== railEl || e.propertyName !== 'opacity') return;
        this.#computedProportion();
    }
    #handleTargetMouseEnter() {
        this.isTargetHover = true;
        this.#computedProportion();
    }
    #handleTargetMouseLeave() {
        this.isTargetHover = false;
        this.#computedProportion();
    }
    #addEventListener() {
        const targetEl = this.#targetEl__;
        const railEl = this.#railEl__;
        const thumbEl = this.#thumbEl__;
        const railContainerEl = this.#railContainerEl__;
        const that = this;
        that.#handleMousedown_ = function (e) {
            that.#handleMousedown(e);
        };
        that.#handleMouseMove_ = function (e) {
            that.#handleMouseMove(e);
        };
        that.#handleMouseUp_ = function (e) {
            that.#handleMouseUp(e);
        };
        that.#handleScroll_ = function (e) {
            that.#handleScroll(e);
        };
        that.#handleClick_ = function (e) {
            that.#handleClick(e);
        };
        that.#handleMouseEnter_ = function (e) {
            that.#handleMouseEnter(e);
        };
        that.#handleMouseLeave_ = function (e) {
            that.#handleMouseLeave(e);
        };
        that.#handleTransitionStart_ = function (e) {
            that.#handleTransitionStart(e);
        };
        that.#handleTransitionEnd_ = function (e) {
            that.#handleTransitionEnd(e);
        };
        that.#handleTargetMouseEnter_ = function (e) {
            that.#handleTargetMouseEnter(e);
        };
        that.#handleTargetMouseLeave_ = function (e) {
            that.#handleTargetMouseLeave(e);
        };
        const fnName = 'addEventListener';
        thumbEl[fnName]('mousedown', that.#handleMousedown_);
        document[fnName]('mousemove', that.#handleMouseMove_);
        document[fnName]('mouseup', that.#handleMouseUp_);
        railContainerEl[fnName]('click', that.#handleClick_);
        if (this.#targetIsWidow__) {
            window[fnName]('scroll', that.#handleScroll_);
            document[fnName]('mouseenter', that.#handleTargetMouseEnter_);
            document[fnName]('mouseleave', that.#handleTargetMouseLeave_);
        } else {
            targetEl[fnName]('scroll', that.#handleScroll_);
            targetEl[fnName]('mouseenter', that.#handleTargetMouseEnter_);
            targetEl[fnName]('mouseleave', that.#handleTargetMouseLeave_);
        }
        railEl[fnName]('mouseenter', that.#handleMouseEnter_);
        railEl[fnName]('mouseleave', that.#handleMouseLeave_);
        railEl[fnName]('transitionstart', that.#handleTransitionStart_);
        railEl[fnName]('transitionend', that.#handleTransitionEnd_);
    }
    #removeEventListener() {
        const targetEl = this.#targetEl__;
        const railEl = this.#railEl__;
        const thumbEl = this.#thumbEl__;
        const railContainerEl = this.#railContainerEl__;
        const fnName = 'removeEventListener';
        thumbEl[fnName]('mousedown', this.#handleMousedown_);
        document[fnName]('mousemove', this.#handleMouseMove_);
        document[fnName]('mouseup', this.#handleMouseUp_);
        railContainerEl[fnName]('click', this.#handleClick_);
        if (this.#targetIsWidow__) {
            window[fnName]('scroll', this.#handleScroll_);
            document[fnName]('mouseenter', this.#handleTargetMouseEnter_);
            document[fnName]('mouseleave', this.#handleTargetMouseLeave_);
        } else {
            targetEl[fnName]('scroll', this.#handleScroll_);
            targetEl[fnName]('mouseenter', this.#handleTargetMouseEnter_);
            targetEl[fnName]('mouseleave', this.#handleTargetMouseLeave_);
        }
        railEl[fnName]('mouseenter', this.#handleMouseEnter_);
        railEl[fnName]('mouseleave', this.#handleMouseLeave_);
        railEl[fnName]('transitionstart', this.#handleTransitionStart_);
        railEl[fnName]('transitionend', this.#handleTransitionEnd_);
    }
    destroy() {
        if (this.isDestroyed) return;
        super.unmount();
        super.destroy();
        this.#removeEventListener();
        this.#railEl__ = undefined;
        this.#railContainerEl__ = undefined;
        this.#thumbEl__ = undefined;
        this.#handleMousedown_ = undefined;
        this.#handleMouseMove_ = undefined;
        this.#handleMouseUp_ = undefined;
        this.#handleClick_ = undefined;
        this.#handleScroll_ = undefined;
        this.#handleMouseEnter_ = undefined;
        this.#handleMouseLeave_ = undefined;
        this.#handleTargetMouseEnter_ = undefined;
        this.#handleTargetMouseLeave_ = undefined;
        this.#handleTransitionStart_ = undefined;
        this.#handleTransitionEnd_ = undefined;
    }
}
