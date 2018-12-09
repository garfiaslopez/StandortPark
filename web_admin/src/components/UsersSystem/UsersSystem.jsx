import React, { Component, Fragment } from 'react';
import CrudLayout from '../CrudLayout/CrudLayout';
import UsersSystemSchema from './UsersSystemSchema';

import { 
    Divider,
    Popconfirm
} from 'antd';

class UsersSystem extends CrudLayout {
    constructor(props) {
        super(props);
        console.log('On User Props');
        console.log(props);
        this.model = {
			name: 'usersystem',
			singular: 'usersystem',
			plural: 'usersystems',
			label: 'Usuario de sistema'
		};
		this.schema = UsersSystemSchema;

        this.table_columns = [
			{
            	title: 'Nombre De Usuario',
            	dataIndex: 'username',
            	key: 'username'
			}, 
			{
            	title: 'Contraseña',
            	dataIndex: 'password',
            	key: 'password'
			},
			{
            	title: 'Nombre',
            	dataIndex: 'name',
            	key: 'name'
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

export default UsersSystem;