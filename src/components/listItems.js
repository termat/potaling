import React, {Component} from 'react';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import {parseGeojson} from './MapPane'
import axios from 'axios';
import * as d3 from 'd3';

const itemData = [];

const fileRead=(data)=>{
//  let url="/potaling/geojson/"+getItem(data.target.alt);
  const params = new URLSearchParams(window.location.search);
  params.set('p', data.target.alt); 
  window.location.search = params.toString();
/*
  axios.get(url)
  .then(res => {
    const val = res.data;
    let str=JSON.stringify(val);
    parseGeojson(str)
  });
  */
};

const getItem=(id)=>{
  for(let i=0;i<itemData.length;i++){
    if(id==itemData[i].no){
      return itemData[i].json;
    }
  }
  return ""
}

export function startPage(page){
  for(let i=0;i<itemData.length;i++){
    if(itemData[i].no==page){
      let url="/potaling/geojson/"+getItem(page);
      axios.get(url)
      .then(res => {
        const val = res.data;
        let str=JSON.stringify(val);
        parseGeojson(str)
      });
    }
  }
}

export default class MainListItems extends Component{

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let url="/potaling/pota_data.csv";
    d3.csv(url, function(data) {
      itemData.push(data);
    })
  }

  render() {
    return (
      <div>
      <ImageList cols={1}>
        <ImageListItem key="Subheader">
          <ListSubheader component="div">ポタリングデータ</ListSubheader>
        </ImageListItem>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${process.env.PUBLIC_URL}/images/${item.img}`}
              alt={item.no}
              loading="lazy"
              onClick={fileRead}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.date}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
    );
  }
}
