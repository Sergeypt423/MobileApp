import React, { Component, PropTypes } from 'react';

import {
	Dimensions,
	View,
	Text,
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
	Input,
	InputGroup,
	Picker,
} from 'native-base';

// import getDirections from 'react-native-google-maps-directions';

import AndroidBackButton from 'react-native-android-back-button';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as usersActionCreators from 'MobileApp/src/data/users/actions';
import * as tempActionCreators from 'MobileApp/src/data/Temp/actions';
import * as session from 'MobileApp/src/services/session';

import DatePikcer from 'react-native-datepicker';


const { width, height } = Dimensions.get('window');
let todayStr;

export class AddPoint extends Component {

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

		const today = new Date();
		const dateStrT = today.toLocaleDateString('en-US');
		const terms = dateStrT.split('/');
		const dateStr = `${terms[2]}-${terms[0]}-${terms[1]}`;
        todayStr = dateStr;

		this.state = {
			newACPointLat: '',
			newACPointLng: '',
			newACPointRadius: '',
			newACPointType: 'Pollen',  /* pollenSelected = false;    noiseSelected = false;    smellSelected = false; */
			newACPointComment: '',
			newACPointDate: dateStr,
			//
		};
	}

	onBefore() {
		this.setState({ newACPointLat: '', newACPointLng: '', newACPointRadius: '', newACPointComment: '', newACPointDate: todayStr, newACPointType: 'Pollen' });
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[6]);
	}

	onAddAOCOK() {
		session.addpoint(this.state.newACPointLat, this.state.newACPointLng, this.state.newACPointType, this.state.newACPointDate, this.state.newACPointRadius,
		this.state.newACPointComment);
        this.onBefore();
	}

	onAddAOCCancel() {
        this.onBefore();
	}

	render() {
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
					<Title>Add AOC point</Title>
				</Body>
			</Header>
			<Content>
				<InputGroup>
					<Input
						placeholder="Latitude"
						autoCorrect={false}
						keyboardType="numeric"
						autoCapitalize="none"
						onChangeText={(lat) => { this.setState({ newACPointLat: lat }); }}
						value={this.state.newACPointLat}
					/>
				</InputGroup>
				<InputGroup>
					<Input
						placeholder="Longitude"
						autoCorrect={false}
						autoCapitalize="none"
						keyboardType="numeric"
						onChangeText={(lng) => { this.setState({ newACPointLng: lng }); }}
						value={this.state.newACPointLng}
					/>
				</InputGroup>
				<InputGroup>
					<Input
						placeholder="Radius"
						autoCorrect={false}
						keyboardType="numeric"
						autoCapitalize="none"
						onChangeText={(radius) => { this.setState({ newACPointRadius: radius }); }}	
						value={this.state.newACPointRadius}
						/>
				</InputGroup>
				<InputGroup style={{ marginBottom: 10, marginTop: 10, flexDirection: 'column', alignItems: 'flex-start' }}>
					<Text> AOCPoint Type </Text>
					<Picker selectedValue={this.state.newACPointType} onValueChange={(value) => { this.setState({ newACPointType: value }); }}>
						<Picker.Item label="Pollen" value="Pollen" />
						<Picker.Item label="Noise" value="Noise" />
						<Picker.Item label="Smell" value="Smell" />
					</Picker>
					
				</InputGroup>
				<InputGroup>
					<Input
						placeholder="Comment"
						autoCorrect={false}
						autoCapitalize="none"
						onChangeText={(comment) => { this.setState({ newACPointComment: comment }); }}
						value={this.state.newACPointComment}
					/>
				</InputGroup>
				<InputGroup style={{ alignSelf: 'center' }}>
					<DatePikcer
						style={{ width: 300, alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
						date={this.state.newACPointDate}
						mode="date"
						placeholder="select date"
						format="YYYY-MM-DD"
						confirmBtnText="Confirm"
						cancelBtnText="Cancel"
						onDateChange={(date) => { this.setState({ newACPointDate: date }); }}
					/>
				</InputGroup>
				<View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 20 , paddingRight: 20}}>
					<Button bordered dark style={{ width: 150, justifyContent: 'center', alignSelf: 'center' }} onPress={ () => this.onAddAOCOK() }><Text>OK</Text></Button>
					<Button bordered dark style={{ width: 150, justifyContent: 'center', alignSelf: 'center' }}onPress={ () => this.onAddAOCCancel() }><Text>Cancel</Text></Button>
				</View>
			</Content>
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
}))(AddPoint);
