// 获取id为"cas"的canvas元素
var canvas = document.getElementById("cas");
// 创建一个新的canvas元素
var ocas = document.createElement("canvas");
// 获取新创建的canvas的2D绘图上下文
var octx = ocas.getContext("2d");
// 获取页面中已存在的canvas的2D绘图上下文
var ctx = canvas.getContext("2d");
// 设置新创建的canvas和页面中的canvas的宽度为窗口的内部宽度
ocas.width = canvas.width = window.innerWidth;
// 设置新创建的canvas和页面中的canvas的高度为窗口的内部高度
ocas.height = canvas.height = window.innerHeight;
// 初始化一个空数组，用于存储爆炸效果对象
var bigbooms = [];

// window.onload = function() {
//     initAnimate();
// };
document.getElementById("iframMusic").onload = function() {
    var music = document.getElementById("music");
    music.src ='./music.mp3';
    music.addEventListener("canplaythrough", function() {
        music.play();
    });
};







// 初始化动画函数，用于开始动画
function initAnimate() {

    // 绘制背景
    drawBg();
    // 记录当前时间，作为动画的起始时间
    lastTime = new Date();
    // 开始执行动画循环
    animate();
    // 启动显示形状元素的定时器
//    shapeInterval = setInterval(showNextShape, 6000);
}
// 定义一个变量，用于存储上一次动画更新的时间
var lastTime;

// 动画循环函数
function animate() {
    // 保存当前绘图上下文的状态
    ctx.save();
    // 设置填充颜色为半透明的深蓝色
    ctx.fillStyle = "rgba(0,5,24,0.1)";
    // 填充整个canvas区域，用于清除之前的画面并设置背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 恢复之前保存的绘图上下文状态
    ctx.restore();
    // 获取当前时间
    var newTime = new Date();
    // 如果距离上次更新时间超过一定阈值
    if (newTime - lastTime > 500 + (window.innerHeight - 767) / 2) {
        // 生成一个随机数，判断是否大于33
        var random = Math.random() * 100 > 33? true: false;
        // 在canvas宽度的五分之一到五分之四之间生成一个随机的x坐标
        var x = getRandom(canvas.width / 5, canvas.width * 4 / 5);
        // 在50到200之间生成一个随机的y坐标
        var y = getRandom(0, 200);
        // 如果随机数为true
        if (random) {
            // 创建一个新的Boom对象，传入随机的半径、颜色和位置信息
            var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
                x: x,
                y: y
            });
            // 将新创建的Boom对象添加到bigbooms数组中

            bigbooms.push(bigboom)
        } else {
//            // 创建一个新的Boom对象，传入随机的半径、颜色和特定位置信息，以及一个随机的形状元素
//            var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
//                    x: canvas.width / 2,
//                    y: 200
//                },
////                document.querySelectorAll(".shape")[parseInt(getRandom(0, document.querySelectorAll(".shape").length+1))]);
//                const shapeElements = document.querySelectorAll(".shape");
//                for (let i = 0; i < shapeElements.length; i++) {
//                    console.log(shapeElements[i].textContent);
//                }
                // 创建一个新的Boom对象，传入随机的半径、颜色和特定位置信息，以及一个随机的形状元素
                    const shapeElements = document.querySelectorAll(".shape");
                    let randomShapeIndex = parseInt(getRandom(0, shapeElements.length));
                    let randomShape = shapeElements[randomShapeIndex];

                    var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
                        x: canvas.width / 2,
                        y: 200
                    }, randomShape);

                    // 遍历形状元素并打印文本内容
                    for (let i = 0; i < shapeElements.length; i++) {
                        console.log(shapeElements[i].textContent);
                    }


            // 将新创建的Boom对象添加到bigbooms数组中
            bigbooms.push(bigboom)

        }
        // 更新上一次动画更新的时间为当前时间
        lastTime = newTime;
        // 在控制台打印bigbooms数组
        console.log(bigbooms)
    }
    // 遍历stars数组，调用每个元素的paint方法绘制星星
    stars.foreach(function() {
        this.paint()
    });
    // 绘制月亮
    drawMoon();
    // 遍历bigbooms数组
    bigbooms.foreach(function(index) {
        var that = this;
        // 如果当前爆炸效果对象未死亡
        if (!this.dead) {
            // 移动当前爆炸效果对象
            this._move();
            // 绘制当前爆炸效果对象的光效
            this._drawLight()
        } else {
            // 遍历当前爆炸效果对象的碎片数组
            this.booms.foreach(function(index) {
                if (!this.dead) {
                    // 移动当前碎片
                    this.moveTo(index)
                } else {
                    // 如果当前碎片是最后一个碎片
                    if (index === that.booms.length - 1) {
                        // 将bigbooms数组中对应的爆炸效果对象设置为null
                        bigbooms[bigbooms.indexOf(that)] = null
                    }
                }
            })
        }
    });
    // 使用requestAnimationFrame或其兼容的方法递归调用animate函数，实现动画循环
    raf(animate)
}



