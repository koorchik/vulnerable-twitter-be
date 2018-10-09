const webpack       = require('webpack');
const path          = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry  : './app.js',
    target : 'node',
    mode   : 'development',
    output : {
        path     : path.join(__dirname, 'build'),
        filename : 'app.js',
        libraryTarget: "commonjs2"
    },


    module : {
        rules : [
            {
                use     : 'babel-loader',
                test    : /\.js$/,
                exclude : /node_modules/
            }
        ]
    },
    externals : [ nodeExternals() ]
};
