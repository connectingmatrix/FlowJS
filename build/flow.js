/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/core.ts":
/*!*********************!*\
  !*** ./lib/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   runFlow: () => (/* binding */ runFlow)\n/* harmony export */ });\nfunction runFlow() {\n    const flow = this;\n    console.log('Starting flow');\n    if (flow.flowRunning)\n        return;\n    flow.flowRunning = true;\n    // TODO: Call all init pipes first, so they can properly initialize. (Needed for classes and other larger libs.)\n    // If no event sources, then go ahead and run flow using the first .to as our event source.\n    if (flow.pipes.events.length === 0) {\n        const target = flow.pipes.targets[0];\n        callNext.call(flow, 0, target);\n        return;\n    }\n    // For each event source, go ahead and call it to init the events.\n    const events = flow.pipes.events;\n    for (const event of events) {\n        callNext.call(flow, -1, event);\n    }\n}\nfunction callNext(index, next, ...params) {\n    console.log('Next target:');\n    console.log(next);\n    const flow = this;\n    function pipeCallback() {\n        console.log(next.target.name, 'used callback');\n        nextPipe.call(flow, index + 1, ...Array.from(arguments));\n    }\n    const props = [...params, ...next.params];\n    props.push(pipeCallback);\n    console.log(next.target.name, 'props', props);\n    // TODO: Wrap in try catch expression to catch errors.\n    const retValue = next.target.apply({}, props);\n    const retType = typeof retValue;\n    if (retType === 'object' && retValue instanceof Promise) {\n        retValue.then((...args) => pipeCallback.call(null, ...Array.from(args)));\n    }\n}\nfunction nextPipe(index, ...props) {\n    console.log('next:', index);\n    console.log('args:', arguments);\n    const targets = this.pipes.targets;\n    const next = targets[index];\n    // If we're at the end of the flow\n    if (!next || !next.target) {\n        this.flowRunning = false;\n        if (this.promisified.isPromised) {\n            this.promisified.resolve(...props);\n            this.promisified.isPromised = false;\n        }\n        return console.log('End of flow at', index);\n    }\n    callNext.call(this, index, next, ...props);\n}\nfunction handleErrors() {\n    // Special use cases\n    // You need special error handler events for modules that expect to use them\n    // You can pass these errors to typical error handlers like throw using the syntax:\n    // .onError(err => throw new Error(err))\n    // Once this is finished, look for any .or() branches to continue chain.\n    // .or() will start a new flow and link these two Flows together.\n}\n\n\n\n//# sourceURL=webpack://flow/./lib/core.ts?");

/***/ }),

/***/ "./lib/helpers.ts":
/*!************************!*\
  !*** ./lib/helpers.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isPrimitive: () => (/* binding */ isPrimitive)\n/* harmony export */ });\n// Modified from: https://cwestblog.com/2011/08/02/javascript-isprimitive-function/\nfunction isPrimitive(arg) {\n    const type = typeof arg;\n    if (arg && type === 'object' && arg.then && typeof arg.then === 'function')\n        return false;\n    return arg == null || (type != \"function\");\n}\n\n\n\n//# sourceURL=webpack://flow/./lib/helpers.ts?");

/***/ }),

