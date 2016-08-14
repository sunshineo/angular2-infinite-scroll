System.register("src/infinite-scroll", ["node_modules/@angular/core", "src/scroller"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, scroller_1;
    var __decorate, __metadata, InfiniteScroll;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (scroller_1_1) {
                scroller_1 = scroller_1_1;
            }],
        execute: function() {
            __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
                var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
                if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
                    r = Reflect.decorate(decorators, target, key, desc);
                else
                    for (var i = decorators.length - 1; i >= 0; i--)
                        if (d = decorators[i])
                            r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            };
            __metadata = (this && this.__metadata) || function (k, v) {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
                    return Reflect.metadata(k, v);
            };
            exports_1("InfiniteScroll", InfiniteScroll = (function () {
                function InfiniteScroll(element) {
                    this.element = element;
                    this._distanceDown = 2;
                    this._distanceUp = 1.5;
                    this._throttle = 3;
                    this.scrollWindow = true;
                    this._immediate = false;
                    this._horizontal = false;
                    this._alwaysCallback = false;
                    this.scrolled = new core_1.EventEmitter();
                    this.scrolledUp = new core_1.EventEmitter();
                }
                InfiniteScroll.prototype.ngOnInit = function () {
                    var containerElement = this.scrollWindow ? window : this.element;
                    this.scroller = new scroller_1.Scroller(containerElement, setInterval, this.element, this.onScrollDown.bind(this), this.onScrollUp.bind(this), this._distanceDown, this._distanceUp, {}, this._throttle, this._immediate, this._horizontal, this._alwaysCallback);
                };
                InfiniteScroll.prototype.ngOnDestroy = function () {
                    this.scroller.clean();
                };
                InfiniteScroll.prototype.onScrollDown = function (data) {
                    if (data === void 0) { data = {}; }
                    this.scrolled.next(data);
                };
                InfiniteScroll.prototype.onScrollUp = function (data) {
                    if (data === void 0) { data = {}; }
                    this.scrolledUp.next(data);
                };
                InfiniteScroll.prototype.handleScroll = function (event) {
                    this.scroller.handler();
                };
                return InfiniteScroll;
            }()));
            __decorate([
                core_1.Input('infiniteScrollDistance'),
                __metadata('design:type', Number)
            ], InfiniteScroll.prototype, "_distanceDown", void 0);
            __decorate([
                core_1.Input('infiniteScrollUpDistance'),
                __metadata('design:type', Number)
            ], InfiniteScroll.prototype, "_distanceUp", void 0);
            __decorate([
                core_1.Input('infiniteScrollThrottle'),
                __metadata('design:type', Number)
            ], InfiniteScroll.prototype, "_throttle", void 0);
            __decorate([
                core_1.Input('scrollWindow'),
                __metadata('design:type', Boolean)
            ], InfiniteScroll.prototype, "scrollWindow", void 0);
            __decorate([
                core_1.Input('immediateCheck'),
                __metadata('design:type', Boolean)
            ], InfiniteScroll.prototype, "_immediate", void 0);
            __decorate([
                core_1.Input('horizontal'),
                __metadata('design:type', Boolean)
            ], InfiniteScroll.prototype, "_horizontal", void 0);
            __decorate([
                core_1.Input('alwaysCallback'),
                __metadata('design:type', Boolean)
            ], InfiniteScroll.prototype, "_alwaysCallback", void 0);
            __decorate([
                core_1.Output(),
                __metadata('design:type', Object)
            ], InfiniteScroll.prototype, "scrolled", void 0);
            __decorate([
                core_1.Output(),
                __metadata('design:type', Object)
            ], InfiniteScroll.prototype, "scrolledUp", void 0);
            __decorate([
                core_1.HostListener('scroll', ['$event']),
                __metadata('design:type', Function),
                __metadata('design:paramtypes', [Object]),
                __metadata('design:returntype', void 0)
            ], InfiniteScroll.prototype, "handleScroll", null);
            exports_1("InfiniteScroll", InfiniteScroll = __decorate([
                core_1.Directive({
                    selector: '[infinite-scroll]'
                }),
                __metadata('design:paramtypes', [core_1.ElementRef])
            ], InfiniteScroll));
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5maW5pdGUtc2Nyb2xsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5maW5pdGUtc2Nyb2xsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7UUFBSSxVQUFVLEVBTVYsVUFBVSxFQUtILGNBQWM7Ozs7Ozs7Ozs7WUFYckIsVUFBVSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7Z0JBQ2pGLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDN0gsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxVQUFVLENBQUM7b0JBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9ILElBQUk7b0JBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7d0JBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxN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
System.register("src/scroller", ["node_modules/rxjs/Observable", "src/axis-resolver", "node_modules/rxjs/add/observable/fromEvent", "node_modules/rxjs/add/observable/timer", "node_modules/rxjs/add/operator/debounce"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Observable_1, axis_resolver_1;
    var Scroller;
    return {
        setters:[
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (axis_resolver_1_1) {
                axis_resolver_1 = axis_resolver_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {}],
        execute: function() {
            Scroller = (function () {
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
            exports_1("Scroller", Scroller);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzY3JvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQUtBO2dCQUNJLGtCQUFZLGFBQWEsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLDBCQUEwQixFQUFFLHdCQUF3QixFQUFFLDBCQUEwQixFQUFFLHdCQUF3QixFQUFFLG9CQUFvQixFQUFFLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxVQUFrQixFQUFFLGNBQXNCO29CQUExQywwQkFBa0IsR0FBbEIsa0JBQWtCO29CQUFFLDhCQUFzQixHQUF0QixzQkFBc0I7b0JBQ2hRLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO29CQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQywwQkFBMEIsR0FBRywwQkFBMEIsQ0FBQztvQkFDN0QsSUFBSSxDQUFDLHdCQUF3QixHQUFHLHdCQUF3QixDQUFDO29CQUN6RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUM7b0JBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzlFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7b0JB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
System.register("src/axis-resolver", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AxisResolver;
    return {
        setters:[],
        execute: function() {
            AxisResolver = (function () {
                function AxisResolver(vertical) {
                    if (vertical === void 0) { vertical = true; }
                    this.vertical = vertical;
                }
                AxisResolver.prototype.clientHeightKey = function () { return this.vertical ? 'clientHeight' : 'clientWidth'; };
                AxisResolver.prototype.offsetHeightKey = function () { return this.vertical ? 'offsetHeight' : 'offsetWidth'; };
                AxisResolver.prototype.scrollHeightKey = function () { return this.vertical ? 'scrollHeight' : 'scrollWidth'; };
                AxisResolver.prototype.pageYOffsetKey = function () { return this.vertical ? 'pageYOffset' : 'pageXOffset'; };
                AxisResolver.prototype.offsetTopKey = function () { return this.vertical ? 'offsetTop' : 'offsetLeft'; };
                AxisResolver.prototype.scrollTopKey = function () { return this.vertical ? 'scrollTop' : 'scrollLeft'; };
                AxisResolver.prototype.topKey = function () { return this.vertical ? 'top' : 'left'; };
                return AxisResolver;
            }());
            exports_1("AxisResolver", AxisResolver);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpcy1yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF4aXMtcmVzb2x2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQUFBO2dCQUNJLHNCQUFZLFFBQWU7b0JBQWYsd0JBQWUsR0FBZixlQUFlO29CQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFDN0IsQ0FBQztnQkFDRCxzQ0FBZSxHQUFmLGNBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxzQ0FBZSxHQUFmLGNBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxzQ0FBZSxHQUFmLGNBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxxQ0FBYyxHQUFkLGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUMxRSxtQ0FBWSxHQUFaLGNBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxtQ0FBWSxHQUFaLGNBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSw2QkFBTSxHQUFOLGNBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELG1CQUFDO1lBQUQsQ0FBQyxBQVhELElBV0M7WUFYRCx1Q0FXQyxDQUFBOzs7O0FBQ0QsczdEQUFzN0QifQ==
System.register("angular2-infinite-scroll", ["src/infinite-scroll", "src/scroller", "src/axis-resolver"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var infinite_scroll_1, scroller_1, axis_resolver_1;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (infinite_scroll_1_1) {
                infinite_scroll_1 = infinite_scroll_1_1;
                exportStar_1(infinite_scroll_1_1);
            },
            function (scroller_1_1) {
                scroller_1 = scroller_1_1;
                exportStar_1(scroller_1_1);
            },
            function (axis_resolver_1_1) {
                axis_resolver_1 = axis_resolver_1_1;
                exportStar_1(axis_resolver_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [infinite_scroll_1.InfiniteScroll, scroller_1.Scroller, axis_resolver_1.AxisResolver]
            });
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjItaW5maW5pdGUtc2Nyb2xsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjItaW5maW5pdGUtc2Nyb2xsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBTUEsb0JBQWU7Z0JBQ1gsVUFBVSxFQUFFLENBQUMsZ0NBQWMsRUFBRSxtQkFBUSxFQUFFLDRCQUFZLENBQUM7YUFDdkQsRUFBQzs7OztBQUNGLDhnQ0FBOGdDIn0=