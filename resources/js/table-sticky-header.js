(() => {
    'use strict';

    if (window.filamentTableStickyHeaderInstalled) {
        return;
    }

    window.filamentTableStickyHeaderInstalled = true;

    const settings = window.filamentData?.filamentTableStickyHeader ?? {};
    const hasConfiguredTopOffset = settings.topOffset !== null
        && settings.topOffset !== undefined
        && settings.topOffset !== ''
        && Number.isFinite(Number(settings.topOffset));
    const configuredTopOffset = hasConfiguredTopOffset
        ? Math.max(0, Number(settings.topOffset))
        : null;
    const tableSelector = '.fi-ta-content-ctn > table.fi-ta-table';
    const stackedTableDesktopMedia = window.matchMedia('(min-width: 640px)');
    const headerStates = new Map();

    let animationFrame = null;
    let needsScan = true;
    let resizeObserver = null;

    const isElementVisible = (element) => {
        const style = window.getComputedStyle(element);

        return style.display !== 'none'
            && style.visibility !== 'hidden'
            && element.getClientRects().length > 0;
    };

    const getVerticalScrollParent = (element) => {
        let parent = element.parentElement;

        while (parent && parent !== document.body && parent !== document.documentElement) {
            const { overflowY } = window.getComputedStyle(parent);

            if (
                /(auto|scroll|overlay)/.test(overflowY)
                && parent.scrollHeight > parent.clientHeight + 1
            ) {
                return parent;
            }

            parent = parent.parentElement;
        }

        return window;
    };

    const getScrollBoundary = (scrollParent) => {
        if (scrollParent === window) {
            return {
                top: 0,
                bottom: window.innerHeight,
            };
        }

        const rect = scrollParent.getBoundingClientRect();

        return {
            top: Math.max(0, rect.top),
            bottom: Math.min(window.innerHeight, rect.bottom),
        };
    };

    const getAutomaticTopInset = (state, boundary) => {
        if (state.scrollParent === window) {
            let inset = 0;

            document.querySelectorAll('.fi-topbar-ctn').forEach((topbar) => {
                if (! isElementVisible(topbar)) {
                    return;
                }

                const rect = topbar.getBoundingClientRect();

                if (rect.top <= boundary.top + 1 && rect.bottom > boundary.top) {
                    inset = Math.max(inset, rect.bottom - boundary.top);
                }
            });

            return inset;
        }

        const modal = state.container.closest('.fi-modal');
        const modalHeader = modal?.querySelector('.fi-modal-header');

        if (! modalHeader || ! isElementVisible(modalHeader)) {
            return 0;
        }

        const modalHeaderRect = modalHeader.getBoundingClientRect();

        return Math.max(0, modalHeaderRect.bottom - boundary.top);
    };

    const resetHeader = (state) => {
        if (state.translateY === 0) {
            return;
        }

        state.header.classList.remove('fi-table-sticky-header-active');
        state.header.style.removeProperty('--fi-table-sticky-header-translate-y');
        state.translateY = 0;
    };

    const setHeaderTranslation = (state, translateY) => {
        if (translateY < 0.5) {
            resetHeader(state);

            return;
        }

        const roundedTranslateY = Math.round(translateY * 100) / 100;

        state.header.style.setProperty(
            '--fi-table-sticky-header-translate-y',
            `${roundedTranslateY}px`,
        );
        state.header.classList.add('fi-table-sticky-header-active');
        state.translateY = roundedTranslateY;
    };

    const canStickHeader = (state) => {
        if (
            ! state.header.isConnected
            || ! isElementVisible(state.header)
            || ! state.header.querySelector(
                '.fi-ta-header-cell, .fi-ta-header-group-cell, .fi-ta-table-stacked-header-cell, [scope="col"]',
            )
        ) {
            return false;
        }

        return ! state.table.classList.contains('fi-ta-table-stacked-on-mobile')
            || stackedTableDesktopMedia.matches;
    };

    const updateHeader = (state) => {
        if (! canStickHeader(state)) {
            resetHeader(state);

            return;
        }

        state.scrollParent = getVerticalScrollParent(state.container);

        const boundary = getScrollBoundary(state.scrollParent);

        if (boundary.bottom <= boundary.top) {
            resetHeader(state);

            return;
        }

        const headerRect = state.header.getBoundingClientRect();
        const tableRect = state.table.getBoundingClientRect();
        const containerRect = state.container.getBoundingClientRect();
        const naturalHeaderTop = headerRect.top - state.translateY;
        const topInset = configuredTopOffset
            ?? getAutomaticTopInset(state, boundary);
        const stickyTop = boundary.top + topInset;
        const maximumHeaderTop = Math.min(
            tableRect.bottom,
            containerRect.bottom,
            boundary.bottom,
        ) - headerRect.height;

        if (
            naturalHeaderTop >= stickyTop
            || maximumHeaderTop <= naturalHeaderTop
            || tableRect.bottom <= stickyTop
        ) {
            resetHeader(state);

            return;
        }

        setHeaderTranslation(
            state,
            Math.min(stickyTop, maximumHeaderTop) - naturalHeaderTop,
        );
    };

    const scanHeaders = () => {
        const discoveredHeaders = new Set();

        document.querySelectorAll(tableSelector).forEach((table) => {
            const header = table.tHead;
            const container = table.parentElement;

            if (! header || ! container?.classList.contains('fi-ta-content-ctn')) {
                return;
            }

            discoveredHeaders.add(header);

            if (headerStates.has(header)) {
                return;
            }

            const state = {
                header,
                table,
                container,
                scrollParent: getVerticalScrollParent(container),
                translateY: 0,
            };

            headerStates.set(header, state);
            resizeObserver?.observe(header);
            resizeObserver?.observe(table);
            resizeObserver?.observe(container);
        });

        headerStates.forEach((state, header) => {
            if (discoveredHeaders.has(header) && header.isConnected) {
                return;
            }

            resetHeader(state);
            resizeObserver?.unobserve(header);
            resizeObserver?.unobserve(state.table);
            resizeObserver?.unobserve(state.container);
            headerStates.delete(header);
        });
    };

    const update = () => {
        animationFrame = null;

        if (needsScan) {
            needsScan = false;
            scanHeaders();
        }

        headerStates.forEach(updateHeader);
    };

    const scheduleUpdate = () => {
        if (animationFrame !== null) {
            return;
        }

        animationFrame = window.requestAnimationFrame(update);
    };

    const scheduleScan = () => {
        needsScan = true;
        scheduleUpdate();
    };

    const start = () => {
        resizeObserver = new ResizeObserver(scheduleUpdate);

        const mutationObserver = new MutationObserver(scheduleScan);

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        document.addEventListener('scroll', scheduleUpdate, {
            capture: true,
            passive: true,
        });
        document.addEventListener('livewire:navigated', scheduleScan);
        document.addEventListener('livewire:initialized', scheduleScan);
        window.addEventListener('resize', scheduleScan, { passive: true });
        window.addEventListener('pageshow', scheduleScan);
        stackedTableDesktopMedia.addEventListener('change', scheduleUpdate);

        scheduleScan();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
