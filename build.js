import { rimraf } from 'rimraf';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// Function to install necessary dependencies
async function installDependencies() {
    console.log('Installing dependencies...');
    await execAsync('npm install express redis compression node-fetch http2');
    console.log('Dependencies installed.');
}

// Function to set up the environment and run the server
async function setupServer() {
    console.log('Setting up the server...');
    const serverType = process.argv.find(arg => ['--concurrency', '--http2', '--tls'].includes(arg)) || '--concurrency';

    switch (serverType) {
        case '--http2':
            await execAsync('node src/http2.js');
            break;
        case '--tls':
            await execAsync('node src/tls.js');
            break;
        default:
            await execAsync('node src/concurrency.js');
            break;
    }
    console.log('Server setup completed.');
}

// Function to build the project using esbuild
async function buildProject() {
    console.log('Building the project...');

    // read version from package.json
    const pkg = JSON.parse(await readFile('package.json'));
    process.env.ULTRAVIOLET_VERSION = pkg.version;

    const isDevelopment = process.argv.includes('--dev');

    await rimraf('dist');
    await mkdir('dist');

    // don't compile these files
    await copyFile('src/sw.js', 'dist/sw.js');
    await copyFile('src/uv.config.js', 'dist/uv.config.js');

    await build({
        platform: 'browser',
        sourcemap: true,
        minify: !isDevelopment,
        entryPoints: {
            'uv.bundle': './src/rewrite/index.js',
            'uv.client': './src/client/index.js',
            'uv.handler': './src/uv.handler.js',
            'uv.sw': './src/uv.sw.js',
        },
        define: {
            'process.env.ULTRAVIOLET_VERSION': JSON.stringify(
                process.env.ULTRAVIOLET_VERSION
            ),
        },
        bundle: true,
        logLevel: 'info',
        outdir: 'dist/',
    });

    console.log('Project build completed.');
}

// Main function to run all steps
async function main() {
    try {
        await installDependencies();
        await buildProject();
        await setupServer();
    } catch (err) {
        console.error('Error during build process:', err);
        process.exit(1);
    }
}

main();