// 绘制月亮的函数
function drawMoon() {
    // 获取id为"moon"的图片元素
    var moon = document.getElementById("moon");
    // 设置月亮的中心x坐标为canvas宽度减去200
    var centerX = canvas.width - 200,
        // 设置月亮的中心y坐标为100
        centerY = 100,
        // 设置月亮的宽度为80
        width = 80;
    // 如果月亮图片已经加载完成
    if (moon.complete) {
        // 在指定位置绘制月亮图片
        ctx.drawImage(moon, centerX, centerY, width, width)
    } else {
        // 当月亮图片加载完成时执行以下函数
        moon.onload = function() {
            // 在指定位置绘制月亮图片
            ctx.drawImage(moon, centerX, centerY, width, width)
        }
    }
    // 初始化一个索引变量
    var index = 0;
    // 循环10次，绘制月亮的光晕效果
    for (var i = 0; i < 10; i++) {
        // 保存当前绘图上下文的状态
        ctx.save();
        // 开始一个新的路径
        ctx.beginPath();
        // 绘制一个圆形路径，用于表示光晕，半径逐渐增大
        ctx.arc(centerX + width / 2, centerY + width / 2, width / 2 + index, 0, 2 * Math.PI);
        // 设置填充颜色为半透明的淡黄色
        ctx.fillStyle = "rgba(240,219,120,0.005)";
        // 增加索引变量的值，用于增大光晕的半径
        index += 2;
        // 填充圆形路径，绘制光晕
        ctx.fill();
        // 恢复之前保存的绘图上下文状态
        ctx.restore()
    }
}

// 为数组原型添加一个foreach方法，用于遍历数组并执行回调函数
Array.prototype.foreach = function(callback) {
    for (var i = 0; i < this.length; i++) {
        if (this[i]!== null) {
            callback.apply(this[i], [i])
        }
    }
};

// 获取requestAnimationFrame或其兼容的方法，如果都不支持则使用setTimeout模拟
var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60)
    };

// 当canvas被点击时执行以下函数
canvas.onclick = function() {
    // 获取鼠标点击的x坐标
    var x = event.clientX;
    // 获取鼠标点击的y坐标
    var y = event.clientY;
    // 创建一个新的Boom对象，传入随机的半径、颜色和点击位置信息
    var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
        x: x,
        y: y
    });
    // 将新创建的Boom对象添加到bigbooms数组中
    bigbooms.push(bigboom)
};

// Boom类的构造函数，用于创建爆炸效果对象
var Boom = function(x, r, c, boomArea, shape) {
    // 初始化一个空数组，用于存储爆炸产生的碎片
    this.booms = [];
    // 设置爆炸效果对象的x坐标
    this.x = x;
    // 设置爆炸效果对象的y坐标，初始值为canvas高度加上半径
    this.y = (canvas.height + r);
    // 设置爆炸效果对象的半径
    this.r = r;
    // 设置爆炸效果对象的颜色
    this.c = c;
    // 设置爆炸效果对象的形状，默认为false
    this.shape = shape || false;
    // 设置爆炸效果对象的目标区域
    this.boomArea = boomArea;
    // 初始化一个角度变量
    this.theta = 0;
    // 初始化一个死亡状态变量，默认为false
    this.dead = false;
    // 生成一个随机的爆炸范围值
    this.ba = parseInt(getRandom(100, 300))
};

