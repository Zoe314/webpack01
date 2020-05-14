## 1、Webpack作为前端构建工具的用途 文件在webpack01中
代码转换：如ts转换为js
文件优化：对文件进行压缩
代码分割
模块合并
自动刷新
代码校验
自动发布

## 2、安装webpack webpack-cli工具
命令：
npm install webpack webpack-cli -D

里面的核心概念：
入口  : 默认找的是src/index
出口  ：自动打包出的文件是dist/main.js
loader 
plugins：插件

## 根据运行环境不同，js的写法也不相同，因一个js就是一个模块。
esModule(浏览器环境)   commonJS(Node环境)
esModule   import   export
commonJS   require  module.exports

## 简单打包
查看本地的npm版本  
npm -v
若是5.2.0+，即5.2以上版本，可以直接npx webpack进行打包
这个命令：npx webpack
=> 找到node_modules/.bin/webpack命令，内部会去webpack-cli，根据用户自己的配置，进行解析，随后执行打包操作。若没有自己配置，就会找webpack默认的。（用户配置的文件就是webpack.config.js）
可以自己配置，package.json:
"scripts":{
    "dev":"webpack --mode developent",
    "build":"webpack --mode production"
}
运行命令：
    npm run dev  /  npm run build  执行打包

## 插件 plugin：
## 因webpack支持的插件是少的，所以需要自己手动添加安装，及配置。使用到的文件是：webpack.config.js。

## html-webpack-plugin 插件:将打包好的js自动引入html
安装命令：
    npm install html-webpack-plugin -D
index.html是模板文件，想将打包好的js自动引入到index.html，不用自己再配置了，就需要在webpack-config.js中引入此插件，使用即可。（开发环境中使用。）
具体使用在webpack.config.js/plugins中设置（先引入，再使用）。 配置完，运行打包命令，就可以将打包好的js直接引入到html文件中，

## clean-webpack-plugin 插件：清空上次打包好的文件(在这里是dist)
安装命令：
    npm install clean-webpack-plugin -D
在dist打包成功的文件夹下，可能有多个文件，为避免混乱，可以引入这个插件.

<!-- 自动化 刷新及打包 -->
## webpack-dev-server 
创建本地服务器，自动重新构建，自动打开浏览器并刷新
安装命令：
    npm install webpack-dev-server -D
下载完后，需要在webpack.config.js文件中进行配置,具体配置详见配置文件.
配置完后，需要在package.json的scripts中，添加dev-server的命令

## 多入口文件 多出口
<!--  多个入口文件 多出口 -->
    entry: {
        index: "./src/index.js",
        other: "./src/other.js"
    },
    output: {
        filename: '[name].js', //name代表上方的index/other
        path: path.resolve(__dirname, "dist")
    }

 ## 若想打包的时候有多个文件，同时引入不同的js
 可以定义数组，遍历
let htmlPlugin = ['index', 'other'].map(chunkName => {
    return new HtmlWebpackPlugin({
        template: `./${chunkName}.html`,
        filename: `${chunkName}.html`,
        chunks: [chunkName]
    })
})
最后用展开运算符执行...htmlPlugin放入plugins数组中 

## loader 解析文件
直接写样式，然后在index.js引入index.css是不生效的，运行npm run dev:server会报错。
### 解析CSS：css-loader style-loader
安装命令: 
    npm install css-loader style-loader -D
安装完后，去webpack.config.js中进行配置
module:{
    relus:[
        // 若有多个解析器，可以使用数组形式[],单个用字符串形式即可。
        {
            test: /\.css$/,
            // 值可以是[] 数组形式/ {}对象形式 / ""字符串形式
            use: ['style-loader', 'css-loader']
        }
    ]
}

### 解析less : less less-loader
安装命令：
    npm install less less-loader -D
安装后，类似上面的css-loader，也要设置下config文件，若将less文件引入到css中，也需要修改配置文件，详见webpack.config.js
### 解析sass ：node-sass sass-loader
### 解析stylus : stylus stylus-loader

## postcss-loader 插件：配置CSS3私有前缀 
如用到CSS3的新属性，浏览器会有不同的前缀，才可生效，就用到这个postcss-loader（样式处理工具）
会用到比如autoprefixer（处理私有前缀的插件）
在使用前，先安装：
    npm install postcss-loader autoprefixer -D
