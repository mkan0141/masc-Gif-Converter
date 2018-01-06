$(document).ready(function(){
    var debug = 0;
    var encoder = new GIFEncoder();
    
    var isChangeImage = true;
    var setCtx = true;
    var setCtxCount = 0;
    var str = "";
    var WIDTH = 300, HEIGHT = 300;
    var canvas = document.getElementById("demo");
    var ctx = canvas.getContext("2d");
    var i = 0;
    var count = 0;
    var img = new Image();
    var imgList = [];
    var srcList = [
        [
            "images/zstn_tya/1.png",
            "images/zstn_tya/1.png",
            "images/zstn_tya/2.png",
            "images/zstn_tya/2.png"
        ],
        [
            "images/zstn_eat/1.png",
            "images/zstn_eat/1.png",
            "images/zstn_eat/2.png",
            "images/zstn_eat/2.png"
        ],
        [
            "images/tznk_zzz/1.png",
            "images/tznk_zzz/2.png",
            "images/tznk_zzz/3のコピー.png",
            "images/tznk_zzz/3のコピー.png",
        ],
        [
            "images/tznk_mochi/1.png",
            "images/tznk_mochi/2.png",
            "images/tznk_mochi/3.png",
            "images/tznk_mochi/4.png",
            "images/tznk_mochi/5.png"
        ],
        /*
        [
            "images/fanfic_1.png",
            "images/fanfic_2.png",
            "images/fanfic_3.png",
            "images/fanfic_4.png",
            "images/fanfic_5.png",
            "images/fanfic_6.png"
        ],
        [
            "images/fanfic_1.png",
            "images/fanfic_2.png",
            "images/fanfic_3.png",
            "images/fanfic_4.png",
            "images/fanfic_5.png",
            "images/fanfic_6.png"
        ],*/
    ];
    var fontList = [
        "mini-wakuwaku",
        "Roboto",
        "明朝体"
    ];
    
    /*初期化*/
    function init(){
        var fonts = $("#fonts");
        for(var i = 0; i < fontList.length; i++){
            fonts.append($("<option>").val(i).text(fontList[i]));
        }
        
        var fontSize = $("#font-size");
        for(var i = 1; i < 51; i++){
            fontSize.append($("<option>").val(i).text(i));
        }
    }
    
    /*update*/
    function update(){
        loadImage();
    }
    
    /*canvasクリック時、imageを変える*/
    function changeImage(){
        var imageNumber = debug;
        while(imageNumber == debug){
            imageNumber = Math.floor(Math.random() * srcList.length);
        }
        debug = imageNumber;
    }
    
    /*canvasのサイズを動的に変える*/
    function autoSizeChange(){
        var strSize = document.getElementById("char").value.length; 
        WIDTH = Math.max(300, strSize * 50 + (strSize - 1) * 10)
    }
    
    /* canvasのリセット */
    function canvasRest(){
        autoSizeChange();
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
    }
    
    /* 表示する画像をimgList配列に代入していく */
    function loadImage(){
        imgList.length = 0;
        for(var i = 0; i < srcList[debug].length; i++){
            imgList[i] = new Image();
            imgList[i].onload = handleLoad;
            imgList[i].onerror = handleLoad;
            imgList[i].src = srcList[debug][i];
        }
        console.log("image load correct")
        function handleLoad(){
            if((++count) == 1){
                draw();
            }
        }
    }
    
    /* loadImageが完了したら線画を開始する */
    function draw(){
        canvasRest();
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        /*画像の座標*/
        ctx.drawImage(imgList[i], (WIDTH - imgList[i].width) / 2, HEIGHT - (imgList[i].height + 10));
        i = (i + 1) % imgList.length;
        drawString();
        if(setCtx == false && setCtxCount == i){
            encoder.addFrame(ctx);
            
            if(setCtxCount == imgList.length - 1){
                setCtx = true;
                encoder.finish();
                
                var bin = new Uint8Array(encoder.stream().bin);
                // Create Blob of GIF type 
                var blob = new Blob([bin.buffer], {type:'image/gif'});
                // Create object URL from blob
                var url = URL.createObjectURL(blob);
                var image = document.getElementById('image');
                image.src = url;
                image.onload = function() {
                    // Don't forget to revoke object url after load
                    URL.revokeObjectURL(url);
                }
                console.log("correct!!");
            }
            setCtxCount++;
        }
        
        setTimeout(draw, 400);
    }
    
    function drawString(){
        str = document.getElementById("char").value;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.font = "50px 'mini-wakuwaku'";
        // console.log(ctx.fontSize);
        var StringWidth = str.length * 50 + 10 * (str.length - 1);
        // console.log(StringWidth);
        for(var i = 0; i < str.length; i++){
            ctx.fillText(str[i], (WIDTH / 2 - StringWidth / 2 + 50 * i + 10 * i), 60);
        }
    }
    
    $('canvas').click(function(){
        if(isChangeImage == true){
            changeImage();
            update();
            isChangeImage = false;
            console.log(debug);
            setTimeout(okChangeImage, 1000);
        }
    });
    
    function okChangeImage(){
        isChangeImage = true;
    }
    
    /* gif生成ボタンを押したらgifを生成する準備をする */
    $('#btn').click(function(){
        setCtx = false;
        setCtxCount = 0;
        encoder = new GIFEncoder();
        encoder.setRepeat(false);
        encoder.setDelay(500);
        encoder.setQuality(20);
        encoder.setSize(WIDTH, HEIGHT);
        encoder.start();
    });
    
    $('#download').click(function(){
         encoder.download("mcac.gif");
    });
    canvasRest();
    loadImage();
    
});