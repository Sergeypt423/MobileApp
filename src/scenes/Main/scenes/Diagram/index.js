import React, { Component, PropTypes } from 'react';

import {
	Dimensions,
 } from 'react-native';

import
{
    Container,
    Header,
    Title,
    Content,
    Button,
    Body,
    Icon,
} from 'native-base';

import MapView from 'react-native-maps';
// import getDirections from 'react-native-google-maps-directions';

import Polyline from '@mapbox/polyline';
import AndroidBackButton from 'react-native-android-back-button';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as usersActionCreators from 'MobileApp/src/data/users/actions';
import * as tempActionCreators from 'MobileApp/src/data/Temp/actions';
import * as session from 'MobileApp/src/services/session';
import geolib from 'geolib';


const { width, height } = Dimensions.get('window');

export class Diagram extends Component {

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
		tempData: PropTypes.shape({
			temps: PropTypes.object,
		}),
	}

	constructor(props) {
		super(props);

		this.state = {
			coords: [],
			pointers: {},
			northeastP: { lat: 44.510514, lng: -73.4852872 },
			southwestP: { lat: 43.69712740000001, lng: -74.2653661 },
			calculated: false,
		};
	}

	onBefore() {
		this.props.tempActions.temps.setDiagramScene(false);
		this.setState({ coords: [], pointers: [], calculated: false });
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[5]);
	}

	onAdd() {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[7]);
	}

	async getDirections(startLoc, destinationLoc) {

		//
		this.props.tempActions.temps.setDiagramScene(false);
		try {
//			console.log(startLoc);
//			console.log(destinationLoc);

			const mode = 'driving';
			const origin = `${startLoc.latitude},${startLoc.longitude}`;
			const destination = `${destinationLoc.latitude},${destinationLoc.longitude}`;
			const APIKEY = 'AIzaSyDvW7G6vBZCQYkEgKZpTSNAtZddphbqnyM';
			const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=${mode}`;

			const resp = await fetch(url);
			const respJson = await resp.json();

//			this.setState({northeast: respJson.routes[0].bounds.northeast,
//							southwest: respJson.routes[0].bounds.southwest });
			const northeast = respJson.routes[0].bounds.northeast;
			const southwest = respJson.routes[0].bounds.southwest;

//			console.log(respJson.routes[0].bounds.northeast);
//			console.log(respJson.routes[0].bounds.southwest);
//			console.log(northeast);
//			console.log(southwest);

			const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
			const coords = points.map((point, index) => ({
				latitude: point[0],
				longitude: point[1],
			}));

//			this.setState({coords: coords});

			const type = [];
			const beforestate = this.props.tempData.temps;
			if (beforestate.PollenSelected) {
				type.push('Pollen');
			}
			if (beforestate.NoiseSelected) {
				type.push('Noise');
			}
			if (beforestate.SmellSelected) {
				type.push('Smell');
			}

//			console.log(northeast);
//			console.log(southwest);
//			console.log(type);

			this.setState({ coords });

			session.aocpoints(northeast.lat, northeast.lng, southwest.lat, southwest.lng,
				type, beforestate.date)
			.then((data) => { this.setState({ pointers: data.data, northeastP: northeast, southwestP: southwest, calculated: true }); })
			.catch((exception) => { console.log(exception); });

//			console.log('--------------pointers---------------');
//			console.log(this.state.pointers);
			return coords;
		} catch (error) {
			return error;
		}
	}

	render() {
		const beforestate = this.props.tempData.temps;
		let polyLineColor = 'blue';
		const length = this.state.pointers.length;
		const circles = [];
		let collision = false;

		let deltalng = (this.state.northeastP.lng > this.state.southwestP.lng) ? 	(this.state.northeastP.lng - this.state.southwestP.lng) : (this.state.southwestP.lng - this.state.northeastP.lng);
		let deltalat = (this.state.northeastP.lat > this.state.southwestP.lat) ? 	(this.state.northeastP.lat - this.state.southwestP.lat) : (this.state.southwestP.lat - this.state.northeastP.lat);

		if (beforestate.DiagramScene) {
			const start = { latitude: beforestate.lat1, longitude: beforestate.lng1 };
			const end = { latitude: beforestate.lat2, longitude: beforestate.lng2 };
			this.getDirections(start, end);
		}

		for (let index = 0; index < length; index += 1) {
			const element = this.state.pointers[index];
			circles.push(
				<MapView.Circle
					key={index}
					center={{ latitude: element.lat, longitude: element.lng }}
					radius={element.radius}
					strokeColor="green"
					strokeWidth={2}
				/>
			);
			if (collision === false) {
				if (this.state.coords.length < 2) {
					break;
				}
				let polyElement1 = this.state.coords[0];
				for (let polyIndex = 1; polyIndex < this.state.coords.length; polyIndex += 1) {
					const polyElement2 = this.state.coords[polyIndex];
					const distance = geolib.getDistanceFromLine({ latitude: element.lat, longitude: element.lng },
						{ latitude: polyElement1.latitude, longitude: polyElement1.longitude },
						{ latitude: polyElement2.latitude, longitude: polyElement2.longitude }
					);

					polyElement1 = polyElement2;
					if (distance < element.radius) {
						console.log({ element1: [polyElement1.latitude, polyElement1.longitude],
							element2: [polyElement2.latitude, polyElement2.longitude],
							circle: [element.lat, element.lng],
							radius: element.radius });
						collision = true;
					}
				}
			}
		}
		if (collision === true) {
			polyLineColor = 'red';
		}
		if (this.state.calculated === true) {
			return (
				<Container>
					<Header>
						<Button
							onPress={() => this.onBefore()}
							transparent
						>
							<Icon name="ios-arrow-back" />
						</Button>
						<Body>
							<Title>Route</Title>
						</Body>
						<Button
							onPress={() => this.onAdd()}
							transparent
						>
							<Icon name="md-add" />
						</Button>
					</Header>
					<Content>
						<MapView
							style={{ width, height }}
							region={{
								latitude: this.state.northeastP.lat - (deltalat / 2),
								longitude: this.state.northeastP.lng - (deltalng / 2),
								latitudeDelta: deltalat * 1.3,
								longitudeDelta: deltalng * 1.3,
							}}
						>
							<MapView.Polyline
								coordinates={this.state.coords}
								strokeWidth={2}
								strokeColor={polyLineColor}
							/>
							{circles}
						</MapView>
					</Content>
					<AndroidBackButton
						onPress={() => this.onBefore()}
					/>
				</Container>
			);
		}
		return (
			<Container>
				<Header>
					<Button
						onPress={() => this.onBefore()}
						transparent
					>
						<Icon name="ios-arrow-back" />
					</Button>
					<Body>
						<Title>Route</Title>
					</Body>
					<Button
						onPress={() => this.onAdd()}
						transparent
					>
						<Icon name="md-add" />
					</Button>
				</Header>
				<Content>
					<MapView
						style={{ width, height }}
						region={{
							latitude: this.state.northeastP.lat,
							longitude: this.state.northeastP.lng,
							latitudeDelta: 170,
							longitudeDelta: 350,
						}}
					/>
				</Content>
				<AndroidBackButton
					onPress={() => this.onBefore()}
				/>
			</Container>
		);
	}
}

export default connect(state => ({
	data: {
		users: state.data.users,
	},
	tempData: {
		temps: state.data.temp,
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
}))(Diagram);