安装后，需要新建一个文件名为：postcss.config.js的文件，因会调用这个配置文件.
在里面引入下载的处理私有前缀的文件。
之后，要在webpack.config.js中的css-loader位置，加上这个postcss-loader,加前缀。
在module.exports => module => rules 下写上：
{
    test: /\.css$/,
    use: [
        'style-loader',//在使用MiniCssExtractPlugin插件分离出css后，这里的style-loader就不需要了
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2 
            }
        }, 'postcss-loader', 'less-loader' //加在less-loader前面
    ]
},
（可以运行npm run dev，看打包好的index.js,搜索就可以看到添加的CSS3属性的前缀）
## 若想要覆盖99.5%的浏览器，根目录下新建一个文件".browserslistrc"
    内容为：cover:99.5%

<!-- 现在js和css在打包时是放在一起的，可以使用插件来分离 -->
##  mini-css-extract-plugin 插件：分离css 
安装命令：
    npm install mini-css-extract-plugin -D
安装后，要在webpack.config.js中引入，并使用。具体使用见webpack.config.js
引入：
然后在plugins使用：
new MiniCssExtractPlugin({
    filename: 'css/main.css' //设置分离出的css的存放目录及文件名
})
还需要在 配置解析器 module => relus中写入：
{
    test: /\.css$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader 
        },
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2 
            }
        }, 'postcss-loader', 'less-loader'
    ]
},
就可以分离css了（可以npm run dev 查看，dist下会有一个css/main.css）

## optimize-css-assets-webpack-plugin 插件:压缩css
当项目上线,代码会进行压缩,若使用了MiniCssExtractPlugin插件分离css，打包的时候，js会自动压缩，但是css不会，所以需要安装单独的插件来压缩css文件
安装命令：
    npm install optimize-css-assets-webpack-plugin -D
安装后，在webpack.config.js中引入：
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
然后在与entry，output，module，plugins的同级，写上：
// webpack中配置压缩css，js的规定用法：
optimization: {
    minimizer: [//压缩的css ，js
        new OptimizeCssAssetsWebpackPlugin()
    ]
},
执行npm run build 就可以看到css，被压缩了。

但是，js此时就不会自动压缩了。需要使用terser-webpack-plugin插件（覆盖默认压缩工具minimizer）.
## terser-webpack-plugin 插件 压缩js
安装命令：
    npm install terser-webpack-plugin
不能放到开发环境下
然后根据压缩css的使用方法使用即可。
引入：
const TerserJsPlugin = require('terser-webpack-plugin'); 
使用：
optimization: {
    minimizer: [//压缩的css ，js
        new OptimizeCssAssetsWebpackPlugin(),
        new TerserJsPlugin()
    ]
},
然后使用npm run build
就可以看到，css和js都压缩成功了。

## 图片需要的解析器 webpack03中开始
### file-loader：把图片解析成一个文件传进来
### url-loader：把一些小图片解析成base64插入到页面中
安装命令：
    npm install file-loader url-loader -D
安装后，在index.js中，引入一张图片（已经下载好的），可以写如下代码：
import url from './img1.jpg';
// let oImg = document.createElement('img');
let oImg = new Image();
oImg.src = url;
document.body.appendChild(oImg);
在webpack.config.js中，需要在module中的rules配置flie-loader
{
    test: /\.(jpg|jpeg|gif)$/,
    use: {
        loader: 'file-loader',
        options: {
            name: 'img/[name].[ext]'
        }
    }
} 
打包npm run dev时，就可以把这个图片当做一个文件传进去了

