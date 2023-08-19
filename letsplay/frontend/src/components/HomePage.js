
import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core"
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useRoutes,
    Navigate
} from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

    async componentDidMount() {
        const response = await fetch("/api/user-in-room");
        const data = await response.json();
        this.setState({
          roomCode:data.code
        })
    }

    clearRoomCode() {
        this.setState({
          roomCode: null,
        });
    }

    renderHomePage() {
        if(this.state.roomCode) {
          return(
            <Navigate to={`/room/${this.state.roomCode}`} replace={true} />
          )
        } else {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} align="center">
                <Typography variant="h3" compact="h3">
                  House Party
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <ButtonGroup disableElevation variant="contained" color="primary">
                  <Button color="primary" to="/join" component={Link}>
                    Join a Room
                  </Button>
                  <Button color="secondary" to="/create-room" component={Link}>
                    Create a Room
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          );
       }
    }
  
    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={this.renderHomePage()} />
                    <Route path="/join" element={<RoomJoinPage />} />
                    <Route path="/create-room" element={<CreateRoomPage />} />
                    <Route path='/room/:roomCode' element={<Room clearRoomCodeCallback={this.clearRoomCode} />} />
                </Routes>
            </Router>
        )
    }
}
