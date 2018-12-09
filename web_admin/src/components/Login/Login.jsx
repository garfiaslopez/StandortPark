import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './Styles';
import { Form, Icon, Input, Button, Alert, Layout } from 'antd';
import moment from 'moment';

import { FetchXHR } from '../../helpers/generals';

const FormItem = Form.Item;
const { Header, Footer, Sider, Content } = Layout;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.props)
        this.props.onSubmitForm(values);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}
        >
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Escribe tu nombre de usuario.' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nombre de usuario" />
          )}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Favor de agregar una contraseña!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Iniciar Sesión
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        }
        this.doLogin = this.doLogin.bind(this);
    }
    doLogin(values) {
        console.log("on login func");
        console.log(values);
        if(values.username !== '' && values.password !== '') {
            const POSTDATA = { username: values.username, password: values.password};
            const url = process.env.REACT_APP_API_URL + '/authenticate';
            FetchXHR(url, 'POST', POSTDATA).then((response) => {
                if (response.json.success) {
                    const toSave = { token: response.json.token, user: response.json.user };
                    localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE, JSON.stringify(toSave));
                    this.props.history.push('/home');
                } else {
                    this.setState({ error: response.json.message });
                }
            }).catch((onError) => {
                this.setState({ error: 'Error al hacer la peticion al servidor.' });
            });
        }else{
            this.setState({ error: 'Favor de rellenar todos los datos' });
        }
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
                        <div style={styles.formContainer}>
                            <WrappedHorizontalLoginForm 
                                onSubmitForm={this.doLogin}
                            />
                        </div>
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
