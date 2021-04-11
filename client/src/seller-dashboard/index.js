import React, { Component } from 'react';
import './../style.css';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import classNames from 'classnames';
import Hidden from '@material-ui/core/Hidden';
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import DonutLarge from '@material-ui/icons/DonutLarge';
import DashboardIcon from '@material-ui/icons/Dashboard';
import NotificationsNone from '@material-ui/icons/NotificationsNone';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import OrderIcon from '@material-ui/icons/Ballot';
import LocalOffer from '@material-ui/icons/LocalOffer';
import FinanceIcon from '@material-ui/icons/Payment';
import ReviewsIcon from '@material-ui/icons/RateReview';
import RankIcon from '@material-ui/icons/SwapVert';

import Collapse from '@material-ui/core/Collapse';

import { Route, Link, Switch } from 'react-router-dom';
import TestPage from './../components/Dashboard/TestPage';
import Dashboard from './Dashboard';
import Error404 from './../components/Dashboard/Error404';

// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TransitionGroup } from 'react-transition-group';
import AddProduct from './Products/AddProduct';
import ManageProducts from './Products/ManageProducts';
import ManageOrders from './Orders/ManageOrders';
import EachOrder from './Orders/EachOrder';
import TransactionOverview from './Finance/TransactionOverview';
import AccountStatement from './Finance/AccountStatement';
import OrderOverview from './Finance/OrderOverview';
import OrderReviews from './Reviews/OrderReviews';
import SellerReviews from './Reviews/SellerReviews';
import AddNewVoucher from './Promotions/AddNewVoucher';
import ManageVouchers from './Promotions/ManageVouchers';
import Rank from './Ranking/Rank';
import EditProduct from './Products/EditProduct';

let drawerWidth = 290;
const drawerCloseWidth = 60;
const baseURL = '/sell/';
const logo = require('./../assets/logo.png');
const axios = require('axios');
const { BASE_URL } = require('./../apibase');

const menu = [
  {
    category: 'Dashboard',
    icon: <DashboardIcon />,
    categoryBaseUrl: 'dashboard/',
    url: 'dashboard/',
    subCategory: [],
  },
  {
    category: 'Products',
    icon: <ShoppingCart />,
    categoryBaseUrl: 'products/',
    url: 'products/manage',
    subCategory: [
      { name: 'Add Products', url: 'products/add' },
      { name: 'Manage Products', url: 'products/manage' },
    ],
  },
  {
    category: 'Orders',
    icon: <OrderIcon />,
    categoryBaseUrl: 'orders/',
    url: 'orders/manage',
    subCategory: [{ name: 'Manage Orders', url: 'orders/manage' }],
  },
  // {
  //   category: 'Promotions',
  //   icon: <LocalOffer />,
  //   categoryBaseUrl: 'promotions/',
  //   url: 'promotions/vouchers',
  //   subCategory: [
  //     { name: 'Add New Voucher', url: 'promotions/addnew' },
  //     { name: 'Seller Vouchers', url: 'promotions/vouchers' },
  //   ],
  // },
  {
    category: 'Finance',
    icon: <FinanceIcon />,
    categoryBaseUrl: 'finance/',
    url: 'finance/statement',
    subCategory: [
      { name: 'Account Statements', url: 'finance/statement' },
      { name: 'Order Overview', url: 'finance/orderoverview' },
      { name: 'Transaction Overview', url: 'finance/transactionoverview' },
    ],
  },
  {
    category: 'Reviews',
    icon: <ReviewsIcon />,
    categoryBaseUrl: 'reviews/',
    url: 'reviews/seller',
    subCategory: [
      { name: 'Order Reviews', url: 'reviews/order' },
      { name: 'Seller Reviews', url: 'reviews/seller' },
    ],
  },
  {
    category: 'Ranking',
    icon: <RankIcon />,
    categoryBaseUrl: 'rank/',
    url: 'rank/',
    subCategory: [],
  },
];

