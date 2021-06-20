
const L=85.05112877980659;

const getTileImage=(url,rect,zoom,ext)=>{
    let topLeft=lonlatToPixel(zoom,rect[0],rect[1]);
    let bottomRight=lonlatToPixel(zoom,rect[0]+rect[2],rect[1]+rect[3]);
    let xx=new Set();
    let yy=new Set();
    for(let i=topLeft[1];i<=bottomRight[1];i++){
        xx.add(Math.ceil(i/256));
    }
    for(let i=bottomRight[2];i<=topLeft[2];i++){
        yy.add(Math.ceil(i/256));
    }
    xx.sort();
    yy.sort();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    for(let i=0;i<xx.length;i++){
        for(let j=0;j<yy.length;j++){
            let u=url+zoom+"/"+xx[i]+"/"+yy[j]+"."+ext;
            let img = new Image();
            img.onload = function(){
                ctx.drawImage(tmp, i*256, j*256, null);
            };
            img.src=u;
        }
    }
};

const lonlatToPixel=(zoom,lon,lat)=>{
    let x=(Math.pow(2, zoom+7)*(lon/180.0+1.0));
    let y=((Math.pow(2, zoom+7)/Math.PI)*(-atanh(Math.sin(Math.toRadians(lat)))+atanh(Math.sin(Math.toRadians(L)))));
    return [x,y];
};

