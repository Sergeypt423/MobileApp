import React, { PropTypes } from 'react';

import {
	Container,
	Header,
	Title,
	Button,
	Content,
	Text,
	Body,
} from 'native-base';


const Main = (props) => {
	const routeStack = props.navigator.getCurrentRoutes();
	return (
		<Container>
			<Header>
				<Body>
					<Title>Welcome</Title>
				</Body>
			</Header>
			<Content>
				<Button
					style={{ marginTop: 20, alignSelf: 'center', width: 150, justifyContent: 'center' }}
					onPress={() => props.navigator.jumpTo(routeStack[1])}
				>
					<Text>Login</Text>
				</Button>
				<Button
					style={{ marginTop: 20, alignSelf: 'center', width: 150, justifyContent: 'center' }}
					onPress={() => props.navigator.jumpTo(routeStack[2])}
				>
					<Text>Register</Text>
				</Button>
			</Content>
		</Container>
	);
};

Main.propTypes = {
	navigator: PropTypes.shape({
		getCurrentRoutes: PropTypes.func,
		jumpTo: PropTypes.func,
	}),
};

export default Main;
