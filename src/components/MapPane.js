import React, { Component } from 'react';
//import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPane.css';
import {Deck} from '@deck.gl/core';
import * as turf from '@turf/turf'
import {setSlider,endRunning} from './ControlBar';

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
};

export const setPhase=(val)=>{
    phase=val;
    if(phase===0.0)start=null;
    if(targetRoute)requestAnimationFrame(frame);
}

export const changeHeight=(val)=>{
    cameraAltitude=val;
    if(!running)checkView();
};

export const changeAngle=(val)=>{
    angle=(val/180.0)*Math.PI;
    camera_angle=[
        -0.005*Math.cos(angle)-(-0.005)*Math.sin(angle),
        -0.005*Math.sin(angle)+(-0.005)*Math.cos(angle)
    ];
    if(!running)checkView();
};

export const startMovie=()=>{
    running=true;
    if(targetRoute)requestAnimationFrame(frame);
};

export const stopMovie=()=>{
    running=false;
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
};

export const changeStyle=(style)=>{
    if(style.terrain){
        delete style.terrain
    }    
    map.setStyle(style);
    map.on('style.load', () => {
        setTerrain(map);
        setSky(map);
        if(targetRoute)updateGeojsonLayer(map);
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
    static SAT='mapbox://styles/mapbox/satellite-v9';
    static STD='/potaling/std.json';
    static PHT= {
            "version": 8,
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
            accessToken:'pk.eyJ1IjoidGVybWF0IiwiYSI6ImNqdXBmYXk1aDBwMnI0MW8xNXZ3dzVkOGUifQ.8nBCHZrBDS50yJbykEE4Sg',
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
/*
            map.addLayer({
                'id': 'vector-tile',
                'type': 'line',
                'minzoom': 8,
                'maxzoom': 18,
                'source': {
                    'type':'vector',
                    'tiles':[
                        'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf'
                    ],
                },
                'source-layer': 'road',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    'paint': {
                        'line-color': '#ff69b4',
                    'line-width': 3
                }
            });
*/
            setTerrain(map);
            setSky(map);
            setGeojsonLayer(map);
        });
    }

    render() {
        return <div className={'map'} ref={(e) => (this.container = e)} />;
    }
}

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
        mapobj.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        mapobj.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
/*
        mapobj.addSource('gsi-dem', {
            "type": "raster-dem",
            "encoding": "gsi",
            "tiles": [
                "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png"
            ],
            "tileSize": 256,
            "maxzoom": 14,
            "attribution": '<a href="https://maps.gsi.go.jp/development/ichiran.html#dem" target="_blank">地理院標高タイル</a>'
        });
*/

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

const checkView=()=>{
    if(!targetRoute)return;
    if(!phase)phase=0;
    let alongRoute = turf.along(
        turf.lineString(targetRoute),
        routeDistance * phase
    ).geometry.coordinates;
    let camera = map.getFreeCameraOptions();
    camera.position = mapbox.MercatorCoordinate.fromLngLat({
        lng: alongRoute[0]+camera_angle[0],
        lat: alongRoute[1]+camera_angle[1]
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
    map.getSource('point').setData(point);
};

const frame=(time)=>{
    if (!start){
        start = time;
        phase=0.0;
    }else{
        let dd=time-start;
        start=time;
        phase=phase+speed*dd*speedMul;
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
    if(running)requestAnimationFrame(frame);
};
