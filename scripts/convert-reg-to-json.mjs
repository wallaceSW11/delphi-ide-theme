import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, '..');
const REG_PATH = resolve(PROJECT_DIR, 'reference', 'delphi-highlight.reg');
const OUTPUT_PATH = resolve(PROJECT_DIR, 'reference', 'delphi-colors.json');

const NAMED_COLORS = {
    clBlack: '#000000',
    clMaroon: '#800000',
    clGreen: '#008000',
    clOlive: '#808000',
    clNavy: '#000080',
    clPurple: '#800080',
    clTeal: '#008080',
    clGray: '#808080',
    clSilver: '#C0C0C0',
    clRed: '#FF0000',
    clLime: '#00FF00',
    clYellow: '#FFFF00',
    clBlue: '#0000FF',
    clFuchsia: '#FF00FF',
    clAqua: '#00FFFF',
    clWhite: '#FFFFFF',
};

function bgrToRgb(bgrHex) {
    const value = bgrHex.replace('$', '');
    const padded = value.padStart(8, '0');

    const r = padded.substring(6, 8);
    const g = padded.substring(4, 6);
    const b = padded.substring(2, 4);

    return `#${r}${g}${b}`;
}

function resolveColor(value) {
    if (value.startsWith('$'))
        return bgrToRgb(value);

    if (NAMED_COLORS[value])
        return NAMED_COLORS[value];

    return value;
}

function parseBool(value) {
    const lower = value.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    return value;
}

function parseSection(lines) {
    const header = lines[0];
    const path = header.slice(1, -1);

    const lastSegment = path.substring(path.lastIndexOf('\\') + 1);
    const categoryName = lastSegment;

    const section = {};

    for (let i = 1; i < lines.length; i++)
    {
        const trimmed = lines[i].trim();
        if (!trimmed || trimmed.startsWith('['))
            continue;

        const match = trimmed.match(/^"([^"]+)"="(.*)"$/);
        if (!match)
            continue;

        const [, key, value] = match;
        section[key] = value;
    }

    return { categoryName, section };
}

function convertStructuralHighlighting(section) {
    return {
        enabled: parseBool(section.Enabled || 'False'),
        flowControlEnabled: parseBool(section.FlowControlEnabled || 'False'),
        flowControlLocation: section.FlowControlLocation || '0',
        showSingleLine: parseBool(section.ShowSingleLine || 'False'),
        colors: [
            resolveColor(section.Color1 || '$00000000'),
            resolveColor(section.Color2 || '$00000000'),
            resolveColor(section.Color3 || '$00000000'),
            resolveColor(section.Color4 || '$00000000'),
        ],
    };
}

function convertStandardSection(section) {
    const foregroundRaw = section['Foreground Color New'] || '';
    const backgroundRaw = section['Background Color New'] || '';

    return {
        foreground: resolveColor(foregroundRaw),
        background: resolveColor(backgroundRaw),
        bold: parseBool(section.Bold || 'False'),
        italic: parseBool(section.Italic || 'False'),
        underline: parseBool(section.Underline || 'False'),
    };
}

function parseRegFile(content) {
    const lines = content.split(/\r?\n/);
    const categories = {};

    let currentLines = [];
    let inSection = false;

    for (const line of lines)
    {
        if (line.startsWith('['))
        {
            if (inSection && currentLines.length > 0)
            {
                const { categoryName, section } = parseSection(currentLines);

                if (categoryName === 'Structural Highlighting')
                    categories[categoryName] = convertStructuralHighlighting(section);
                else if (categoryName && categoryName !== 'Highlight')
                    categories[categoryName] = convertStandardSection(section);
            }

            currentLines = [line];
            inSection = true;
            continue;
        }

        if (inSection)
            currentLines.push(line);
    }

    if (inSection && currentLines.length > 0)
    {
        const { categoryName, section } = parseSection(currentLines);

        if (categoryName === 'Structural Highlighting')
            categories[categoryName] = convertStructuralHighlighting(section);
        else if (categoryName && categoryName !== 'Highlight')
            categories[categoryName] = convertStandardSection(section);
    }

    return categories;
}

function sortObjectKeys(obj) {
    const sorted = {};

    for (const key of Object.keys(obj).sort((a, b) => a.localeCompare(b)))
        sorted[key] = obj[key];

    return sorted;
}

function run() {
    const raw = readFileSync(REG_PATH, 'utf-8');
    const categories = parseRegFile(raw);
    const sorted = sortObjectKeys(categories);
    const jsonOutput = JSON.stringify(sorted, null, '    ') + '\n';

    writeFileSync(OUTPUT_PATH, jsonOutput, 'utf-8');

    const categoryCount = Object.keys(sorted).length;
    process.stdout.write(`Converted ${categoryCount} categories to ${OUTPUT_PATH}\n`);
}

run();