// Boom类的原型对象，定义了爆炸效果对象的方法
Boom.prototype = {
    // 绘制爆炸效果对象的方法
    _paint: function() {
        // 保存当前绘图上下文的状态
        ctx.save();
        // 开始一个新的路径
        ctx.beginPath();
        // 绘制一个圆形路径，用于表示爆炸效果对象
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        // 设置填充颜色为爆炸效果对象的颜色
        ctx.fillStyle = this.c;
        // 填充圆形路径，绘制爆炸效果对象
        ctx.fill();
        // 恢复之前保存的绘图上下文状态
        ctx.restore()
    },
    // 移动爆炸效果对象的方法
    _move: function() {
        // 计算爆炸效果对象与目标区域的x轴和y轴的距离
        var dx = this.boomArea.x - this.x,
            dy = this.boomArea.y - this.y;
        // 根据距离和速度系数移动爆炸效果对象的x坐标
        this.x = this.x + dx * 0.01;
        // 根据距离和速度系数移动爆炸效果对象的y坐标
        this.y = this.y + dy * 0.01;
        // 如果爆炸效果对象到达目标区域
        if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
            // 如果有指定的形状
            if (this.shape) {
                // 执行形状爆炸效果
                this._shapBoom()
            } else {
                // 执行普通爆炸效果
                this._boom()
            }
            // 设置爆炸效果对象的死亡状态为true
            this.dead = true
        } else {
            // 如果未到达目标区域，绘制爆炸效果对象
            this._paint()
        }
    },
    // 绘制爆炸效果对象光效的方法
    _drawLight: function() {
        // 保存当前绘图上下文的状态
        ctx.save();
        // 设置填充颜色为半透明的黄色
        ctx.fillStyle = "rgba(255,228,150,0.3)";
        // 开始一个新的路径
        ctx.beginPath();
        // 绘制一个圆形路径，用于表示光效，半径在原半径的基础上加上一个随机值
        ctx.arc(this.x, this.y, this.r + 3 * Math.random() + 1, 0, 2 * Math.PI);
        // 填充圆形路径，绘制光效
        ctx.fill();
        // 恢复之前保存的绘图上下文状态
        ctx.restore()
    },
    // 普通爆炸效果的方法，生成并添加碎片到booms数组中
    _boom: function() {
        // 生成一个随机的碎片数量
        var fragNum = getRandom(30, 200);
        // 生成一个随机的样式值
        var style = getRandom(0, 10) >= 5? 1 : 2;
        var color;
        // 如果样式为1
        if (style === 1) {
            // 生成一个随机的颜色对象
            color = {
                a: parseInt(getRandom(128, 255)),
                b: parseInt(getRandom(128, 255)),
                c: parseInt(getRandom(128, 255))
            }
        }
        // 生成一个随机的碎片扩散范围
        var fanwei = parseInt(getRandom(300, 400));
        // 循环生成碎片并添加到booms数组中
        for (var i = 0; i < fragNum; i++) {
            // 如果样式为2
            if (style === 2) {
                // 生成一个随机的颜色对象
                color = {
                    a: parseInt(getRandom(128, 255)),
                    b: parseInt(getRandom(128, 255)),
                    c: parseInt(getRandom(128, 255))
                }
            }
            // 生成一个随机的角度
            var a = getRandom( - Math.PI, Math.PI);
            // 根据角度和扩散范围计算碎片的x坐标
            var x = getRandom(0, fanwei) * Math.cos(a) + this.x;
            // 根据角度和扩散范围计算碎片的y坐标
            var y = getRandom(0, fanwei) * Math.sin(a) + this.y;
            // 生成一个随机的碎片半径
            var radius = getRandom(0, 2);
            // 创建一个新的Frag对象，传入碎片的相关信息
            var frag = new Frag(this.x, this.y, radius, color, x, y);
            // 将新创建的Frag对象添加到booms数组中
            this.booms.push(frag)
        }
    },
    // 形状爆炸效果的方法，根据指定的形状生成并添加碎片到booms数组中
    _shapBoom: function() {
        var that = this;
        putValue(ocas, octx, this.shape, 6,
            function(dots) {
                var dx = canvas.width / 2 - that.x;
                var dy = canvas.height / 2 - that.y;
                for (var i = 0; i < dots.length; i++) {
                    color = {
                        a: dots[i].a,
                        b: dots[i].b,
                        c: dots[i].c
                    };
                    var x = dots[i].x;
                    var y = dots[i].y;
                    var radius = 1;
                    var frag = new Frag(that.x, that.y, radius, color, x - dx, y - dy);
                    that.booms.push(frag)
                }
            })
    }
};


