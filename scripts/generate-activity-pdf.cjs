const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const reportPath = path.join(root, 'docs', 'portfolio-crud-activity.md');
const outputPath = path.join(root, 'docs', 'portfolio-crud-activity.pdf');
const screenshotPath = path.join(root, 'docs', 'screenshots', 'public-portfolio.png');
const sourceFiles = [
    'database/migrations/2026_11_01_000000_create_projects_table.php',
    'database/migrations/2026_11_02_000001_add_unique_title_to_projects_table.php',
    'app/Models/Project.php',
    'app/Http/Requests/ProjectRequest.php',
    'app/Http/Controllers/ProjectController.php',
    'routes/web.php',
    'app/Http/Middleware/HandleInertiaRequests.php',
    'resources/js/components/projects/project-form.tsx',
    'resources/js/components/projects/project-card.tsx',
    'resources/js/components/portfolio-navbar.tsx',
    'resources/js/components/portfolio-footer.tsx',
    'resources/js/components/section-title.tsx',
    'resources/js/pages/projects/index.tsx',
    'resources/js/pages/projects/create.tsx',
    'resources/js/pages/projects/edit.tsx',
    'resources/js/pages/welcome.tsx',
    'resources/js/types/index.ts',
    'tests/Feature/ProjectManagementTest.php',
];

const pages = [];
let currentPage = [];
let y = 748;
let screenshotPageIndex = -1;

function ascii(text) {
    return text
        .replace(/[’‘]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[–—]/g, '-')
        .replace(/…/g, '...')
        .replace(/·/g, '*')
        .replace(/[^\x20-\x7e]/g, '?');
}

function escapePdf(text) {
    return ascii(text).replace(/([\\()])/g, '\\$1');
}

function newPage() {
    pages.push(currentPage);
    currentPage = [];
    y = 748;
}

function writeLine(text, { font = 'F1', size = 9.5, leading = 13, indent = 0 } = {}) {
    if (y < 52) newPage();
    currentPage.push(`BT /${font} ${size} Tf 1 0 0 1 ${54 + indent} ${y} Tm (${escapePdf(text)}) Tj ET`);
    y -= leading;
}

function wrapped(text, max = 98) {
    const words = ascii(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
        if (line && `${line} ${word}`.length > max) {
            lines.push(line);
            line = word;
        } else {
            line = line ? `${line} ${word}` : word;
        }
    }
    if (line) lines.push(line);
    return lines;
}

function writeParagraph(text, style = {}) {
    for (const line of wrapped(text, style.max ?? 105)) writeLine(line, style);
}

function stripMarkdown(text) {
    return ascii(text)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/^\s*[-*]\s+/, '- ')
        .replace(/^\s*\d+\.\s+/, '- ');
}

function renderReport(markdown) {
    let inCode = false;
    for (const rawLine of markdown.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (line.startsWith('```')) {
            inCode = !inCode;
            continue;
        }
        if (!line) {
            y -= 4;
            continue;
        }
        if (/^\|[\s:-]+\|?$/.test(line.replace(/\|/g, ''))) continue;
        if (inCode) {
            for (const part of wrapped(line, 112)) writeLine(part, { font: 'F2', size: 7.5, leading: 9.5 });
            continue;
        }
        if (line.startsWith('|')) {
            writeParagraph(
                line
                    .split('|')
                    .filter(Boolean)
                    .map((cell) => cell.trim())
                    .join('  |  '),
                { size: 8.5, leading: 11, max: 118 },
            );
            continue;
        }
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
            y -= heading[1].length === 1 ? 8 : 4;
            writeParagraph(stripMarkdown(heading[2]), {
                font: 'F1',
                size: heading[1].length === 1 ? 18 : heading[1].length === 2 ? 13 : 11,
                leading: heading[1].length === 1 ? 24 : 17,
                max: 100,
            });
            continue;
        }
        writeParagraph(stripMarkdown(line), { size: 9.3, leading: 12.5 });
    }
}

function renderSources() {
    newPage();
    writeLine('APPENDIX: COMPLETE SOURCE CODE', { size: 17, leading: 24 });
    writeLine('The following source files are reproduced from the project.', { size: 9.5, leading: 16 });
    for (const relativePath of sourceFiles) {
        newPage();
        writeParagraph(relativePath, { size: 11, leading: 16 });
        y -= 5;
        const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
        for (const sourceLine of source.replace(/\r/g, '').split('\n')) {
            const parts = wrapped(sourceLine || ' ', 116);
            for (const part of parts) writeLine(part, { font: 'F2', size: 7.2, leading: 9 });
        }
    }
}

