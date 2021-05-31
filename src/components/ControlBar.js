import React, { Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import {startMovie,stopMovie,setPhase,ieRunning,setSpeed} from './MapPane'

export let setSlider;
export let endRunning;
let setRunning;

let spId=0;
let speedChange;

export default class ControlBar extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          play_state: "開始",
          val:0,
          label:"低速"
        }
    };

    componentDidMount(){
        setSlider=(value)=>{
            this.setState({val:Math.ceil(value*100)});
        };
        endRunning=()=>{
            stopMovie();
            this.setState({play_state: "開始"});
        };
        setRunning=()=>{
            if(this.state.play_state==="開始"){
                startMovie();
                this.setState({play_state: "停止"});
            }else{
                stopMovie();
                this.setState({play_state: "開始"});
            }
        };
        speedChange=()=>{
            spId=(spId+1)%3;
            if(spId===0){
                setSpeed(1.0);
                this.setState({label:"低速"});
            }else if(spId===1){
                setSpeed(2.0);
                this.setState({label:"中速"});
            }else{
                setSpeed(3.0);
                this.setState({label:"高速"});
            }
        };
    }

    render() {
        return <div style={bar_style}>
        <ListItem>
        <Button variant="contained" color="primary" style={{marginRight:"20px"}} onClick={setRunning}>{this.state.play_state}</Button>
        <Slider
          value={this.state.val}
          getAriaValueText={onChangeProgress}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
          onChange={onChangeVal}
        />
        <Button variant="contained" color="primary" style={{marginLeft:"20px"}} onClick={speedChange}>{this.state.label}</Button>
        </ListItem>
        </div>;
    };
}

const onChangeProgress=(value)=>{

};

const onChangeVal=(val)=>{
    if(!ieRunning())setPhase(val.target.value/100.0);
};

const bar_style = {
    float: "left",
    width: "96%", 
    lineHeight: "32px",
    borderRadius: 4,
    border: "none",
    padding: "0px 20px 0px 20px",
    color: "#fff",
    background: "#ffffff88",
    position: "absolute",
    bottom: 35,
    left: "2%",
    zindex:255
};  