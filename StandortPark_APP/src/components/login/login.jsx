import React, { Component } from 'react';
import './login.css';
import { 
    Layout,
    Button,
    Avatar,
    Alert
} from 'antd';
import moment from 'moment';
import firebase from 'firebase';
import { FetchXHR } from '../../helpers/generals';
import styles from './Styles';

const { Header, Footer, Content } = Layout;
const Firebase_Config = {
    apiKey: "AIzaSyAYC0KsTxHz7t0_dZSWiB-jRnaQDlpethY",
    authDomain: "parkng-a5781.firebaseapp.com",
    databaseURL: "https://parkng-a5781.firebaseio.com",
    projectId: "parkng-a5781",
    storageBucket: "parkng-a5781.appspot.com",
    messagingSenderId: "100242496683"
}
firebase.initializeApp(Firebase_Config);

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = 'es';


class Login extends Component {

    constructor(props) {
        super(props);
        this.loginGoogle = this.loginGoogle.bind(this);
        this.redirect = this.redirect.bind(this);
        this.sendToDatabase = this.sendToDatabase.bind(this);
        this.state = {
            error: ''
        }
        console.log(props);
    }

    redirect() {
        console.log(this.props);
    }

    sendToDatabase(user) {
        const url = process.env.REACT_APP_API_URL + '/user'
        const data = {
            'username': user.displayName,
            'password': '123',
            'name': user.displayName,
            'email': user.email,
        };
        FetchXHR(url, 'POST', data).then((response) => {
            console.log(response)
            this.props.history.push("/card");
        }).catch((onError) => {
            console.log(onError);
            this.props.history.push("/card");

        });
    }

    loginGoogle() {

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            firebase.auth().signInWithPopup(provider).then((result) => {
                var token = result.credential.accessToken;
                var user = result.user;
                window.localStorage.setItem('userToken', token);
                window.localStorage.setItem('user', JSON.stringify(user));
                console.log(user);
                this.sendToDatabase(user);
              }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(errorMessage);
                alert(errorMessage);
              });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    }
    render() {
        let alert = <div></div>
        if (this.state.error !== '') {
            alert = (
                <Alert
                    message={'Error'} 
                    description={this.state.error} 
                    type="error" 
                    banner={true}
                    showIcon={true}
                    closable={true}
                    onClose={() => {
                        this.setState({ error: '' });
                    }}
                />
            )
        }

        return (
            <Layout style={styles.layout}>
                <Header style={styles.header} > 
                    StandortPark - Iniciar Sesión 
                </Header>
                <Content>
                    {alert}
                    <div style={styles.centerContainer}>
                        <img
                            src={process.env.REACT_APP_CDN + '/images/MainLogo.png'}
                            style={styles.mainLogo}
                            alt="enterpriseImage"
                        />
                        <Button 
                            onClick={this.loginGoogle}
                        > 
                            Iniciar Sesión Google
                        </Button>
                        
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    StandortPark  © {moment().format('YYYY')}
                </Footer>
            </Layout>
        );
    }
}

export default Login;



