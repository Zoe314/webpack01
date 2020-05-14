// 配置文件
// 遵循node中的commonJS规范,引入文件用require
const path = require('path');
// console.log(path.resolve(__dirname, "dist"));  //E:\Users\zoe\Desktop\学习js\zhufeng\webpack01\dist  ----path.resolve()将地址转成绝对路径
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //功用：每次打包清空文件夹
const HtmlWebpackPlugin = require('html-webpack-plugin'); //功用：将打包好的js文件自动引入到html中
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //插件功用：分离css的插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); //插件功用：压缩css
const TerserJsPlugin = require('terser-webpack-plugin'); //插件功用：压缩js

let htmlPlugin = ['index', 'other'].map(chunkName => {
    return new HtmlWebpackPlugin({
        template: `./${chunkName}.html`,
        filename: `${chunkName}.html`,
        chunks: [chunkName]
    })
})
module.exports = {
    // entry: "./src/index.js", //单个的入口文件
    // output: {
    //     // 文件指纹：hash（整个项目产生的hash） chunkHash(根据出口文件产生的hash) contentHash（根据内容产生的hash）
    //     // 为防止缓存，加个hash
    //     filename: 'bundle.js',
    //     path: path.resolve(__dirname, "dist")
    // },
    // 多个入口文件 多出口
    entry: {
        index: "./src/index.js",
        other: "./src/other.js"
    },
    output: {
        filename: '[name].js', //name代表上方的index/other
        path: path.resolve(__dirname, "dist")
    },
    // webpack中配置压缩css，js的规定用法：
    optimization: {
        minimizer: [//压缩的css ，js
            new OptimizeCssAssetsWebpackPlugin(), //压缩Css
            new TerserJsPlugin()  //压缩的js
        ]
    },
    // 配置解析器：
    module: {
        // 需先加载css- loader，再加载style-loader
        rules: [
            // 这里的顺序是： 从下往上 从右往左，所以写的时候要注意顺序
            // 使用对象{}写法：
            // {
            //     test: /\.css$/,
            //     use: 'css-loader'
            // },
            // {
            //     test: /\.css$/,
            //     use: 'style-loader',
            //     enforce: 'post' // pre优先加载 post 最后加载。
            // }
            // 若有多个解析器，可以使用数组形式[],单个用字符串形式即可。
            {
                test: /\.css$/,
                // 值可以是[] 数组形式/ {}对象形式 / ""字符串形式
                // 若在index.css中引入a.less，要配置如下：
                use: [
                    // 'style-loader',在使用MiniCssExtractPlugin插件分离出css后，会通过外链形式引入到页面，所以这里的style-loader就不需要了
                    {
                        loader: MiniCssExtractPlugin.loader //写完存放分离出css路径后还需要在此处调用一下loader（插件用法）
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2 //用后面的1个加载器来解析，若有2个就写2
                        }
                    }, 'postcss-loader', 'less-loader'
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'] //因是从右向左，可以先写右边的，然后在往前面加
            }
        ]
    },
    // devServer自动构建并打开
    devServer: {//在内存中打包，所有的目录是在根目录下
        port: 7777,  //端口
        compress: true, //是否压缩代码
        open: true, //是否自动打开浏览器
        contentBase: "static", //启动配置一个访问的静态资源文件
        hot: true //自动刷新
    },
    // 插件在这里设置
    plugins: [
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: ['cc/*', '!cc/a.js']
        // }) //清空cc下的所有文件，除了cc/a.js
        new CleanWebpackPlugin(), //清空输出的目录
        new MiniCssExtractPlugin({
            filename: 'css/main.css' //设置分离出的css的存放目录及文件名
        }),
        // 多的话就需要封装函数:直接展开定义的实例化例子
        ...htmlPlugin
        // 若有少的html,可以这么写
        // new HtmlWebpackPlugin({
        //     // 打包好的js插入到哪个文件就使用template字段
        //     template: "./index.html",//依赖的模板文件
        //     hash: true, //可以加hash,在打包好的文件中引入的js中有hash值
        //     minify: { //打包的时候去掉一些东西
        //         removeAttributeQuotes: true,//删除引号
        //         collapseWhitespace: true//删除空格
        //     },
        //     filename: "index.html", //打包后的html文件名
        //     chunks: ['index'] //指定引入的入口文件是哪个
        // }),
        // new HtmlWebpackPlugin({
        //     // 打包好的js插入到哪个文件就使用template字段
        //     template: "./other.html",//依赖的模板文件
        //     hash: true, //可以加hash,在打包好的文件中引入的js中有hash值
        //     filename: "other.html", //打包后的html文件名
        //     chunks: ['other']
        // })
    ]
}
