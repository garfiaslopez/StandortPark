import React, { Component, Fragment } from 'react';
import toPairs from 'lodash/toPairs';
import {
    Form,
    Icon,
    Modal,
    Button,
    Alert,
    Table,
    Tabs,
    Popconfirm
} from 'antd';
import styles from './Styles';
import FormGeneratorChild from './FormGeneratorChild';
import FormRender from './FormRender';

class FormGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: this.props.error,
            open: this.props.open,
            loading: this.props.loading,
            sub_form: {
                open: false,
                schema: [],
                title: null,
                state_id: null
            },
            sub_form_data: {}
        }
    }
    componentWillMount() {
        this.FormRender = new FormRender(this.props.form);
    }

    componentDidMount() {
        if (this.props.fields) {
            this.props.form.setFieldsValue(this.props.fields);
            // check nested objects:
            let data = {};
            this.props.schema.forEach((row) => {
                row.forEach((el) => {
                    if (el.type == 'Nested_Object') {
                        data[el.id] = this.props.fields[el.id];
                    }
                    if (el.type == 'Tab_Component') {
                        el.fields.forEach((row_nested) => {
                            row_nested.forEach((el_nested) => {
                                if (el_nested.type == 'Nested_Object') {
                                    data[el_nested.id] = this.props.fields[el_nested.id];
                                }
                            });
                        });
                    }
                });
            });
            this.setState({sub_form_data: data});
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
                if (this.state.sub_form_data) {
                    this.props.onSubmit({
                        ...values,
                        ...this.state.sub_form_data
                    });
                } else {
                    this.props.onSubmit(values);
                }
                
            }
        });
    }
    renderNestedObject(field_input) {
        const key = field_input.id;
        let data_table = [];
        const columns_table = [];
        field_input.schema.forEach((row) => {
            row.forEach((el) => {
                columns_table.push({
                    dataIndex: el.id,
                    title: el.placeholder
                });
            });
        });
        columns_table.push({
            title: 'Acciones',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Popconfirm 
                        title="¿Esta seguro de eliminar?" 
                        okText="Eliminar"
                        cancelText="Cancelar"
                        onConfirm={() => {
                            let newState = {};
                            let newValues = this.state.sub_form_data[key];
                            newValues.splice(record.key,1);
                            newState[key] = newValues;
                            this.setState(newState);
                        }}
                    >
                        <a>Eliminar</a>
                      </Popconfirm>
                </span>
            ),
        });
        if (this.state.sub_form_data[key]) {
            data_table = this.state.sub_form_data[key].map((el, index) => ({
                key: index,
                ...el
            }));
        }
        return(
            <div
                key={'fragment_' + field_input.id}
                style={styles.nestedObjectContainer}
            >
                <Button
                    key={'add_' + field_input.id}
                    type="primary" 
                    size="default"
                    onClick={() => {
                        this.setState({
                            sub_form: {
                                open: true,
                                schema: field_input.schema,
                                title: field_input.placeholder,
                                state_id: key
                            }
                        });
                    }}
                >
                    <Icon type="plus-circle-o" />
                    Agregar {field_input.placeholder}
                </Button>
                <Table
                    style={styles.nestedObjectTable}
                    columns={columns_table} 
                    dataSource={data_table} 
                    size="small" 
                    pagination={false}
                />
            </div>
        );
    }

    renderTabObject(field_input) {
        const tabs = [];
        field_input.fields.forEach((field, index) => {
            tabs.push(
                <Tabs.TabPane tab={field[0].placeholder} key={index}>
                    {this.renderNestedObject(field[0])}
                </Tabs.TabPane>
            )
        });
        return(
            <Tabs defaultActiveKey="0">
                {tabs}
            </Tabs>
        );
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
                    if (field_input.type === 'Color_Picker') {
                        rows.push(this.FormRender.renderColorPicker(field_input));
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
                    if (field_input.type === 'Nested_Object') {
                        rows.push(this.renderNestedObject(field_input));
                    }
                    if (field_input.type === 'Tab_Component') {
                        rows.push(this.renderTabObject(field_input));
                    }
                    // if (field_input.type === 'Dropdown_DataDB') {
                    //     rows.push(this.FormRender.renderDropdownDataDB(field_input));
                    // }
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

        // SUBFORM SETUP:
        let subForm = <div></div>;
        if (this.state.sub_form.open) {
            subForm = (
                <FormGeneratorChild
                    key={this.state.sub_form.state_id}
                    title={this.state.sub_form.title}
                    open={true}
                    onClose={ () => {
                        this.setState({
                            sub_form: {
                                open: false,
                                schema: [],
                                title: null,
                                state_id: null
                            }
                        });
                    }}
                    onSubmit={ (values) => {
                        let newState = {
                            sub_form: {
                                open: false,
                                schema: [],
                                title: null,
                                state_id: null
                            },
                            sub_form_data: {}
                        };
                        let newValues = Object.assign({}, this.state.sub_form_data);
                        if (newValues[this.state.sub_form.state_id]) {
                            newValues[this.state.sub_form.state_id].push(values);
                        } else {
                            newValues[this.state.sub_form.state_id] = [];
                            newValues[this.state.sub_form.state_id].push(values);
                        }
                        newState.sub_form_data = newValues;
                        this.setState(newState);
                    }}
                    schema={this.state.sub_form.schema}
                />
            );
        }
        return (
            <Fragment>
                {subForm}
                <Modal
                    width="80%"
                    bodyStyle={styles.modalContainer}
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
                            Guardar
                        </Button>,
                    ]}
                    >
                    <Fragment
                        style={styles.modalContainer}
                    >
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
export default Form.create({})(FormGenerator);