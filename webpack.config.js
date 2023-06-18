/*
NB The webpack.config.js files in my-loop, adserver and wwappbase.js are identical but cannot be symlinked!
If it's a symlink, NPM will resolve paths (including module names) relative to the symlink source - and
complain that it can't find webpack, because it's not installed in /wwappbase.js/templates/node_modules
Keep this copy in sync with the others - if the same file can't be used for all three, there should be a good reason.
*/
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// Needed IF you want to run git commands & get current branch
const { execSync } = require('child_process');

// Get current git branch. If it's a release branch (which will have matching legacy-unit files)
// inject it in the bundle for e.g. presetting legacyUnitBranch
let RELEASE_BRANCH = JSON.stringify('');
let head = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
if (head.match(/(gl-)?release-.*/)) RELEASE_BRANCH = JSON.stringify(head);

const baseConfig = {
    // NB When editing keep the "our code" entry point last in this list - makeConfig override depends on this position.
    entry: ['core-js', './websrc/js/app.jsx'],
    output: {
        path: path.resolve(__dirname, "web/build"), // NB: this should include js and css outputs
        // filename: is left undefined and filled in by makeConfig
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
        symlinks: false,
        alias: {
            querystring: 'querystring-es3',
            util: 'util'
        }
    },
    module: {
        rules: [
            {	// .js or .jsx
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ['@babel/preset-env', { targets: { ie: '11' }, loose: true }]
                    ],
                    plugins: [
                        '@babel/plugin-transform-react-jsx',
                        '@babel/plugin-transform-runtime',
                        // loose: true specified to silence warnings about mismatch with preset-env loose setting
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ['@babel/plugin-proposal-private-methods', { loose: true }],
                        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                    ]
                }
            }, {
                test: /\.less$/,
                // If we use css-loader with default options it will try to inline any url('/img/whatever.png') rules it finds.
                // We don't want this (plus the URLs don't resolve correctly, throwing an error on compile) so {url: false} disables it.
                use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {url: false}}, 'less-loader'],
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'style/main.css' }),
        //new NodePolyfillPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                RELEASE_BRANCH,
            }
        }),
    ]
};


/**
* Copy and fill out the baseConfig object with:
* @param {!string} filename Set the bundle output.filename
* @param {?string} mode "production" or "development", determines if JS will be minified
* @param {?string} entry (unusual) Compile a different entry-point file instead of app.jsx
* ## process.env
* process is always globally available to runtime code.
*/
const makeConfig = ({ filename, mode, entry }) => {
    const config = { ...baseConfig, mode };
    config.output = { ...baseConfig.output, filename };

    // Has an entry point other than ./src/js/app.jsx been requested?
    if (entry) config.entry = [...config.entry.slice(0, -1), entry]; // Copy, don't modify in-place

    return config;
};

const configs = [
    makeConfig({filename: 'js/bundle-debug.js', mode: 'development' }),
//	Add additional configs (eg with different entry points) like this:
//	makeConfig({filename: 'js/other-bundle-debug.js', mode: 'development', entry:'./src/js/other.js'}),
];

// Default behaviour: Create a production config (with mode & output filename amended) for each dev config.
// Allow debug-only compilation for faster iteration in dev
if (process.env.NO_PROD !== 'true') {
    const prodconfigs = configs.map(devc => ({
        ...devc,
        mode: 'production',
        output: {
            ...devc.output,
            filename: devc.output.filename.replace('-debug', '')
        }
    }));
    // Put new production configs in the main list
    prodconfigs.forEach(prodc => configs.push(prodc));
}

// Output bundle files for production and dev/debug
module.exports = configs;