// 在指定的canvas上根据给定的元素和参数获取图像数据并执行回调函数
function putValue(canvas, context, ele, dr, callback) {
    // 清除canvas上的内容


    context.clearRect(0, 0, canvas.width, canvas.height);
    // 创建一个新的Image对象
    var img = new Image();
    // 如果元素的innerHTML中包含"img"
    if (ele.innerHTML.indexOf("img") >= 0) {
        // 设置Image对象的src属性为元素中的图片的src属性
        img.src = ele.getElementsByTagName("img")[0].src;
        // 当图片加载完成时执行以下函数
        imgload(img,
            function() {
                // 在canvas的中心位置绘制图片
                context.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.width / 2);
                // 获取图像数据并转换为点数组
                dots = getimgData(canvas, context, dr);
                // 执行回调函数，传入点数组
                callback(dots)
            })
    } else {
        // 获取元素的innerHTML内容
        var text = ele.innerHTML;
        // 保存当前绘图上下文的状态
        context.save();
        // 设置字体大小为200px，字体为宋体加粗
        var fontSize = 200;
        context.font = fontSize + "px 宋体 bold";
        // 设置文本对齐方式为居中
        context.textAlign = "center";
        // 设置文本基线为居中
        context.textBaseline = "middle";
        // 设置填充颜色为随机的半透明颜色
        context.fillStyle = "rgba(" + parseInt(getRandom(128, 255)) + "," + parseInt(getRandom(128, 255)) + "," + parseInt(getRandom(128, 255)) + ", 1)";
        // 在canvas的中心位置绘制文本
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        // 恢复之前保存的绘图上下文状态
        context.restore();
        // 获取图像数据并转换为点数组
        dots = getimgData(canvas, context, dr);
        callback(dots)
    }
}
// 定义一个函数，用于加载图像，图像加载完成后调用回调函数
function imgload(img, callback) {
    // 如果图像已经加载完成
    if (img.complete) {
        // 直接调用回调函数，并将图像对象作为this指针传入
        callback.call(img)
    } else {
        // 当图像加载完成时，调用回调函数，并将图像对象作为this指针传入
        img.onload = function () {
            callback.call(this)
        }
    }
}

// 定义一个函数，用于获取图像数据并转换为点数组
function getimgData(canvas, context, dr) {
    // 获取指定区域的图像数据
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    // 清除画布上的内容
    context.clearRect(0, 0, canvas.width, canvas.height);
    var dots = [];
    // 遍历图像的每一行，步长为dr
    for (var x = 0; x < imgData.width; x += dr) {
        // 遍历图像的每一列，步长为dr
        for (var y = 0; y < imgData.height; y += dr) {
            // 计算当前像素在图像数据数组中的索引
            var i = (y * imgData.width + x) * 4;
            // 如果当前像素的透明度大于128
            if (imgData.data[i + 3] > 128) {
                var dot = {
                    // 当前像素的x坐标
                    x: x,
                    // 当前像素的y坐标
                    y: y,
                    // 当前像素的红色通道值
                    a: imgData.data[i],
                    // 当前像素的绿色通道值
                    b: imgData.data[i + 1],
                    // 当前像素的蓝色通道值
                    c: imgData.data[i + 2]
                };
                // 将当前像素的信息添加到点数组中
                dots.push(dot)
            }
        }
    }
    // 返回点数组
    return dots
}

