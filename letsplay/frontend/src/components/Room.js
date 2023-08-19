// import React, { Component } from "react";

// export default class Room extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             votesToSkip: 2,
//             guestCanPause: false,
//             isHost: false,
//         };
//         this.roomCode = this.props.match.params.roomCode;

//     }

//     render() {
//         return (
//             <div>
//                 <h3>{this.roomCode}</h3>
//                 <p>Votes: {this.state.votesToSkip}</p>
//                 <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
//                 <p>Host: {this.state.isHost.toString()}</p>   
//             </div>
//         )
//     }
// }

import React, { Component } from "react";
import { useParams } from 'react-router-dom';
import {Grid, Typography, ButtonGroup, Button} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
    };

    this.roomCode = this.props.params.roomCode;
    this.LeaveButton = this.LeaveButton.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails();
  }
  LeaveButton() {
    const navigate = useNavigate();
  
    const leaveButtonPressed = () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/api/leave-room", requestOptions).then((_response) => {
        this.props.clearRoomCodeCallback();
        navigate("/");
      });
    };
  
    return (
      <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>
        Leave Room
      </Button>
    );
  }
  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  getParams() {
    let params = useParams();
    return params;
  }


  getRoomDetails() {
    fetch("/api/get-room" + "?code=" + this.roomCode)
      .then(response => {if (!response.ok){
        this.props.clearRoomCodeCallback();
        navigate("/");
      }else{
        return response.json();
      }
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }

  renderSettings() {
    return (<Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage 
        update={true} 
        votesToSkip={this.state.votesToSkip} 
        guestCanPause={this.state.guestCanPause} 
        roomCode={this.roomCode} 
        updateCallback={this.getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
      <Button
          variant="contained"
          color="secondary"
          onClick={() => this.updateShowSettings(false)}
        >
          Close
        </Button>
      </Grid>
    </Grid>);
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>

    );
  }

  render() {
    const LeaveButton = this.LeaveButton;
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {this.roomCode}
          </Typography>
          </Grid>
          <Grid item xs={12} align="center">
        <Typography variant="h5" component="h4">
        Votes: {this.state.votesToSkip}
          </Typography>
          </Grid>
          <Grid item xs={12} align="center">
        <Typography variant="h6" component="h4">
        Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
          </Grid>
          <Grid item xs={12} align="center">
        <Typography variant="h6" component="h4">
        Host: {this.state.isHost.toString()}
          </Typography>
          </Grid>
          {this.state.isHost ? this.renderSettingsButton() : null}
         <Grid item xs={12} align="center">
          <LeaveButton />
         </Grid>
        </Grid>
      </div>
    );
  }
}

export default withParams(Room);


