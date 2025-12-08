// ==UserScript==
// @name         Multi-Script Loader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Loads jQuery and multiple external scripts via the @require directive.
// @author       YourName
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://raw.githubusercontent.com/ravanabackup/script/refs/heads/main/procinehubclicker.txt
// @require      https://raw.githubusercontent.com/ravanabackup/script/refs/heads/main/gp_bypass.txt
// @require      https://raw.githubusercontent.com/ravanabackup/script/refs/heads/main/universalpopupblocker.txt
// ==/UserScript==

(function() {
    'use strict';

    // All scripts listed in the @require directives above are automatically
    // loaded and executed by Tampermonkey before this main function runs.
    // jQuery is loaded first to ensure $ is defined for the dependent scripts.

})();
