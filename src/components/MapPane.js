import React, { Component } from 'react';
//import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPane.css';
import {Deck} from '@deck.gl/core';
import * as turf from '@turf/turf'
import {setSlider,endRunning} from './ControlBar';
import {startPage} from './listItems';
import {imagePop,imageClose} from './Imagepopup'
import axios from 'axios';
import mapbox from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
mapbox.workerClass = MapboxWorker;

let targetRoute;
let map;
let cameraAltitude = 500;
let routeDistance;
let speed;
let start;
let running=false;
let phase;
let angle=0.0;
let camera_angle=[-0.005,-0.005];
let speedMul=1.0;
let pointer;
let angleVal=0;
let runAni;

const photo_URL="https://www.termat.net/photo/get/bounds/"
const image_URL="https://www.termat.net/photo/get/image/"

const dem={
    "type": "raster-dem",
    "tiles": [
      "https://www.termat.net/dem/{z}/{x}/{y}"
    ],
    "tileSize": 256,
    "maxzoom": 14,
    "attribution": "<a href='https://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
  };

 const mvt={
    "type": "vector",
    "glyphs": "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    "tiles": ["/potaling/mvt/{z}/{x}/{y}.pbf"],
    "minzoom":12,
    "maxzoom": 17,
    "attribution": "<a href='https://github.com/gsi-cyberjapan/gsimaps-vector-experiment'>地理院ベクトルタイル</a>"
  };

  const vector={
    "type": "vector",
    "glyphs": "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    "tiles": [
        "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
    ],
    "minzoom":9,
    "maxzoom": 16
  };

export const setSpeed=(val)=>{
    speedMul=val;
}

export const ieRunning=()=>{
    return running;
};

export const jumpTo=(data)=>{
    map.jumpTo({center: data});
};

const propcLine=(c)=>{
    c.forEach(e =>{
        targetRoute.push(e);
    });
}

export const parseGeojson=(str)=>{
    stopMovie();
    let json=JSON.parse(str);
    targetRoute=[];

    let array=json.features;
    array.forEach(e => {
        let c=e.geometry.coordinates;
        if(e.geometry.type==="Point"){
            targetRoute.push(c);
        }else if(e.geometry.type==="LineString"){
            propcLine(c);
        }
    });
    if (map.getLayer('line'))map.removeLayer('line');
    if (map.getSource('trace'))map.removeSource('trace');
    if (map.getLayer('point'))map.removeLayer('point');
    if (map.getSource('point'))map.removeSource('point');
    setGeojsonLayer(map);
    fitBounds();
    start=null;
    phase=0.0;
    setSlider(0);
};

export const setPhase=(val)=>{
    phase=val;
    if(phase===0.0)start=null;
    if(targetRoute)frame();
}

export const startMovie=()=>{
    running=true;
    if(targetRoute)requestAnimationFrame(frame);
};

export const stopMovie=()=>{
    running=false;
    cancelAnimationFrame(runAni);
    start=null;
};

export const fitBounds=()=>{
    if(!targetRoute)return;
    let xmin=100000;
    let xmax=-10000;
    let ymin=100000;
    let ymax=-10000;
    targetRoute.forEach(element => {
        xmin=Math.min(xmin,element[0]);
        xmax=Math.max(xmax,element[0]);
        ymin=Math.min(ymin,element[1]);
        ymax=Math.max(ymax,element[1]);
    });
    map.fitBounds([
        [xmin, ymin],
        [xmax, ymax]
    ]);
    addPhoto(map,xmin,xmax,ymin,ymax);
};

export const changeStyle=(style,flg)=>{
    if(style.terrain){
        delete style.terrain
    }    
    map.setStyle(style);
    map.on('style.load', () => {
        setTerrain(map);
        setSky(map);
        if(targetRoute)updateGeojsonLayer(map);
        if(flg===0)setVector(map);
    });
};

const viewState = {
    width: window.innerWidth,
    height: window.innerHeight,
    longitude: 139.692704,
    latitude: 35.689526,
    zoom: 14,
    maxZoom: 18,
    pitch: 65
 };

