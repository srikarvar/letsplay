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
    };

    this.roomCode = this.props.params.roomCode;
    this.getRoomDetails();
    this.LeaveButton = this.LeaveButton.bind(this);
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


  render() {
    const LeaveButton = this.LeaveButton;
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
         <Grid item xs={12} align="center">
          <LeaveButton />
         </Grid>
        </Grid>
      </div>
    );
  }
}

export default withParams(Room);