/***/ "./lib/index.ts":
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Flow: () => (/* binding */ Flow)\n/* harmony export */ });\n/* harmony import */ var _flow_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @flow/core */ \"./lib/core.ts\");\n/* harmony import */ var _flow_methods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @flow/methods */ \"./lib/methods.ts\");\n\n\nclass Flow {\n    thread() {\n        return new Flow();\n    }\n    static use(name, module) {\n        if (this.modules[name])\n            throw new Error(name + ' collides with existing Flow module or property.');\n        this.modules[name] = module;\n    }\n    constructor() {\n        this.pipes = {\n            init: [],\n            events: [],\n            targets: [],\n        };\n        this.flowRunning = false;\n        this.promisified = {\n            isPromised: false,\n            resolve: () => { },\n            reject: () => { },\n        };\n        this.init = function (target) {\n            // If target is a class or initializer of some kind.\n            return _flow_methods__WEBPACK_IMPORTED_MODULE_1__.addPipe.call(this, 'init', target, Array.from(arguments).slice(1));\n        };\n        this.to = function (target) {\n            return _flow_methods__WEBPACK_IMPORTED_MODULE_1__.addPipe.call(this, 'to', target, Array.from(arguments).slice(1));\n        };\n        this.from = function (target) {\n            // Spawn a new Flow (if needed), because its a new Event Source.\n            return _flow_methods__WEBPACK_IMPORTED_MODULE_1__.addPipe.call(this, 'from', target, Array.from(arguments).slice(1));\n        };\n        this.run = function () {\n            if (this.promisified.isPromised)\n                return new Promise((resolve, reject) => {\n                    this.promisified.resolve = resolve;\n                    this.promisified.reject = reject;\n                    _flow_core__WEBPACK_IMPORTED_MODULE_0__.runFlow.call(this);\n                });\n            else\n                _flow_core__WEBPACK_IMPORTED_MODULE_0__.runFlow.call(this);\n        };\n        this.waitFor = function (target) {\n            // waitFor will accept a conditional and value (using a proxy) or function\n            // waitFor will also accept a flow, and check if waitingForEvent = false\n            return _flow_methods__WEBPACK_IMPORTED_MODULE_1__.addPipe.call(this, 'waitFor', target, Array.from(arguments).slice(1));\n        };\n        this.promisify = () => {\n            this.promisified.isPromised = true;\n            return this;\n        };\n        this.modules = {};\n        //@ts-ignore\n        this.modules = this.constructor.modules;\n        return new Proxy(this, {\n            get: function (target, property) {\n                if (Reflect.has(target, property))\n                    return Reflect.get(target, property);\n                else if (Reflect.has(target.modules, property))\n                    //@ts-ignore  \n                    return target.modules[property];\n            }\n        });\n    }\n}\nFlow.modules = {};\n\n\n//# sourceURL=webpack://flow/./lib/index.ts?");

/***/ }),

/***/ "./lib/methods.ts":
/*!************************!*\
  !*** ./lib/methods.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addPipe: () => (/* binding */ addPipe),\n/* harmony export */   isConstructor: () => (/* binding */ isConstructor)\n/* harmony export */ });\n/* harmony import */ var _flow_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @flow/helpers */ \"./lib/helpers.ts\");\n\nfunction isConstructor(f) {\n    try {\n        Reflect.construct(String, [], f);\n        return true;\n    }\n    catch (e) {\n        return false;\n    }\n}\n// Pipe control\nfunction addPipe(direction, target, params) {\n    const pipe = {\n        direction,\n        target,\n        params,\n    };\n    // Wrap any targets that are primitives with arrow function\n    if (typeof target !== 'function') // Because functions are also objects\n        if ((0,_flow_helpers__WEBPACK_IMPORTED_MODULE_0__.isPrimitive)(target))\n            pipe.target = async () => target;\n    // Wrap any targets that are Promises with arrow function.\n    //@ts-ignore\n    if (typeof target === 'object' && typeof target.then === 'function') {\n        //@ts-ignore\n        pipe.target = (cb) => target.then(cb);\n    }\n    const flow = this;\n    switch (pipe.direction) {\n        case 'init':\n            if (!isConstructor(target))\n                throw new Error('Flow target is not a constructor!');\n            //console.log('init added for:', pipe)\n            //flow.pipes.init.push(pipe)\n            //@ts-ignore\n            const instance = new target(...params);\n            flow.pipes.init.push(instance);\n            break;\n        case 'from':\n            console.log('from added for:', pipe);\n            flow.pipes.events.push(pipe);\n            break;\n        case 'to':\n            flow.pipes.targets.push(pipe);\n            break;\n        default:\n            // Shouldn't be here.\n            console.warn('WARNING: Flow has received an unknown pipe direction. Please post a bug to the author about this.');\n            break;\n    }\n    console.log(`Added .${direction}(${target.name || 'anonymous'})`);\n    return this;\n}\n\n\n//# sourceURL=webpack://flow/./lib/methods.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./lib/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});