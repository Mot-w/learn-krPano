/**
 * Created by 吴琼 on 2017/9/19.
 */
var krpano;

window.onload = function () {
    //获取krpano DOM节点
    krpano = document.getElementById('krpanoSWFObject');
     
    PanoEvents();

    //showDebugger();

    //开始自动旋转之前，最后一次交互之后的等待时间（默认时间为1.5s）
    krpano.set('autorotate.waittime', '0');

    //开启自动旋转, 默认值为false不开启
    //krpano.set('autorotate.enabled', true);
};

//krpnao 的注册事件
function PanoEvents() {

    //旋转一圈调用的时间
    krpano.set('events.onautorotateoneround', function () {
        //console.log(1)
    });

    //停止旋转后调用的时间
    krpano.set('events.onautorotatestop', function () {
        //alert('旋转停止');
        console.log('旋转停止')
    });

    //当视角发生变化时的事件
    krpano.set('events.onviewchanged', function () {
        var fpsDom = document.getElementById('fps');
        fpsDom.innerHTML = krpano.get('display.currentfps').toFixed(1);

        var vlookat = krpano.get('view.vlookat');   //Y
        var hlookat = krpano.get('view.hlookat');   //X
        var fov = krpano.get('view.fov');   //Z
        //console.log('vlookat:' + vlookat + '-- hlookat:'+hlookat+'-- fov:' + fov)
        
        //判断旋转2圈的时候停止旋转
        if (hlookat >= 720) {
            stopRotate();
        }
    });

    //定义停止旋转的事件，默认有'userviewchange|layers|keyboard'， 设置''则不允许通过点击等事件停止旋转
    krpano.set('autorotate.interruptionevents', '');

    //开始旋转时触发的时间
    krpano.set('events.onautorotatestart', function() {
        console.log('开始旋转')
    })
    //旋转停止时触发的时间
    krpano.set('events.onautorotatestop', function() {
        console.log('旋转停止')
    })

    //当xml文件场景加载完成后的事件
    krpano.set('events.onxmlcomplete', function () {
        //alert('场景加载完成，执行下面操作请点击确定')
    })

    //发生在加载完成之后，图片渲染完成后执行的事件
    krpano.set('events.onloadcomplete', function () {
        //alert('图片渲染完成，执行下面操作')
    })

    krpano.set('events.onnewpano', function () {
        console.log('进入新场景');
        asteroid();
        console.log('hlookat:'+krpano.get('view.hlookat'));
        console.log('vlookat:'+krpano.get('view.vlookat'));
        console.log('fov:'+krpano.get('view.fov'));
        console.log('fisheye:'+krpano.get('view.fisheye'));
    })
    krpano.set('events.onremovepano', function () {
        console.log('离开当前场景')
    })
    krpano.set('events.onnewscene', function() {
        console.log('新场景')
    })
}

//debugger
function showDebugger() {
    krpano.call("showlog()")
}

//全屏
function fullScreen() {
   // krpano.set('fullscreen', true);
}

//开始旋转
function startRotate() {
    krpano.call('autorotate.start()');

    //开启旋转后的加速度，默认为1s，加速至最大速度
    //krpano.set('autorotate.accel', '1.5');

    //设置旋转的最大速度（负值为顺时针旋转）
    krpano.set('autorotate.speed', '-10');

    //开启旋转后先位于给定的值，然后在旋转，如果给定的为off或非数字的值，则会禁用它
    //krpano.set('autorotate.horizon', '0.0');

    //缩放到给定的视野后再旋转
    //krpano.set('autorotate.tofov', '0');

    //减慢相对于当前缩放/视场的自动转速，以便在所有变焦距离处获得相同的视觉速度。默认值为true
    krpano.set('autorotate.zoomslowdown', false);
}

//停止旋转
function stopRotate() {
    krpano.call('autorotate.stop()')
}

//判断当前是否旋转，只读属性
function showVrState() {
    krpano.get('autorotate.isrotating') ? console.log('当前正在旋转') : console.log('当前没有旋转');
    //console.log(krpano.get('autorotate.ispaused'));
}

//停止旋转waittime 秒后再启动旋转
function timeOut() {
    //停止旋转后根据设置waittime时间后再次启动旋转
    krpano.call('autorotate.interrupt')
}

//暂停旋转
function pauseRotate() {
    krpano.call('autorotate.pause()')
}

//恢复自动旋转
function restoreRotate() {
    krpano.call('autorotate.resume()')
}

//切换场景
function loadPano() {
    krpano.call('loadpano(01JiangSuDaJuYuan.xml)')
}

//小行星开场
function asteroid() {
    krpano.set("view.fisheye", 1.0);    //球体的弯曲程度
    krpano.set("view.fovmax", 150);     //相机距离物体的最大距离
    krpano.set("view.fov", 150);        //相机距离物体的距离
    krpano.set("view.hlookat", 180);    //水平视角的旋转角度
    krpano.set("view.vlookat", 90);     //垂直视角的旋转角度
    
    krpano.call('tween(view.hlookat, 0, 10);tween(view.vlookat, 0, 10);tween(view.fov, 90, 10);tween(view.fisheye, 0, 10)');
    //startRotate();
}


//添加热点
function addHotSport() {
    stopRotate();
    if(!$('.text-hot').hasClass('open')) {
        $('.text-hot').css('display', 'block').addClass('open');
    } else {
        return false;
    }
}

$(function () {
    $('#closeAdd').click(function () {
        if($('.text-hot').hasClass('open')) {
            $('.text-hot').css('display', 'none').removeClass('open');
        }
    })


    (function () {
        var dragging = false;
        var boxX, boxY, mouseX, mouseY, offsetX, offsetY;
      
        var box = document.getElementById('text-hot-flag');
      
        box.onmousedown = down;
        document.onmousemove = move;
        document.onmouseup = up;
      
        function down(e) {
          dragging = true;
          boxX = box.offsetLeft;
          boxY = box.offsetTop;
          mouseX = parseInt(getMouseXY(e).x);
          mouseY = parseInt(getMouseXY(e).y);
          offsetX = mouseX - boxX;
          offsetY = mouseY - boxY;
        }
      
        function move(e) {
          if (dragging) {
            var x = getMouseXY(e).x - offsetX;
            var y = getMouseXY(e).y - offsetY;
            var width = document.documentElement.clientWidth - box.offsetWidth;
            var height = document.documentElement.clientHeight - box.offsetHeight;
      
            x = Math.min(Math.max(0, x), width);
            y = Math.min(Math.max(0, y), height);
      
            box.style.left = x + 'px';
            box.style.top = y + 'px';
          }
        }
      
        function up(e) {
          dragging = false;
        }
      
        function getMouseXY(e) {
          var x = 0, y = 0;
          e = e || window.event;
          if (e.pageX) {
            x = e.pageX;
            y = e.pageY;
          } else {
            x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
            y = e.clientY + document.body.scrollTop - document.body.clientTop;
          }
          return {
            x: x,
            y: y
          };
        }
      })()
})