function renderScreenshot() {
    if (!fs.existsSync(screenshotPath)) return;

    newPage();
    screenshotPageIndex = pages.length;
    writeLine('FIGURE: PUBLIC PORTFOLIO', { size: 17, leading: 24 });
    writeParagraph(
        'The public Projects section is database-backed and filterable. This capture shows the current empty state; add a real project before submitting a populated portfolio screenshot.',
        {
            size: 9.5,
        },
    );
    currentPage.push('q 504 0 0 332 54 350 cm /Im0 Do Q');
    y = 330;
    writeParagraph('Captured from the running Laravel + Inertia application on November 2, 2026.', { size: 8.5 });
    writeParagraph(
        'The manager, create, edit, confirmation, success, and validation screenshots still need to be added from an authenticated browser session.',
        {
            size: 8.5,
        },
    );
}

function buildPdf() {
    pages.push(currentPage);
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
    ];
    const pageIds = [];

    const screenshot = screenshotPageIndex >= 0 ? readPng(screenshotPath) : null;
    const imageId = screenshot ? objects.length + pages.length * 2 + 1 : 0;

    pages.forEach((commands, index) => {
        const pageId = objects.length + 1;
        const contentId = pageId + 1;
        pageIds.push(`${pageId} 0 R`);
        const footer = `BT /F1 8 Tf 1 0 0 1 500 28 Tm (Page ${index + 1} of ${pages.length}) Tj ET`;
        const content = `${commands.join('\n')}\n${footer}\n`;
        const xObject = index === screenshotPageIndex ? ` /XObject << /Im0 ${imageId} 0 R >>` : '';
        objects.push(
            `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>${xObject} >> /Contents ${contentId} 0 R >>`,
            `<< /Length ${Buffer.byteLength(content, 'ascii')} >>\nstream\n${content}endstream`,
        );
    });

    if (screenshot) {
        const imageHeader = `<< /Type /XObject /Subtype /Image /Width ${screenshot.width} /Height ${screenshot.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns ${screenshot.width} >> /Length ${screenshot.data.length} >>\nstream\n`;
        objects.push(Buffer.concat([Buffer.from(imageHeader, 'ascii'), screenshot.data, Buffer.from('\nendstream', 'ascii')]));
    }

    objects[1] = `<< /Type /Pages /Kids [${pageIds.join(' ')}] /Count ${pageIds.length} >>`;
    const chunks = [Buffer.from('%PDF-1.4\n', 'ascii')];
    const offsets = [0];
    let offset = chunks[0].length;

    objects.forEach((object, index) => {
        offsets.push(offset);
        const chunk = Buffer.isBuffer(object)
            ? Buffer.concat([Buffer.from(`${index + 1} 0 obj\n`, 'ascii'), object, Buffer.from('\nendobj\n', 'ascii')])
            : Buffer.from(`${index + 1} 0 obj\n${object}\nendobj\n`, 'ascii');
        chunks.push(chunk);
        offset += chunk.length;
    });

    const xrefOffset = offset;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const objectOffset of offsets.slice(1)) xref += `${String(objectOffset).padStart(10, '0')} 00000 n \n`;
    xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    chunks.push(Buffer.from(xref, 'ascii'));
    fs.writeFileSync(outputPath, Buffer.concat(chunks));
    console.log(`Created ${path.relative(root, outputPath)} (${pages.length} pages).`);
}

function readPng(filePath) {
    const png = fs.readFileSync(filePath);
    if (png.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Public portfolio screenshot is not a PNG.');

    let width;
    let height;
    const imageData = [];
    for (let offset = 8; offset < png.length; ) {
        const length = png.readUInt32BE(offset);
        const type = png.toString('ascii', offset + 4, offset + 8);
        const data = png.subarray(offset + 8, offset + 8 + length);
        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            if (data[8] !== 8 || data[9] !== 2) throw new Error('Screenshot must use 8-bit RGB PNG encoding.');
        } else if (type === 'IDAT') {
            imageData.push(data);
        } else if (type === 'IEND') {
            break;
        }
        offset += length + 12;
    }

    return { width, height, data: Buffer.concat(imageData) };
}

const report = fs.readFileSync(reportPath, 'utf8');
const bodyStart = report.indexOf('## Section and justification');
if (bodyStart < 0) throw new Error('The activity report is missing its main section.');
renderReport(report.slice(0, bodyStart));
newPage();
renderReport(report.slice(bodyStart));
renderScreenshot();
renderSources();
buildPdf();
