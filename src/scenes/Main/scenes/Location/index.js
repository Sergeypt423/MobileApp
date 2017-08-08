import React, { Component, PropTypes } from 'react';

import {
	Alert,
 } from 'react-native';

import AndroidBackButton from 'react-native-android-back-button';

import {
	Container,
	Header,
	Title,
	Content,
	Icon,
	Button,
	Body,
	FooterTab,
	Footer,
} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DatePikcer from 'react-native-datepicker';

import * as session from 'MobileApp/src/services/session';

import * as usersActionCreators from 'MobileApp/src/data/users/actions';

import * as tempActionCreators from 'MobileApp/src/data/Temp/actions';

export class Location extends Component {
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
		actions: PropTypes.shape({
			users: PropTypes.object,
		}),
		services: PropTypes.shape({
			routeHistory: PropTypes.object,
		}),
		data: PropTypes.shape({
			users: PropTypes.object,
		}),
		tempActions: PropTypes.shape({
			temps: PropTypes.object,
		}),
	}

	constructor(props) {
		super(props);
		const today = new Date();
		const dateStrT = today.toLocaleDateString('en-US');
		const terms = dateStrT.split('/');
		const dateStr = `${terms[2]}-${terms[0]}-${terms[1]}`;

		this.state = { date: dateStr,
			lat1: 51.1231231,
			lng1: 51.2342342,
			lat2: 51.1231231,
			lng2: 51.2342342,
			place1selected: false,
			place2selected: false,
		};
	}

	componentDidMount() {
		this.tryFetch();
	}

	componentDidUpdate() {
		this.tryFetch();
	}

	onPressLogout() {
		session.logout().then(() => {
			const routeStack = this.props.navigator.getCurrentRoutes();
			this.props.navigator.jumpTo(routeStack[0]);
			this.props.actions.users.empty();
		}).catch((error) => { console.error(error); })
		;
	}

	onNext() {
		if (this.state.date === '') {
			Alert.alert(
			'Hey',
			'Please select date',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}
		if (this.state.place1selected === false) {
			Alert.alert(
			'Hey',
			'Please select place1',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}
		if (this.state.place2selected === false) {
			Alert.alert(
			'Hey',
			'Please select place2',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}
		const place1 = { lat: this.state.lat1, lng: this.state.lng1 };
		const place2 = { lat: this.state.lat2, lng: this.state.lng2 };
		this.props.tempActions.temps.setDate(this.state.date);
		this.props.tempActions.temps.setFirstPlace(place1);
		this.props.tempActions.temps.setSecondPlace(place2);
//		this.props.tempActions.temps.setCurScene('5');
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[5]);
	}

	tryFetch() {
		// Fetch users when the scene becomes active
		const { items } = this.props.services.routeHistory;
		if (Object.keys(this.props.data.users.items).length === 0 &&
		items.length > 0 && items[items.length - 1].name === 'Users') {
			this.props.actions.users.get();
		}
	}

	renderGoogleAutoComplete1() {
		return (
			<GooglePlacesAutocomplete
				placeholder="Enter Location"
				minLength={2}
				autoFocus={false}
				fetchDetails={true}
				query={{
					key: 'AIzaSyAl1jg0Ja0biaTpNcl8KJjkd04G3r0TGHE',
					language: 'en', // language of the results 
					// "types" : [ "locality", "political", "geocode" ]
					types: ['locality', 'political', 'geocode'], // default: 'geocode' 
				}}
				styles={{
					textInputContainer: {
						backgroundColor: '#00000000',
						borderTopWidth: 0,
						borderBottomWidth: 0,
					},
					textInput: {
						marginLeft: 0,
						marginRight: 0,
						height: 38,
						color: '#5d5d5d',
						fontSize: 16,
					},
					predefinedPlacesDescription: {
						color: '#1faadb',
					},
				}}
				currentLocation={false}
				onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
					this.state.lat1 = details.geometry.location.lat;
					this.state.lng1 = details.geometry.location.lng;
					this.state.place1selected = true;
				}}
			/>
		);
	}

	renderGoogleAutoComplete2() {
		return (
			<GooglePlacesAutocomplete
				placeholder="Enter Location"
				minLength={2}
				autoFocus={false}
				fetchDetails={true}
				query={{
				// available options: https://developers.google.com/places/web-service/autocomplete 
					key: 'AIzaSyBFsltt1kTS7lo-jQkYl3eNiZYPMWDMAKA',
					language: 'en', // language of the results 
					types: ['locality', 'political', 'geocode'], // default: 'geocode'
				}}
				styles={{
					textInputContainer: {
						backgroundColor: '#00000000',
						borderTopWidth: 0,
						borderBottomWidth: 0,
					},
					textInput: {
						marginLeft: 0,
						marginRight: 0,
						height: 38,
						color: '#5d5d5d',
						fontSize: 16,
					},
					predefinedPlacesDescription: {
						color: '#1faadb',
					},
				}}
				currentLocation={false}
				onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
					this.state.lat2 = details.geometry.location.lat;
					this.state.lng2 = details.geometry.location.lng;
					this.state.place2selected = true;
				}}
			/>
		);
	}

	render() {
		return (
			<Container>
				<Header>
					<Button
						onPress={() => this.onPressLogout()}
						transparent
					>
						<Icon name="ios-power" />
					</Button>
					<Body>
						<Title>Location</Title>
					</Body>
				</Header>
				<Content>
					{this.renderGoogleAutoComplete1()}
					{this.renderGoogleAutoComplete2()}
					<DatePikcer
						style={{ width: 200, alignSelf: 'center', marginTop: 100 }}
						date={this.state.date}
						mode="date"
						placeholder="select date"
						format="YYYY-MM-DD"
						confirmBtnText="Confirm"
						cancelBtnText="Cancel"
						onDateChange={(date) => { this.setState({ date: date }); }}
					/>
				</Content>
				<Footer>
					<FooterTab>
						<Button onPress={() => this.onNext()} style={{ alignSelf: 'center' }}>
							<Title style={{ alignSelf: 'center' }}>Next</Title>
						</Button>
					</FooterTab>
				</Footer>
				<AndroidBackButton
						onPress={() => this.onPressLogout()}
					/>
			</Container>
		);
	}
}
export default connect(state => ({
	data: {
		users: state.data.users,
//		temps: state.data.temp,
	},
	services: {
		routeHistory: state.services.routeHistory,
	},
}), dispatch => ({
	actions: {
		users: bindActionCreators(usersActionCreators, dispatch),
	},
	tempActions: {
		temps: bindActionCreators(tempActionCreators, dispatch),
	},
}))(Location);
