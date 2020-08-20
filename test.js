// react-native init DeepLinkExample
// cd DeepLinkExample

// yarn add react-navigation
// yarn add react-native-gesture-handler
// react-native link react-native-gesture-handler

import React from 'react';
import { Text } from 'react-native';


class Home extends React.Component {  
static navigationOptions = {   title: 'Home',  };
render() {  
return <Text>Hello from Home!</Text>; 
 }
}
export default Home;


import React from 'react';
import { Text } from 'react-native';
class Article extends React.Component {  
static navigationOptions = {   title: 'Article',  };
 render() {   
const { id }=this.props.navigation.state.params;   return <Text>Hello from Article {id}!</Text>;  
}
}
export default Article;

//App
import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { createAppContainer, createStackNavigator} from "react-navigation";
import Home from './src/Home';
import Article from './src/Article';
const AppNavigator = createStackNavigator({  
Home: { screen: Home },  
Article: { screen: Article, path: 'article/:id', },
},
{ initialRouteName: "Home"});
const prefix = 'myapp://myapp/';
const App = createAppContainer(AppNavigator)
const MainApp = () => <App uriPrefix={prefix} />;
export default MainApp;
