import React, { Component } from 'react';
import './inorder.css';
import { 
    Layout,
    Button,
    Avatar,
    Alert,
    Radio,
    Divider,
    Input
} from 'antd';
import { geolocated } from 'react-geolocated';
import moment from 'moment';
import { FetchXHR } from '../../helpers/generals';
import styles from './Styles';
import Countdown from 'react-countdown-now';

const { Header, Footer, Content } = Layout;
const RadioGroup = Radio.Group;

class InOrder extends Component {

    constructor(props) {
        super(props);
        
        this.slot = JSON.parse(localStorage.getItem('slot_to_reserve'));
        this.order = JSON.parse(localStorage.getItem('actual_order'));

        this.state = {
            error: '',
            remaining_time: props.remaining_time,
            status_slot: this.slot.status,
            loading: false
        }

        this.onClickNavigation = this.onClickNavigation.bind(this);
        this.onClickHelp = this.onClickHelp.bind(this);
        this.onExpiredCounter = this.onExpiredCounter.bind(this);
        this.onClickLeave = this.onClickLeave.bind(this);
    }

    onClickNavigation() {
        window.open('http://maps.google.com/?saddr=' + this.props.coords.latitude + ',' + this.props.coords.longitude + '&daddr=' + this.slot.location.coordinates[1] + ',' + this.slot.location.coordinates[0]);
    }

    onClickHelp() {
        window.open('mailto:help@standortpark.com')
    }

    onExpiredCounter() {
        this.setState({
            status_slot: 'expired'
        });
    }

    onClickLeave() {
        // do the leave http post here:
        // do the http post for reserve slot:
        this.setState({
            loading: true
        });

        const POSTDATA = {
            status: 'closed',
            date_out: moment().toISOString()
        }
        const PUTDATA = {
            status: 'free',
        }
        let method = 'PUT';
        
		let url = process.env.REACT_APP_API_URL + '/order/' + this.order._id;
		let url_put = process.env.REACT_APP_API_URL + '/slot/' + this.slot._id;
		FetchXHR(url, method, POSTDATA).then((response) => {
            if (response.json.success) {
                localStorage.removeItem('actual_order');
                FetchXHR(url_put, method, PUTDATA).then((response) => {
                    if (response.json.success) {
                        this.props.history.replace('/home');
                    }
                });
            }
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

        let status_slot = "En tiempo"; 
        if (this.state.status_slot == 'expired') {
            status_slot = "Expired";
        }


        const render_countdown = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
                return <span style={styles.labelCounter}> 00:00 </span>
            } else {
                return <span style={styles.labelCounter} >{hours}:{minutes}:{seconds}</span>;
            }
        };

        let maps_link = '';
        if (this.props.coords) {
            maps_link = 'http://maps.google.com/?saddr=' + this.props.coords.latitude + ',' + this.props.coords.longitude + '&daddr=' + this.slot.location.coordinates[1] + ',' + this.slot.location.coordinates[0];
        }

        return (
            <Layout style={styles.layout}>
                <Header style={styles.header} > 
                    Estado de Cajón
                </Header>
                <Content style={{height: '100%'}}>
                    {alert}
                    <div style={styles.centerContainer}>
                        
                        <img
                            src={process.env.REACT_APP_CDN + '/images/parking.svg'}
                            style={styles.mainLogo}
                            alt="enterpriseImage"
                        />

                        <Divider style={styles.divider}>{ this.slot.denomination }</Divider>
                        <p> { this.slot.address } </p>

                        <Countdown
                            date={new Date(this.order.date_needs_out)}
                            daysInHours={false}
                            zeroPadLength={2}
                            onComplete={this.onExpiredCounter}
                            renderer={render_countdown}
                        />

                        <Divider style={styles.divider}>Estado: { status_slot } </Divider>
                        <Divider style={styles.divider}>Vehiculo: { this.order.vehicle + ' - ' + this.order.plates } </Divider>

                        <Button 
                            style={styles.buttonLink}
                            type="primary" 
                            icon="environment" 
                            href={maps_link}
                            target="_blank"
                        >
                            Navegación
                        </Button>
                        <Button 
                            style={styles.button}
                            type="primary" 
                            icon="mail" 
                            onClick={this.onClickHelp}
                        >
                            Asistencia
                        </Button>
                        <Button 
                            style={styles.button}
                            type="primary" 
                            icon="logout" 
                            loading={this.state.loading}
                            onClick={this.onClickLeave}
                        >
                            Desocupar Cajón
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

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 15000,
})(InOrder);



