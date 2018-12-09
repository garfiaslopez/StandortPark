import React, { Component, Fragment } from 'react';
import toPairs from 'lodash/toPairs';
import {
    Form,
    Icon,
    Modal,
    Button,
    Alert
} from 'antd';
import styles from './Styles';
import FormRender from './FormRender';

class FormGeneratorChild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: this.props.error,
            open: this.props.open,
            loading: this.props.loading
        }
    }
    componentWillMount() {
        this.FormRender = new FormRender(this.props.form.getFieldDecorator);
    }
    componentDidMount() {
        if (this.props.fields) {
            this.props.form.setFieldsValue(this.props.fields);
        }
    }
    componentWillUnmount() {
        this.props.form.resetFields();
    }
    componentWillReceiveProps(nextProps) {

    }
    onSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }
    renderFields() {
        const fieldsToReturn = [];
        if (this.props.schema) {
            this.props.schema.forEach((row_components, i) => {
                const rows = [];
                row_components.forEach((field_input, j) => {
                    if (field_input.type === 'String') {
                        rows.push(this.FormRender.renderStringField(field_input));
                    }
                    if (field_input.type === 'Number') {
                        rows.push(this.FormRender.renderNumberField(field_input));
                    }
                    if (field_input.type === 'Number_Money') {
                        rows.push(this.FormRender.renderNumberMoneyField(field_input));
                    }
                    if (field_input.type === 'Dropdown') {
                        rows.push(this.FormRender.renderDropdown(field_input));
                    }
                    if (field_input.type === 'Date') {
                        rows.push(this.FormRender.renderDate(field_input));
                    }
                    if (field_input.type === 'TextArea') {
                        rows.push(this.FormRender.renderTextAreaField(field_input));
                    }
                });
                fieldsToReturn.push(
                    <div 
                        style={styles.rowFormContainer}
                        key={`rowForm_${i}`}
                    >
                        {rows}
                    </div>
                );
            });
        } else {
            fieldsToReturn.push(<div>No schema</div>);
        }
        return fieldsToReturn;
    }
    render() {
        const Fields = this.renderFields();
        let alert=<div></div>;
		if (this.state.error) {
            alert = (
                <Alert
                    style={styles.alertContainer}
                    message={'Error'} 
                    description={this.state.error} 
                    type="error" 
                    banner={true}
                    showIcon={true}
                    closable={true}
                    onClose={()=>{this.props.dismissError()}}
                />
            )
        }
        return (
            <Fragment>
                <Modal
                    width="60%"
                    style={styles.modalContainer}
                    visible={this.state.open}
                    title={this.props.title}
                    onCancel={this.props.onClose}
                    keyboard={true}
                    footer={[
                        <Button 
                            key="cancel"
                            onClick={this.props.onClose}
                        >
                            Cancelar
                        </Button>,
                        <Button 
                            key="submit" 
                            type="primary" 
                            loading={this.state.loading}
                            onClick={this.onSubmit}
                        >
                            Agregar
                        </Button>,
                    ]}
                    >
                    <Fragment>
                        {alert}
                        <Form
                            width="100%"
                            style={styles.modalFormContainer}
                        >
                            {Fields}
                        </Form>
                    </Fragment>
                </Modal>
            </Fragment>
        );
    }
}

// wrap a HOC to handle the inject of the fields?
export default Form.create({})(FormGeneratorChild);