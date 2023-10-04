const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack')

const {
    NODE_ENV = 'development',
} = process.env;

const BUNDLE_MODULES = true;

module.exports = {
    entry: {
        "flow": './lib/index',
    },
    mode: NODE_ENV,
    target: 'node',
    output: {
        libraryTarget: 'umd',
        path: path.resolve('build'),
        filename: '[name].js',
    },
    externals: [
        function ({ context, request }, callback) {
            try {
                /** This will disable the schema fetching in the production */
                const blacklist = ['@apollo/subgraph'];
                if (request) {
                    if (blacklist.includes(request)) {
                        return callback(request);
                    }
                }
                callback();
            } catch (e) {
                console.log('[WEBPACK_ERROR] on module', request);
            }
        },
    ],
    optimization: {
        splitChunks: { name: 'vendor', chunks: 'all' },
    },
    resolve: {
        alias: {
            '@flow': path.resolve('./lib'),
        },
        extensions: ['.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            reportFiles: ['!node_modules/**/*']
                        },
                    },
                ]
            },
        ],
    },
    plugins: [
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /a\.js|node_modules/,
            // include specific files based on a RegExp
            include: /srv/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        }),
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports =
                    BUNDLE_MODULES == 'true'
                        ? [
                            'cors'
                        ]
                        : ['request', 'consolidate/lib', 'kcors'];
                if (lazyImports.includes(resource)) {
                    try {
                        require.resolve(resource);
                        console.log('[BUNDLING]', resource);
                        return false;
                    } catch (err) {
                        console.log('[SKIP-BUNDLING]', resource);
                        return true;
                    }
                }
                return false;
            },
        }),
    ],
};
