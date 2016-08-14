var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Scroller } from './scroller';
export let InfiniteScroll = class InfiniteScroll {
    constructor(element) {
        this.element = element;
        this._distanceDown = 2;
        this._distanceUp = 1.5;
        this._throttle = 3;
        this.scrollWindow = true;
        this._immediate = false;
        this._horizontal = false;
        this._alwaysCallback = false;
        this.scrolled = new EventEmitter();
        this.scrolledUp = new EventEmitter();
    }
    ngOnInit() {
        const containerElement = this.scrollWindow ? window : this.element;
        this.scroller = new Scroller(containerElement, setInterval, this.element, this.onScrollDown.bind(this), this.onScrollUp.bind(this), this._distanceDown, this._distanceUp, {}, this._throttle, this._immediate, this._horizontal, this._alwaysCallback);
    }
    ngOnDestroy() {
        this.scroller.clean();
    }
    onScrollDown(data = {}) {
        this.scrolled.next(data);
    }
    onScrollUp(data = {}) {
        this.scrolledUp.next(data);
    }
    handleScroll(event) {
        this.scroller.handler();
    }
};
__decorate([
    Input('infiniteScrollDistance'), 
    __metadata('design:type', Number)
], InfiniteScroll.prototype, "_distanceDown", void 0);
__decorate([
    Input('infiniteScrollUpDistance'), 
    __metadata('design:type', Number)
], InfiniteScroll.prototype, "_distanceUp", void 0);
__decorate([
    Input('infiniteScrollThrottle'), 
    __metadata('design:type', Number)
], InfiniteScroll.prototype, "_throttle", void 0);
__decorate([
    Input('scrollWindow'), 
    __metadata('design:type', Boolean)
], InfiniteScroll.prototype, "scrollWindow", void 0);
__decorate([
    Input('immediateCheck'), 
    __metadata('design:type', Boolean)
], InfiniteScroll.prototype, "_immediate", void 0);
__decorate([
    Input('horizontal'), 
    __metadata('design:type', Boolean)
], InfiniteScroll.prototype, "_horizontal", void 0);
__decorate([
    Input('alwaysCallback'), 
    __metadata('design:type', Boolean)
], InfiniteScroll.prototype, "_alwaysCallback", void 0);
__decorate([
    Output(), 
    __metadata('design:type', Object)
], InfiniteScroll.prototype, "scrolled", void 0);
__decorate([
    Output(), 
    __metadata('design:type', Object)
], InfiniteScroll.prototype, "scrolledUp", void 0);
__decorate([
    HostListener('scroll', ['$event']), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', void 0)
], InfiniteScroll.prototype, "handleScroll", null);
InfiniteScroll = __decorate([
    Directive({
        selector: '[infinite-scroll]'
    }), 
    __metadata('design:paramtypes', [ElementRef])
], InfiniteScroll);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5maW5pdGUtc2Nyb2xsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5maW5pdGUtc2Nyb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQXFCLE1BQU0sZUFBZTtPQUM1RyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVk7QUFLckM7SUFjRSxZQUFvQixPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBWE4sa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDeEIsZ0JBQVcsR0FBVyxHQUFHLENBQUM7UUFDNUIsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUNoQyxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUMzQixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQ2hDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQ3pCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBRWhELGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBRUEsQ0FBQztJQUUzQyxRQUFRO1FBQ04sTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQ3BFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN4RCxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQ3hELElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBSSxHQUFHLEVBQUU7UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtRQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBR0QsWUFBWSxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixDQUFDO0FBQ0gsQ0FBQztBQXJDQztJQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQzs7cURBQUE7QUFDaEM7SUFBQyxLQUFLLENBQUMsMEJBQTBCLENBQUM7O21EQUFBO0FBQ2xDO0lBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDOztpREFBQTtBQUNoQztJQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7O29EQUFBO0FBQ3RCO0lBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDOztrREFBQTtBQUN4QjtJQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7O21EQUFBO0FBQ3BCO0lBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDOzt1REFBQTtBQUV4QjtJQUFDLE1BQU0sRUFBRTs7Z0RBQUE7QUFDVDtJQUFDLE1BQU0sRUFBRTs7a0RBQUE7QUF3QlQ7SUFBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7a0RBQUE7QUF2Q3JDO0lBQUMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG1CQUFtQjtLQUM5QixDQUFDOztrQkFBQTtBQXlDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxlciB9IGZyb20gJy4vc2Nyb2xsZXInO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbaW5maW5pdGUtc2Nyb2xsXSdcbn0pXG5leHBvcnQgY2xhc3MgSW5maW5pdGVTY3JvbGwgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIHB1YmxpYyBzY3JvbGxlcjogU2Nyb2xsZXI7XG5cbiAgQElucHV0KCdpbmZpbml0ZVNjcm9sbERpc3RhbmNlJykgX2Rpc3RhbmNlRG93bjogbnVtYmVyID0gMjtcbiAgQElucHV0KCdpbmZpbml0ZVNjcm9sbFVwRGlzdGFuY2UnKSBfZGlzdGFuY2VVcDogbnVtYmVyID0gMS41O1xuICBASW5wdXQoJ2luZmluaXRlU2Nyb2xsVGhyb3R0bGUnKSBfdGhyb3R0bGU6IG51bWJlciA9IDM7XG4gIEBJbnB1dCgnc2Nyb2xsV2luZG93Jykgc2Nyb2xsV2luZG93OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCdpbW1lZGlhdGVDaGVjaycpIF9pbW1lZGlhdGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCdob3Jpem9udGFsJykgX2hvcml6b250YWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCdhbHdheXNDYWxsYmFjaycpIF9hbHdheXNDYWxsYmFjazogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBzY3JvbGxlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNjcm9sbGVkVXAgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lckVsZW1lbnQgPSB0aGlzLnNjcm9sbFdpbmRvdyA/IHdpbmRvdyA6IHRoaXMuZWxlbWVudDtcbiAgICB0aGlzLnNjcm9sbGVyID0gbmV3IFNjcm9sbGVyKGNvbnRhaW5lckVsZW1lbnQsIHNldEludGVydmFsLCB0aGlzLmVsZW1lbnQsXG4gICAgICAgIHRoaXMub25TY3JvbGxEb3duLmJpbmQodGhpcyksIHRoaXMub25TY3JvbGxVcC5iaW5kKHRoaXMpLFxuICAgICAgICB0aGlzLl9kaXN0YW5jZURvd24sIHRoaXMuX2Rpc3RhbmNlVXAsIHt9LCB0aGlzLl90aHJvdHRsZSxcbiAgICAgICAgdGhpcy5faW1tZWRpYXRlLCB0aGlzLl9ob3Jpem9udGFsLCB0aGlzLl9hbHdheXNDYWxsYmFjayk7XG4gIH1cblxuICBuZ09uRGVzdHJveSAoKSB7XG4gICAgdGhpcy5zY3JvbGxlci5jbGVhbigpO1xuICB9XG5cbiAgb25TY3JvbGxEb3duKGRhdGEgPSB7fSkge1xuICAgIHRoaXMuc2Nyb2xsZWQubmV4dChkYXRhKTtcbiAgfVxuXG4gIG9uU2Nyb2xsVXAoZGF0YSA9IHt9KSB7XG4gICAgdGhpcy5zY3JvbGxlZFVwLm5leHQoZGF0YSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdzY3JvbGwnLCBbJyRldmVudCddKVxuICBoYW5kbGVTY3JvbGwoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuc2Nyb2xsZXIuaGFuZGxlcigpO1xuICB9XG59XG4iXX0=