// 定义一个函数，用于生成指定范围内的随机数
function getRandom(a, b) {
    // 返回一个在[a, b)范围内的随机数
    return Math.random() * (b - a) + a
}

// 定义最大半径和星星数组
var maxRadius = 1,
    stars = [];

// 定义一个函数，用于绘制背景，创建并绘制100个随机的星星
function drawBg() {
    // 循环100次
    for (var i = 0; i < 100; i++) {
        // 随机生成星星的半径
        var r = Math.random() * maxRadius;
        // 随机生成星星的x坐标
        var x = Math.random() * canvas.width;
        // 随机生成星星的y坐标
        var y = Math.random() * 2 * canvas.height - canvas.height;
        // 创建一个新的星星对象
        var star = new Star(x, y, r);
        // 将星星对象添加到星星数组中
        stars.push(star);
        // 调用星星对象的绘制方法
        star.paint()
    }
}

// 定义一个星星类
var Star = function (x, y, r) {
    // 星星的x坐标
    this.x = x;
    // 星星的y坐标
    this.y = y;
    // 星星的半径
    this.r = r
};

// 为星星类添加原型方法
Star.prototype = {
    // 定义绘制星星的方法
    paint: function () {
        // 保存当前绘图上下文的状态
        ctx.save();
        // 开始绘制路径
        ctx.beginPath();
        // 绘制一个圆形，圆心为星星的坐标，半径为星星的半径，角度从0到2π
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        // 设置填充颜色，透明度为星星的半径
        ctx.fillStyle = "rgba(255,255,255," + this.r + ")";
        // 填充圆形
        ctx.fill();
        // 恢复绘图上下文的状态
        ctx.restore()
    }
};

// 定义焦距
var focallength = 250;

// 定义一个碎片类
var Frag = function (centerX, centerY, radius, color, tx, ty) {
    // 碎片的目标x坐标
    this.tx = tx;
    // 碎片的目标y坐标
    this.ty = ty;
    // 碎片的当前x坐标
    this.x = centerX;
    // 碎片的当前y坐标
    this.y = centerY;
    // 碎片是否死亡的标志
    this.dead = false;
    // 碎片的中心x坐标
    this.centerX = centerX;
    // 碎片的中心y坐标
    this.centerY = centerY;
    // 碎片的半径
    this.radius = radius;
    // 碎片的颜色
    this.color = color
};

// 为碎片类添加原型方法
Frag.prototype = {
    // 定义绘制碎片的方法
    paint: function () {
        // 保存当前绘图上下文的状态
        ctx.save();
        // 开始绘制路径
        ctx.beginPath();
        // 绘制一个圆形，圆心为碎片的坐标，半径为碎片的半径，角度从0到2π
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        // 设置填充颜色，透明度为1
        ctx.fillStyle = "rgba(" + this.color.a + "," + this.color.b + "," + this.color.c + ",1)";
        // 填充圆形
        ctx.fill();
        // 恢复绘图上下文的状态
        ctx.restore()
    },
    // 定义移动碎片的方法
    moveTo: function (index) {
        // 增加碎片的目标y坐标
        this.ty = this.ty + 0.3;
        // 计算碎片当前位置与目标位置在x轴上的距离
        var dx = this.tx - this.x,
            // 计算碎片当前位置与目标位置在y轴上的距离
            dy = this.ty - this.y;
        // 如果碎片在x轴上接近目标位置
        this.x = Math.abs(dx) < 0.1? this.tx: (this.x + dx * 0.1);
        // 如果碎片在y轴上接近目标位置
        this.y = Math.abs(dy) < 0.1? this.ty: (this.y + dy * 0.1);
        // 如果碎片在x轴上到达目标位置且在y轴上接近目标位置
        if (dx === 0 && Math.abs(dy) <= 80) {
            // 设置碎片为死亡状态
            this.dead = true
        }
        // 绘制碎片
        this.paint()
    }
};