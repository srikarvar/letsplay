import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { useNavigate } from "react-router-dom";

import { BrowserRouter as Router,  
    Routes,
    Route, 
    Link, 
    Redirect } from "react-router-dom";


const withRouter = WrappedComponent => props => {
        const navigate = useNavigate();
        // etc... other react-router-dom v6 hooks
      
        return (
          <WrappedComponent
            {...props}
            navigate={navigate}
            // etc...
          />
        );
      };

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    
}

render() {
    return ( <Router>
        <Routes>
            <Route exact path="/" element={<p>This is the home page</p>}/>
            <Route path="/join" element={<RoomJoinPage/>}/>
            <Route path="/create-room" element={<CreateRoomPage/>}/>
            <Route path="/room/:roomCode" element={<Room/>}/>
        </Routes>
    </Router>
    );
}}
