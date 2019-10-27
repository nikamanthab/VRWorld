import React from 'react';
import {View, Text,VrButton} from 'react-360';
import AnimatedBtn from './animatedBtn';
// import ColdCard from './coldcard';
import {handleColdstart} from './../../store'
class ColdStart extends React.Component{

    state={
        categories:[]
    }

    handleCold(){
          handleColdstart(this.state.categories);
    }

    addChange(exp){
        if(this.state.categories.indexOf(exp) == -1){

            this.setState({ categories: [...this.state.categories,exp]})

        }else{

            this.setState({ categories: this.state.categories.filter(ele =>{
                return (ele != exp)
                })
            })
            }
    }
    
    check(cont){
        return(
            <View style={styles.greetingbox} >
                <AnimatedBtn
                onClick={() => this.addChange(cont)} 
                text={cont} 
                fontSize={30} 
                height={60} 
                width={280} 
                backgroundcolor={"#C030ED"}
                focusBack = {"#DC86FA"}
                selectedColor={"#770087"}
                selected ={this.state.categories.includes(cont)}/>
                {/* <VrButton  onClick={() => this.addChange(cont)}>
                    <View style={{justifyContent:"center",alignItem:"center"}}>
                        <Text style={{textAlign:"center",paddingTop:10}}> {cont} </Text>
                    </View>
                </VrButton> */}
            </View>

        )
    }

    renderList(){
        let needed;
        needed = this.props.cardlist.map(ele =>{
            return this.check(ele);
        })
        return needed;
    }

    render = ()=>{
        console.log("inside coldstart");
        console.log("Categories:",this.state.categories );
        cardlist = this.props.cardlist;
        return(
            <View>
                <View style={styles.flexPanel}>
                    {this.renderList()}
                </View>
                <View style={{alignItems:"center"}}>
                    {/* <AnimatedBtn onClick={alert("enter")} text={"Suggest Party"} /> */}
                    <AnimatedBtn
                    onClick={() => this.handleCold()}
                    text={"Submit"}
                    fontSize={30} 
                    height={40} 
                    width={180} 
                    />
                </View>
            </View>

        )
    }
}
const styles ={
    flexPanel:{
        flexDirection: 'row',
        flexWrap:'wrap',
        width: 980,
        height: 500,
        justifyContent:'space-around',
        // alignItem:center
        // borderWidth:1,
        // borderColor: 'green',
  
      },
    greetingbox:{
        width: 360,
      height: 110,
      borderRadius:5,
      justifyContent:"center",
      alignItems:"center",
    //   backgroundColor: "green",
      margin:10
    }
}
export default ColdStart;