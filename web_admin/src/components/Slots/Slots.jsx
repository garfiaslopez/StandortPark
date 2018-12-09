import React, { Component, Fragment } from 'react';
import CrudLayout from '../CrudLayout/CrudLayout';
import SlotsSchema from './SlotsSchema';

import { 
    Divider,
	Popconfirm
} from 'antd';

class Slots extends CrudLayout {
    constructor(props) {
		super(props);
		this.schema = SlotsSchema;
		this.state = { // render vars:
			filters_layout: ['search']
		};
        this.model = {
			name: 'slot',
			singular: 'slot',
			plural: 'slots',
			label: 'Cajones'
		};
        this.table_columns = [
			{
            	title: 'Identificador',
            	dataIndex: '_id',
				key: '_id'
			},
			{
            	title: 'Denominacion',
            	dataIndex: 'denomination',
				key: 'denomination',
				sorter: true
			},
			{
            	title: 'Dirección',
            	dataIndex: 'address',
				key: 'address',
				sorter: true
			},
			{
            	title: 'Estado',
            	dataIndex: 'status',
				key: 'status',
				sorter: true
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
}

export default Slots;