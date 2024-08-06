import React from "react";
import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import VideoPlayer from "./components/VideoPlayer";
import Sidebar from "./components/Sidebar";
import Notifications from "./components/Notifications";
import UserList from "./components/UserList";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    marginTop: "30px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "500px",
    padding: "10px",

    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  image: {
    marginLeft: "15px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h2" align="center">
          Video Chat App
        </Typography>
      </AppBar>
      <VideoPlayer />
      <div className="parentWrapper">
        <div className="sidebarWrapper">
          <Sidebar></Sidebar>
        </div>
        <div className="notificationsWrapper">
          <Notifications />
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default App;
