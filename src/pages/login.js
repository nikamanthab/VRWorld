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
  import {setUserId,handleAuth} from './../../store';

  // const fbAuth= NativeModules.fbAuth;

class LoginPage extends React.Component{
  // state={
  //   checkStatus: null,
  //   uid: null
  // }
   componentDidMount(){
    //  console.log("fireballs:",firebase)
        // fbAuth.fbsetup( (val,val2) => {
        //   console.log("in comp",val)
        //   this.setState({
        //     checkStatus: val,
        //     uid: val2
        //   });
        // });
   }
  //  handleAuth(){
  //    console.log("blah",this.state.checkStatus)
  //    if(this.state.checkStatus){
  //     setUserId(this.state.uid); 
  //     this.props.login();
  //    }
  //    else{
  //     fbAuth.fbAuthenticate((val,val2) => {
  //       if(val){
  //         console.log("boomboom:",val2);
  //         setUserId(val2);
  //         this.props.login();
  //       }

  //     });
  //     // this.props.login();
  //   }
    
  //  }

    render = ()=>{
       
        return(
            <View style={styles.panel}>
                <View style={styles.greetingBox}>
                    <Text style={styles.greeting}>
                    VIRTUAL GALAXY
                    </Text>
                </View>

                <View style={styles.greetingBox}>
                    <VrButton style={{ flexDirection: 'row', justifyContent:'space-between'}} onClick={() => handleAuth()}>
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
      // backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    greetingBox: {
      borderRadius:10,
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