export default class MapPane extends Component {
//    static SAT='mapbox://styles/mapbox/satellite-v9';
    static STD='/potaling/std.json';
    static PHT= {
            "version": 8,
            "glyphs": "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
            "sources": {
                "t_pale": {
                    "type": "raster",
                    "tiles": [
                        "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
                    ],
                    "tileSize": 256,
                    "attribution": "<a href='https://maps.gsi.go.jp/development/ichiran.html'>地理院タイル（全国最新写真）</a>"
                }
            },
            "layers": [{
                "id": "t_pale",
                "type": "raster",
                "source": "t_pale",
                "minzoom": 8,
                "maxzoom": 18
            }]
        };

    componentDidMount() {
        map = new mapbox.Map({
            accessToken:'pk.eyJ1IjoidGVybWF0IiwiYSI6ImNrcGprNXE2ajBjdmQybnFyMmI5d3lrN2UifQ.EyZTUEX49xUnq6i2y0Na2Q',
            container: this.container,
            hash: true,
            style: MapPane.PHT,
            center: [139.692704, 35.689526], 
            zoom: 14,
            maxZoom: 18,
            minZoom: 8,
            pitch: 65,
            bearing: 0,
            interactive: true,
            localIdeographFontFamily: false,
//            antialias: true 
        });

        this.deckgl = new Deck({
            gl: map.painter.context.gl,
            layers: [],
            initialViewState:viewState
        });

        map.addControl(new mapbox.FullscreenControl());
        map.addControl(new mapbox.NavigationControl());

        map.on('load', () => {
            setTerrain(map);
            setSky(map);
//            setMvt(map);
            setGeojsonLayer(map);
            setVector(map);
            map.loadImage(
                '/potaling/camera.png',(error, image) => {
                    if (error) throw error;
                    map.addImage('custom-marker', image);
                }
            );
            const arg=getArg(window.location.search);
            if(arg["p"]){
                startPage(arg["p"]);
            }
        });

        map.on('touchstart', (e)=> {
            pointer=e.point;
        });
        map.on('touchend', (e)=> {
            pointer=null;
        });

        map.on('mousedown', (e)=> {
            pointer=e.point;
        });
        map.on('mouseup', (e)=> {
            pointer=null;
        });
        map.on('mouseout', (e)=> {
            pointer=null;
        });
        map.on('mousemove', (e)=> {
            move(e);
        });
        map.on('touchmove', (e)=> {
            move(e);
        });
        map.on('wheel',(e)=>{
            if(running){
                e.preventDefault();
                if(e.originalEvent.deltaY>0){
                    cameraAltitude=Math.min(2000,cameraAltitude+50);
                }else{
                    cameraAltitude=Math.max(200,cameraAltitude-50);
                }
            }
        });
    }

    render() {
        return <div className={'map'} ref={(e) => (this.container = e)} />;
    }
}

const move=(e)=>{
    if(running&&pointer){
        e.preventDefault();
        let x0=pointer.x;
        let y0=pointer.y;
        let x1=e.point.x;
        let y1=e.point.y;
        const e2 = e.originalEvent;
        let flg=false;
        if(e.originalEvent.altKey)flg=true;
        if (e2 && 'touches' in e2) {
            if (e2.touches.length > 1) {
                flg=true;
            }
        }
        if (flg) {
            if(y1>y0){
                cameraAltitude=Math.min(2000,cameraAltitude+50);
            }else{
                cameraAltitude=Math.max(200,cameraAltitude-50);
            }
        }else{
            if(x1>x0){
                angleVal=(angleVal+5)%360;
                angle=(angleVal/180.0)*Math.PI;
                camera_angle=[
                    -0.005*Math.cos(angle)-(-0.005)*Math.sin(angle),
                    -0.005*Math.sin(angle)+(-0.005)*Math.cos(angle)
                ];
            }else{
                angleVal=(angleVal-5)%360;
                angle=(angleVal/180.0)*Math.PI;
                camera_angle=[
                    -0.005*Math.cos(angle)-(-0.005)*Math.sin(angle),
                    -0.005*Math.sin(angle)+(-0.005)*Math.cos(angle)
                ];
            }
        }
        if(pointer)pointer=e.point;
    }
};

