import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (relativePath) => readFileSync(
    resolve(globalThis.process.cwd(), relativePath),
    'utf8',
);

describe('deployment configuration', () => {
    it('uses the Netlify URL consistently in public metadata', () => {
        const publicMetadata = [
            readProjectFile('index.html'),
            readProjectFile('public/robots.txt'),
            readProjectFile('public/sitemap.xml'),
            readProjectFile('README.md'),
        ].join('\n');

        expect(publicMetadata).toContain('https://rickandmorty99.netlify.app/');
        expect(publicMetadata).not.toMatch(/vercel\.app/i);
    });

    it('defines a production build, security headers and immutable asset caching', () => {
        const netlifyConfig = readProjectFile('netlify.toml');

        expect(netlifyConfig).toContain('publish = "dist"');
        expect(netlifyConfig).toContain('Content-Security-Policy');
        expect(netlifyConfig).toContain("connect-src 'self' https://rickandmortyapi.com");
        expect(netlifyConfig).toContain('X-Content-Type-Options = "nosniff"');
        expect(netlifyConfig).toContain('max-age=31536000, immutable');
    });

    it('keeps repository and API links on valid HTTPS targets', () => {
        const footer = readProjectFile('src/components/Footer.jsx');
        const config = readProjectFile('src/config.js');

        expect(footer).toContain('https://github.com/DavidDevXPe/Rick-and-Morty---App');
        expect(footer).toContain('https://rickandmortyapi.com/documentation');
        expect(config).toContain("API_BASE_URL = 'https://rickandmortyapi.com/api'");
    });
});
