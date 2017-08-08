import React, { Component, PropTypes } from 'react';
import {
    Image,
    Dimensions,
    View,
    TouchableWithoutFeedback,
} from 'react-native';

import
{
    Container,
    Header,
    Title,
    Content,
    Footer,
    FooterTab,
    Button,
    Body,
    Icon,
} from 'native-base';

import AndroidBackButton from 'react-native-android-back-button';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as usersActionCreators from 'MobileApp/src/data/users/actions';
import * as tempActionCreators from 'MobileApp/src/data/Temp/actions';

const iconsMap = {
    '1': require('MobileApp/imgs/1.png'),
    '2': require('MobileApp/imgs/2.png'),
    '3': require('MobileApp/imgs/3.png'),
};

const iconsSels = {
  '1': require('MobileApp/imgs/sel1.png'),
  '2': require('MobileApp/imgs/sel2.png'),
  '3': require('MobileApp/imgs/sel3.png'),
};

class OneCheckingTerm extends Component{

  constructor(props){
    super(props);
    this.state = {selected: false };
  }
  
  render(){
    let source = this.state.selected ? iconsSels[this.props.name] : iconsMap[this.props.name];
//    var source = this.state.selected ?{iconsMap[this.props.name]} : {iconsMap[this.props.name]};
    return (
        <View style={{ margin: 2,
            width: Dimensions.get('window').width-6,
            height: Dimensions.get('window').height/3.5-6,
            justifyContent: 'center',
            alignItems: 'center',
        }} >
            <TouchableWithoutFeedback  onPress={() => {
              
              if (this.props.name === '1') {
                pollenSelected = !pollenSelected;
              }
              if (this.props.name === '2') {
                noiseSelected = !noiseSelected;
              }
              if (this.props.name === '3') {
                smellSelected = !smellSelected;
              }
              this.setState({selected: !this.state.selected});
              }}>
                <Image source= {source} />
            </TouchableWithoutFeedback>
        </View>
    );
  }
}

let pollenSelected = false;
let noiseSelected = false;
let smellSelected = false;

export class Checking extends Component {

  constructor(props) {
    super(props);

    pollenSelected = false;
    noiseSelected = false;
    smellSelected = false;
  }

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

    onBefore() {
        const routeStack = this.props.navigator.getCurrentRoutes();
        this.props.navigator.jumpTo(routeStack[4]);
	}
    onNext() {

        this.props.tempActions.temps.setSmell(smellSelected);
        this.props.tempActions.temps.setNoise(noiseSelected);
        this.props.tempActions.temps.setPollen(pollenSelected);
        this.props.tempActions.temps.setDiagramScene(true);
        const routeStack = this.props.navigator.getCurrentRoutes();
        this.props.navigator.jumpTo(routeStack[6]);
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
				<Title>Checking</Title>
			</Body>
		</Header>

        <Content style={{ flex: 1, backgroundColor: '#efefef' }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 2 }}>
              <OneCheckingTerm name='1' />
              <OneCheckingTerm name='2' />
              <OneCheckingTerm name='3' />
          </View>
        </Content>
        
        <Footer>
          <FooterTab>
            <Button full onPress={() => { this.onNext(); }}>
              <Title>Begin Checking</Title>
            </Button>
          </FooterTab>
        </Footer>
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
}))(Checking);
