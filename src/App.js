import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Cells from './Cells';
import ExpandMore from '@material-ui/icons/ExpandMore';
const axios = require('axios');

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [events, updateEvents] = React.useState([]);
  const [openList, setOpenList] = React.useState([]);
  const [fullDates, updateFullDates] = React.useState([]);
  const [checkedEvent, updateCheckedEvent] = React.useState(null);

  React.useEffect(()=>{
    axios.get('http://smart-spb.ru/cw/getcats')
    .then((res)=>{
      console.log(res);
      updateEvents(res.data.reverse() || []);
    })
    .catch((err)=>{
      console.log(err);
    })
  }, []);

  React.useEffect(()=>{
    if(events.length>0){
      let dates = [];
      events.map((event)=>{
        if(dates.indexOf(event.date)<0){
          dates.push(event.date)
        }
      })
      let fullDates = [];
      dates.map((date)=>{
        fullDates.push({date, events:events.filter((event)=>(event.date==date))})
      })
      console.log("FULLDATES", fullDates);
      let date = fullDates[0].date;
      if(openList.indexOf(date)==-1){
        let newOpenList = [...openList];
        newOpenList.push(date);
        setOpenList(newOpenList);
      }
      else {
        let newOpenList = [...openList];
        newOpenList.splice(openList.indexOf(date),1)
        setOpenList(newOpenList);
      }
      updateCheckedEvent(fullDates[0].events[0]);
      updateFullDates(fullDates);
    }
  }, [events])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {checkedEvent?'WatchCam '+checkedEvent.date+' '+checkedEvent.hour+':'+checkedEvent.minute:'WatchCam'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {fullDates.map((date, index) => (
            <Box key={index}>
            <ListItem button key={date.date+index} onClick={()=>{
                if(openList.indexOf(date.date)==-1){
                  let newOpenList = [...openList];
                  newOpenList.push(date.date);
                  setOpenList(newOpenList);
                }
                else {
                  let newOpenList = [...openList];
                  newOpenList.splice(openList.indexOf(date.date),1)
                  setOpenList(newOpenList);
                }
              }}>
              <ListItemText primary={date.date}/>
              {openList.indexOf(date.date) ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openList.indexOf(date.date)==-1?false:true} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {date.events.map((event)=>(
                <ListItem button className={classes.nested} key={event.date+event.hour+event.minute} 
                selected={event == checkedEvent}
                onClick={()=>{
                  updateCheckedEvent(event);
                }}>
                  <ListItemText primary={event.hour+':'+event.minute} />
                </ListItem>
                ))}
              </List>
            </Collapse>
            </Box>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {checkedEvent?<Cells checkedEvent={checkedEvent}/>:''}
      </main>
    </div>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