const styles = theme => ({
  // margin: {

  // },
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
  },
  avatar: {
    marginRight: 10,
    width: 35,
    height: 35,
    color: 'rgb(39,44,48)',
    fontSize: 22,
    backgroundColor: 'white',
  },
  avatarPopover: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 50,
    height: 50,
    color: 'rgb(236,239,234)',
    backgroundColor: 'rgb(39,44,48)',
    marginTop: 0,
    marginBottom: 10,
  },
  userDetails: {
    marginLeft: 40,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 25,
  },
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'rgb(39,44,48)',
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
  },
  toolbarTitle: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 20,
  },
  userName: {
    color: 'rgb(236,239,234)',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingTop: 85,
    transition: theme.transitions.create('padding-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerOpenContent: {
    paddingLeft: drawerWidth + 20,
  },
  drawerCloseContent: {
    paddingLeft: 80,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: drawerCloseWidth,
  },
  drawerOpen: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 35,
    marginRight: 36,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    '&::-webkit-scrollbar-track': {
      // '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
      borderRadius: 10,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 10,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  listItem: {
    paddingTop: 17,
    paddingBottom: 17,
    marginBottom: 5,
  },
  listItemSelected: {
    backgroundColor: 'rgb(53,60,66)',
    color: 'rgb(236,239,244)',
    '&:hover': {
      backgroundColor: 'rgb(63,71,78)',
    },
    '&:focus': {
      backgroundColor: 'rgb(63,71,78)',
    },
  },
  listItemIcon: {
    color: 'rgb(53,60,66)',
  },
  listItemIconSelected: {
    color: 'rgb(236,239,244)',
  },
  listItemTextSelected: {
    color: 'white',
  },
  layout: {
    width: 'auto',
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  popover: {
    padding: 20,
    paddingTop: 10,
    marginTop: 7,
  },
  popperSubmenu: {
    marginLeft: drawerCloseWidth - 8,
    zIndex: 1000,
  },
  popperSubmenuInner: {
    borderRadius: 0,
  },
  popperSubmenuInnerMenu: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  popperSubmenuHeader: {
    paddingTop: 17,
    paddingBottom: 17,
    paddingRight: 85,
    fontSize: 18,
    color: 'rgb(53,60,66)',
  },
  popperSubmenuOptions: {
    backgroundColor: 'rgb(245,245,245)',
    color: 'rgb(160,160,160)',
  },
  menuExtendedSubcategories: {
    paddingLeft: drawerCloseWidth / 1.6,
  },
  subCategoryExtended: {
    height: 'auto',
  },
  subCategoryExtendedHidden: {
    height: 0,
    display: 'none',
  },
  subCategoryExtendedVisible: {
    height: 'auto',
    display: 'block',
  },
  logoutButtonPopover: {
    width: '100%',
    marginTop: 7,
  },
  notificationBadge: {
    backgroundColor: 'rgb(236,239,244)',
    color: 'rgb(53,60,66)',
    height: 18,
  },
  popperNotificationMenu: {
    // zIndex: 10000,
    padding: 10,
    maxWidth: 370,
  },
  listItemNotification: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: 'solid rgba(0,0,0,0.05) 1px',
    '&:hover': {
      backgroundColor: 'rgb(248,248,248)',
      color: 'rgb(53,60,66)',
    },
  },
});

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      screenHeight: 0,
      submenuContent: menu[0],
      anchorEl2: null,
      submenuOpen: false,
      notificationMenuOpen: false,
      anchorElNotification: null,
      loggedUserName: '',
      stepsToDo: 0,
      shopName: "Usama's Shop",
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getUserDetails();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    //console.log(this.props.location.pathname)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
    drawerWidth = this.state.screenWidth > 450 ? this.state.screenWidth : 280;
    //console.log(drawerWidth)
  }

  state = {
    open: false,
    anchorEl: null,
    submenuOpen: false,
    notificationMenuOpen: false,
  };

  handlePopoverOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  handleMenuOpen = (event, index) => {
    //console.log(index)
    this.setState({
      anchorEl2: event.currentTarget,
      submenuOpen: true,
      submenuContent: menu[index],
    });
  };

  handleMenuClose = event => {
    //console.log('function called');
    if (this.state.anchorEl2.contains(event.target)) {
      return;
    }

    this.setState({ submenuOpen: false });
  };

  handleNotificationMenuOpen = (event, index) => {
    //console.log(index)
    this.setState({
      anchorElNotification: event.currentTarget,
      notificationMenuOpen: true,
    });
  };

  handleNotificationMenuClose = event => {
    //console.log('function called');
    if (this.state.anchorElNotification.contains(event.target)) {
      return;
    }
    this.setState({ notificationMenuOpen: false });
  };

  getUserDetails = () => {
    axios
      .get(BASE_URL + 'seller/', { withCredentials: true })
      .then(response => {
        console.log('seller/', response);
        this.setState({
          loggedUserName: response.data.ownerName ? response.data.ownerName : 'Usama Moin',
          stepsToDo: response.data.stepsToDo,
          shopName: response.data.shopName,
          rank: response.data.rank,
        });
      })
      .catch(error => {
        //console.log(error.response);
        // //console.log(error.response.data.statusCode)
        //this.props.history.push(`/seller/login`)
      });
  };

  logout = () => {
    //console.log("Logout called")
    // axios.get(BASE_URL + "seller/logout", { withCredentials: true })
    //     .then((response) => {
    //         this.props.history.push(`/login`)
    //         //console.log(response);

    //     })
    //     .catch((error) => {
    //         //console.log(error.response);
    //         //this.props.history.goBack();
    //         // //console.log(error.response.data.statusCode)
    //
    //     });
    this.props.history.push(`/login`);
  };

  render() {
    const { classes } = this.props;
    const {
      anchorEl,
      submenuOpen,
      anchorEl2,
      notificationMenuOpen,
      anchorElNotification,
    } = this.state;
    const popoverOpen = Boolean(anchorEl);
    const { pathname } = this.props.location;

    return (
      <div className={classes.root}>
        {/* <MuiThemeProvider theme={CustomTheme.customTheme}> */}
        <CssBaseline />
        <AppBar position='static' color='primary' className={classes.appBar}>
          <Toolbar>
            <img src={logo} height={35} width='auto' alt='LashCart Logo'></img>

            <Typography variant='h6' color='inherit' noWrap className={classes.toolbarTitle}>
              LASH<b>CART</b>
              <Hidden xsDown>
                <IconButton
                  color='inherit'
                  aria-label='Open drawer'
                  onClick={this.toggleDrawer}
                  className={classes.menuButton}>
                  <MenuIcon />
                </IconButton>
              </Hidden>
            </Typography>

            {/* <Button>Features</Button>
                        <Button>Enterprise</Button>
                        <Button>Support</Button>
                        <Button color="primary" variant="outlined">
                            Login
          </Button> */}
            <Hidden smUp>
              <IconButton
                color='inherit'
                aria-label='Open drawer'
                onClick={this.toggleDrawer}
                className={classes.menuButton}>
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden xsDown>
              <IconButton
                color='inherit'
                aria-owns={notificationMenuOpen ? 'notification-menu' : undefined}
                aria-haspopup='true'
                onClick={this.handleNotificationMenuOpen}>
                <Badge
                  badgeContent={0}
                  classes={{ colorPrimary: classes.notificationBadge }}
                  color='primary'>
                  <NotificationsNone />
                </Badge>
              </IconButton>
              <Button
                variant='text'
                className={classes.userDetails}
                aria-owns={popoverOpen ? 'mouse-click-popover' : undefined}
                aria-haspopup='true'
                onClick={this.handlePopoverOpen}>
                <Avatar className={classes.avatar}>U</Avatar>
                <Typography className={classes.userName}>{this.state.loggedUserName}</Typography>
              </Button>
            </Hidden>
          </Toolbar>
        </AppBar>
        {/* </MuiThemeProvider> */}
        <div id='drawerContainer'>
          <Drawer
            variant='permanent'
            className={classNames(classes.drawer, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            })}
            classes={{
              paper: classNames({
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              }),
            }}
            open={this.state.open}>
            <div className={classes.toolbar}></div>
            <Divider />
            <List>
              {menu.map((menuOption, index) => (
                <div key={index}>
                  <Link
                    to={`${baseURL}${menuOption.url}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem
                      button
                      onClick={evt => this.handleMenuOpen(evt, index)}
                      className={classNames(classes.listItem, {
                        [classes.listItemSelected]: !pathname.search(
                          baseURL + menuOption.categoryBaseUrl,
                        ),
                      })}
                      // onClick={console.log(pathname + "    " + baseURL + menuOption.url + "   h=" + !pathname.search(baseURL + menuOption.url))}
                      onMouseEnter={evt => this.handleMenuOpen(evt, index)}
                      onMouseLeave={this.handleMenuClose}>
                      <ListItemIcon
                        className={classNames(classes.listItemIcon, {
                          [classes.listItemIconSelected]: !pathname.search(
                            baseURL + menuOption.categoryBaseUrl,
                          ),
                        })}>
                        {menuOption.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={menuOption.category}
                        className={classNames({
                          [classes.listItemTextSelected]: !pathname.search(
                            baseURL + menuOption.categoryBaseUrl,
                          ),
                        })}
                      />
                    </ListItem>
                  </Link>

                  <Collapse in={this.state.open} timeout='auto'>
                    {menuOption.subCategory.map((cat, index1) => (
                      <Link
                        to={`${baseURL}${cat.url}`}
                        key={index1}
                        style={{ textDecoration: 'none' }}>
                        <ListItem button className={classes.menuExtendedSubcategories}>
                          <ListItemIcon className={classNames(classes.listItemIcon)}>
                            {cat.icon ? cat.icon : <DonutLarge />}
                          </ListItemIcon>
                          <ListItemText primary={cat.name} />
                        </ListItem>
                      </Link>
                    ))}
                  </Collapse>
                </div>

                // <ListItem button key={text} onClick={this.handleMenuOpen} className={classNames(classes.listItem, {
                //     [classes.listItemSelected]: text === 'Inbox',
                // })}>
                //     <ListItemIcon className={classNames(classes.listItemIcon, {
                //         [classes.listItemIconSelected]: text === 'Inbox',
                //     })}>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                //     <ListItemText primary={text} classes={classNames({
                //         [classes.listItemTextSelected]: text === 'Inbox',
                //     })} />
                // </ListItem>
              ))}
            </List>
          </Drawer>
        </div>

        <main
          className={classNames(classes.content, {
            [classes.drawerOpenContent]: this.state.open,
            [classes.drawerCloseContent]: !this.state.open,
          })}>
          <TransitionGroup>
            {/* <CSSTransition key={this.props.location.key} classNames="fade" timeout={300}> */}
            <Switch location={this.props.location}>
              {/* SS-CHANGED main dashborad Component Called here */}
              <Route
                exact
                path={`${baseURL}dashboard`}
                render={() => (
                  <Dashboard stepsToDo={this.state.stepsToDo} shopName={this.state.shopName} />
                )}
              />

              <Route
                path={`${baseURL}todo`}
                render={() => (
                  <Dashboard stepsToDo={this.state.stepsToDo} shopName={this.state.shopName} />
                )}
              />

              <Route path={`${baseURL}test`} component={TestPage} />
              <Route path={`${baseURL}rank`} component={Rank} />

              <Route path={`${baseURL}products/add`} component={AddProduct} />
              <Route path={`${baseURL}products/manage`} component={ManageProducts} />
              <Route path={`${baseURL}products/edit/:prodID`} component={EditProduct} />

              <Route exact path={`${baseURL}orders/manage`} component={ManageOrders} />
              <Route exact path={`${baseURL}orders/manage/:orderId`} component={EachOrder} />

              <Route path={`${baseURL}finance/statement`} component={AccountStatement} />
              <Route
                path={`${baseURL}finance/transactionoverview`}
                component={TransactionOverview}
              />
              <Route path={`${baseURL}finance/orderoverview`} component={OrderOverview} />

              <Route path={`${baseURL}promotions/addnew`} component={AddNewVoucher} />
              <Route path={`${baseURL}promotions/vouchers`} component={ManageVouchers} />

              <Route path={`${baseURL}reviews/order`} component={OrderReviews} />
              <Route path={`${baseURL}reviews/seller`} component={SellerReviews} />

              <Route component={Error404} />
            </Switch>
            {/* </CSSTransition> */}
          </TransitionGroup>
        </main>

        <Popover
          id='mouse-click-popover'
          classes={{
            paper: classes.paper,
          }}
          open={popoverOpen}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus>
          <div style={{ margin: 10 }}>
            <Typography className={classes.popover}>
              <Avatar className={classes.avatarPopover}>{this.state.loggedUserName[0]}</Avatar>
              {this.state.loggedUserName}
            </Typography>
            <Divider />
            <Button
              className={classes.logoutButtonPopover}
              onClick={() => {
                this.logout();
              }}>
              Logout
            </Button>
          </div>
        </Popover>

        <Popper
          open={submenuOpen}
          anchorEl={anchorEl2}
          transition
          disablePortal
          placement='right-start'
          className={classes.popperSubmenu}>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} id='menu-list-grow'>
              <Paper className={classes.popperSubmenuInner}>
                <ClickAwayListener onClickAway={this.handleMenuClose}>
                  <MenuList
                    className={classes.popperSubmenuInnerMenu}
                    onMouseLeave={this.handleMenuClose}>
                    <Link
                      to={`${baseURL}${this.state.submenuContent.url}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MenuItem
                        onClick={this.handleMenuClose}
                        className={classes.popperSubmenuHeader}>
                        {this.state.submenuContent.category}
                      </MenuItem>
                    </Link>

                    {this.state.submenuContent.subCategory.map((category, index) => (
                      <Link
                        to={`${baseURL}${category.url}`}
                        key={category.name}
                        style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem
                          onClick={this.handleMenuClose}
                          className={classes.popperSubmenuOptions}>
                          {category.name}
                        </MenuItem>
                      </Link>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <Popper
          open={notificationMenuOpen}
          anchorEl={anchorElNotification}
          transition
          disablePortal
          placement='bottom'
          className={classes.popperNotificationMenu}>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} id='notification-menu'>
              <Paper className={classes.popperNotificationInner}>
                <ClickAwayListener onClickAway={this.handleNotificationMenuClose}>
                  {/* <ListItem button
                                        className={classNames(classes.listItemNotification)}
                                        onClick={this.handleNotificationMenuClose}
                                    >
                                        <ListItemIcon className={classNames(classes.listItemIcon)}>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="5 New Orders" />
                                    </ListItem>

                                    <ListItem button
                                        className={classNames(classes.listItemNotification)}
                                        onClick={this.handleNotificationMenuClose}
                                    >
                                        <ListItemIcon className={classNames(classes.listItemIcon)}>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="10 Undelivered products" />
                                    </ListItem> */}

                  <ListItem
                    button
                    className={classNames(classes.listItemNotification)}
                    onClick={this.handleNotificationMenuClose}>
                    <ListItemIcon className={classNames(classes.listItemIcon)}>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='No new notfication' />
                  </ListItem>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Index);
