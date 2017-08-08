/* global XMLHttpRequest */

import React, { Component } from 'react';
import {
	View,
} from 'react-native';
import {
	Navigator,
} from 'react-native-deprecated-custom-components';

import { Provider } from 'react-redux';

import store from 'MobileApp/src/store';
import * as session from 'MobileApp/src/services/session';
import * as routeHistoryActions from 'MobileApp/src/services/routeHistory/actions';
import Splash from 'MobileApp/src/scenes/Splash';
import Main from 'MobileApp/src/scenes/Main';
import Login from 'MobileApp/src/scenes/Main/scenes/Login';
import Register from 'MobileApp/src/scenes/Main/scenes/Register';
import Users from 'MobileApp/src/scenes/Main/scenes/Users';
import Location from 'MobileApp/src/scenes/Main/scenes/Location';
import Checking from 'MobileApp/src/scenes/Main/scenes/Checking';
import Diagram from 'MobileApp/src/scenes/Main/scenes/Diagram';
import AddPoint from 'MobileApp/src/scenes/Main/scenes/AddPoint';

// This is used in order to see requests on the Chrome DevTools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
	GLOBAL.originalXMLHttpRequest :
	GLOBAL.XMLHttpRequest;

const transition = Navigator.SceneConfigs.HorizontalSwipeJump;
transition.gestures = null;

const routeStack = [
	{ name: 'Main', component: Main },
	{ name: 'Login', component: Login },
	{ name: 'Register', component: Register },
	{ name: 'Users', component: Users },
	{ name: 'Location', component: Location },
	{ name: 'Checking', component: Checking },
	{ name: 'Diagram', component: Diagram },
	{ name: 'AddPoint', component: AddPoint },
];

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			initialRoute: null,
		};
	}

	componentDidMount() {
		// Waits for the redux store to be populated with the previously saved state,
		// then it will try to auto-login the user.
		const unsubscribe = store.subscribe(() => {
			if (store.getState().services.persist.isHydrated) {
				unsubscribe();
				this.autoLogin();
			}
		});
	}

	autoLogin() {
		session.check().then(() => {
			this.setState({ initialRoute: routeStack[4] });
		}).catch(() => {
			this.setState({ initialRoute: routeStack[0] });
		});
	}

	renderContent() {
		if (!this.state.initialRoute) {
			return <Splash />;
		}

		return (
			<Navigator
				initialRoute={this.state.initialRoute}
				initialRouteStack={routeStack}
				configureScene={() => Navigator.SceneConfigs.HorizontalSwipeJump}
				onWillFocus={route => store.dispatch(routeHistoryActions.push(route))}
				renderScene={(route, navigator) =>
					<route.component route={route} navigator={navigator} {...route.passProps} />
				}
			/>
		);
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#eee' }}>
				<Provider store={store}>
					{this.renderContent()}
				</Provider>
			</View>
		);
	}
}

export default App;
