(function() {
    'use strict';

    const guideCopy = {
        ja: {
            title: 'Image converter guide',
            sections: [
                {
                    title: 'Basic workflow',
                    items: [
                        'Drag and drop images, or click the upload area to choose files.',
                        'Adjust output format, quality, max dimensions, rotation, and filters as needed.',
                        'Download converted files individually or all at once from the results area.'
                    ]
                },
                {
                    title: 'Recommended settings',
                    items: [
                        'For web publishing, try WebP around 75-85% and compare file size with visual quality.',
                        'For social posts or thumbnails, set a max width to create lighter display images.',
                        'For print or color-sensitive work, always review converted images visually.'
                    ]
                },
                {
                    title: 'Privacy',
                    items: [
                        'Conversion runs in your browser, and image data is not uploaded to negi-lab.com servers.',
                        'Large images or large batches depend on device performance, so split them into smaller batches if needed.'
                    ]
                }
            ]
        },
        en: {
            title: 'How to Use the Image Converter',
            sections: [
                {
                    title: 'Basic Workflow',
                    items: [
                        'Drag and drop images, or click the upload area to choose files.',
                        'Adjust the output format, quality, size limit, rotation, and filter settings as needed.',
                        'Download converted files individually or all at once from the results area.'
                    ]
                },
                {
                    title: 'Recommended Settings',
                    items: [
                        'For web publishing, try WebP around 75-85% and compare the final size with visual quality.',
                        'For social posts or thumbnails, set a max width to create lighter images for display.',
                        'For print or color-sensitive work, always review the converted image visually.'
                    ]
                },
                {
                    title: 'Privacy',
                    items: [
                        'Conversion happens in your browser, and image data is not uploaded to negi-lab.com servers.',
                        'Large images or large batches depend on device performance, so split them into smaller batches if needed.'
                    ]
                }
            ]
        }
    };

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            callback();
        }
    }

    function currentLanguage() {
        const selectorLanguage = document.getElementById('lang-switch')?.value;
        if (selectorLanguage === 'ja' || selectorLanguage === 'en') return selectorLanguage;

        const documentLanguage = (document.documentElement.lang || '').slice(0, 2);
        if (documentLanguage === 'ja' || documentLanguage === 'en') return documentLanguage;

        return window.NegiI18n?.getLanguage?.() || 'ja';
    }

    function createTextElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = text;
        return element;
    }

    function renderGuide(content, lang) {
        const copy = guideCopy[lang === 'en' ? 'en' : 'ja'];
        const fragment = document.createDocumentFragment();
        const title = createTextElement('h2', 'text-xl font-bold mb-4 text-accent', copy.title);
        title.id = 'guide-modal-title';
        fragment.appendChild(title);

        copy.sections.forEach((section) => {
            fragment.appendChild(createTextElement('h3', 'font-bold text-base mt-5 mb-2 text-gray-800', section.title));
            const list = document.createElement('ul');
            list.className = 'list-disc ml-5 text-gray-700 text-sm space-y-2';
            section.items.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
            fragment.appendChild(list);
        });

        content.replaceChildren(fragment);
    }

    function bindGuide() {
        const guideBtn = document.getElementById('guide-btn');
        const guideModal = document.getElementById('guide-modal');
        const guideClose = document.getElementById('guide-close');
        const guideContent = document.getElementById('guide-modal-content');
        if (!guideBtn || !guideModal || !guideClose || !guideContent) return;

        function openGuide() {
            renderGuide(guideContent, currentLanguage());
            guideModal.classList.remove('hidden');
            guideClose.focus();
        }

        function closeGuide() {
            guideModal.classList.add('hidden');
            guideBtn.focus();
        }

        guideBtn.addEventListener('click', openGuide);
        guideClose.addEventListener('click', closeGuide);
        guideModal.addEventListener('click', (event) => {
            if (event.target === guideModal) closeGuide();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !guideModal.classList.contains('hidden')) closeGuide();
        });
        window.addEventListener('languageChanged', () => {
            if (!guideModal.classList.contains('hidden')) {
                renderGuide(guideContent, currentLanguage());
            }
        });
    }

    function bindFocusLinks() {
        document.querySelectorAll('[data-image-focus]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const target = document.getElementById(link.getAttribute('data-image-focus'));
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.focus({ preventScroll: true });
            });
        });
    }

    ready(() => {
        window.ImageConverterTranslationSystem?.init?.();
        window.ImageConverterUI?.init?.();
        bindGuide();
        bindFocusLinks();
    });
})();
