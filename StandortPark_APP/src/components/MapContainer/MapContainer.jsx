import React, { Component } from 'react';
import { 
    Layout, 
    Menu, 
    Icon,
    Button
} from 'antd';
import ReactMapboxGl, { Layer, Feature, Marker, Popup } from "react-mapbox-gl";

import './MapContainer.css';
import { FetchXHR } from '../../helpers/generals';

const { Header, Sider, Content } = Layout;
const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiZGF6emVyc25heWRlciIsImEiOiJjam5udGs0azgwaDhvM3FyMGl1eTRrejY3In0.wGbg1AV_afhBRGuusBLZFQ"
});

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            loading_data: false,
            error: '',
            slots: [],
            selected_slot: null
        };
        this.getSlots = this.getSlots.bind(this);
        this.open_popup = this.open_popup.bind(this);
        this.reserve_slot = this.reserve_slot.bind(this);
    }
    componentDidMount() {
        this.getSlots();
        setInterval(() => {
            this.getSlots();
        }, 5000);
    }

    getSlots() {
		this.setState({
			loading_data: true,
		});
		const url = process.env.REACT_APP_API_URL + '/slots';
        const POSTDATA = {
            limit: 100,
            page: 1,
            status: 'free' 
		}
        FetchXHR(url, 'POST', POSTDATA).then((response) => {
            if (response.json.success) {
                this.setState({
					slots: response.json.data.docs,
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
    
    reserve_slot() {
        console.log("reservar");
        localStorage.setItem('slot_to_reserve', JSON.stringify(this.state.selected_slot));
        this.props.history.push('/order');
    }

    open_popup = (marker) => {
        this.setState({
            selected_slot: marker
        });
    }

    close_popup = () => {
        this.setState({
            selected_slot: null
        });
    }

    render() {

        let order_button = <div></div>;
        let popup = <div></div>;
        if (this.state.selected_slot) {
            order_button = (
                <Button
                    onClick={this.reserve_slot}
                    className="reserveButton"
                >
                    Reservar &nbsp; {this.state.selected_slot.denomination}
                </Button>
            );
            popup = (
                <Popup
                    coordinates={[ this.state.selected_slot.location.coordinates[0], this.state.selected_slot.location.coordinates[1]]}
                    offset={{
                        'bottom-left': [12, -38],
                        'bottom': [0, -38], 
                        'bottom-right': [-12, -38]
                    }}
                >
                    <h1>
                        {this.state.selected_slot.denomination}
                    </h1>
                </Popup>
            );
        }

        const Markers = this.state.slots.map((el, key) => {
            return (
                <Marker
                    onClick={()=>{
                        this.open_popup(el);
                    }}
                    coordinates={[el.location.coordinates[0], el.location.coordinates[1]]}
                    anchor="bottom"
                >
                    <img src={"/images/marker.svg"}/>
                </Marker>
            );
        });


        return (
            <div>
                <Map
                    onClick={() => {
                        if (this.state.selected_slot) {
                            this.close_popup();
                        }
                    }}
                    center = {[ -99.135994, 19.500486]}
                    zoom = {[19]}
                    style="mapbox://styles/mapbox/streets-v9"
                    containerStyle={{
                        height: "100vh",
                        width: "100vw"
                    }}>
                        {popup}
                        {Markers}
                </Map>
                {order_button}
            </div>
            
        );
    }
}

export default MapContainer;