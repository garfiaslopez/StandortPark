import React, { Component } from 'react';
import './profile.css';
import { 
    Layout,
    Button,
    Avatar,
    Alert,
    Radio,
    Divider,
    Input,
    List
} from 'antd';

import moment from 'moment';
import { FetchXHR } from '../../helpers/generals';
import styles from './Styles';

const { Header, Footer, Content } = Layout;
const RadioGroup = Radio.Group;

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loading_data: false,
            orders: []
        }
        this.user = JSON.parse(localStorage.getItem('user'));
        this.vehicle = localStorage.getItem('vehicle') || '';
        this.plates = localStorage.getItem('plates') || '';

    }
    componentDidMount() {
        this.getData();
    }
    // GET DATA
	getData() {
		this.setState({
			loading_data: true,
		});
		const url = process.env.REACT_APP_API_URL + '/orders';
        const POSTDATA = {
            limit: 100,
            page: 1,
            google_user_id: this.user.uid
		}
        FetchXHR(url, 'POST', POSTDATA).then((response) => {
            if (response.json.success) {
                this.setState({
					orders: response.json.data.docs,
					total_docs: response.json.data.total,
                    loading_data: false
                });
            } else {
				console.log(response.message);
				this.setState({
					error: response.message
				});
            }
        }).catch((onError) => {
			console.log(onError);
			this.setState({
				error: onError.message
			});
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
            <div style={styles.centerContainer}>
                <img
                    src={process.env.REACT_APP_CDN + '/images/profile.svg'}
                    style={styles.mainLogo}
                    alt="enterpriseImage"
                />
                <Divider style={styles.divider}>{ this.user.displayName }</Divider>
                <Divider style={styles.divider}>{ this.user.email }</Divider>
                <p style={styles.divider}>{ this.vehicle + ' - ' + this.plates } </p>
                <Divider style={styles.divider}>HISTORIAL</Divider>

                <List
                    itemLayout="horizontal"
                    dataSource={this.state.orders.map((el) => {
                        return { 
                            title: moment(el.date_in).format('DD - MM - YYYY'),
                            description: el.total,
                            total: el.total
                        }
                    })}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={process.env.REACT_APP_CDN + '/images/parking.svg'} />}
                            title={item.title}
                            description={'$ ' + item.description + ' MXN' }
                        />
                    </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default Profile;



