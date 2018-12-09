import React from 'react';
import {
    Input,
    Form,
    Icon,
    InputNumber,
    Select,
    DatePicker
} from 'antd';
import ColorPicker from '../../helpers/ColorPicker';
import toPairs from 'lodash/toPairs';
import styles from './Styles';
import locale_es from 'antd/lib/date-picker/locale/es_ES';

const FormItem = Form.Item;

// Reference rules
// https://github.com/yiminghe/async-validator/blob/master/src/messages.js
const rules = {
	required: 'Campo requerido',
	min: 'Ingrese los caracteres minimos para el campo',
	types: {
		email: 'Ingresa un email valido',
		array: 'Ingresa almenos un elemento',
	},
};

const getMessage = (currentRule) => {
    const rulePairs = toPairs(currentRule)[0];
        if (rulePairs[0] === 'type') {
        return Object.assign({}, currentRule, {
            message: rules.types[rulePairs[1]],
        });
    }
    return Object.assign({}, currentRule, {
        message: rules[rulePairs[0]],
    });
};


class FormRender {
    constructor(form) {
        this.getFieldDecorator = form.getFieldDecorator;
        this.setFieldsValue = form.setFieldsValue;
        this.getFieldValue = form.getFieldValue;
    }
    public
    renderStringField(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        const FieldRender = (
            <Input
                prefix={
                    field_input.prefixIcon ? (
                        <Icon
                            type={field_input.prefixIcon}
                            className="field-icon"
                        />
                    ) : ''
                }
                type={field_input.type || 'text'}
                placeholder={field_input.placeholder || ''}
                size="large"
            />
        );
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                {getFieldDecorator(field_input.id, {
                    rules: field_input.rules.map(rule => getMessage(rule)),
                    })(FieldRender)
                }
            </FormItem>
        );
    }

    renderTextAreaField(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        const FieldRender = (
            <Input.TextArea
                prefix={
                    field_input.prefixIcon ? (
                        <Icon
                            type={field_input.prefixIcon}
                            className="field-icon"
                        />
                    ) : ''
                }
                autosize={{ minRows: 2, maxRows: 6 }}
                placeholder={field_input.placeholder || ''}
                size="large"
            />
        );
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                {getFieldDecorator(field_input.id, {
                    rules: field_input.rules.map(rule => getMessage(rule)),
                    })(FieldRender)
                }
            </FormItem>
        );
    }

    renderNumberField(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        const FieldRender = (
            <InputNumber
                size="100%"
                max={field_input.options.max}
                min={field_input.options.min}
                step={field_input.options.step}
            />
        );
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                <div style={styles.inputNumberContainer}>
                    <p style={styles.labelInputNumber}>{field_input.placeholder}</p>
                    {getFieldDecorator(field_input.id, {
                        rules: field_input.rules.map(rule => getMessage(rule)),
                        })(FieldRender)
                    }
                </div>
            </FormItem>
        );
    }

    renderNumberMoneyField(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        const FieldRender = (
            <InputNumber
                size="100%"
                max={field_input.options.max}
                min={field_input.options.min}
                step={field_input.options.step}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
        );
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                <div style={styles.inputNumberContainer}>
                    <p style={styles.labelInputNumber}>{field_input.placeholder}</p>
                    {getFieldDecorator(field_input.id, {
                        rules: field_input.rules.map(rule => getMessage(rule)),
                        })(FieldRender)
                    }
                </div>
            </FormItem>
        );
    }

    renderColorPicker(field_input) {
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                <div style={styles.inputNumberContainer} >
                    <p style={styles.labelInputNumber} >Color </p>
                    <ColorPicker
                        value={this.getFieldValue('color')}
                        onClose={(color) => {
                            this.setFieldsValue({'color': color});
                        }}
                    />
                </div>
            </FormItem>
        );
    }

    renderDropdown(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        const Options = field_input.options.map((item, index) => {
            return (
                <Select.Option
                    value={item}
                    key={`${item} - ${index}`} 
                >
                    {item}
                </Select.Option>
            );
        });
        const FieldRender = (
            <Select
                showSearch
                optionFilterProp="children"
                placeholder={field_input.placeholder || ''}
                size="large"
            >
                {Options}
            </Select>
        );
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                {getFieldDecorator(field_input.id, {
                    rules: field_input.rules.map(rule => getMessage(rule)),
                    })(FieldRender)
                }
            </FormItem>
        );
    }

    renderDropdownDataDB(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        if (this.state[field_input.data]) {
            const Options = this.state[field_input.data].map((obj, index) => {
                return (
                    <Select.Option
                        value={obj[field_input.label]}
                        key={`${obj['key']} - ${index}`} 
                    >
                        {obj[field_input.label]}
                    </Select.Option>
                );
            });
            const FieldRender = (
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={field_input.placeholder || ''}
                    size="large"
                >
                    {Options}
                </Select>
            );
            return (
                <FormItem 
                    key={field_input.id}
                    style={styles.formComponent}
                >
                    {getFieldDecorator(field_input.id, {
                        rules: field_input.rules.map(rule => getMessage(rule)),
                        })(FieldRender)
                    }
                </FormItem>
            );
        }
        return (
            <div>"Cargando Proovedores..."</div>
        );
    }

    renderDate(field_input) {
        const getFieldDecorator = this.getFieldDecorator;
        const FieldRender = (
            <DatePicker 
                size="medium"
                locale={locale_es}
                size="large"
                style={styles.datePickerContainer}
            />
        );
        return (
            <FormItem 
                key={field_input.id}
                style={styles.formComponent}
            >
                {getFieldDecorator(field_input.id, {
                    rules: field_input.rules.map(rule => getMessage(rule)),
                    })(FieldRender)
                }
            </FormItem>
        );
        
    }
}

export default FormRender;