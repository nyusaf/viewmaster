/*jshint eqnull: true, browser: true */
/*global define, module, require */

/**
 * Helper methods for the dom. Using jQuery methods when convenient.
 * Otherwise, defaulting to plain Javascript
 *
 * TODO: Only use vanilla js
 */

 /*
  Module Definition pattern from UMD
  https://github.com/umdjs/umd
  */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // only CommonJS-like environments that support module.exports,
    // like Node and Browserify
    var jquery = require('jquery');
    module.exports = factory(jquery);
  } else {
    // Browser globals (root is window)
    root.Viewmaster = factory();
  }
}(this, function ($) {

  'use strict';

  var previousScroll = 0;

  /**
   * Compatible window scrollY
   *
   * @return  {Number}  window scrollY
   *
   * @public
   * @method getWindowScrollTop
   */
  function getWindowScrollTop () {
    return window.scrollY || window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
  }

  /**
   * Compatible window height
   *
   * @return  {Number}  window height
   *
   * @public
   * @method getWindowHeight
   */
  function getWindowHeight () {
    return window.innerHeight || document.body.clientHeight;
  }

  /**
   * Compatible window width
   *
   * @return  {Number}  window width
   *
   * @public
   * @method getWindowWidth
   */
  function getWindowWidth () {
    return window.innerWidth || document.body.clientWidth;
  }

  /**
   * Get element's position from top of viewport
   *
   * @param   {Object}   el   Dom element
   *
   * @return  {Number}  element's position from top of viewport
   *
   * @public
   * @method getElPositionFromViewportTop
   */
  function getElPositionFromViewportTop (el) {
    return el.getBoundingClientRect().top;
  }

  /**
   * Get height of element that's visible in the viewport
   *
   * @param   {Object}   el   Dom element
   *
   * @return  {Number}  element's height that's in the viewport
   *
   * @public
   * @method getVisibleElHeight
   */
  function getVisibleElHeight (el) {
    var
      $el = $(el),
      elHeight = $el.outerHeight(),
      windowHeight = getWindowHeight(),
      rect = el.getBoundingClientRect(),
      rectTop = rect.top,
      rectBottom = rect.bottom,
      result = 0;

      if (rectTop > 0) {  // there is space above element in viewport
        result = Math.min(elHeight, windowHeight - rectTop);
      } else {
        if (rectBottom < windowHeight) { // there is space below the element in viewport
          result = rectBottom;
        } else {
          result = windowHeight;
        }
      }

    return result;
  }

  /**
   * Is the element cut off?
   * sample usage: sticky long side nav on a search results page
   *
   * @param   {Object}   el             Dom element to be tested
   *
   * @return  {Boolean}  Whether element is cut off
   *
   * @public
   * @method isElementCutOff
   */
  function isElementCutOff (el) {
    var
      $el = $(el),
      visibleElHeight = getVisibleElHeight(el);

    if (visibleElHeight > 0) {
      return visibleElHeight < $el.outerHeight();
    }

    return false;
  }

  /**
   * Is the top of the element in the viewport?
   * sample usage: sticky long side nav on a search results page
   *
   * @param   {Object}   el             Dom element to be tested
   * @param   {Number}   passedBuffer   Buffer
   *
   * @return  {Boolean}  Whether element top is visible at all in viewport
   *
   * @public
   * @method isElementTopInView
   */
  function isElementTopInView (el, passedBuffer) {
    var
      buffer = passedBuffer || 0;

    // el.getBoundingClientRect().top is negative if you scroll past the top
    return (el.getBoundingClientRect().top + buffer) > 0;
  }

  /**
   * Is the bottom/end of the element in the viewport?
   * sample usage: sticky long side nav on a search results page
   *
   * @param   {Object}   $el            jQuery dom element
   * @param   {Object}   el             Dom element to be tested
   * @param   {Number}   passedBuffer   Buffer
   *
   * @return  {Boolean}  Whether element bottom is visible at all in viewport
   *
   * @public
   * @method isElementBottomInView
   */
  function isElementBottomInView ($el, el, passedBuffer) {
    var
      visibleElHeight = getVisibleElHeight(el),
      buffer = passedBuffer || 0,
      bottomOfViewport = getWindowScrollTop() + window.innerHeight,
      bottomOfEl = $el.offset().top + el.clientHeight;

    if (visibleElHeight > 0 && (bottomOfEl + buffer) < bottomOfViewport) {
      return true;
    }

    return false;
  }

  /**
   * Is the dom element in the viewport?
   * sample usage: hide 'back to top' arrow once footer is in viewport
   * so that the footer and arrow don't overlap
   *
   * @param   {Object}   el             Dom element to be tested
   * @param   {Number}   passedBuffer   Buffer
   *
   * @return  {Boolean}  Whether element is visible at all in viewport
   *
   * @public
   * @method isElementInViewport
   */
  function isElementInViewport (el, passedBuffer) {
    var
      buffer = passedBuffer || 0,
      rect = el.getBoundingClientRect();

    return (rect.top - buffer) < getWindowHeight();
  }

  /**
   * Determines scroll direction
   *
   * @return  {String}   Up or down
   *
   * @public
   * @method getScrollDirection
   */
  function getScrollDirection () {
    var
      dir,
      currentScroll = getWindowScrollTop();

    currentScroll > previousScroll ? dir = 'down' : dir =  'up';
    previousScroll = currentScroll;

    return dir;
  }

  /**
   * Returns vertical distance between 2 elements
   * Usage: determine how much space there is as a fixed element approaches
   *        static element when scrolling
   *
   * @param   {Object}   $top      top jQuery element
   * @param   {Object}   $bottom   bottom jQuery element
   *
   * @return  {Number}   Distance
   *
   * @public
   * @method getVerticalDistBetweenElem
   */
  function getVerticalDistBetweenElem ($top, $bottom) {
    var top = $top.get(0);

    return $bottom.offset().top - ($top.offset().top + top.clientHeight);
  }

  /**
   * Tests whether an element that has a set height and overflow set to hidden
   * has overflown
   *
   * @param   {Object}   el   Dom element to be tested
   *
   * @return  {Boolean}  Whether element has overflown
   *
   * @public
   * @method hasElementOverflown
   */
  function hasElementOverflown (el) {
    return el.scrollHeight > el.offsetHeight;
  }

  return {
    getWindowScrollTop: getWindowScrollTop,
    getWindowHeight: getWindowHeight,
    getWindowWidth: getWindowWidth,
    getScrollDir: getScrollDirection,
    hasElementOverflown: hasElementOverflown,
    getElPositionFromViewportTop: getElPositionFromViewportTop,
    getVerticalDistBetweenElem: getVerticalDistBetweenElem,
    getVisibleElHeight: getVisibleElHeight,
    isElementInViewport: isElementInViewport,
    isElementBottomInView: isElementBottomInView,
    isElementTopInView: isElementTopInView,
    isElementCutOff: isElementCutOff
  };

})); // umd