const updateGeojsonLayer=(mapobj)=>{
    if (!mapobj.getSource('trace')){
        mapobj.addSource('trace', {
            type: 'geojson',
            data: {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': targetRoute
                }
            }
        });
    }
    if (!mapobj.getLayer('line')){
        mapobj.addLayer({
            type: 'line',
            source: 'trace',
            id: 'line',
            paint: {
                'line-color': 'orange',
                'line-width': 5
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            }
        });
    }
    if (!mapobj.getSource('point')){
        let point = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': targetRoute[0]
                }
            }]
        };
        mapobj.addSource('point', {
            'type': 'geojson',
            'data': point 
        });
    }
    if (!mapobj.getLayer('point')){
        mapobj.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-color': "#ff0000",
                'circle-radius':8,
                'circle-stroke-width': 4,
                'circle-stroke-opacity': 0.05
            },
        });
    }
};

const setGeojsonLayer=(mapobj)=>{
    if(targetRoute){
        mapobj.addSource('trace', {
            type: 'geojson',
            data: {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': targetRoute
                }
            }
        });
        mapobj.addLayer({
            type: 'line',
            source: 'trace',
            id: 'line',
            paint: {
                'line-color': 'orange',
                'line-width': 5
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            }
        });
        let point = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': targetRoute[0]
                }
            }]
        };
        mapobj.addSource('point', {
            'type': 'geojson',
            'data': point 
        });
        mapobj.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-color': "#ff0000",
                'circle-radius':8,
                'circle-stroke-width': 4,
                'circle-stroke-opacity': 0.05
            },
        });
        routeDistance = turf.length(turf.lineString(targetRoute));
        speed=1/((routeDistance/10)*60000);
    }
};

const setTerrain=(mapobj)=>{
    if (!mapobj.getSource('mapbox-dem')){
        mapobj.addSource('mapbox-dem', dem);
        mapobj.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.25 });
    }
};

const setMvt=(mapobj)=>{
    if (!mapobj.getSource('mvt')){
        mapobj.addSource('mvt', mvt);
		mapobj.addLayer({
			"id": "bldg",
			"type": "fill-extrusion",
			"source": "mvt",
			"source-layer": "BUILDING",
			"minzoom": 12,
			"maxzoom": 17,
			"paint": {
				"fill-extrusion-color": [
					'interpolate',
					['linear'],
					["get", "height"],
						0,'blue',
						10,'royalblue',
						20,'cyan',
						30,'lime',
						40,'yellow',
						50,'orange',
						60,'red'],
				"fill-extrusion-height": ["get", "height"],
				'fill-extrusion-opacity': 0.75,
			}
		});
    }
};

const setVector=(mapobj)=>{
    if (!mapobj.getSource('vector')){
        mapobj.addSource('vector', vector);
        mapobj.addLayer({
            "id": "vector",
            "type": "line",
            "source": "vector",
            "source-layer": "road",
            "minzoom": 9,
            "maxzoom": 18,
            "paint": {
                    'line-opacity': 1.0,
                    'line-color': 'rgb(80, 80, 80)',
                    'line-width': 2
                }
        });
        mapobj.addLayer({
            "id": "label",
            "type": "symbol",
            "source": "vector",
            "source-layer": "label",
            "minzoom": 9,
            "maxzoom": 18,
            "layout": {
                'text-size': 16,
                "text-rotate":["case",["==",["get","arrng"],2],["*",["+",["to-number",["get","arrngAgl"]],90],-1],["*",["to-number",["get","arrngAgl"]],-1]],
                "text-field":["get","knj"],
                "text-font":["NotoSansCJKjp-Regular"],
                "text-allow-overlap": true,
                "text-keep-upright":true,
                "text-allow-overlap":false,
                "symbol-z-order":"auto",
                "text-max-width":60,
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-justify': 'auto',
                "symbol-placement": "point"
            },
            "paint": {
                "text-color": "black",
                "text-opacity": 1.0,
                "text-halo-color": "rgba(255,255,255,0.95)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1
            }
        });
    }
};

