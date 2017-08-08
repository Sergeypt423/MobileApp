import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {
	TouchableWithoutFeedback,
	Alert,
} from 'react-native';
import {
	Container,
	Header,
	Title,
	InputGroup,
	Input,
	Button,
	Icon,
	Text,
	View,
	Spinner,
	Body,
	Content,
} from 'native-base';
import validator from 'validator';

import AndroidBackButton from 'react-native-android-back-button';

import FormMessage from 'MobileApp/src/components/FormMessage';
import * as session from 'MobileApp/src/services/session';
import * as api from 'MobileApp/src/services/api';

class Login extends Component {
	static propTypes = {
		navigator: PropTypes.shape({
			getCurrentRoutes: PropTypes.func,
			jumpTo: PropTypes.func,
		}),
	}

	constructor(props) {
		super(props);

		this.initialState = {
			isLoading: false,
			error: null,
			email: '',
			password: '',
		};
		this.state = this.initialState;
	}

	onPressLogin() {
		dismissKeyboard();

		this.state.email.trim();

		if (!this.state.email) {
			Alert.alert(
			'Error',
			'Please input email',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}

		if (!validator.isEmail(this.state.email)) {
			Alert.alert(
			'Error',
			'Email is not valid',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}

		if (!this.state.password) {
			Alert.alert(
			'Error',
			'Please input password',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}

		this.setState({
			isLoading: true,
			error: '',
		});

		session.signin(this.state.email, this.state.password)
		.then(() => {
			this.setState(this.initialState);
			const routeStack = this.props.navigator.getCurrentRoutes();
			this.props.navigator.jumpTo(routeStack[4]);
		})
		.catch((exception) => {
			// Displays only the first error message
			const error = api.exceptionExtractError(exception);

			this.setState({
				isLoading: false,
				...(error ? { error } : {}),
			});

			Alert.alert(
			'Error',
			'Email or Password is incorrect',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);

			if (!error) {
				throw exception;
			}
		});
	}

	onPressBack() {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
	}

	renderError() {
		if (this.state.error) {
			return (
				<Text
					style={{ color: 'red', marginBottom: 20 }}
				>
					{this.state.error}
				</Text>
			);
		}
	}

	render() {
		return (
			<Container>
				<Header>
					<Button
						onPress={() => this.onPressBack()}
						transparent
					>
						<Icon name="ios-arrow-back" />
					</Button>
					<Body>
						<Title>Login</Title>
					</Body>
				</Header>
				<Content>
					<TouchableWithoutFeedback
						onPress={dismissKeyboard}
					>
						<View
							style={{ padding: 30, flex: 1 }}
						>
							{this.state.error ? (
								<FormMessage message={this.state.error} />
							) : null}
							<InputGroup style={{ marginBottom: 20 }}>
								<Icon style={{ width: 30 }} name="ios-person" />
								<Input
									placeholder="Email"
									keyboardType="email-address"
									autoCorrect={false}
									autoCapitalize="none"
									onChangeText={email => this.setState({ email })}
									value={this.state.email}
								/>
							</InputGroup>
							<InputGroup style={{ marginBottom: 20 }}>
								<Icon style={{ width: 30 }} name="ios-unlock" />
								<Input
									placeholder="Password"
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
									secureTextEntry
								/>
							</InputGroup>
							{this.state.isLoading ? (
								<Spinner size="small" color="#000000" />
							) : (
							<Button
								style={{ marginTop: 20, alignSelf: 'center', width: 150, justifyContent: 'center' }}
								onPress={() => this.onPressLogin()}
							>
								<Text>Login</Text>
							</Button>
							)}
						</View>
					</TouchableWithoutFeedback>
					<AndroidBackButton
						onPress={() => this.onPressBack()}
					/>
				</Content>
			</Container>
		);
	}
}

export default Login;
