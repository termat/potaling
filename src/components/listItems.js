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
import {useLocation} from 'react-router-dom';

const itemData = [];

const fileRead=(data)=>{
//  let url="https://termat.github.io/potaling/geojson/"+data.target.alt;
  let url="/potaling/geojson/"+getItem(data.target.alt);
  window.location.search="page="+data.target.alt;
  axios.get(url)
  .then(res => {
    const val = res.data;
    let str=JSON.stringify(val);
    parseGeojson(str)
  });
};

const getItem=(id)=>{
  for(let i=0;i<itemData.length;i++){
    if(id==itemData[i].no){
      return itemData[i].json;
    }
  }
  return ""
}

export function startData(page){
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
    let pageNo=this.props.page;
    let url="/potaling/pota_data.csv";
    d3.csv(url, function(data) {
      itemData.push(data);
    }).then(function(data) {
      if(pageNo){
        setTimeout(function(){startData(pageNo);},2500);
      }
    });
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
