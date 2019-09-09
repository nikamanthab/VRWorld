import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    VrButton,
    Image,
    asset,
    NativeModules,
  } from 'react-360';

  const fbAuth= NativeModules.fbAuth;

class LoginPage extends React.Component{
  state={
    login: false,
  }
   componentDidMount(){
        fbAuth.fbsetup();
   }
   handleAuth(){
    fbAuth.fbAuthenticate((val) => {
      this.setState({
        login: val,
      });
    });
    this.props.login();
   }

    render = ()=>{
        if(this.state.login){
          this.props.login
        }
        return(
            <View style={styles.panel}>
                <View style={styles.greetingBox}>
                    <Text style={styles.greeting}>
                    COOPER PLAZA
                    </Text>
                </View>

                <View style={styles.greetingBox}>
                    <VrButton style={{ flexDirection: 'row', justifyContent:'space-between'}} onClick={() => this.handleAuth()}>
                        <Image  style={{height: 40,width: 40, marginRight: 20}} source={asset('facebook.png')} />
                        <Text style={styles.greeting}>
                               Login
                        </Text>
                    </VrButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 1000,
      height: 600,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    greetingBox: {
      padding: 20,
      margin:10,
      backgroundColor: 'white',
      borderColor: 'white',
      borderWidth: 2,
    },
    greeting: {
      fontSize: 30,
      color: '#475993',
      fontWeight: 'bold',
      paddingLeft: 10,
    },
  });

export default LoginPage;