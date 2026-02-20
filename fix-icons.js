const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\wildrydes-site';

// Map of files and their icon replacements
// Each entry: [file, searchString, replacementSVG]
const fixes = [
    // stage-padel.html: hotel and trophy icons (tennis ball already replaced)
    ['stage-padel.html',
        '<div class="icon" style="font-size: 2rem;">',
        null // will use indexOf to find ALL instances and replace per-occurrence
    ]
];

// Better approach: for each file, replace all broken icon divs
function fixFile(filename, replacements) {
    const filePath = path.join(dir, filename);
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [search, replacement] of replacements) {
        // Find by indexOf to handle garbled bytes
        const idx = content.indexOf(search);
        if (idx !== -1) {
            // Find the closing </div>
            const closeIdx = content.indexOf('</div>', idx);
            if (closeIdx !== -1) {
                const original = content.slice(idx, closeIdx + 6);
                content = content.slice(0, idx) + replacement + content.slice(closeIdx + 6);
                console.log(`  Replaced in ${filename}: "${original.slice(0, 60)}..." -> SVG`);
            }
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

// stage-padel.html: fix hotel and trophy (tennis ball/globe already done)
{
    const filePath = path.join(dir, 'stage-padel.html');
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace all remaining broken icon divs that start with <div class="icon" style="font-size: 2rem;">
    // followed by garbage bytes
    const brokenIconPattern = /<div class="icon" style="font-size: 2rem;">[^<]+<\/div>/g;
    const matches = [...content.matchAll(brokenIconPattern)];

    const replacements = [
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>`,
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 3 8 10 3 10"></polyline><polyline points="16 3 16 10 21 10"></polyline><line x1="12" y1="3" x2="12" y2="21"></line><path d="M3 10a9 9 0 0 0 18 0"></path><path d="M8 21h8"></path></svg></div>`
    ];

    let replIdx = 0;
    content = content.replace(brokenIconPattern, (match) => {
        if (replIdx < replacements.length) {
            console.log(`stage-padel.html: replaced icon ${replIdx + 1}`);
            return replacements[replIdx++];
        }
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

// events.html: fix icons
{
    const filePath = path.join(dir, 'events.html');
    let content = fs.readFileSync(filePath, 'utf8');

    const brokenIconPattern = /<div class="icon">[^<]+<\/div>/g;

    const svgs = [
        // Concept (lightbulb)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg></div>`,
        // Logistique (already ok but for safety) - gear
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>`,
        // Animation (microphone)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></div>`,
        // Partenaires (handshake)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10z"></path><path d="M12 3v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M19.07 4.93l-2.83 2.83"></path></svg></div>`,
        // Digital (smartphone)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg></div>`,
        // Coordination (clipboard)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></div>`
    ];

    let svgIdx = 0;
    content = content.replace(brokenIconPattern, (match) => {
        if (svgIdx < svgs.length) {
            console.log(`events.html: replaced icon ${svgIdx + 1}`);
            return svgs[svgIdx++];
        }
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

// corporate.html: fix location pins
{
    const filePath = path.join(dir, 'corporate.html');
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the broken pin emoji divs
    const brokenPinPattern = /<div style="font-size: 1\.5rem; color: #fff; font-weight: 700;">[^<]+<\/div>/g;
    const matches = [...content.matchAll(brokenPinPattern)];

    const locationReplacements = [
        `<div style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; color: #fff; font-weight: 700;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-neon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Paris</div>`,
        `<div style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; color: #fff; font-weight: 700;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-neon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Agadir</div>`
    ];

    let locIdx = 0;
    content = content.replace(brokenPinPattern, (match) => {
        if (locIdx < locationReplacements.length) {
            console.log(`corporate.html: replaced location pin ${locIdx + 1}`);
            return locationReplacements[locIdx++];
        }
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

// academy.html: fix icons
{
    const filePath = path.join(dir, 'academy.html');
    let content = fs.readFileSync(filePath, 'utf8');

    const brokenIconPattern = /<div class="icon">[^<]+<\/div>/g;

    const svgs = [
        // Découverte (search/magnifying glass)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>`,
        // Construire (build/layers)
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>`,
        // Game Changer (already has ⚡ which might be ok, but let's keep it) - zap
        `<div class="icon" style="color: var(--accent-neon); width: 36px; height: 36px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>`
    ];

    let svgIdx = 0;
    content = content.replace(brokenIconPattern, (match) => {
        if (svgIdx < svgs.length) {
            console.log(`academy.html: replaced icon ${svgIdx + 1}`);
            return svgs[svgIdx++];
        }
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('All icons fixed!');