const setSky=(mapobj)=>{
    if (!mapobj.getLayer('sky')){
        mapobj.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
            }
        });
    }
};

const getArg=(search)=>{
    var arg = new Object;
    var pair=search.substring(1).split('&');
    for(var i=0;pair[i];i++) {
        var kv = pair[i].split('=');
        arg[kv[0]]=kv[1];
    }
    return arg;
}

const addPhoto=(map,xmin,xmax,ymin,ymax)=>{
    const url=photo_URL+xmin+"/"+ymin+"/"+(xmax-xmin)+"/"+(ymax-ymin);
    axios.get(url)
    .then(function (res) {
        map.addSource('photo', {
            'type': 'geojson',
            'data': res.data
        });
        map.addLayer({
            'id': 'photoId',
            'source': 'photo',
            'type': 'symbol',
            'layout': {
                'icon-image': 'custom-marker',
                'text-size': 12,
                "text-field":["get","title"],
                "text-font":["NotoSansCJKjp-Regular"],
                "text-allow-overlap": true,
                "text-keep-upright":true,
                "text-allow-overlap":false,
                "symbol-z-order":"auto",
                "text-max-width":60,
                'text-variable-anchor':  ['top', 'bottom', 'left', 'right'],
                'text-justify': 'auto',
                "symbol-placement": "point",
                "icon-offset":[0,32]
            },
            "paint": {
                "text-color": "red",
                "text-opacity": 1.0,
                "text-halo-color": "rgba(255,255,255,0.95)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1
            }
        });

        map.on('touchstart', 'photoId', function(e){showPop(e);});
        map.on('mouseenter', 'photoId', function(e){showPop(e);});
    });
};

const showPop=(e)=>{
    const ll=new mapbox.LngLat(e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]);
    const prop=e.features[0].properties;
    const divElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerHTML=prop["title"]+"("+prop["date"]+")";
    const imgElement = document.createElement('img');
    imgElement.setAttribute("src","data:image/png;base64,"+prop["thumbnail"]);
    imgElement.setAttribute("style","width:100%;z-index:100;");
    imgElement.addEventListener('click', (e) => {
        imagePop(image_URL+prop["image"]);
    });
    divElement.appendChild(pElement);
    divElement.appendChild(imgElement);
    imageClose();
    new mapbox.Popup()
    .setLngLat(ll)
    .setDOMContent(divElement)
    .addTo(map);
};

const frame=(time)=>{
    if (!start){
        start = time;
//        phase=0.0;
    }else{
        if (typeof time !== "undefined") {
            let dd=time-start;
            start=time;
            phase=phase+speed*dd*speedMul*0.5;
        }else{
            start=Date.now();
        }
    }
    setSlider(phase);
    if (phase >= 1) {
        setTimeout(function () {
            running=false;
            endRunning();
        }, 1500);
    }
    let alongRoute = turf.along(
        turf.lineString(targetRoute),
        routeDistance * phase
    ).geometry.coordinates;
    let camera = map.getFreeCameraOptions();
    camera.position = mapbox.MercatorCoordinate.fromLngLat({
            lng: alongRoute[0]-camera_angle[0],
            lat: alongRoute[1]-camera_angle[1]
        },
        cameraAltitude
    ); 
    camera.lookAtPoint({
        lng: alongRoute[0],
        lat: alongRoute[1]
    });
    map.setFreeCameraOptions(camera);
    let point = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': alongRoute
            }
        }]
    };
    let src=map.getSource('point');
    if(src)src.setData(point);
    if(running){
        runAni=requestAnimationFrame(frame);
    }else{
        cancelAnimationFrame(runAni);
    }
};
