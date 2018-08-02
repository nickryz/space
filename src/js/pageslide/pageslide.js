export class Pageslide {
    constructor(opt) {
        // DOM
        this.pagesGroup = document.querySelector(opt.pagesGroupId);

        // start options
        this.scrollStep = opt.scroll.step || 100;
        this.scrollUnit = opt.scroll.unit || '%';

        // transition options
        this.transitionStatus = opt.transition.transitionStatus || true;
        this.transitionDelay = opt.transition.transitionDelay || 1;
        this.transitionType = opt.transition.transitionType || 'linear';
        this._setTransitionOpt(); 

        // helper var
        this.currentTranslate = 0;
        this.LastTime = new Date();
        this.touchStartY;

        // listener
        this._listener();
    }
     
    _listener() {
        window.addEventListener('wheel', this._scrollHandler.bind(this));
        window.addEventListener('keydown', this._keyHandler.bind(this));
        window.addEventListener('touchstart', this._touchStartHandler.bind(this));
        window.addEventListener('touchend', this._touchEndHandler.bind(this));
    }

    _scrollHandler(e) {
        if(e.ctrlKey) return;
        e.preventDefault();
        if(this._checkTimer()) return;
        let delta = e.deltaY;
        if(delta > 0) {
            this._setTranslate('down');
        } else {
            this._setTranslate('up');
        }
    }

    _keyHandler(e) {
        let targetKey = e.keyCode;
        if(targetKey !== 33 && targetKey !== 32 && targetKey !== 34) return;
        if(this._checkTimer()) return;
        if(targetKey === 34  || targetKey === 32) {
            this._setTranslate('down');
        } else if (targetKey === 33){
            this._setTranslate('up');
        }
    }

    _touchStartHandler(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    _touchEndHandler(e) {
        if(this._checkTimer()) return;
        let touchY = e.changedTouches[0].clientY;
        let diff = this.touchStartY - touchY;
        if(Math.abs(diff) < 20) return;
        if(diff > 0) {
            this._setTranslate('down');
        } else if (diff < 0) {
            this._setTranslate('up');
        }
    }

    _checkTimer() {
        let currentTime = new Date();
        if( (currentTime - this.LastTime) < 100 + this.transitionDelay * 1000) return true;
        this.LastTime = currentTime;
    }

    _setTranslate(path) {
        let step;
        if(path === 'down') {
            step = Math.max(this.currentTranslate - this.scrollStep, this.pagesGroup.children.length * -this.scrollStep);
        } else if (path === 'up') {
            step = Math.min(this.currentTranslate + this.scrollStep, 0);
        }
        this.pagesGroup.style.transform = `translateY(${step + this.scrollUnit})`;
        this.currentTranslate = step;
    }

    // init start options
    _setTransitionOpt() {
        if(this.transitionStatus) {
            this.pagesGroup.style.transition = `transform ${this.transitionDelay}s ${this.transitionType}`;
            this.pagesGroup.style.willChange = `transform`;
        }
    }
}