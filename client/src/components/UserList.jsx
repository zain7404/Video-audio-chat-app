import React, { useState, useContext } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from "../Context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  container: {
    // width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
  },
  buttonMargin: {
    marginTop: 10,
  },
  userName: {
    textAlign: "left",
    width: "90%",
    margin: "auto",
    marginLeft: "4px",
  },
}));

const UserList = () => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    users,
  } = useContext(SocketContext);
  const classes = useStyles();
  const [idToCall, setIdToCall] = useState("");

  return (
    <Container className={classes.container}>
      <Grid>
        <Paper elevation={10} className={classes.paper}>
          <Typography variant="h6">Online Users</Typography>
          <List>
            {users.map((user) => (
              <ListItem className="flex-column" key={user.id}>
                <div className={classes.userName}>
                  <Typography variant="contained">{user.name}</Typography>
                </div>
                <div>
                  <form className={classes.root} noValidate autoComplete="off">
                    <Grid container className={classes.gridContainer}>
                      <Grid item xs={12} md={12}>
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Phone fontSize="large" />}
                            fullWidth
                            onClick={() => callUser(user.id, "video")}
                            className={classes.buttonMargin}
                          >
                            Video Call
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Phone fontSize="large" />}
                            fullWidth
                            onClick={() => callUser(user.id, "audio")}
                            className={classes.buttonMargin}
                          >
                            Audio Call
                          </Button>
                        </>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Container>
  );
};

export default UserList;
