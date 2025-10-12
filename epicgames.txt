// ==UserScript==
// @name         Epic Games Auto Claimer (Android + PC)
// @namespace    https://www.narendramodi.in/
// @version      2.0
// @description  Auto-claims free Epic Games, handles unsupported device popup, iframe clicks, and mobile app compatibility.
// @author       Ek din ye sab games mera baccha khelega
// @match        https://store.epicgames.com/en-US/p/*
// @match        https://store.epicgames.com/en-US/cart/checkout
// @match        https://store.epicgames.com/purchase*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 🔘 Simulate a real user click
    function simulatePhysicalClick(buttonElement) {
        if (!buttonElement || typeof buttonElement.click !== "function") return;
        const rect = buttonElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(type => {
            const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
                button: 0
            });
            buttonElement.dispatchEvent(evt);
        });

        console.log("✅ Simulated physical click on:", buttonElement.textContent.trim());
    }

    // 🔍 Find and click a button by text (within any DOM context)
    function findAndClickButton(textRegex, maxRetries = 30, retryDelay = 1500, context = document) {
        let retries = 0;

        function attemptClick() {
            const buttons = Array.from(context.querySelectorAll('button'));
            const btn = buttons.find(b => {
                const text = b.textContent.trim().toLowerCase();
                return textRegex.test(text) && !b.disabled && b.offsetParent !== null;
            });

            if (btn) {
                console.log(`✅ Found button: "${btn.textContent.trim()}"`);
                btn.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => simulatePhysicalClick(btn), 800);
            } else if (retries < maxRetries) {
                retries++;
                console.log(`🔁 Retry ${retries}/${maxRetries}...`);
                setTimeout(attemptClick, retryDelay);
            } else {
                console.warn(`❌ Button not found after ${maxRetries} retries.`);
            }
        }

        attemptClick();
    }

    // 🔁 Handle "Device not supported" popup
    function handleUnsupportedPopup() {
        const modalObserver = new MutationObserver(() => {
            const continueBtn = Array.from(document.querySelectorAll('button')).find(b =>
                b.textContent.trim().toLowerCase() === 'continue' && b.offsetParent !== null
            );
            if (continueBtn) {
                console.log("⚠️ Detected 'Device not supported' popup — clicking 'Continue'...");
                simulatePhysicalClick(continueBtn);
                modalObserver.disconnect(); // Stop observing after handling
            }
        });

        modalObserver.observe(document.body, { childList: true, subtree: true });
    }

    // 🧠 Main logic per page
    const path = window.location.pathname;

    if (path.startsWith('/en-US/p/')) {
        console.log('🛍️ Game product page detected. Watching for popups and clicking GET...');
        handleUnsupportedPopup();
        setTimeout(() => findAndClickButton(/get|free now|add to cart/i), 2000);
    }

    else if (path === '/en-US/cart/checkout') {
        console.log('🧾 Checkout page. Clicking checkboxes and preparing to proceed...');

        const clickCheckboxes = () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (!cb.checked && cb.offsetParent !== null) {
                    cb.click();
                    console.log('☑️ Clicked a checkbox.');
                }
            });
        };

        let stepTries = 0;
        const prepareAndOpenIframe = () => {
            clickCheckboxes();
            stepTries++;
            if (stepTries <= 5) {
                setTimeout(prepareAndOpenIframe, 1000);
            } else {
                console.log('🪟 Waiting for iframe to load...');
                setTimeout(tryAccessIframe, 2000);
            }
        };

        prepareAndOpenIframe();
    }

    else if (window.location.href.includes('/purchase')) {
        console.log('💳 Inside purchase iframe! Trying to click PLACE ORDER...');
        setTimeout(() => findAndClickButton(/place order/i, 40, 1000, document), 3000);
    }

})();
