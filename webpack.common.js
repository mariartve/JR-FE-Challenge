const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: false }]]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              // All default supported tags and attributes
              {
                tag: "img",
                attribute: "src",
                type: "src",
              },
              {
                tag: "img",
                attribute: "data-src",
                type: "src",
              },
              {
                tag: "source",
                attribute: "src",
                type: "src",
              },
              {
                tag: "source",
                attribute: "srcset",
                type: "srcset",
              },
              {
                tag: "lottie-player",
                attribute: "src",
                type: "src"
              },
              {
                tag: "link",
                attribute: "href",
                type: "src"
              },
            ],
          },
          minimize: false,
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
