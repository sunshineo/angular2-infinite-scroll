import { Observable } from 'rxjs/Observable';
import { AxisResolver } from './axis-resolver';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/debounce';
export class Scroller {
    constructor(windowElement, $interval, $elementRef, infiniteScrollDownCallback, infiniteScrollUpCallback, infiniteScrollDownDistance, infiniteScrollUpDistance, infiniteScrollParent, infiniteScrollThrottle, isImmediate, horizontal = false, alwaysCallback = false) {
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
        this.axis = new AxisResolver(!this.horizontal);
    }
    defineContainer() {
        if (this.isContainerWindow) {
            this.attachEvent(this.windowElement);
        }
        else {
            this.container = this.windowElement.nativeElement;
        }
    }
    createInterval() {
        if (this.isImmediate) {
            this.checkInterval = this.$interval(() => {
                return this.handler();
            }, 0);
        }
    }
    height(elem) {
        let offsetHeight = this.axis.offsetHeightKey();
        let clientHeight = this.axis.clientHeightKey();
        // elem = elem.nativeElement;
        if (isNaN(elem[offsetHeight])) {
            return this.documentElement[clientHeight];
        }
        else {
            return elem[offsetHeight];
        }
    }
    offsetTop(elem) {
        let top = this.axis.topKey();
        // elem = elem.nativeElement;
        if (!elem.getBoundingClientRect) {
            return;
        }
        return elem.getBoundingClientRect()[top] + this.pageYOffset(elem);
    }
    pageYOffset(elem) {
        let pageYOffset = this.axis.pageYOffsetKey();
        let scrollTop = this.axis.scrollTopKey();
        let offsetTop = this.axis.offsetTopKey();
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
    }
    handler() {
        const container = this.calculatePoints();
        const scrollingDown = this.lastScrollPosition < container.scrolledUntilNow;
        this.lastScrollPosition = container.scrolledUntilNow;
        let remaining;
        let containerBreakpoint;
        if (scrollingDown) {
            remaining = container.totalToScroll - container.scrolledUntilNow;
            containerBreakpoint = container.height * this.scrollDownDistance + 1;
        }
        else {
            remaining = container.scrolledUntilNow;
            containerBreakpoint = container.height * this.scrollUpDistance + 1;
        }
        const shouldScroll = remaining <= containerBreakpoint;
        const triggerCallback = (this.alwaysCallback || shouldScroll) && this.scrollEnabled;
        const shouldClearInterval = shouldScroll && this.checkInterval;
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
    }
    calculatePoints() {
        return this.isContainerWindow
            ? this.calculatePointsForWindow()
            : this.calculatePointsForElement();
    }
    calculatePointsForWindow() {
        // container's height
        const height = this.height(this.container);
        // scrolled until now / current y point
        const scrolledUntilNow = height + this.pageYOffset(this.documentElement);
        // total height / most bottom y point
        const totalToScroll = this.offsetTop(this.$elementRef.nativeElement) + this.height(this.$elementRef.nativeElement);
        return { height, scrolledUntilNow, totalToScroll };
    }
    calculatePointsForElement() {
        let scrollTop = this.axis.scrollTopKey();
        let scrollHeight = this.axis.scrollHeightKey();
        const height = this.height(this.container);
        // perhaps use this.container.offsetTop instead of 'scrollTop'
        const scrolledUntilNow = this.container[scrollTop];
        let containerTopOffset = 0;
        const offsetTop = this.offsetTop(this.container);
        if (offsetTop !== void 0) {
            containerTopOffset = offsetTop;
        }
        const totalToScroll = this.container[scrollHeight];
        // const totalToScroll = this.offsetTop(this.$elementRef.nativeElement) - containerTopOffset + this.height(this.$elementRef.nativeElement);
        return { height, scrolledUntilNow, totalToScroll };
    }
    handleInfiniteScrollDistance(scrollDownDistance, scrollUpDistance) {
        this.scrollDownDistance = parseFloat(scrollDownDistance) || 0;
        this.scrollUpDistance = parseFloat(scrollUpDistance) || 0;
    }
    attachEvent(newContainer) {
        this.clean();
        this.container = newContainer;
        if (newContainer) {
            const throttle = this.infiniteScrollThrottle;
            this.disposeScroll = Observable.fromEvent(this.container, 'scroll')
                .debounce(ev => Observable.timer(throttle))
                .subscribe(ev => this.handler());
        }
    }
    clean() {
        if (this.disposeScroll) {
            this.disposeScroll.unsubscribe();
        }
    }
    handleInfiniteScrollDisabled(enableScroll) {
        this.scrollEnabled = !enableScroll;
        // if (this.scrollEnabled && checkWhenEnabled) {
        // 	checkWhenEnabled = false;
        // 	return handler();
        // }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY3JvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQjtPQUVyQyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQjtPQUN2QywrQkFBK0I7T0FDL0IsMkJBQTJCO09BQzNCLDRCQUE0QjtBQUVuQztJQWVDLFlBQ1MsYUFBd0MsRUFDeEMsU0FBbUIsRUFDbkIsV0FBdUIsRUFDdkIsMEJBQW9DLEVBQ3BDLHdCQUFrQyxFQUMxQywwQkFBa0MsRUFDbEMsd0JBQWdDLEVBQ2hDLG9CQUErQyxFQUN2QyxzQkFBOEIsRUFDOUIsV0FBb0IsRUFDcEIsVUFBVSxHQUFZLEtBQUssRUFDM0IsY0FBYyxHQUFZLEtBQUs7UUFYL0Isa0JBQWEsR0FBYixhQUFhLENBQTJCO1FBQ3hDLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIsK0JBQTBCLEdBQTFCLDBCQUEwQixDQUFVO1FBQ3BDLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBVTtRQUlsQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQVE7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQVM7UUFDcEIsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDM0IsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBZmpDLHVCQUFrQixHQUFXLENBQUMsQ0FBQztRQWlCckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ25HLElBQUksQ0FBQyw0QkFBNEIsQ0FBQywwQkFBMEIsRUFB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QUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztpQkFDakUsUUFBUSxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUMxQyxTQUFTLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7SUFDRixDQUFDO0lBRUQsS0FBSztRQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEMsQ0FBQztJQUNGLENBQUM7SUFFRCw0QkFBNEIsQ0FBRSxZQUFxQjtRQUNsRCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQ25DLGdEQUFnRDtRQUNoRCw2QkFBNkI7UUFDN0IscUJBQXFCO1FBQ3JCLElBQUk7SUFDTCxDQUFDO0FBQ0YsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBBeGlzUmVzb2x2ZXIgfSBmcm9tICcuL2F4aXMtcmVzb2x2ZXInO1xuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2Zyb21FdmVudCc7XG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvdGltZXInO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9kZWJvdW5jZSc7XG5cbmV4cG9ydCBjbGFzcyBTY3JvbGxlciB7XG5cdHB1YmxpYyBzY3JvbGxEb3duRGlzdGFuY2U6IG51bWJlcjtcblx0cHVibGljIHNjcm9sbFVwRGlzdGFuY2U6IG51bWJlcjtcblx0cHVibGljIHNjcm9sbEVuYWJsZWQ6IGJvb2xlYW47XG5cdHB1YmxpYyBjaGVja1doZW5FbmFibGVkOiBib29sZWFuO1xuXHRwdWJsaWMgY29udGFpbmVyOiBXaW5kb3cgfCBFbGVtZW50UmVmIHwgYW55O1xuXHRwdWJsaWMgaW1tZWRpYXRlQ2hlY2s6IGJvb2xlYW47XG5cdHB1YmxpYyB1c2VEb2N1bWVudEJvdHRvbTogYm9vbGVhbjtcblx0cHVibGljIGNoZWNrSW50ZXJ2YWw6IG51bWJlcjtcblx0cHJpdmF0ZSBkb2N1bWVudEVsZW1lbnQ6IFdpbmRvdyB8IEVsZW1lbnRSZWYgfCBhbnk7XG5cdHByaXZhdGUgaXNDb250YWluZXJXaW5kb3c6IGJvb2xlYW47XG5cdHByaXZhdGUgZGlzcG9zZVNjcm9sbDogU3Vic2NyaXB0aW9uO1xuXHRwdWJsaWMgbGFzdFNjcm9sbFBvc2l0aW9uOiBudW1iZXIgPSAwO1xuXHRwcml2YXRlIGF4aXM6IEF4aXNSZXNvbHZlcjtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHdpbmRvd0VsZW1lbnQ6IFdpbmRvdyB8IEVsZW1lbnRSZWYgfCBhbnksXG5cdFx0cHJpdmF0ZSAkaW50ZXJ2YWw6IEZ1bmN0aW9uLFxuXHRcdHByaXZhdGUgJGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG5cdFx0cHJpdmF0ZSBpbmZpbml0ZVNjcm9sbERvd25DYWxsYmFjazogRnVuY3Rpb24sXG5cdFx0cHJpdmF0ZSBpbmZpbml0ZVNjcm9sbFVwQ2FsbGJhY2s6IEZ1bmN0aW9uLFxuXHRcdGluZmluaXRlU2Nyb2xsRG93bkRpc3RhbmNlOiBudW1iZXIsXG5cdFx0aW5maW5pdGVTY3JvbGxVcERpc3RhbmNlOiBudW1iZXIsXG5cdFx0aW5maW5pdGVTY3JvbGxQYXJlbnQ6IFdpbmRvdyB8IEVsZW1lbnRSZWYgfCBhbnksXG5cdFx0cHJpdmF0ZSBpbmZpbml0ZVNjcm9sbFRocm90dGxlOiBudW1iZXIsXG5cdFx0cHJpdmF0ZSBpc0ltbWVkaWF0ZTogYm9vbGVhbixcblx0XHRwcml2YXRlIGhvcml6b250YWw6IGJvb2xlYW4gPSBmYWxzZSxcblx0XHRwcml2YXRlIGFsd2F5c0NhbGxiYWNrOiBib29sZWFuID0gZmFsc2Vcblx0KSB7XG5cdFx0dGhpcy5pc0NvbnRhaW5lcldpbmRvdyA9IHRvU3RyaW5nLmNhbGwodGhpcy53aW5kb3dFbGVtZW50KS5pbmNsdWRlcygnV2luZG93Jyk7XG5cdFx0dGhpcy5kb2N1bWVudEVsZW1lbnQgPSB0aGlzLmlzQ29udGFpbmVyV2luZG93ID8gdGhpcy53aW5kb3dFbGVtZW50LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IG51bGw7XG5cdFx0dGhpcy5oYW5kbGVJbmZpbml0ZVNjcm9sbERpc3RhbmNlKGluZmluaXRlU2Nyb2xsRG93bkRpc3RhbmNlLCBpbmZpbml0ZVNjcm9sbFVwRGlzdGFuY2UpO1xuXG5cdFx0Ly8gaWYgKGF0dHJzLmluZmluaXRlU2Nyb2xsUGFyZW50ICE9IG51bGwpIHtcblx0XHQvLyBcdGF0dGFjaEV2ZW50KGFuZ3VsYXIuZWxlbWVudChlbGVtLnBhcmVudCgpKSk7XG5cdFx0Ly8gfVxuXHRcdHRoaXMuaGFuZGxlSW5maW5pdGVTY3JvbGxEaXNhYmxlZChmYWxzZSk7XG5cdFx0dGhpcy5kZWZpbmVDb250YWluZXIoKTtcblx0XHR0aGlzLmNyZWF0ZUludGVydmFsKCk7XG5cdFx0dGhpcy5heGlzID0gbmV3IEF4aXNSZXNvbHZlcighdGhpcy5ob3Jpem9udGFsKTtcblx0fVxuXG5cdGRlZmluZUNvbnRhaW5lciAoKSB7XG5cdFx0aWYgKHRoaXMuaXNDb250YWluZXJXaW5kb3cpIHtcblx0XHRcdHRoaXMuYXR0YWNoRXZlbnQodGhpcy53aW5kb3dFbGVtZW50KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5jb250YWluZXIgPSB0aGlzLndpbmRvd0VsZW1lbnQubmF0aXZlRWxlbWVudDtcblx0XHR9XG5cdH1cblxuXHRjcmVhdGVJbnRlcnZhbCAoKSB7XG5cdFx0aWYgKHRoaXMuaXNJbW1lZGlhdGUpIHtcblx0XHRcdHRoaXMuY2hlY2tJbnRlcnZhbCA9IHRoaXMuJGludGVydmFsKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlcigpO1xuXHRcdFx0fSwgMCk7XG5cdFx0fVxuXHR9XG5cblx0aGVpZ2h0IChlbGVtOiBhbnkpIHtcblx0XHRsZXQgb2Zmc2V0SGVpZ2h0ID0gdGhpcy5heGlzLm9mZnNldEhlaWdodEtleSgpO1xuXHRcdGxldCBjbGllbnRIZWlnaHQgPSB0aGlzLmF4aXMuY2xpZW50SGVpZ2h0S2V5KCk7XG5cblx0XHQvLyBlbGVtID0gZWxlbS5uYXRpdmVFbGVtZW50O1xuXHRcdGlmIChpc05hTihlbGVtW29mZnNldEhlaWdodF0pKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnRbY2xpZW50SGVpZ2h0XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGVsZW1bb2Zmc2V0SGVpZ2h0XTtcblx0XHR9XG5cdH1cblxuXHRvZmZzZXRUb3AgKGVsZW06IGFueSkge1xuXHRcdGxldCB0b3AgPSB0aGlzLmF4aXMudG9wS2V5KCk7XG5cblx0XHQvLyBlbGVtID0gZWxlbS5uYXRpdmVFbGVtZW50O1xuXHRcdGlmICghZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHsgLy8gfHwgZWxlbS5jc3MoJ25vbmUnKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRyZXR1cm4gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVt0b3BdICsgdGhpcy5wYWdlWU9mZnNldChlbGVtKTtcblx0fVxuXG5cdHBhZ2VZT2Zmc2V0IChlbGVtOiBhbnkpIHtcblx0XHRsZXQgcGFnZVlPZmZzZXQgPSB0aGlzLmF4aXMucGFnZVlPZmZzZXRLZXkoKTtcblx0XHRsZXQgc2Nyb2xsVG9wICAgPSB0aGlzLmF4aXMuc2Nyb2xsVG9wS2V5KCk7XG5cdFx0bGV0IG9mZnNldFRvcCAgID0gdGhpcy5heGlzLm9mZnNldFRvcEtleSgpO1xuXG5cdFx0Ly8gZWxlbSA9IGVsZW0ubmF0aXZlRWxlbWVudDtcblx0XHRpZiAoaXNOYU4od2luZG93W3BhZ2VZT2Zmc2V0XSkpIHtcblx0XHRcdHJldHVybiB0aGlzLmRvY3VtZW50RWxlbWVudFtzY3JvbGxUb3BdO1xuXHRcdH0gZWxzZSBpZiAoZWxlbS5vd25lckRvY3VtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3W3BhZ2VZT2Zmc2V0XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGVsZW1bb2Zmc2V0VG9wXTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVyICgpIHtcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLmNhbGN1bGF0ZVBvaW50cygpO1xuXHRcdGNvbnN0IHNjcm9sbGluZ0Rvd246IGJvb2xlYW4gPSB0aGlzLmxhc3RTY3JvbGxQb3NpdGlvbiA8IGNvbnRhaW5lci5zY3JvbGxlZFVudGlsTm93O1xuXHRcdHRoaXMubGFzdFNjcm9sbFBvc2l0aW9uID0gY29udGFpbmVyLnNjcm9sbGVkVW50aWxOb3c7XG5cblx0XHRsZXQgcmVtYWluaW5nOiBudW1iZXI7XG5cdFx0bGV0IGNvbnRhaW5lckJyZWFrcG9pbnQ6IG51bWJlcjtcblx0XHRpZiAoc2Nyb2xsaW5nRG93bikge1xuXHRcdFx0cmVtYWluaW5nID0gY29udGFpbmVyLnRvdGFsVG9TY3JvbGwgLSBjb250YWluZXIuc2Nyb2xsZWRVbnRpbE5vdztcblx0XHRcdGNvbnRhaW5lckJyZWFrcG9pbnQgPSBjb250YWluZXIuaGVpZ2h0ICogdGhpcy5zY3JvbGxEb3duRGlzdGFuY2UgKyAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1haW5pbmcgPSBjb250YWluZXIuc2Nyb2xsZWRVbnRpbE5vdztcblx0XHRcdGNvbnRhaW5lckJyZWFrcG9pbnQgPSBjb250YWluZXIuaGVpZ2h0ICogdGhpcy5zY3JvbGxVcERpc3RhbmNlICsgMTtcblx0XHR9XG5cdFx0Y29uc3Qgc2hvdWxkU2Nyb2xsOiBib29sZWFuID0gcmVtYWluaW5nIDw9IGNvbnRhaW5lckJyZWFrcG9pbnQ7XG5cdFx0Y29uc3QgdHJpZ2dlckNhbGxiYWNrOiBib29sZWFuID0gKHRoaXMuYWx3YXlzQ2FsbGJhY2sgfHwgc2hvdWxkU2Nyb2xsKSAmJiB0aGlzLnNjcm9sbEVuYWJsZWQ7XG5cdFx0Y29uc3Qgc2hvdWxkQ2xlYXJJbnRlcnZhbCA9IHNob3VsZFNjcm9sbCAmJiB0aGlzLmNoZWNrSW50ZXJ2YWw7XG5cdFx0Ly8gaWYgKHRoaXMudXNlRG9jdW1lbnRCb3R0b20pIHtcblx0XHQvLyBcdGNvbnRhaW5lci50b3RhbFRvU2Nyb2xsID0gdGhpcy5oZWlnaHQodGhpcy4kZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQpO1xuXHRcdC8vIH1cblx0XHR0aGlzLmNoZWNrV2hlbkVuYWJsZWQgPSBzaG91bGRTY3JvbGw7XG5cblx0XHRpZiAodHJpZ2dlckNhbGxiYWNrKSB7XG5cdFx0XHRpZiAoc2Nyb2xsaW5nRG93bikge1xuXHRcdFx0XHR0aGlzLmluZmluaXRlU2Nyb2xsRG93bkNhbGxiYWNrKHtjdXJyZW50U2Nyb2xsUG9zaXRpb246IGNvbnRhaW5lci5zY3JvbGxlZFVudGlsTm93fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmluZmluaXRlU2Nyb2xsVXBDYWxsYmFjayh7Y3VycmVudFNjcm9sbFBvc2l0aW9uOiBjb250YWluZXIuc2Nyb2xsZWRVbnRpbE5vd30pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoc2hvdWxkQ2xlYXJJbnRlcnZhbCkge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmNoZWNrSW50ZXJ2YWwpO1xuXHRcdH1cblx0fVxuXG5cdGNhbGN1bGF0ZVBvaW50cygpIHtcblx0XHRyZXR1cm4gdGhpcy5pc0NvbnRhaW5lcldpbmRvd1xuXHRcdFx0PyB0aGlzLmNhbGN1bGF0ZVBvaW50c0ZvcldpbmRvdygpXG5cdFx0XHQ6IHRoaXMuY2FsY3VsYXRlUG9pbnRzRm9yRWxlbWVudCgpO1xuXHR9XG5cblx0Y2FsY3VsYXRlUG9pbnRzRm9yV2luZG93ICgpIHtcblx0XHQvLyBjb250YWluZXIncyBoZWlnaHRcblx0XHRjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodCh0aGlzLmNvbnRhaW5lcik7XG5cdFx0Ly8gc2Nyb2xsZWQgdW50aWwgbm93IC8gY3VycmVudCB5IHBvaW50XG5cdFx0Y29uc3Qgc2Nyb2xsZWRVbnRpbE5vdyA9IGhlaWdodCArIHRoaXMucGFnZVlPZmZzZXQodGhpcy5kb2N1bWVudEVsZW1lbnQpO1xuXHRcdC8vIHRvdGFsIGhlaWdodCAvIG1vc3QgYm90dG9tIHkgcG9pbnRcblx0XHRjb25zdCB0b3RhbFRvU2Nyb2xsID0gdGhpcy5vZmZzZXRUb3AodGhpcy4kZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSArIHRoaXMuaGVpZ2h0KHRoaXMuJGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG5cdFx0cmV0dXJuIHsgaGVpZ2h0LCBzY3JvbGxlZFVudGlsTm93LCB0b3RhbFRvU2Nyb2xsIH07XG5cdH1cblxuXHRjYWxjdWxhdGVQb2ludHNGb3JFbGVtZW50ICgpIHtcblx0XHRsZXQgc2Nyb2xsVG9wICAgID0gdGhpcy5heGlzLnNjcm9sbFRvcEtleSgpO1xuXHRcdGxldCBzY3JvbGxIZWlnaHQgPSB0aGlzLmF4aXMuc2Nyb2xsSGVpZ2h0S2V5KCk7XG5cblx0XHRjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodCh0aGlzLmNvbnRhaW5lcik7XG5cdFx0Ly8gcGVyaGFwcyB1c2UgdGhpcy5jb250YWluZXIub2Zmc2V0VG9wIGluc3RlYWQgb2YgJ3Njcm9sbFRvcCdcblx0XHRjb25zdCBzY3JvbGxlZFVudGlsTm93ID0gdGhpcy5jb250YWluZXJbc2Nyb2xsVG9wXTtcblx0XHRsZXQgY29udGFpbmVyVG9wT2Zmc2V0ID0gMDtcblx0XHRjb25zdCBvZmZzZXRUb3AgPSB0aGlzLm9mZnNldFRvcCh0aGlzLmNvbnRhaW5lcik7XG5cdFx0aWYgKG9mZnNldFRvcCAhPT0gdm9pZCAwKSB7XG5cdFx0XHRjb250YWluZXJUb3BPZmZzZXQgPSBvZmZzZXRUb3A7XG5cdFx0fVxuXHRcdGNvbnN0IHRvdGFsVG9TY3JvbGwgPSB0aGlzLmNvbnRhaW5lcltzY3JvbGxIZWlnaHRdO1xuXHRcdC8vIGNvbnN0IHRvdGFsVG9TY3JvbGwgPSB0aGlzLm9mZnNldFRvcCh0aGlzLiRlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIC0gY29udGFpbmVyVG9wT2Zmc2V0ICsgdGhpcy5oZWlnaHQodGhpcy4kZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblx0XHRyZXR1cm4geyBoZWlnaHQsIHNjcm9sbGVkVW50aWxOb3csIHRvdGFsVG9TY3JvbGwgfTtcblx0fVxuXG5cdGhhbmRsZUluZmluaXRlU2Nyb2xsRGlzdGFuY2UgKHNjcm9sbERvd25EaXN0YW5jZTogbnVtYmVyIHwgYW55LCBzY3JvbGxVcERpc3RhbmNlOiBudW1iZXIgfCBhbnkpIHtcblx0XHR0aGlzLnNjcm9sbERvd25EaXN0YW5jZSA9IHBhcnNlRmxvYXQoc2Nyb2xsRG93bkRpc3RhbmNlKSB8fCAwO1xuXHRcdHRoaXMuc2Nyb2xsVXBEaXN0YW5jZSA9IHBhcnNlRmxvYXQoc2Nyb2xsVXBEaXN0YW5jZSkgfHwgMDtcblx0fVxuXG5cdGF0dGFjaEV2ZW50IChuZXdDb250YWluZXI6IFdpbmRvdyB8IEVsZW1lbnRSZWYgfCBhbnkpIHtcblx0XHR0aGlzLmNsZWFuKCk7XG5cdFx0dGhpcy5jb250YWluZXIgPSBuZXdDb250YWluZXI7XG5cdFx0aWYgKG5ld0NvbnRhaW5lcikge1xuXHRcdFx0Y29uc3QgdGhyb3R0bGU6IG51bWJlciA9IHRoaXMuaW5maW5pdGVTY3JvbGxUaHJvdHRsZTtcblx0XHRcdHRoaXMuZGlzcG9zZVNjcm9sbCA9IE9ic2VydmFibGUuZnJvbUV2ZW50KHRoaXMuY29udGFpbmVyLCAnc2Nyb2xsJylcblx0XHRcdFx0LmRlYm91bmNlKGV2ID0+IE9ic2VydmFibGUudGltZXIodGhyb3R0bGUpKVxuXHRcdFx0XHQuc3Vic2NyaWJlKGV2ID0+IHRoaXMuaGFuZGxlcigpKVxuXHRcdH1cblx0fVxuXG5cdGNsZWFuICgpIHtcblx0XHRpZiAodGhpcy5kaXNwb3NlU2Nyb2xsKSB7XG5cdFx0XHR0aGlzLmRpc3Bvc2VTY3JvbGwudW5zdWJzY3JpYmUoKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVJbmZpbml0ZVNjcm9sbERpc2FibGVkIChlbmFibGVTY3JvbGw6IGJvb2xlYW4pIHtcblx0XHR0aGlzLnNjcm9sbEVuYWJsZWQgPSAhZW5hYmxlU2Nyb2xsO1xuXHRcdC8vIGlmICh0aGlzLnNjcm9sbEVuYWJsZWQgJiYgY2hlY2tXaGVuRW5hYmxlZCkge1xuXHRcdC8vIFx0Y2hlY2tXaGVuRW5hYmxlZCA9IGZhbHNlO1xuXHRcdC8vIFx0cmV0dXJuIGhhbmRsZXIoKTtcblx0XHQvLyB9XG5cdH1cbn1cbiJdfQ==