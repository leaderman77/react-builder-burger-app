import React, { Component } from 'react';
import classes from './Layout.css'
import Auxiliary from '../Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }
    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }
    sideDrawerToggleHandler = (prevState) => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer}
        });
    }
    render () {
        return (
            <Auxiliary>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                    open={this.state.showSideDrawer} 
                    closed={this.sideDrawerClosedHandler}/>
                {/* <div>Toolbar, SideDrawer, Backdrop</div> */}
                <main className={classes.Content}>
                    {this.props.children}
                </main>
                <Route path='/checkout' exact component={Checkout}/>
            </Auxiliary>
        )
    }
}

export default Layout;