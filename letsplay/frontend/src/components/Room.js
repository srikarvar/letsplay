
import React, { Component } from "react";
import { useParams } from 'react-router-dom';
import {Grid, Typography, ButtonGroup, Button} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

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
      spotifyAuthenticated: false,
      song: {}
    };

    this.roomCode = this.props.params.roomCode;
    this.LeaveButton = this.LeaveButton.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.getRoomDetails();
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
        if (this.state.isHost) {
          this.authenticateSpotify();
        }
      });
  }

  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          spotifyAuthenticated: data.status,
        });
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          // console.log(response)
          return response.json();
        }
      }).then((data) => {
        this.setState({ song: data });
        console.log(data);
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
         <div>
         {/* {JSON.stringify(this.state.song)} */}
         <MusicPlayer {...this.state.song} />
          </div>
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


