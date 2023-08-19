// import React, { Component } from "react";
// import { Button, 
//     Grid, 
//     Typography, 
//     TextField } from "@material-ui/core";
// import { Link } from "react-router-dom";

// export default class RoomJoinPage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             roomCode: "",
//             error: "",
//         }
//         this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
//         this._roomButtonPressed = this._roomButtonPressed.bind(this);
// }

// _handleTextFieldChange(e) {
//     this.setState({
//         roomCode: e.target.value,
//     });
// }

// _roomButtonPressed() {
//     console.log(this.state.roomCode);
// }

// render() {
//     return(
//         <div>
//             <Grid container spacing={1} alignItems="center">
//                 <Grid item xs={12} align="center">
//                     <Typography component="h4" variant="h4">
//                         Join Room
//                         </Typography>
//                     </Grid>
//                     <Grid item xs={12} align="center">
//                         <TextField
//                         error={this.state.error}
//                         label="Code"
//                         placeholder="Enter Room Code"
//                         value={this.state.roomCode}
//                         helperText={this.state.error}
//                         variant="outlined"
//                         onChange={this._handleTextFieldChange}
//                         />
//                         </Grid>
//                         <Grid item xs={12} align="center">
//                             <Button variant="contained" color="primary" onClick={this._roomButtonPressed}>
//                                 Enter Room
//                                 </Button>
//                         </Grid>
//                         <Grid item xs={12} align="center">
//                             <Button variant="contained" color="secondary" to="/" component={Link}>
//                                 Back
//                                 </Button>
//                         </Grid>
//             </Grid>
//         </div>
//     )   
// }}

import React, { useState, Component } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import {useNavigate} from 'react-router-dom';

export default function RoomJoinPage(props) {
  const navigate = useNavigate();
  
  const[roomCode,setroomCode] = useState('');
  const[error,seterror] = useState('');


  const handleTextFieldChange = (e) => {
    setroomCode(e.target.value);
  };

  const roomButtonPressed = () => {
    console.log(roomCode);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };

    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate(`/room/${roomCode}`)
        } else {
          seterror("Room not found.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={roomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}