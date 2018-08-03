export class Pageslide {
    constructor(opt) {
        // DOM
        this.pagesGroup = document.querySelector(opt.pagesGroupId);
        this.markersGroup = document.querySelector(opt.markers.markersWrapId);

        // start options
        this.scrollStep = opt.scroll.step || 100;
        this.scrollUnit = opt.scroll.unit || '%';

        // markers options
        this.markerActiveClass = opt.markers.markerActiveClass;
        this.markerStatus = opt.markers.markerStatus || false;
        this.markerElHTML = opt.markers.markerElHTML || '<li class="marker"></li>';

        // transition options
        this.transitionStatus = opt.transition.transitionStatus || true;
        this.transitionDelay = opt.transition.transitionDelay || 1;
        this.transitionType = opt.transition.transitionType || 'linear';
        this._setTransitionOpt(); 

        // helper var
        this.currentTranslate = 0;
        this.LastTime = new Date();
        this.touchStartY;
        this.currentSlideId = 0;
        this.prevSlideId = 0;


        // start fn
        this._startingChanges();
    }
     
    _listener() {
        window.addEventListener('wheel', this._scrollHandler.bind(this));
        window.addEventListener('keydown', this._keyHandler.bind(this));
        window.addEventListener('touchstart', this._touchStartHandler.bind(this));
        window.addEventListener('touchend', this._touchEndHandler.bind(this));

        if(this.markerStatus) {
            for(let i = 0; i < this.markersGroup.children.length; i++) {
                this.markersGroup.children[i].setAttribute('data-id', i)
            }
            this.markersGroup.addEventListener('click', this._scrollFromMarkerClick.bind(this));
        }
    }

    _scrollFromMarkerClick(e) {
        let target = e.target;
        let id = target.getAttribute('data-id');
        if(!id) return;
        if(id == this.currentSlideId) return;
        
        if(id < this.prevSlideId) {
            this.currentTranslate = -id * this.scrollStep + this.scrollStep;
            this._setTranslate('down');
        } else {
            this.currentTranslate = -id * this.scrollStep - this.scrollStep;
            this._setTranslate('up');
        }
    }

    _startingChanges() {
        document.body.style.overflow = 'hidden';

        if(this.markerStatus) {        
            for(let i = 0; i < this.pagesGroup.children.length; i++) {
                this.markersGroup.innerHTML += this.markerElHTML;
            }
            this._changeActiveMarker();  // set active class for marker at first
        }

        this._listener();
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
        if(Math.abs(diff) < 25) return;
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
        // console.log(this.currentTranslate)
        if(path === 'down') {
            step = Math.max(this.currentTranslate - this.scrollStep, this.pagesGroup.children.length * -this.scrollStep);
        } else if (path === 'up') {
            step = Math.min(this.currentTranslate + this.scrollStep, 0);
        }
        this.pagesGroup.style.transform = `translateY(${step + this.scrollUnit})`;
        this.currentTranslate = step;
        // console.log(this.currentTranslate, 2)

        this._setCurrentSlideId();

        if(this.markerStatus) {
            this._changeActiveMarker();
        }
    }

    // init start options
    _setTransitionOpt() {
        if(this.transitionStatus) {
            this.pagesGroup.style.transition = `transform ${this.transitionDelay}s ${this.transitionType}`;
            this.pagesGroup.style.willChange = `transform`;
        }
    }

    _setCurrentSlideId() {
       this.prevSlideId = this.currentSlideId;
       this.currentSlideId = Math.abs(this.currentTranslate/this.scrollStep);
    }

    _changeActiveMarker() {
        if(this.markersGroup.children[this.prevSlideId].classList.contains(this.markerActiveClass)) {
            this.markersGroup.children[this.prevSlideId].classList.remove(this.markerActiveClass)
        }
        this.markersGroup.children[this.currentSlideId].classList.add(this.markerActiveClass)
    }
}