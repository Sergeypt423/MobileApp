import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {
	Alert,
	TouchableWithoutFeedback,
} from 'react-native';
import {
	Container,
	Header,
	Title,
	InputGroup,
	Input,
	Button,
	Spinner,
	Icon,
	View,
	Text,
	Content,
	Body,
} from 'native-base';

import AndroidBackButton from 'react-native-android-back-button';

import * as session from 'MobileApp/src/services/session';
import FormMessage from 'MobileApp/src/components/FormMessage';
import validator from 'validator';

class Register extends Component {
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
			firstname: '',
			lastname: '',
			email: '',
			password: '',
			passwordConfirm: '',
		};
		this.state = this.initialState;
	}

	onPressRegister() {
		dismissKeyboard();

		if (this.state.password !== this.state.passwordConfirm) {
			Alert.alert('Confirm password correctly');
			return;
		}

		const { firstname, lastname, email, password } = this.state;

		if (!firstname) {
			Alert.alert(
			'Error',
			'Please input first name',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}

		if (!lastname) {
			Alert.alert(
			'Error',
			'Please input last name',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
			return;
		}

		if (!email) {
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

		if (!password) {
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

		session.signup(firstname, lastname, email, password)
		.then(() => {
			this.setState(this.initialState);
			const routeStack = this.props.navigator.getCurrentRoutes();
			this.props.navigator.jumpTo(routeStack[4]);
		}).catch((error) => {
			// error.response.json().then((res) => {
			// 	console.error(res);
			// });
			this.setState({
				isLoading: false,
				// ...(error ? { error } : {}),
			});

			Alert.alert(
			'Error',
			'User already exists',
				[
					{ text: 'OK', style: 'cancel' },
				],
			{ cancelable: false }
			);
		});
	}

	onPressBack() {
		const routeStack = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routeStack[0]);
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
						<Title>Register</Title>
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
								<Icon style={{ width: 30 }} name="ios-arrow-forward" />
								<Input
									placeholder="First name"
									autoCorrect={false}
									onChangeText={firstname => this.setState({ firstname })}
									value={this.state.firstname}
								/>
							</InputGroup>
							<InputGroup style={{ marginBottom: 20 }}>
								<Icon style={{ width: 30 }} name="ios-arrow-forward" />
								<Input
									placeholder="Last name"
									autoCorrect={false}
									onChangeText={lastname => this.setState({ lastname })}
									value={this.state.lastname}
								/>
							</InputGroup>
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
							<InputGroup style={{ marginBottom: 20 }}>
								<Icon style={{ width: 30 }} name="ios-unlock" />
								<Input
									placeholder="Confirm"
									onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
									value={this.state.passwordConfirm}
									secureTextEntry
								/>
							</InputGroup>

							{this.state.isLoading ? (
								<Spinner size="small" color="#000000" />
							) : (
							<Button
								style={{ marginTop: 20, alignSelf: 'center', width: 150, justifyContent: 'center' }}
								onPress={() => this.onPressRegister()}
							>
								<Text>Register</Text>
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

export default Register;
