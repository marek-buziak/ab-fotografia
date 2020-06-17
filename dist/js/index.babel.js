"use strict";

window.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');
  console.log('test - skrypt');
  var observer = lozad(); // lazy loads elements with default selector as '.lozad'

  observer.observe();
});