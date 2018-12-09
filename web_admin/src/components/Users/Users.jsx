import React, { Component, Fragment } from 'react';
import CrudLayout from '../CrudLayout/CrudLayout';
import UsersSchema from './UsersSchema';

import { 
    Divider,
    Popconfirm
} from 'antd';

class Users extends CrudLayout {
    constructor(props) {
        super(props);
        console.log('On User Props');
        console.log(props);
        this.model = {
			name: 'user',
			singular: 'user',
			plural: 'users',
			label: 'Personal'
		};
		this.schema = UsersSchema;
		this.additional_submit_data = {
			account_id: this.props.session.user.account_id
		}
        this.table_columns = [
			{
            	title: 'Nombre de Usuario',
            	dataIndex: 'username',
            	key: 'username'
			}, 
			{
            	title: 'Password',
            	dataIndex: 'password',
            	key: 'password'
			}, 
			{
            	title: 'Placas',
            	dataIndex: 'plates',
            	key: 'plates'
			},
			{
            	title: 'Nombre',
            	dataIndex: 'name',
            	key: 'name'
			},
			{
            	title: 'Telefono',
            	dataIndex: 'phone_number',
            	key: 'phone_number'
			},
			{
            	title: 'Email',
            	dataIndex: 'email',
            	key: 'email'
			},
			{
            	title: 'Acciones',
            	key: 'action',
            	render: (text, record) => (
					<span>
						<a href="javascript:;" onClick={()=> this.onEdit(record)}>Editar</a>
						<Divider type="vertical" />
						<Popconfirm 
							title="¿Esta seguro de eliminar?" 
							okText="Eliminar"
							cancelText="Cancelar"
							onConfirm={() => this.onDelete(record)}
						>
                			<a>Eliminar</a>
              			</Popconfirm>
					</span>
            	),
		  	}
		];
    }

    onSubmitted(saved) {
        console.log('on submitted form');
        console.log(saved);
    }
}

export default Users;