若是图片不大的话，可以选择使用url-loader，转换为base64的格式
index.js中的引入不变，变化的是webpack.config.js中module=>rules的内容：
{
    test:/\.(jpg|jpeg|gif)/,
    use:{
        loader:'url-loader', //小于100kb的使用url-loader
        options:{
            limit:100*1024, //100kb
            outputPath:'img',
            publicPath:'http://www.baidu.com/img' //这可以写网上的地址
        }
    }
}
## 对于图标：iconfont 
官网地址：https://www.iconfont.cn/?spm=a313x.7781069.1998910419.d4d0a486a
使用方法：
将挑选好的iconfont，可以新建一个项目，直接下载到本地（新建的项目是指在iconfont网中的添加项目，需要下载到本地）
把需要的文件（iconfont.css & iconfont.eot & iconfont.svg & iconfont.ttf & iconfont.woff & iconfont.woff2）放入到项目中src中
要在项目index.js中引入这个下载好的图库
import './icon/iconfont.css'; //引入iconfont的样式文件
let i = document.createElement('i');
i.className = 'iconfont icon-agreement';
document.body.appendChild(i);
然后重新配置下webpack.config.js文件下的module=>relus:
{
    test:/\.(eot|svg|ttf|woff|woff2)$/,
    use:'file-loader'
} 
重新npm run devServer 就可以在页面中看到这个iconfont了

## 将ES6,ES7转换为所有浏览器都支持的ES5
在webpack中，一个重要的模块，此功能使用到的插件有：
### @babel/core babel的核心模块
### babel-loader 解析js代码，webpack和babel的桥梁
### @babel/preset-env es6转化为es5插件的集合 
安装命令：
npm install @babel/core babel-loader @babel/preset-env -D
安装完后，配置webpack.config.js中的module=>rules:
{
    test: /\.js$/,
    use: 'babel-loader',
    include: path.resolve(__dirname, 'src'), //需要编译的js文件的目录
    exclude: 'node_modules' //排除需要编译js文件的目录
}
运行打包npm run dev,发现打包出的文件中还是箭头函数，所以需要配置babel的预设。
创建一个文件名为：.babelrc,里面的内容为：
{
    // preset 预设（插件的集合）从下往上 
    "presets":[
        "@babel/preset-env"
    ],
    // plugins 一个个插件，从上往下
    "plugins":[]
}
再去执行npm run dev ,就会看到箭头函数已经可以解析成功了，但是有些ES6的方法，依然是不解析的，需要另外配置参数。
举个栗子：
index.js中写入如下代码：
    console.log('nihaoshijie'.includes('g'));
npm run dev ,在其中查找includes，这个方法还是这样写的，没有解析
所以需要修改.babelrc值：
{
    //  preset 预设（插件的集合）从下往上 
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage" //只转化使用的api
            }
        ]
    ],
    // plugins 一个个插件，从上往下 
    "plugins": []
}
修改后，npm run dev
会提示要去下载core-js
### 会要求下载core-js@3 这个相当于之前用现在废弃的@babel/pollyfill 
这时根据提示下载：npm install --save core-js@3
然后在进行配置.babelrc的内容，修改为：
{
    //  preset 预设（插件的集合）从下往上 
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage", //只转化使用的api
                "corejs": 3 //相当于之前用的@babel/pollyfill（已废弃）功用是转化es6中高版本的api(比如promise,async,await这种)
            }
        ]
    ],
    // plugins 一个个插件，从上往下 
    "plugins": []
}
再运行npm run dev,在打包好的文件中，搜索includes，就可以看到已经给转化为浏览器都可识别的es5方法

<!-- 装饰器 -->
在index.js中写一个装饰器的例子：
//草案
// 装饰器 语法糖（吃起来甜，理解有些难）
@fn
class Son{
    a = 1
}
function fn(target) {
    target.flag = true;
    console.log(target);
}
let S = new Son();
console.log(Son.flag);
运行 npm run dev,
会报错，因不能识别，需要用到下列的包
## @babel/plugin-proposal-class-properties 修饰类，还有一个@babel/plugin-proposal-decorators 修饰装饰器的
若有一些草案的语法，需要修饰器，用到一些包：
安装：npm install @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D
安装后，配置写.babelrc文件内容为：
{
    //  preset 预设（插件的集合）从下往上 
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage", //只转化使用的api
                "corejs": 3 //相当于之前用的@babel/pollyfill（已废弃）转化es6中高版本的api
            }
        ]
    ],
    // plugins 一个个插件，从上往下 
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true //若为false使用旧版本，用true使用最新的
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true //解析类的属性，默认为false。若用true是使用表达式
            }
        ]
    ]
}
写完后，运行:npm run dev:server ，就可以识别，并且会有打印值。
/*index.js中打印到的值
    function Son() {
        _classCallCheck(this, Son);
        this.a = 1;
    }
    true
*/
可以在sum.js中也写上一个方法，使用修饰器的例子：
class Person {
    @readonly
    first = 1;
}
function readonly(target, name, descriptor) {
    descriptor.writable = false; //不可更改
}
let p = new Person();
p.first = 100; 
//sum.js中，因已经写了不可更改，使用了修饰器修饰first，会得到如下错误：Uncaught TypeError: Cannot assign to read only property 'first' of object '#<Person>'


