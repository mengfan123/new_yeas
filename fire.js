   // 获取id为"cas"的canvas元素
        const canvas = document.getElementById("cas");
        // 创建一个新的canvas元素
        const ocas = document.createElement("canvas");
        // 获取新创建的canvas的2D绘图上下文
        const octx = ocas.getContext("2d");
        // 获取页面中已存在的canvas的2D绘图上下文
        const ctx = canvas.getContext("2d");
        // 设置新创建的canvas和页面中的canvas的宽度为窗口的内部宽度
        ocas.width = canvas.width = window.innerWidth;
        // 设置新创建的canvas和页面中的canvas的高度为窗口的内部高度
        ocas.height = canvas.height = window.innerHeight;
        // 初始化一个空数组，用于存储爆炸效果对象
        const bigbooms = [];
        // 初始化星星数组
        const stars = [];
        // 最大半径
        const maxRadius = 1;

        // 预计算一些固定值
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const shapeElements = document.querySelectorAll(".shape");

        // 初始化动画函数，用于开始动画
        function initAnimate() {
            // 绘制背景（同时初始化星星）
            drawBg();
            // 记录当前时间，作为动画的起始时间
            let lastTime = new Date();
            // 开始执行动画循环
            function animate() {
                const newTime = new Date();
                if (newTime - lastTime > 500 + (canvasHeight - 767) / 2) {
                    const random = Math.random() * 100 > 33;
                    const x = getRandom(canvasWidth / 5, canvasWidth * 4 / 5);
                    const y = getRandom(0, 200);
                    if (random) {
                        const bigboom = new Boom(getRandom(canvasWidth / 3, canvasWidth * 2 / 3), 2, "#FFF", {
                            x,
                            y
                        });
                        bigbooms.push(bigboom);
                    } else {
                        const randomShapeIndex = parseInt(getRandom(0, shapeElements.length));
                        const randomShape = shapeElements[randomShapeIndex];
                        const bigboom = new Boom(getRandom(canvasWidth / 3, canvasWidth * 2 / 3), 2, "#FFF", {
                            x: canvasWidth / 2,
                            y: 200
                        }, randomShape);
                        bigbooms.push(bigboom);
                    }
                    lastTime = newTime;
                }

                // 保存当前绘图上下文的状态
                ctx.save();
                // 设置填充颜色为半透明的深蓝色
                ctx.fillStyle = "rgba(0,5,24,0.1)";
                // 填充整个canvas区域，用于清除之前的画面并设置背景色
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                // 恢复之前保存的绘图上下文状态
                ctx.restore();

                stars.forEach(star => star.paint());
                drawMoon();

                bigbooms.forEach((bigboom, bigboomIndex) => {
                    if (bigboom) {
                        if (!bigboom.dead) {
                            bigboom._move();
                            bigboom._drawLight();
                        } else {
                            bigboom.booms.forEach((frag, fragIndex) => {
                                if (!frag.dead) {
                                    frag.moveTo(fragIndex);
                                } else {
                                    if (fragIndex === bigboom.booms.length - 1) {
                                        bigbooms[bigboomIndex] = null;
                                    }
                                }
                            });
                        }
                    }
                });

                requestAnimationFrame(animate);
            }
            animate();
        }

        // 绘制月亮的函数
        function drawMoon() {
            const moon = document.getElementById("moon");
            const centerX = canvasWidth - 200;
            const centerY = 100;
            const width = 80;
            if (moon.complete) {
                ctx.drawImage(moon, centerX, centerY, width, width);
            } else {
                moon.onload = function () {
                    ctx.drawImage(moon, centerX, centerY, width, width);
                };
            }
            for (let index = 0; index < 10; index++) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX + width / 2, centerY + width / 2, width / 2 + index * 2, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(240,219,120,0.005)";
                ctx.fill();
                ctx.restore();
            }
        }

        // 获取requestAnimationFrame或其兼容的方法，如果都不支持则使用setTimeout模拟
        const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        // 当canvas被点击时执行以下函数
        canvas.onclick = function (event) {
            const x = event.clientX;
            const y = event.clientY;
            const bigboom = new Boom(getRandom(canvasWidth / 3, canvasWidth * 2 / 3), 2, "#FFF", {
                x,
                y
            });
            bigbooms.push(bigboom);
        };

        // Boom类的构造函数，用于创建爆炸效果对象
        function Boom(x, r, c, boomArea, shape) {
            this.booms = [];
            this.x = x;
            this.y = canvasHeight + r;
            this.r = r;
            this.c = c;
            this.shape = shape || false;
            this.boomArea = boomArea;
            this.theta = 0;
            this.dead = false;
            this.ba = parseInt(getRandom(100, 300));
        }

        // Boom类的原型对象，定义了爆炸效果对象的方法
        Boom.prototype = {
            // 绘制爆炸效果对象的方法
            _paint: function () {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                ctx.fillStyle = this.c;
                ctx.fill();
                ctx.restore();
            },
            // 移动爆炸效果对象的方法
            _move: function () {
                const dx = this.boomArea.x - this.x;
                const dy = this.boomArea.y - this.y;
                this.x = this.x + dx * 0.01;
                this.y = this.y + dy * 0.01;
                if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
                    if (this.shape) {
                        this._shapBoom();
                    } else {
                        this._boom();
                    }
                    this.dead = true;
                } else {
                    this._paint();
                }
            },
            // 绘制爆炸效果对象光效的方法
            _drawLight: function () {
                ctx.save();
                ctx.fillStyle = "rgba(255,228,150,0.3)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r + 3 * Math.random() + 1, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            },
            // 普通爆炸效果的方法，生成并添加碎片到booms数组中
            _boom: function () {
                const fragNum = getRandom(30, 200);
                const style = getRandom(0, 10) >= 5? 1 : 2;
                const fanwei = parseInt(getRandom(300, 400));
                for (let i = 0; i < fragNum; i++) {
                    let color;
                    if (style === 1) {
                        color = {
                            a: parseInt(getRandom(128, 255)),
                            b: parseInt(getRandom(128, 255)),
                            c: parseInt(getRandom(128, 255))
                        };
                    } else {
                        color = {
                            a: parseInt(getRandom(128, 255)),
                            b: parseInt(getRandom(128, 255)),
                            c: parseInt(getRandom(128, 255))
                        };
                    }
                    const a = getRandom(-Math.PI, Math.PI);
                    const x = getRandom(0, fanwei) * Math.cos(a) + this.x;
                    const y = getRandom(0, fanwei) * Math.sin(a) + this.y;
                    const radius = getRandom(0, 2);
                    const frag = new Frag(this.x, this.y, radius, color, x, y);
                    this.booms.push(frag);
                }
            },
            // 形状爆炸效果的方法，根据指定的形状生成并添加碎片到booms数组中
            _shapBoom: function () {
                const that = this;
                putValue(ocas, octx, this.shape, 6, function (dots) {
                    const dx = canvasWidth / 2 - that.x;
                    const dy = canvasHeight / 2 - that.y;
                    for (let i = 0; i < dots.length; i++) {
                        const color = {
                            a: dots[i].a,
                            b: dots[i].b,
                            c: dots[i].c
                        };
                        const x = dots[i].x;
                        const y = dots[i].y;
                        const radius = 1;
                        const frag = new Frag(that.x, that.y, radius, color, x - dx, y - dy);
                        that.booms.push(frag);
                    }
                });
            }
        };

        // 在指定的canvas上根据给定的元素和参数获取图像数据并执行回调函数
        function putValue(canvas, context, ele, dr, callback) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const img = new Image();
            if (ele.innerHTML.indexOf("img") >= 0) {
                img.src = ele.getElementsByTagName("img")[0].src;
                img.onload = function () {
                    context.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.width / 2);
                    const dots = getimgData(canvas, context, dr);
                    callback(dots);
                };
            } else {
                const text = ele.innerHTML;
                context.save();
                const fontSize = 200;
                context.font = fontSize + "px 宋体 bold";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "rgba(" + parseInt(getRandom(128, 255)) + "," + parseInt(getRandom(128, 255)) + "," + parseInt(getRandom(128, 255)) + ", 1)";
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                context.restore();
                const dots = getimgData(canvas, context, dr);
                callback(dots);
            }
        }

        // 定义一个函数，用于加载图像，图像加载完成后调用回调函数
        function imgload(img, callback) {
            if (img.complete) {
                callback();
            } else {
                img.onload = callback;
            }
        }

        // 定义一个函数，用于获取图像数据并转换为点数组
        function getimgData(canvas, context, dr) {
            const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            context.clearRect(0, 0, canvas.width, canvas.height);
            const dots = [];
            for (let x = 0; x < imgData.width; x += dr) {
                for (let y = 0; y < imgData.height; y += dr) {
                    const i = (y * imgData.width + x) * 4;
                    if (imgData.data[i + 3] > 128) {
                        const dot = {
                            x,
                            y,
                            a: imgData.data[i],
                            b: imgData.data[i + 1],
                            c: imgData.data[i + 2]
                        };
                        dots.push(dot);
                    }
                }
            }
            return dots;
        }

        // 定义一个函数，用于生成指定范围内的随机数
        function getRandom(a, b) {
            return Math.random() * (b - a) + a;
        }

        // 定义一个函数，用于绘制背景，创建并绘制100个随机的星星
        function drawBg() {
            for (let i = 0; i < 100; i++) {
                const r = Math.random() * maxRadius;
                const x = Math.random() * canvasWidth;
                const y = Math.random() * 2 * canvasHeight - canvasHeight;
                const star = new Star(x, y, r);
                stars.push(star);
            }
        }

        // 定义一个星星类
        function Star(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
        }

        // 为星星类添加原型方法
        Star.prototype = {
            // 定义绘制星星的方法
            paint: function () {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(255,255,255," + this.r + ")";
                ctx.fill();
                ctx.restore();
            }
        };

        // 定义焦距
        const focallength = 250;

        // 定义一个碎片类
        function Frag(centerX, centerY, radius, color, tx, ty) {
            this.tx = tx;
            this.ty = ty;
            this.x = centerX;
            this.y = centerY;
            this.dead = false;
            this.centerX = centerX;
            this.centerY = centerY;
            this.radius = radius;
            this.color = color;
        }

        // 为碎片类添加原型方法
        Frag.prototype = {
            // 定义绘制碎片的方法
            paint: function () {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(" + this.color.a + "," + this.color.b + "," + this.color.c + ",1)";
                ctx.fill();
                ctx.restore();
            },
            // 定义移动碎片的方法
            moveTo: function (index) {
                this.ty = this.ty + 0.3;
                const dx = this.tx - this.x;
                const dy = this.ty - this.y;
                this.x = Math.abs(dx) < 0.1? this.tx : (this.x + dx * 0.1);
                this.y = Math.abs(dy) < 0.1? this.ty : (this.y + dy * 0.1);
                if (dx === 0 && Math.abs(dy) <= 80) {
                    this.dead = true;
                }
                this.paint();
            }
        };

        initAnimate();