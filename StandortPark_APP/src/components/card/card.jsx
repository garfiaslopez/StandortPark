import React, { Component } from 'react';
import './card.css';
import '../login/login.css';
import { Layout, Input, Button, Icon } from 'antd';
const { Header, Footer, Content } = Layout;

class Card extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            credit_card: '',
            cvv: '',
            name: '',
            expiry_date: '',
            vehicle: '',
            plates: ''
        }
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeVehicle = this.onChangeVehicle.bind(this);
        this.onChangePlates = this.onChangePlates.bind(this);
        this.onChangeCreditCard = this.onChangeCreditCard.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeCCV = this.onChangeCCV.bind(this);
        this.onSaveCard  = this.onSaveCard.bind(this);
    }

    onChangeName(event) {
        this.setState({
            name: event.target.value
        });
    }
    onChangeVehicle(event) {
        localStorage.setItem('vehicle', event.target.value);
        this.setState({
            vehicle: event.target.value
        });
    }
    onChangePlates(event) {
        localStorage.setItem('plates', event.target.value);
        this.setState({
            plates: event.target.value
        });
    }
    onChangeCreditCard(event) {
        this.setState({
            credit_card: event.target.value
        });
    }
    onChangeDate(event) {
        this.setState({
            expiry_date: event.target.value
        });
    }
    
    onChangeCCV(event) {
        this.setState({
            cvv: event.target.value
        });
    }

    onSaveCard() {
        this.props.history.push("/home");
    }
    

    
    render() {
        return (

            <Layout>
                <Header className="loginHeader">
                    Ingresar Datos
                </Header>
                <Content className="loginContent">
                    <img
                        src={process.env.REACT_APP_CDN + '/images/CardICon.png'}
                        className="mainLogo"
                        alt="enterpriseImage"
                    />
                    <div className="cardContainer">
                        <Input
                            className="cardInputForm"
                            placeholder="Nombre Completo"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={this.onChangeName}
                            ref={node => this.userNameInput = node}
                        />

                        <Input
                            className="cardInputForm"
                            placeholder="Vehiculo"
                            prefix={<Icon type="car" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={this.onChangeVehicle}
                            ref={node => this.userNameInput = node}
                        />

                        <Input
                            className="cardInputForm"
                            placeholder="Placas del Vehiculo"
                            prefix={<Icon type="car" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={this.onChangePlates}
                            ref={node => this.userNameInput = node}
                        />
                        
                        <Input 
                            className="cardInputForm"
                            placeholder="Numero de tarjeta"
                            prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={this.onChangeCreditCard}
                            ref={node => this.userNameInput = node}
                        />

                        
                        <Input
                            className="cardInputForm"
                            placeholder="Fechar Expiracion"
                            prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={this.onChangeDate}
                            ref={node => this.userNameInput = node}
                        />

                        
                        <Input
                            className="cardInputForm"
                            placeholder="CVV"
                            prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={this.onChangeCCV}
                            ref={node => this.userNameInput = node}
                        />
                        <Button 
                            onClick={this.onSaveCard} 
                            type="primary" 
                            icon="plus-circle"
                            className="cardInputForm"
                        > 
                            Agregar 
                        </Button>
                    </div>
                
                </Content>
                <Footer className="loginFooter">
                    <p className="loginLabelFooter"> ParkingApp 2018 </p>
                </Footer>
            </Layout>

        );
    }
}

export default Card;

