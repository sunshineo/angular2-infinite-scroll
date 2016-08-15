"use strict";
var Observable_1 = require('rxjs/Observable');
var axis_resolver_1 = require('./axis-resolver');
require('rxjs/add/observable/fromEvent');
require('rxjs/add/observable/timer');
require('rxjs/add/operator/debounce');
var Scroller = (function () {
    function Scroller(windowElement, $interval, $elementRef, infiniteScrollDownCallback, infiniteScrollUpCallback, infiniteScrollDownDistance, infiniteScrollUpDistance, infiniteScrollParent, infiniteScrollThrottle, isImmediate, horizontal, alwaysCallback) {
        if (horizontal === void 0) { horizontal = false; }
        if (alwaysCallback === void 0) { alwaysCallback = false; }
        this.windowElement = windowElement;
        this.$interval = $interval;
        this.$elementRef = $elementRef;
        this.infiniteScrollDownCallback = infiniteScrollDownCallback;
        this.infiniteScrollUpCallback = infiniteScrollUpCallback;
        this.infiniteScrollThrottle = infiniteScrollThrottle;
        this.isImmediate = isImmediate;
        this.horizontal = horizontal;
        this.alwaysCallback = alwaysCallback;
        this.lastScrollPosition = 0;
        this.isContainerWindow = toString.call(this.windowElement).includes('Window');
        this.documentElement = this.isContainerWindow ? this.windowElement.document.documentElement : null;
        this.handleInfiniteScrollDistance(infiniteScrollDownDistance, infiniteScrollUpDistance);
        // if (attrs.infiniteScrollParent != null) {
        // 	attachEvent(angular.element(elem.parent()));
        // }
        this.handleInfiniteScrollDisabled(false);
        this.defineContainer();
        this.createInterval();
        this.axis = new axis_resolver_1.AxisResolver(!this.horizontal);
    }
    Scroller.prototype.defineContainer = function () {
        if (this.isContainerWindow) {
            this.attachEvent(this.windowElement);
        }
        else {
            this.container = this.windowElement.nativeElement;
        }
    };
    Scroller.prototype.createInterval = function () {
        var _this = this;
        if (this.isImmediate) {
            this.checkInterval = this.$interval(function () {
                return _this.handler();
            }, 0);
        }
    };
    Scroller.prototype.height = function (elem) {
        var offsetHeight = this.axis.offsetHeightKey();
        var clientHeight = this.axis.clientHeightKey();
        // elem = elem.nativeElement;
        if (isNaN(elem[offsetHeight])) {
            return this.documentElement[clientHeight];
        }
        else {
            return elem[offsetHeight];
        }
    };
    Scroller.prototype.offsetTop = function (elem) {
        var top = this.axis.topKey();
        // elem = elem.nativeElement;
        if (!elem.getBoundingClientRect) {
            return;
        }
        return elem.getBoundingClientRect()[top] + this.pageYOffset(elem);
    };
    Scroller.prototype.pageYOffset = function (elem) {
        var pageYOffset = this.axis.pageYOffsetKey();
        var scrollTop = this.axis.scrollTopKey();
        var offsetTop = this.axis.offsetTopKey();
        // elem = elem.nativeElement;
        if (isNaN(window[pageYOffset])) {
            return this.documentElement[scrollTop];
        }
        else if (elem.ownerDocument) {
            return elem.ownerDocument.defaultView[pageYOffset];
        }
        else {
            return elem[offsetTop];
        }
    };
    Scroller.prototype.handler = function () {
        var container = this.calculatePoints();
        var scrollingDown = this.lastScrollPosition < container.scrolledUntilNow;
        this.lastScrollPosition = container.scrolledUntilNow;
        var remaining;
        var containerBreakpoint;
        if (scrollingDown) {
            remaining = container.totalToScroll - container.scrolledUntilNow;
            containerBreakpoint = container.height * this.scrollDownDistance + 1;
        }
        else {
            remaining = container.scrolledUntilNow;
            containerBreakpoint = container.height * this.scrollUpDistance + 1;
        }
        var shouldScroll = remaining <= containerBreakpoint;
        var triggerCallback = (this.alwaysCallback || shouldScroll) && this.scrollEnabled;
        var shouldClearInterval = shouldScroll && this.checkInterval;
        // if (this.useDocumentBottom) {
        // 	container.totalToScroll = this.height(this.$elementRef.nativeElement.ownerDocument);
        // }
        this.checkWhenEnabled = shouldScroll;
        if (triggerCallback) {
            if (scrollingDown) {
                this.infiniteScrollDownCallback({ currentScrollPosition: container.scrolledUntilNow });
            }
            else {
                this.infiniteScrollUpCallback({ currentScrollPosition: container.scrolledUntilNow });
            }
        }
        if (shouldClearInterval) {
            clearInterval(this.checkInterval);
        }
    };
    Scroller.prototype.calculatePoints = function () {
        return this.isContainerWindow
            ? this.calculatePointsForWindow()
            : this.calculatePointsForElement();
    };
    Scroller.prototype.calculatePointsForWindow = function () {
        // container's height
        var height = this.height(this.container);
        // scrolled until now / current y point
        var scrolledUntilNow = height + this.pageYOffset(this.documentElement);
        // total height / most bottom y point
        var totalToScroll = this.offsetTop(this.$elementRef.nativeElement) + this.height(this.$elementRef.nativeElement);
        return { height: height, scrolledUntilNow: scrolledUntilNow, totalToScroll: totalToScroll };
    };
    Scroller.prototype.calculatePointsForElement = function () {
        var scrollTop = this.axis.scrollTopKey();
        var scrollHeight = this.axis.scrollHeightKey();
        var height = this.height(this.container);
        // perhaps use this.container.offsetTop instead of 'scrollTop'
        var scrolledUntilNow = this.container[scrollTop];
        var containerTopOffset = 0;
        var offsetTop = this.offsetTop(this.container);
        if (offsetTop !== void 0) {
            containerTopOffset = offsetTop;
        }
        var totalToScroll = this.container[scrollHeight];
        // const totalToScroll = this.offsetTop(this.$elementRef.nativeElement) - containerTopOffset + this.height(this.$elementRef.nativeElement);
        return { height: height, scrolledUntilNow: scrolledUntilNow, totalToScroll: totalToScroll };
    };
    Scroller.prototype.handleInfiniteScrollDistance = function (scrollDownDistance, scrollUpDistance) {
        this.scrollDownDistance = parseFloat(scrollDownDistance) || 0;
        this.scrollUpDistance = parseFloat(scrollUpDistance) || 0;
    };
    Scroller.prototype.attachEvent = function (newContainer) {
        var _this = this;
        this.clean();
        this.container = newContainer;
        if (newContainer) {
            var throttle_1 = this.infiniteScrollThrottle;
            this.disposeScroll = Observable_1.Observable.fromEvent(this.container, 'scroll')
                .debounce(function (ev) { return Observable_1.Observable.timer(throttle_1); })
                .subscribe(function (ev) { return _this.handler(); });
        }
    };
    Scroller.prototype.clean = function () {
        if (this.disposeScroll) {
            this.disposeScroll.unsubscribe();
        }
    };
    Scroller.prototype.handleInfiniteScrollDisabled = function (enableScroll) {
        this.scrollEnabled = !enableScroll;
        // if (this.scrollEnabled && checkWhenEnabled) {
        // 	checkWhenEnabled = false;
        // 	return handler();
        // }
    };
    return Scroller;
}());
exports.Scroller = Scroller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY3JvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsMkJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFFN0MsOEJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0MsUUFBTywrQkFBK0IsQ0FBQyxDQUFBO0FBQ3ZDLFFBQU8sMkJBQTJCLENBQUMsQ0FBQTtBQUNuQyxRQUFPLDRCQUE0QixDQUFDLENBQUE7QUFFcEM7SUFlQyxrQkFDUyxhQUF3QyxFQUN4QyxTQUFtQixFQUNuQixXQUF1QixFQUN2QiwwQkFBb0MsRUFDcEMsd0JBQWtDLEVBQzFDLDBCQUFrQyxFQUNsQyx3QkFBZ0MsRUFDaEMsb0JBQStDLEVBQ3ZDLHNCQUE4QixFQUM5QixXQUFvQixFQUNwQixVQUEyQixFQUMzQixjQUErQjtRQUR2QywwQkFBbUMsR0FBbkMsa0JBQW1DO1FBQ25DLDhCQUF1QyxHQUF2QyxzQkFBdUM7UUFYL0Isa0JBQWEsR0FBYixhQUFhLENBQTJCO1FBQ3hDLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIsK0JBQTBCLEdBQTFCLDBCQUEwQixDQUFVO1FBQ3BDLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBVTtRQUlsQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQVE7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQVM7UUFDcEIsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDM0IsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBZmpDLHVCQUFrQixHQUFXLENBQUMsQ0FBQztRQWlCckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFB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QztRQUFwRCxpQkFTQztRQVJBLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBTSxVQUFRLEdBQVcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO1lBQ3JELElBQUksQ0FBQyxhQUFhLEdBQUcsdUJBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7aUJBQ2pFLFFBQVEsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLHVCQUFVLENBQUMsS0FBSyxDQUFDLFVBQVEsQ0FBQyxFQUExQixDQUEwQixDQUFDO2lCQUMxQyxTQUFTLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUE7UUFDbEMsQ0FBQztJQUNGLENBQUM7SUFFRCx3QkFBSyxHQUFMO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNsQyxDQUFDO0lBQ0YsQ0FBQztJQUVELCtDQUE0QixHQUE1QixVQUE4QixZQUFxQjtRQUNsRCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQ25DLGdEQUFnRDtRQUNoRCw2QkFBNkI7UUFDN0IscUJBQXFCO1FBQ3JCLElBQUk7SUFDTCxDQUFDO0lBQ0YsZUFBQztBQUFELENBQUMsQUEvTEQsSUErTEM7QUEvTFksZ0JBQVEsV0ErTHBCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMvU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEF4aXNSZXNvbHZlciB9IGZyb20gJy4vYXhpcy1yZXNvbHZlcic7XG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvZnJvbUV2ZW50JztcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS90aW1lcic7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2RlYm91bmNlJztcblxuZXhwb3J0IGNsYXNzIFNjcm9sbGVyIHtcblx0cHVibGljIHNjcm9sbERvd25EaXN0YW5jZTogbnVtYmVyO1xuXHRwdWJsaWMgc2Nyb2xsVXBEaXN0YW5jZTogbnVtYmVyO1xuXHRwdWJsaWMgc2Nyb2xsRW5hYmxlZDogYm9vbGVhbjtcblx0cHVibGljIGNoZWNrV2hlbkVuYWJsZWQ6IGJvb2xlYW47XG5cdHB1YmxpYyBjb250YWluZXI6IFdpbmRvdyB8IEVsZW1lbnRSZWYgfCBhbnk7XG5cdHB1YmxpYyBpbW1lZGlhdGVDaGVjazogYm9vbGVhbjtcblx0cHVibGljIHVzZURvY3VtZW50Qm90dG9tOiBib29sZWFuO1xuXHRwdWJsaWMgY2hlY2tJbnRlcnZhbDogbnVtYmVyO1xuXHRwcml2YXRlIGRvY3VtZW50RWxlbWVudDogV2luZG93IHwgRWxlbWVudFJlZiB8IGFueTtcblx0cHJpdmF0ZSBpc0NvbnRhaW5lcldpbmRvdzogYm9vbGVhbjtcblx0cHJpdmF0ZSBkaXNwb3NlU2Nyb2xsOiBTdWJzY3JpcHRpb247XG5cdHB1YmxpYyBsYXN0U2Nyb2xsUG9zaXRpb246IG51bWJlciA9IDA7XG5cdHByaXZhdGUgYXhpczogQXhpc1Jlc29sdmVyO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgd2luZG93RWxlbWVudDogV2luZG93IHwgRWxlbWVudFJlZiB8IGFueSxcblx0XHRwcml2YXRlICRpbnRlcnZhbDogRnVuY3Rpb24sXG5cdFx0cHJpdmF0ZSAkZWxlbWVudFJlZjogRWxlbWVudFJlZixcblx0XHRwcml2YXRlIGluZmluaXRlU2Nyb2xsRG93bkNhbGxiYWNrOiBGdW5jdGlvbixcblx0XHRwcml2YXRlIGluZmluaXRlU2Nyb2xsVXBDYWxsYmFjazogRnVuY3Rpb24sXG5cdFx0aW5maW5pdGVTY3JvbGxEb3duRGlzdGFuY2U6IG51bWJlcixcblx0XHRpbmZpbml0ZVNjcm9sbFVwRGlzdGFuY2U6IG51bWJlcixcblx0XHRpbmZpbml0ZVNjcm9sbFBhcmVudDogV2luZG93IHwgRWxlbWVudFJlZiB8IGFueSxcblx0XHRwcml2YXRlIGluZmluaXRlU2Nyb2xsVGhyb3R0bGU6IG51bWJlcixcblx0XHRwcml2YXRlIGlzSW1tZWRpYXRlOiBib29sZWFuLFxuXHRcdHByaXZhdGUgaG9yaXpvbnRhbDogYm9vbGVhbiA9IGZhbHNlLFxuXHRcdHByaXZhdGUgYWx3YXlzQ2FsbGJhY2s6IGJvb2xlYW4gPSBmYWxzZVxuXHQpIHtcblx0XHR0aGlzLmlzQ29udGFpbmVyV2luZG93ID0gdG9TdHJpbmcuY2FsbCh0aGlzLndpbmRvd0VsZW1lbnQpLmluY2x1ZGVzKCdXaW5kb3cnKTtcblx0XHR0aGlzLmRvY3VtZW50RWxlbWVudCA9IHRoaXMuaXNDb250YWluZXJXaW5kb3cgPyB0aGlzLndpbmRvd0VsZW1lbnQuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogbnVsbDtcblx0XHR0aGlzLmhhbmRsZUluZmluaXRlU2Nyb2xsRGlzdGFuY2UoaW5maW5pdGVTY3JvbGxEb3duRGlzdGFuY2UsIGluZmluaXRlU2Nyb2xsVXBEaXN0YW5jZSk7XG5cblx0XHQvLyBpZiAoYXR0cnMuaW5maW5pdGVTY3JvbGxQYXJlbnQgIT0gbnVsbCkge1xuXHRcdC8vIFx0YXR0YWNoRXZlbnQoYW5ndWxhci5lbGVtZW50KGVsZW0ucGFyZW50KCkpKTtcblx0XHQvLyB9XG5cdFx0dGhpcy5oYW5kbGVJbmZpbml0ZVNjcm9sbERpc2FibGVkKGZhbHNlKTtcblx0XHR0aGlzLmRlZmluZUNvbnRhaW5lcigpO1xuXHRcdHRoaXMuY3JlYXRlSW50ZXJ2YWwoKTtcblx0XHR0aGlzLmF4aXMgPSBuZXcgQXhpc1Jlc29sdmVyKCF0aGlzLmhvcml6b250YWwpO1xuXHR9XG5cblx0ZGVmaW5lQ29udGFpbmVyICgpIHtcblx0XHRpZiAodGhpcy5pc0NvbnRhaW5lcldpbmRvdykge1xuXHRcdFx0dGhpcy5hdHRhY2hFdmVudCh0aGlzLndpbmRvd0VsZW1lbnQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmNvbnRhaW5lciA9IHRoaXMud2luZG93RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXHRcdH1cblx0fVxuXG5cdGNyZWF0ZUludGVydmFsICgpIHtcblx0XHRpZiAodGhpcy5pc0ltbWVkaWF0ZSkge1xuXHRcdFx0dGhpcy5jaGVja0ludGVydmFsID0gdGhpcy4kaW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGVyKCk7XG5cdFx0XHR9LCAwKTtcblx0XHR9XG5cdH1cblxuXHRoZWlnaHQgKGVsZW06IGFueSkge1xuXHRcdGxldCBvZmZzZXRIZWlnaHQgPSB0aGlzLmF4aXMub2Zmc2V0SGVpZ2h0S2V5KCk7XG5cdFx0bGV0IGNsaWVudEhlaWdodCA9IHRoaXMuYXhpcy5jbGllbnRIZWlnaHRLZXkoKTtcblxuXHRcdC8vIGVsZW0gPSBlbGVtLm5hdGl2ZUVsZW1lbnQ7XG5cdFx0aWYgKGlzTmFOKGVsZW1bb2Zmc2V0SGVpZ2h0XSkpIHtcblx0XHRcdHJldHVybiB0aGlzLmRvY3VtZW50RWxlbWVudFtjbGllbnRIZWlnaHRdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZWxlbVtvZmZzZXRIZWlnaHRdO1xuXHRcdH1cblx0fVxuXG5cdG9mZnNldFRvcCAoZWxlbTogYW55KSB7XG5cdFx0bGV0IHRvcCA9IHRoaXMuYXhpcy50b3BLZXkoKTtcblxuXHRcdC8vIGVsZW0gPSBlbGVtLm5hdGl2ZUVsZW1lbnQ7XG5cdFx0aWYgKCFlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkgeyAvLyB8fCBlbGVtLmNzcygnbm9uZScpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHJldHVybiBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW3RvcF0gKyB0aGlzLnBhZ2VZT2Zmc2V0KGVsZW0pO1xuXHR9XG5cblx0cGFnZVlPZmZzZXQgKGVsZW06IGFueSkge1xuXHRcdGxldCBwYWdlWU9mZnNldCA9IHRoaXMuYXhpcy5wYWdlWU9mZnNldEtleSgpO1xuXHRcdGxldCBzY3JvbGxUb3AgICA9IHRoaXMuYXhpcy5zY3JvbGxUb3BLZXkoKTtcblx0XHRsZXQgb2Zmc2V0VG9wICAgPSB0aGlzLmF4aXMub2Zmc2V0VG9wS2V5KCk7XG5cblx0XHQvLyBlbGVtID0gZWxlbS5uYXRpdmVFbGVtZW50O1xuXHRcdGlmIChpc05hTih3aW5kb3dbcGFnZVlPZmZzZXRdKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZG9jdW1lbnRFbGVtZW50W3Njcm9sbFRvcF07XG5cdFx0fSBlbHNlIGlmIChlbGVtLm93bmVyRG9jdW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXdbcGFnZVlPZmZzZXRdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZWxlbVtvZmZzZXRUb3BdO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZXIgKCkge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY2FsY3VsYXRlUG9pbnRzKCk7XG5cdFx0Y29uc3Qgc2Nyb2xsaW5nRG93bjogYm9vbGVhbiA9IHRoaXMubGFzdFNjcm9sbFBvc2l0aW9uIDwgY29udGFpbmVyLnNjcm9sbGVkVW50aWxOb3c7XG5cdFx0dGhpcy5sYXN0U2Nyb2xsUG9zaXRpb24gPSBjb250YWluZXIuc2Nyb2xsZWRVbnRpbE5vdztcblxuXHRcdGxldCByZW1haW5pbmc6IG51bWJlcjtcblx0XHRsZXQgY29udGFpbmVyQnJlYWtwb2ludDogbnVtYmVyO1xuXHRcdGlmIChzY3JvbGxpbmdEb3duKSB7XG5cdFx0XHRyZW1haW5pbmcgPSBjb250YWluZXIudG90YWxUb1Njcm9sbCAtIGNvbnRhaW5lci5zY3JvbGxlZFVudGlsTm93O1xuXHRcdFx0Y29udGFpbmVyQnJlYWtwb2ludCA9IGNvbnRhaW5lci5oZWlnaHQgKiB0aGlzLnNjcm9sbERvd25EaXN0YW5jZSArIDE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbWFpbmluZyA9IGNvbnRhaW5lci5zY3JvbGxlZFVudGlsTm93O1xuXHRcdFx0Y29udGFpbmVyQnJlYWtwb2ludCA9IGNvbnRhaW5lci5oZWlnaHQgKiB0aGlzLnNjcm9sbFVwRGlzdGFuY2UgKyAxO1xuXHRcdH1cblx0XHRjb25zdCBzaG91bGRTY3JvbGw6IGJvb2xlYW4gPSByZW1haW5pbmcgPD0gY29udGFpbmVyQnJlYWtwb2ludDtcblx0XHRjb25zdCB0cmlnZ2VyQ2FsbGJhY2s6IGJvb2xlYW4gPSAodGhpcy5hbHdheXNDYWxsYmFjayB8fCBzaG91bGRTY3JvbGwpICYmIHRoaXMuc2Nyb2xsRW5hYmxlZDtcblx0XHRjb25zdCBzaG91bGRDbGVhckludGVydmFsID0gc2hvdWxkU2Nyb2xsICYmIHRoaXMuY2hlY2tJbnRlcnZhbDtcblx0XHQvLyBpZiAodGhpcy51c2VEb2N1bWVudEJvdHRvbSkge1xuXHRcdC8vIFx0Y29udGFpbmVyLnRvdGFsVG9TY3JvbGwgPSB0aGlzLmhlaWdodCh0aGlzLiRlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCk7XG5cdFx0Ly8gfVxuXHRcdHRoaXMuY2hlY2tXaGVuRW5hYmxlZCA9IHNob3VsZFNjcm9sbDtcblxuXHRcdGlmICh0cmlnZ2VyQ2FsbGJhY2spIHtcblx0XHRcdGlmIChzY3JvbGxpbmdEb3duKSB7XG5cdFx0XHRcdHRoaXMuaW5maW5pdGVTY3JvbGxEb3duQ2FsbGJhY2soe2N1cnJlbnRTY3JvbGxQb3NpdGlvbjogY29udGFpbmVyLnNjcm9sbGVkVW50aWxOb3d9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuaW5maW5pdGVTY3JvbGxVcENhbGxiYWNrKHtjdXJyZW50U2Nyb2xsUG9zaXRpb246IGNvbnRhaW5lci5zY3JvbGxlZFVudGlsTm93fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChzaG91bGRDbGVhckludGVydmFsKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuY2hlY2tJbnRlcnZhbCk7XG5cdFx0fVxuXHR9XG5cblx0Y2FsY3VsYXRlUG9pbnRzKCkge1xuXHRcdHJldHVybiB0aGlzLmlzQ29udGFpbmVyV2luZG93XG5cdFx0XHQ/IHRoaXMuY2FsY3VsYXRlUG9pbnRzRm9yV2luZG93KClcblx0XHRcdDogdGhpcy5jYWxjdWxhdGVQb2ludHNGb3JFbGVtZW50KCk7XG5cdH1cblxuXHRjYWxjdWxhdGVQb2ludHNGb3JXaW5kb3cgKCkge1xuXHRcdC8vIGNvbnRhaW5lcidzIGhlaWdodFxuXHRcdGNvbnN0IGhlaWdodCA9IHRoaXMuaGVpZ2h0KHRoaXMuY29udGFpbmVyKTtcblx0XHQvLyBzY3JvbGxlZCB1bnRpbCBub3cgLyBjdXJyZW50IHkgcG9pbnRcblx0XHRjb25zdCBzY3JvbGxlZFVudGlsTm93ID0gaGVpZ2h0ICsgdGhpcy5wYWdlWU9mZnNldCh0aGlzLmRvY3VtZW50RWxlbWVudCk7XG5cdFx0Ly8gdG90YWwgaGVpZ2h0IC8gbW9zdCBib3R0b20geSBwb2ludFxuXHRcdGNvbnN0IHRvdGFsVG9TY3JvbGwgPSB0aGlzLm9mZnNldFRvcCh0aGlzLiRlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpICsgdGhpcy5oZWlnaHQodGhpcy4kZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblx0XHRyZXR1cm4geyBoZWlnaHQsIHNjcm9sbGVkVW50aWxOb3csIHRvdGFsVG9TY3JvbGwgfTtcblx0fVxuXG5cdGNhbGN1bGF0ZVBvaW50c0ZvckVsZW1lbnQgKCkge1xuXHRcdGxldCBzY3JvbGxUb3AgICAgPSB0aGlzLmF4aXMuc2Nyb2xsVG9wS2V5KCk7XG5cdFx0bGV0IHNjcm9sbEhlaWdodCA9IHRoaXMuYXhpcy5zY3JvbGxIZWlnaHRLZXkoKTtcblxuXHRcdGNvbnN0IGhlaWdodCA9IHRoaXMuaGVpZ2h0KHRoaXMuY29udGFpbmVyKTtcblx0XHQvLyBwZXJoYXBzIHVzZSB0aGlzLmNvbnRhaW5lci5vZmZzZXRUb3AgaW5zdGVhZCBvZiAnc2Nyb2xsVG9wJ1xuXHRcdGNvbnN0IHNjcm9sbGVkVW50aWxOb3cgPSB0aGlzLmNvbnRhaW5lcltzY3JvbGxUb3BdO1xuXHRcdGxldCBjb250YWluZXJUb3BPZmZzZXQgPSAwO1xuXHRcdGNvbnN0IG9mZnNldFRvcCA9IHRoaXMub2Zmc2V0VG9wKHRoaXMuY29udGFpbmVyKTtcblx0XHRpZiAob2Zmc2V0VG9wICE9PSB2b2lkIDApIHtcblx0XHRcdGNvbnRhaW5lclRvcE9mZnNldCA9IG9mZnNldFRvcDtcblx0XHR9XG5cdFx0Y29uc3QgdG90YWxUb1Njcm9sbCA9IHRoaXMuY29udGFpbmVyW3Njcm9sbEhlaWdodF07XG5cdFx0Ly8gY29uc3QgdG90YWxUb1Njcm9sbCA9IHRoaXMub2Zmc2V0VG9wKHRoaXMuJGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkgLSBjb250YWluZXJUb3BPZmZzZXQgKyB0aGlzLmhlaWdodCh0aGlzLiRlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdHJldHVybiB7IGhlaWdodCwgc2Nyb2xsZWRVbnRpbE5vdywgdG90YWxUb1Njcm9sbCB9O1xuXHR9XG5cblx0aGFuZGxlSW5maW5pdGVTY3JvbGxEaXN0YW5jZSAoc2Nyb2xsRG93bkRpc3RhbmNlOiBudW1iZXIgfCBhbnksIHNjcm9sbFVwRGlzdGFuY2U6IG51bWJlciB8IGFueSkge1xuXHRcdHRoaXMuc2Nyb2xsRG93bkRpc3RhbmNlID0gcGFyc2VGbG9hdChzY3JvbGxEb3duRGlzdGFuY2UpIHx8IDA7XG5cdFx0dGhpcy5zY3JvbGxVcERpc3RhbmNlID0gcGFyc2VGbG9hdChzY3JvbGxVcERpc3RhbmNlKSB8fCAwO1xuXHR9XG5cblx0YXR0YWNoRXZlbnQgKG5ld0NvbnRhaW5lcjogV2luZG93IHwgRWxlbWVudFJlZiB8IGFueSkge1xuXHRcdHRoaXMuY2xlYW4oKTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG5ld0NvbnRhaW5lcjtcblx0XHRpZiAobmV3Q29udGFpbmVyKSB7XG5cdFx0XHRjb25zdCB0aHJvdHRsZTogbnVtYmVyID0gdGhpcy5pbmZpbml0ZVNjcm9sbFRocm90dGxlO1xuXHRcdFx0dGhpcy5kaXNwb3NlU2Nyb2xsID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnQodGhpcy5jb250YWluZXIsICdzY3JvbGwnKVxuXHRcdFx0XHQuZGVib3VuY2UoZXYgPT4gT2JzZXJ2YWJsZS50aW1lcih0aHJvdHRsZSkpXG5cdFx0XHRcdC5zdWJzY3JpYmUoZXYgPT4gdGhpcy5oYW5kbGVyKCkpXG5cdFx0fVxuXHR9XG5cblx0Y2xlYW4gKCkge1xuXHRcdGlmICh0aGlzLmRpc3Bvc2VTY3JvbGwpIHtcblx0XHRcdHRoaXMuZGlzcG9zZVNjcm9sbC51bnN1YnNjcmliZSgpO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZUluZmluaXRlU2Nyb2xsRGlzYWJsZWQgKGVuYWJsZVNjcm9sbDogYm9vbGVhbikge1xuXHRcdHRoaXMuc2Nyb2xsRW5hYmxlZCA9ICFlbmFibGVTY3JvbGw7XG5cdFx0Ly8gaWYgKHRoaXMuc2Nyb2xsRW5hYmxlZCAmJiBjaGVja1doZW5FbmFibGVkKSB7XG5cdFx0Ly8gXHRjaGVja1doZW5FbmFibGVkID0gZmFsc2U7XG5cdFx0Ly8gXHRyZXR1cm4gaGFuZGxlcigpO1xuXHRcdC8vIH1cblx0fVxufVxuIl19