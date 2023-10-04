const merge = require('webpack-merge');
const main = require('./webpack.build');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const nodeExternals = require('webpack-node-externals');

module.exports = merge.merge(main, {
    watch: true,
    mode: 'development',
    devtool: 'source-map',
    externals: nodeExternals(),
    plugins: [
        new WebpackShellPluginNext({
            onBuildEnd: {
                scripts: ['nodemon --watch build/flow.js --exec \"node examples/hello-world.js\"'],
                blocking: false,
                parallel: true,
                safe: false,
            },
        }),
    ],
});
