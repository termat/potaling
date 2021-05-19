import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';
import {changeHeight,changeDuration,changeAngle} from './MapPane'
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';

export default class ControlPanerl extends Component {

    render() {
        return <div style={style}>
             <Divider />
      <Tooltip title="視点の高さ" placement="right">
      <ListItem button>
        <ListItemIcon>
          <CameraAltIcon />
        </ListItemIcon>
        <Slider
          defaultValue={500}
          getAriaValueText={onChangeHeight}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={200}
          max={2000}
          style={{marginLeft:'0.8rem'}}
        />
      </ListItem>
      </Tooltip>
      <Tooltip title="視点の方向" placement="right">
      <ListItem button>
        <ListItemIcon>
          <FlipCameraIosIcon onClick={changeDuration} />
        </ListItemIcon>
        <Slider
          defaultValue={0}
          getAriaValueText={onChangeAngle}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={360}
          style={{marginLeft:'0.8rem'}}
        />
      </ListItem>
      </Tooltip>
      <Tooltip title="移動時間" placement="right">
      <ListItem button>
        <ListItemIcon>
          <SwitchCameraIcon />
        </ListItemIcon>
        <Slider
          defaultValue={300}
          getAriaValueText={onChangeDuration}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={20}
          marks
          min={80}
          max={360}
          style={{marginLeft:'0.8rem'}}
        />
      </ListItem>
      </Tooltip>
        </div>;
    }
}

const onChangeHeight=(value)=>{
    changeHeight(value);
};
  
const onChangeAngle=(value)=>{
    changeAngle(value);
};
  
const onChangeDuration=(value)=>{
    changeDuration(value*1000);
};

const style = {
    float: "left",
    width: 230, 
    lineHeight: "32px",
    borderRadius: 4,
    border: "none",
    padding: "0 4px",
    color: "#fff",
    background: "#ffffff88",
    position: "absolute",
    top: 100,
    left: 5,
    zindex:255
};  
 