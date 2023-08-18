import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router,  
    Routes,
    Route, 
    Link, 
    Redirect } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
}
render() {
    return ( <Router>

        <Routes>
            <Route exact path="/" element={<p>This is the home page</p>}/>
            <Route path="/join" element={<RoomJoinPage/>}/>
            <Route path="/create-room" element={<CreateRoomPage/>}/>
        </Routes>
    </Router>
    );
}}

const appDiv = document.getElementById("app");
render(<App name="Srikar"/>, appDiv);
