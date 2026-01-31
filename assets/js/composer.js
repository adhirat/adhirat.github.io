/**
 * Visual Composer - Block-based Page Builder
 * Adhirat Portal
 */

import { db, collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from './firebase-config.js';
import { initAuthObserver } from './firebase-modules.js';

// Initialize auth
initAuthObserver(true);

// Block Definitions
const BLOCK_TYPES = {
    heading: {
        icon: 'title',
        label: 'Heading',
        defaultContent: { text: 'Heading', level: 'h2' },
        render: (block) => `<${block.content.level} class="text-2xl font-bold text-slate-900 dark:text-white" contenteditable="true">${block.content.text}</${block.content.level}>`
    },
    paragraph: {
        icon: 'notes',
        label: 'Text',
        defaultContent: { text: 'Start typing your text here...' },
        render: (block) => `<p class="text-base text-slate-700 dark:text-slate-300 leading-relaxed" contenteditable="true">${block.content.text}</p>`
    },
    image: {
        icon: 'image',
        label: 'Image',
        defaultContent: { src: '', alt: 'Image', caption: '' },
        render: (block) => block.content.src
            ? `<figure><img src="${block.content.src}" alt="${block.content.alt}" class="w-full rounded-lg"><figcaption class="text-sm text-slate-500 text-center mt-2">${block.content.caption}</figcaption></figure>`
            : `<div class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onclick="composer.editImage('${block.id}')">
                <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">add_photo_alternate</span>
                <span class="text-sm text-slate-500">Click to add image</span>
               </div>`
    },
    button: {
        icon: 'smart_button',
        label: 'Button',
        defaultContent: { text: 'Click Me', url: '#', style: 'primary' },
        render: (block) => `<div class="text-center py-2"><a href="${block.content.url}" class="inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600 transition-colors">${block.content.text}</a></div>`
    },
    divider: {
        icon: 'horizontal_rule',
        label: 'Divider',
        defaultContent: { style: 'solid' },
        render: () => `<hr class="border-slate-200 dark:border-slate-700 my-4">`
    },
    spacer: {
        icon: 'height',
        label: 'Spacer',
        defaultContent: { height: 40 },
        render: (block) => `<div style="height: ${block.content.height}px"></div>`
    },
    quote: {
        icon: 'format_quote',
        label: 'Quote',
        defaultContent: { text: 'Your quote here...', author: '' },
        render: (block) => `<blockquote class="border-l-4 border-primary pl-6 py-2 italic text-xl text-slate-700 dark:text-slate-300">
            <p contenteditable="true">${block.content.text}</p>
            ${block.content.author ? `<footer class="text-sm text-slate-500 mt-2 not-italic">— ${block.content.author}</footer>` : ''}
        </blockquote>`
    },
    callout: {
        icon: 'campaign',
        label: 'Callout',
        defaultContent: { text: 'Important information here...', type: 'info' },
        render: (block) => {
            const colors = { info: 'blue', warning: 'amber', success: 'emerald', error: 'red' };
            const c = colors[block.content.type] || 'blue';
            return `<div class="p-4 rounded-lg bg-${c}-50 dark:bg-${c}-900/20 border border-${c}-200 dark:border-${c}-800">
                <p class="text-${c}-700 dark:text-${c}-400" contenteditable="true">${block.content.text}</p>
            </div>`;
        }
    },
    video: {
        icon: 'videocam',
        label: 'Video',
        defaultContent: { url: '', type: 'youtube' },
        render: (block) => block.content.url
            ? `<div class="aspect-video rounded-lg overflow-hidden"><iframe src="${block.content.url}" class="w-full h-full" allowfullscreen></iframe></div>`
            : `<div class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onclick="composer.editVideo('${block.id}')">
                <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">videocam</span>
                <span class="text-sm text-slate-500">Click to add video URL</span>
               </div>`
    },
    list: {
        icon: 'format_list_bulleted',
        label: 'List',
        defaultContent: { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false },
        render: (block) => {
            const tag = block.content.ordered ? 'ol' : 'ul';
            const items = block.content.items.map(i => `<li>${i}</li>`).join('');
            return `<${tag} class="list-${block.content.ordered ? 'decimal' : 'disc'} list-inside text-slate-700 dark:text-slate-300 space-y-1">${items}</${tag}>`;
        }
    },
    section: {
        icon: 'view_agenda',
        label: 'Section',
        defaultContent: { background: 'transparent', padding: 'md' },
        render: (block, children) => `<section class="p-8 rounded-xl ${block.content.background !== 'transparent' ? 'bg-' + block.content.background : ''}">${children}</section>`
    },
    columns: {
        icon: 'view_column',
        label: 'Columns',
        defaultContent: { count: 2, gap: 'md' },
        isContainer: true,
        render: (block, children) => `<div class="grid grid-cols-${block.content.count} gap-6">${children}</div>`
    },
    // New blocks
    collapsible: {
        icon: 'unfold_more',
        label: 'Collapsible',
        defaultContent: { title: 'Click to expand', content: 'Hidden content goes here...', open: false },
        render: (block) => `<details class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden" ${block.content.open ? 'open' : ''}>
            <summary class="p-4 bg-slate-50 dark:bg-slate-800 cursor-pointer font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">${block.content.title}</summary>
            <div class="p-4 text-slate-700 dark:text-slate-300" contenteditable="true">${block.content.content}</div>
        </details>`
    },
    toc: {
        icon: 'toc',
        label: 'Table of Contents',
        defaultContent: { title: 'Contents' },
        render: (block) => `<nav class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-slate-900 dark:text-white mb-3">${block.content.title}</h4>
            <ul class="space-y-2 text-sm text-primary">
                <li><a href="#" class="hover:underline">• Section 1</a></li>
                <li><a href="#" class="hover:underline">• Section 2</a></li>
                <li><a href="#" class="hover:underline">• Section 3</a></li>
            </ul>
        </nav>`
    },
    placeholder: {
        icon: 'add_box',
        label: 'Placeholder',
        defaultContent: { text: 'Placeholder content' },
        render: (block) => `<div class="p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
            <span class="material-symbols-outlined mr-2">add_box</span>
            <span>${block.content.text}</span>
        </div>`
    },
    carousel: {
        icon: 'view_carousel',
        label: 'Carousel',
        defaultContent: { images: [] },
        render: (block) => block.content.images.length > 0
            ? `<div class="relative overflow-hidden rounded-lg"><img src="${block.content.images[0]}" class="w-full aspect-video object-cover"></div>`
            : `<div class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onclick="composer.editCarousel('${block.id}')">
                <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">view_carousel</span>
                <span class="text-sm text-slate-500">Click to add images</span>
               </div>`
    },
    youtube: {
        icon: 'smart_display',
        label: 'YouTube',
        defaultContent: { videoId: '' },
        render: (block) => block.content.videoId
            ? `<div class="aspect-video rounded-lg overflow-hidden"><iframe src="https://www.youtube.com/embed/${block.content.videoId}" class="w-full h-full" allowfullscreen></iframe></div>`
            : `<div class="aspect-video bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800" onclick="composer.editYouTube('${block.id}')">
                <span class="material-symbols-outlined text-4xl text-red-500 mb-2">smart_display</span>
                <span class="text-sm text-red-600 dark:text-red-400">Click to add YouTube video</span>
               </div>`
    },
    social: {
        icon: 'groups',
        label: 'Social Links',
        defaultContent: { links: { facebook: '', twitter: '', linkedin: '', instagram: '' } },
        render: () => `<div class="flex items-center justify-center gap-4 py-4">
            <a href="#" class="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"><span class="material-symbols-outlined text-lg">chat</span></a>
            <a href="#" class="size-10 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors"><span class="material-symbols-outlined text-lg">share</span></a>
            <a href="#" class="size-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors"><span class="material-symbols-outlined text-lg">work</span></a>
            <a href="#" class="size-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-colors"><span class="material-symbols-outlined text-lg">photo_camera</span></a>
        </div>`
    },
    map: {
        icon: 'location_on',
        label: 'Map',
        defaultContent: { embedUrl: '', address: 'Your location' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full" allowfullscreen loading="lazy"></iframe></div>`
            : `<div class="aspect-video bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200 dark:border-emerald-800" onclick="composer.editEmbed('${block.id}', 'map')">
                <span class="material-symbols-outlined text-4xl text-emerald-500 mb-2">location_on</span>
                <span class="text-sm text-emerald-600 dark:text-emerald-400">Click to embed Google Map</span>
               </div>`
    },
    calendar: {
        icon: 'calendar_month',
        label: 'Calendar',
        defaultContent: { embedUrl: '' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full"></iframe></div>`
            : `<div class="aspect-video bg-blue-50 dark:bg-blue-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800" onclick="composer.editEmbed('${block.id}', 'calendar')">
                <span class="material-symbols-outlined text-4xl text-blue-500 mb-2">calendar_month</span>
                <span class="text-sm text-blue-600 dark:text-blue-400">Click to embed Google Calendar</span>
               </div>`
    },
    docs: {
        icon: 'description',
        label: 'Google Docs',
        defaultContent: { embedUrl: '' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full"></iframe></div>`
            : `<div class="aspect-[4/3] bg-blue-50 dark:bg-blue-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800" onclick="composer.editEmbed('${block.id}', 'docs')">
                <span class="material-symbols-outlined text-4xl text-blue-600 mb-2">description</span>
                <span class="text-sm text-blue-700 dark:text-blue-400">Click to embed Google Doc</span>
               </div>`
    },
    slides: {
        icon: 'slideshow',
        label: 'Google Slides',
        defaultContent: { embedUrl: '' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full" allowfullscreen></iframe></div>`
            : `<div class="aspect-video bg-amber-50 dark:bg-amber-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-200 dark:border-amber-800" onclick="composer.editEmbed('${block.id}', 'slides')">
                <span class="material-symbols-outlined text-4xl text-amber-600 mb-2">slideshow</span>
                <span class="text-sm text-amber-700 dark:text-amber-400">Click to embed Google Slides</span>
               </div>`
    },
    sheets: {
        icon: 'table_chart',
        label: 'Google Sheets',
        defaultContent: { embedUrl: '' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full"></iframe></div>`
            : `<div class="aspect-[4/3] bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200 dark:border-emerald-800" onclick="composer.editEmbed('${block.id}', 'sheets')">
                <span class="material-symbols-outlined text-4xl text-emerald-600 mb-2">table_chart</span>
                <span class="text-sm text-emerald-700 dark:text-emerald-400">Click to embed Google Sheet</span>
               </div>`
    },
    forms: {
        icon: 'assignment',
        label: 'Google Forms',
        defaultContent: { embedUrl: '' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full"></iframe></div>`
            : `<div class="aspect-[4/3] bg-purple-50 dark:bg-purple-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-800" onclick="composer.editEmbed('${block.id}', 'forms')">
                <span class="material-symbols-outlined text-4xl text-purple-600 mb-2">assignment</span>
                <span class="text-sm text-purple-700 dark:text-purple-400">Click to embed Google Form</span>
               </div>`
    },
    charts: {
        icon: 'bar_chart',
        label: 'Charts',
        defaultContent: { embedUrl: '' },
        render: (block) => block.content.embedUrl
            ? `<div class="aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"><iframe src="${block.content.embedUrl}" class="w-full h-full"></iframe></div>`
            : `<div class="aspect-video bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors border border-indigo-200 dark:border-indigo-800" onclick="composer.editEmbed('${block.id}', 'charts')">
                <span class="material-symbols-outlined text-4xl text-indigo-600 mb-2">bar_chart</span>
                <span class="text-sm text-indigo-700 dark:text-indigo-400">Click to embed chart</span>
               </div>`
    },
    code: {
        icon: 'code',
        label: 'Code',
        defaultContent: { code: '// Your code here', language: 'javascript' },
        render: (block) => `<pre class="p-4 bg-slate-900 rounded-lg overflow-x-auto"><code class="text-sm text-emerald-400 font-mono">${block.content.code}</code></pre>`
    }
};

// Composer State
class VisualComposer {
    constructor() {
        this.blocks = [];
        this.selectedBlockId = null;
        this.history = [];
        this.historyIndex = -1;
        this.currentDevice = 'desktop';
        this.documentId = null;
        this.isDirty = false;

        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupKeyboardShortcuts();
        this.setupTabs();
        this.setupHeaderFooterListeners();
        this.loadFromUrl();
        this.render();
    }

    // Setup Header/Footer listeners
    setupHeaderFooterListeners() {
        const header = document.getElementById('site-header');
        const footer = document.getElementById('site-footer');

        [header, footer].forEach(el => {
            if (el) {
                el.addEventListener('input', () => {
                    this.isDirty = true;
                });
            }
        });
    }

    // Setup tabs
    setupTabs() {
        const tabs = document.querySelectorAll('[data-tab]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                // Update tab buttons
                tabs.forEach(t => {
                    const isTarget = t.dataset.tab === tabName;
                    t.classList.toggle('text-primary', isTarget);
                    t.classList.toggle('border-b-2', isTarget);
                    t.classList.toggle('border-primary', isTarget);
                    t.classList.toggle('text-slate-500', !isTarget);
                });

                // Update content
                ['insert', 'pages', 'themes'].forEach(t => {
                    const content = document.getElementById(`tab-${t}-content`);
                    if (content) content.classList.toggle('hidden', t !== tabName);
                });
            });
        });
    }

    // Generate unique ID
    generateId() {
        return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Setup drag and drop
    setupDragAndDrop() {
        const blockItems = document.querySelectorAll('.block-item[draggable="true"]');
        const canvas = document.getElementById('canvas-content');

        blockItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('block-type', item.dataset.blockType);
                item.classList.add('dragging');
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('active'));
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dropZone = e.target.closest('.drop-zone');
            if (dropZone) dropZone.classList.add('active');
        });

        canvas.addEventListener('dragleave', (e) => {
            const dropZone = e.target.closest('.drop-zone');
            if (dropZone) dropZone.classList.remove('active');
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('block-type');
            if (!blockType) return;

            const dropZone = e.target.closest('.drop-zone');
            let index = this.blocks.length;

            if (dropZone) {
                index = parseInt(dropZone.dataset.index) || 0;
            }

            this.addBlock(blockType, index);
        });
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); }
                if (e.key === 'z' && e.shiftKey) { e.preventDefault(); this.redo(); }
                if (e.key === 'y') { e.preventDefault(); this.redo(); }
                if (e.key === 's') { e.preventDefault(); this.save(); }
                if (e.key === 'c' && this.selectedBlockId) { this.copyBlock(); }
                if (e.key === 'v') { this.pasteBlock(); }
            }
            if (e.key === 'Delete' && this.selectedBlockId) { this.deleteSelected(); }
            if (e.key === 'Escape') { this.deselectAll(); }
        });
    }

    // Add block
    addBlock(type, index = this.blocks.length) {
        const blockDef = BLOCK_TYPES[type];
        if (!blockDef) return;

        const block = {
            id: this.generateId(),
            type: type,
            content: JSON.parse(JSON.stringify(blockDef.defaultContent)),
            styles: {}
        };

        this.saveHistory();
        this.blocks.splice(index, 0, block);
        this.isDirty = true;
        this.selectBlock(block.id);
        this.render();
        this.showToast(`${blockDef.label} added`, 'success');
    }

    // Select block
    selectBlock(id) {
        this.selectedBlockId = id;
        this.render();
        this.showProperties(id);
    }

    // Deselect all
    deselectAll() {
        this.selectedBlockId = null;
        this.render();
        document.getElementById('properties-panel').classList.add('hidden');
    }

    // Delete selected block
    deleteSelected() {
        if (!this.selectedBlockId) return;
        this.saveHistory();
        this.blocks = this.blocks.filter(b => b.id !== this.selectedBlockId);
        this.selectedBlockId = null;
        this.isDirty = true;
        this.render();
        document.getElementById('properties-panel').classList.add('hidden');
        this.showToast('Block deleted', 'success');
    }

    // Copy/paste
    copyBlock() {
        const block = this.blocks.find(b => b.id === this.selectedBlockId);
        if (block) {
            localStorage.setItem('composer_clipboard', JSON.stringify(block));
            this.showToast('Block copied', 'success');
        }
    }

    pasteBlock() {
        const data = localStorage.getItem('composer_clipboard');
        if (!data) return;

        try {
            const block = JSON.parse(data);
            block.id = this.generateId();
            this.saveHistory();

            const currentIndex = this.blocks.findIndex(b => b.id === this.selectedBlockId);
            const insertIndex = currentIndex >= 0 ? currentIndex + 1 : this.blocks.length;

            this.blocks.splice(insertIndex, 0, block);
            this.isDirty = true;
            this.selectBlock(block.id);
            this.render();
            this.showToast('Block pasted', 'success');
        } catch (e) {
            console.error('Paste error:', e);
        }
    }

    // History (undo/redo)
    saveHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.stringify(this.blocks));
        this.historyIndex++;
        this.updateHistoryButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.blocks = JSON.parse(this.history[this.historyIndex]);
            this.isDirty = true;
            this.render();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.blocks = JSON.parse(this.history[this.historyIndex]);
            this.isDirty = true;
            this.render();
        }
    }

    updateHistoryButtons() {
        document.getElementById('undo-btn').disabled = this.historyIndex <= 0;
        document.getElementById('redo-btn').disabled = this.historyIndex >= this.history.length - 1;
    }

    // Device preview
    setDevice(device) {
        this.currentDevice = device;
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.toggle('bg-white', btn.dataset.device === device);
            btn.classList.toggle('dark:bg-slate-700', btn.dataset.device === device);
            btn.classList.toggle('shadow-sm', btn.dataset.device === device);
        });
        document.getElementById('canvas').dataset.device = device;
        const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };
        document.getElementById('canvas').style.width = widths[device];

        // Center canvas for mobile/tablet
        if (device !== 'desktop') {
            document.getElementById('canvas').style.margin = '0 auto';
        } else {
            document.getElementById('canvas').style.margin = '0';
        }
    }

    // Render canvas
    render() {
        const canvas = document.getElementById('canvas-content');
        const emptyState = document.getElementById('empty-state');

        if (this.blocks.length === 0) {
            emptyState.classList.remove('hidden');
            canvas.innerHTML = '';
            canvas.appendChild(emptyState);
            return;
        }

        emptyState.classList.add('hidden');

        let html = '<div class="drop-zone" data-index="0"></div>';

        this.blocks.forEach((block, index) => {
            const blockDef = BLOCK_TYPES[block.type];
            if (!blockDef) return;

            const isSelected = block.id === this.selectedBlockId;
            const content = blockDef.render(block);

            html += `
                <div class="canvas-block relative group ${isSelected ? 'selected' : ''}" data-block-id="${block.id}" onclick="composer.selectBlock('${block.id}')">
                    <!-- Drag handle -->
                    <div class="drag-handle absolute -left-10 top-1/2 -translate-y-1/2 cursor-move p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span class="material-symbols-outlined text-slate-400">drag_indicator</span>
                    </div>
                    
                    <!-- Block content -->
                    <div class="block-content">${content}</div>
                    
                    <!-- Floating toolbar (visible when selected) -->
                    ${isSelected ? `
                    <div class="block-toolbar flex items-center gap-1 bg-slate-900 dark:bg-slate-700 rounded-lg p-1 shadow-xl">
                        <button onclick="event.stopPropagation(); composer.moveBlock('${block.id}', -1)" class="p-1.5 rounded hover:bg-white/10 text-white" title="Move up">
                            <span class="material-symbols-outlined text-lg">arrow_upward</span>
                        </button>
                        <button onclick="event.stopPropagation(); composer.moveBlock('${block.id}', 1)" class="p-1.5 rounded hover:bg-white/10 text-white" title="Move down">
                            <span class="material-symbols-outlined text-lg">arrow_downward</span>
                        </button>
                        <div class="w-px h-5 bg-white/20 mx-1"></div>
                        <button onclick="event.stopPropagation(); composer.duplicateBlock('${block.id}')" class="p-1.5 rounded hover:bg-white/10 text-white" title="Duplicate">
                            <span class="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                        <button onclick="event.stopPropagation(); composer.deleteSelected()" class="p-1.5 rounded hover:bg-red-500 text-white" title="Delete">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>
                    ` : ''}
                </div>
                <div class="drop-zone" data-index="${index + 1}"></div>
            `;
        });

        canvas.innerHTML = html;
        this.setupBlockDragging();
    }

    // Setup block reordering via drag
    setupBlockDragging() {
        document.querySelectorAll('.drag-handle').forEach(handle => {
            const blockEl = handle.closest('.canvas-block');
            blockEl.setAttribute('draggable', 'true');

            blockEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('block-id', blockEl.dataset.blockId);
                blockEl.style.opacity = '0.5';
            });

            blockEl.addEventListener('dragend', () => {
                blockEl.style.opacity = '1';
            });
        });
    }

    // Move block
    moveBlock(id, direction) {
        const index = this.blocks.findIndex(b => b.id === id);
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= this.blocks.length) return;

        this.saveHistory();
        const block = this.blocks.splice(index, 1)[0];
        this.blocks.splice(newIndex, 0, block);
        this.isDirty = true;
        this.render();
    }

    // Duplicate block
    duplicateBlock(id) {
        const block = this.blocks.find(b => b.id === id);
        if (!block) return;

        const index = this.blocks.findIndex(b => b.id === id);
        const newBlock = JSON.parse(JSON.stringify(block));
        newBlock.id = this.generateId();

        this.saveHistory();
        this.blocks.splice(index + 1, 0, newBlock);
        this.isDirty = true;
        this.selectBlock(newBlock.id);
        this.render();
        this.showToast('Block duplicated', 'success');
    }

    // Show properties panel
    showProperties(id) {
        const block = this.blocks.find(b => b.id === id);
        if (!block) return;

        const blockDef = BLOCK_TYPES[block.type];

        // Ensure Insert tab is active
        document.querySelector('[data-tab="insert"]').click();

        document.getElementById('properties-panel').classList.remove('hidden');
        document.getElementById('prop-block-icon').textContent = blockDef.icon;
        document.getElementById('prop-block-type').textContent = blockDef.label;

        // Generate property fields based on block type
        const fields = document.getElementById('prop-fields');
        fields.innerHTML = this.generatePropertyFields(block);
    }

    // Generate property input fields
    generatePropertyFields(block) {
        let html = '';

        for (const [key, value] of Object.entries(block.content)) {
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

            if (typeof value === 'string') {
                html += `
                    <div class="space-y-1">
                        <label class="text-xs font-medium text-slate-500">${label}</label>
                        <input type="text" value="${value}" onchange="composer.updateBlockContent('${block.id}', '${key}', this.value)"
                            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                `;
            } else if (typeof value === 'number') {
                html += `
                    <div class="space-y-1">
                        <label class="text-xs font-medium text-slate-500">${label}</label>
                        <input type="number" value="${value}" onchange="composer.updateBlockContent('${block.id}', '${key}', parseInt(this.value))"
                            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                `;
            }
        }

        return html;
    }

    // Update block content
    updateBlockContent(id, key, value) {
        const block = this.blocks.find(b => b.id === id);
        if (!block) return;

        this.saveHistory();
        block.content[key] = value;
        this.isDirty = true;
        this.render();
    }

    // Image picker
    editImage(id) {
        const url = prompt('Enter image URL:');
        if (url) {
            this.updateBlockContent(id, 'src', url);
        }
    }

    // Video picker
    editVideo(id) {
        const url = prompt('Enter video embed URL (YouTube/Vimeo):');
        if (url) {
            // Convert YouTube URL to embed format
            let embedUrl = url;
            if (url.includes('youtube.com/watch')) {
                const videoId = new URL(url).searchParams.get('v');
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
            this.updateBlockContent(id, 'url', embedUrl);
        }
    }

    // YouTube picker
    editYouTube(id) {
        const url = prompt('Enter YouTube URL or video ID:');
        if (url) {
            let videoId = url;
            if (url.includes('youtube.com/watch')) {
                videoId = new URL(url).searchParams.get('v');
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            }
            this.updateBlockContent(id, 'videoId', videoId);
        }
    }

    // Carousel editor
    editCarousel(id) {
        const urls = prompt('Enter image URLs (comma-separated):');
        if (urls) {
            const images = urls.split(',').map(u => u.trim()).filter(u => u);
            this.updateBlockContent(id, 'images', images);
        }
    }

    // Generic embed editor
    editEmbed(id, type) {
        const prompts = {
            map: 'Enter Google Maps embed URL:',
            calendar: 'Enter Google Calendar embed URL:',
            docs: 'Enter Google Docs embed URL:',
            slides: 'Enter Google Slides embed URL:',
            sheets: 'Enter Google Sheets embed URL:',
            forms: 'Enter Google Forms embed URL:',
            charts: 'Enter chart embed URL:'
        };
        const url = prompt(prompts[type] || 'Enter embed URL:');
        if (url) {
            this.updateBlockContent(id, 'embedUrl', url);
        }
    }

    // Export HTML
    exportHtml() {
        const header = document.getElementById('site-header').outerHTML.replace(/contenteditable="true"/g, '');
        const footer = document.getElementById('site-footer').outerHTML.replace(/contenteditable="true"/g, '');

        let mainContent = '';
        this.blocks.forEach(block => {
            const blockDef = BLOCK_TYPES[block.type];
            if (blockDef) mainContent += blockDef.render(block);
        });

        return `${header}\n<main class="py-8">${mainContent}</main>\n${footer}`;
    }

    // Save to Firebase
    async save() {
        const title = document.getElementById('doc-title').value;
        const data = {
            title,
            blocks: this.blocks,
            headerContent: document.getElementById('site-header').innerHTML,
            footerContent: document.getElementById('site-footer').innerHTML,
            html: this.exportHtml(),
            updatedAt: serverTimestamp()
        };

        try {
            if (this.documentId) {
                await updateDoc(doc(db, "composer_documents", this.documentId), data);
            } else {
                data.createdAt = serverTimestamp();
                const docRef = await addDoc(collection(db, "composer_documents"), data);
                this.documentId = docRef.id;
                history.replaceState(null, '', `?id=${this.documentId}`);
            }
            this.isDirty = false;
            document.getElementById('save-status').textContent = 'Saved';
            document.getElementById('save-status').className = 'text-xs px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
            this.showToast('Document saved!', 'success');
        } catch (e) {
            console.error('Save error:', e);
            this.showToast('Error saving document', 'error');
        }
    }

    // Load from URL
    async loadFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (id) {
            try {
                const snap = await getDoc(doc(db, "composer_documents", id));
                if (snap.exists()) {
                    const data = snap.data();
                    this.documentId = id;
                    this.blocks = data.blocks || [];
                    document.getElementById('doc-title').value = data.title || 'Untitled';

                    // Restore header/footer if available
                    if (data.headerContent) document.getElementById('site-header').innerHTML = data.headerContent;
                    if (data.footerContent) document.getElementById('site-footer').innerHTML = data.footerContent;

                    document.getElementById('save-status').textContent = 'Saved';
                    document.getElementById('save-status').className = 'text-xs px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
                    this.saveHistory();
                    this.render();
                }
            } catch (e) {
                console.error('Load error:', e);
            }
        } else {
            this.saveHistory();
        }
    }

    // Preview
    preview() {
        const html = this.exportHtml();
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview - ${document.getElementById('doc-title').value}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; }</style>
            </head>
            <body>${html}</body>
            </html>
        `);
    }

    // Toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        document.getElementById('toast-icon').textContent = type === 'success' ? 'check_circle' : 'error';
        document.getElementById('toast-message').textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 2500);
    }

    // Toggle Sidebar
    toggleSidebar() {
        const sidebar = document.querySelector('aside');
        const isHidden = sidebar.classList.contains('hidden');

        if (isHidden) {
            sidebar.classList.remove('hidden');
            // Animate in
            sidebar.classList.add('animate-fade-in-right');
        } else {
            sidebar.classList.add('hidden');
        }
    }
}

// Initialize composer
const composer = new VisualComposer();
window.composer = composer;
