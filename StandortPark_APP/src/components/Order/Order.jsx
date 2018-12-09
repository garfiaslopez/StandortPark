import React, { Component } from 'react';
import './order.css';
import { 
    Layout,
    Button,
    Avatar,
    Alert,
    Radio,
    Divider,
    Input
} from 'antd';

import moment from 'moment';
import { FetchXHR } from '../../helpers/generals';
import styles from './Styles';

const { Header, Footer, Content } = Layout;
const RadioGroup = Radio.Group;

class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            radio_value: 1,
            paying: false,
            total: 3 * 1.16,
            minutes: 15
        }
        this.slot = JSON.parse(localStorage.getItem('slot_to_reserve'));
        this.user = JSON.parse(localStorage.getItem('user'));
        this.vehicle = localStorage.getItem('vehicle') || '';
        this.plates = localStorage.getItem('plates') || '';


        console.log(this.slot);
        console.log(props);

        this.onChangeRadio = this.onChangeRadio.bind(this);
        this.doPay = this.doPay.bind(this);
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
        });
    }

    onChangeRadio(e) {
        var price = 3;
        var minutes = 15;
        if (e.target.value == 1) {
            price = 3.0;
            minutes = 15;
        }
        if (e.target.value == 2) {
            price = 12.0;
            minutes = 60;
        }
        if (e.target.value == 3) {
            price = 18.0;
            minutes = 90;
        }
        if (e.target.value == 4) {
            price = 24.0;
            minutes = 120;
        }
        if (e.target.value == 5) {
            price = 36.0;
            minutes = 180;
        }
        if (e.target.value == 6) {
            price = 48.0;
            minutes = 240;
        }
        this.setState({
            radio_value: Number(e.target.value),
            total: price * 1.16,
            minutes: minutes
        });
    }

    doPay() {

        // do the http post for reserve slot:
        this.setState({
            paying: true
        });

        const POSTDATA = {
			google_user_id: this.user.uid,
            slot_id: this.slot._id,
            total: Number(this.state.total.toFixed(2)),
            status: 'open',
            vehicle: this.vehicle,
            plates: this.plates,
            minutes_payed: this.state.minutes,
            date_needs_out: moment().add(this.state.minutes, 'minutes').toISOString(),
            date_in: moment().toISOString()
        }

        const PUTDATA = {
			status: 'reserved',
        }
        
		let method = 'POST';
        let url = process.env.REACT_APP_API_URL + '/order';
        let method_put = 'PUT';
        let url_put = process.env.REACT_APP_API_URL + '/slot/' + this.slot._id;
        
		FetchXHR(url, method, POSTDATA).then((response) => {
            if (response.json.success) {
                localStorage.setItem('actual_order', JSON.stringify(response.json.obj));
                FetchXHR(url_put, method_put, PUTDATA).then((response) => {
                    if (response.json.success) {
                        this.props.history.replace('/inorder');
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

        return (
            <Layout style={styles.layout}>
                <Header style={styles.header} > 
                    Reservar Cajón
                </Header>
                <Content>
                    {alert}
                    <div style={styles.centerContainer}>
                        <img
                            src={process.env.REACT_APP_CDN + '/images/garage.svg'}
                            style={styles.mainLogo}
                            alt="enterpriseImage"
                        />
                        <Divider style={styles.divider}>{ this.slot.denomination }</Divider>
                        <p> { this.slot.address } </p>
                        <Divider style={styles.divider}>Tarifas</Divider>

                        <RadioGroup 
                            onChange={this.onChangeRadio} 
                            value={this.state.radio_value}
                            style={styles.radioGroup}
                        >
                            <Radio style={styles.radioStyle} value={1}>
                                <a style={styles.labelRadioLeft}>15 min</a>
                                <a style={styles.labelRadioRight}>$3 MXN</a>
                            </Radio>
                            <Radio style={styles.radioStyle} value={2}>
                                <a style={styles.labelRadioLeft}>15min / 1hr</a>
                                <a style={styles.labelRadioRight}>$12 MXN</a>
                            </Radio>
                            <Radio style={styles.radioStyle} value={3}>
                                <a style={styles.labelRadioLeft}>1hr / 1:30hr</a>
                                <a style={styles.labelRadioRight}>$18 MXN</a>
                            </Radio>
                            <Radio style={styles.radioStyle} value={4}>
                                <a style={styles.labelRadioLeft}>1:30hr / 2hr min</a>
                                <a style={styles.labelRadioRight}>$24 MXN</a>
                            </Radio>
                            <Radio style={styles.radioStyle} value={5}>
                                <a style={styles.labelRadioLeft}>2hr / 3hr min</a>
                                <a style={styles.labelRadioRight}>$36 MXN</a>
                            </Radio>
                            <Radio style={styles.radioStyle} value={6}>
                                <a style={styles.labelRadioLeft}>3hr / 4hr min</a>
                                <a style={styles.labelRadioRight}>$48 MXN</a>
                            </Radio>
                        </RadioGroup>

                        <Divider style={styles.divider}>Total (+iva): { this.state.total.toFixed(2) } </Divider>

                        <Button 
                            style={styles.button}
                            type="primary" 
                            icon="credit-card" 
                            loading={this.state.paying} 
                            onClick={this.doPay}
                        >
                            Proceder a pagar
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

export default Order;