## @babel/plugin-transform-runtime @babel/runtime 优化js
每个js文件中有方法，在打包时会出现_classCallCheck方法，10个这种文件就会有10个_classCallCheck，所以会有冗余代码。想要优化js,会用到： @babel/plugin-transform-runtime @babel/runtime两个插件
安装：
    npm install  @babel/plugin-transform-runtime @babel/runtime -D
安装后，配置.babelrc：
{
    //  preset 预设（插件的集合）从下往上 
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage", //只转化使用的api
                "corejs": 3 //相当于之前用的@babel/pollyfill（已废弃）转化es6中高版本的api
            }
        ]
    ],
    // plugins 一个个插件，从上往下 
    "plugins": [
        "@babel/plugin-transform-runtime", //这是优化js，去除每次调用的封装方法会使用helpers的方法，轻便，会自动查找@babel/runtime,故不需要引入
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true //若为false使用旧版本，用true使用最新的
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true //解析类的属性，默认为false。若用true是使用表达式
            }
        ]
    ]
}
当配置好后，运行npm run dev,查看打包好的bundle.js,会发现，之前的_classCallCheck方法都变成了_babel_runtime_helpers_classCallCheck来转换类，不再是哪个文件有类就封装，而且bundle.js大小也发生变化。
若无这行"@babel/plugin-transform-runtime"，bundle.js是89kib
有"@babel/plugin-transform-runtime"的话，bundle.js是12.1kib

## 跨域问题：
需要一个后台返回数据，可以使用express
安装下：
npm install express -D
然后新建一个server.js文件，中间写上可成功运行的代码：
let express = require('express');
let app = express();
app.get('/user', function (req, res) {
    res.json({
        name: 'zoe'
    })
})
app.listen(8000, function () {
    console.log('8000服务已启动')
})
前端的服务端口号是7777，后台是8000，可以在index.js中，发送ajax，把之前代码都注释
let xhr = new XMLHttpRequest();
xhr.open('get', '/api/user', true); //异步
xhr.onreadystatechange = function () { //监听请求是否成功，成功打印数据
    console.log(xhr.response);
}
xhr.send();
启动服务:
    npm run dev:server
此时页面中会报错：HTTP404: 找不到 - 服务器尚未找到与请求的 URI (统一资源标识符)匹配的任何内容。(XHR)GET - http://localhost:7777/api/user，因为跨域了。
要想解决这个问题，需要在webpack.config.js中的devServer中，配置proxy，就是代理，来解决跨域,配置如下，直接在devServer中写：
devServer: {
    port: 7777,
    hot: true,
    contentBase: "static",
    open: true,
    proxy: { //启动代理，解决跨域
        '/api': { //请求地址以api开头
            target: 'http://localhost:8000', //请求的服务器地址
            secure: false, //若为true，表示以https开头
            pathRewrite: { '^/api': '' }, //重写请求的地址
            changeOrigin: true, //把请求头中的host改成服务器的地址
        }
    }
}
修改完配置信息，重新npm run dev:server 就可以获得数据
-------
若不需要后端配合，前端自己也可以实现：
devServer.before  提供在服务器内部所有其他中间件之前执行自定义中间件的能力。这可用于定义自定义处理程序。将以上写的proxy注释，并添加如下内容：
before: function (app, server) { //表示启动一个端口号为7777服务
    app.get('/api/user', function (req, res) {
        res.json({ custom: 'response' });
    });
}
配置完以上代码，就可以重启 npm run dev:server,就可解决跨域问题。
以上是解决跨域的两种方法，看后端是否有地址，有的话，直接配置，没有可以自己实现。













