import React, { Component, Fragment } from 'react';
import CrudLayout from '../CrudLayout/CrudLayout';
import OrdersSchema from './OrdersSchema';

import {
    Divider,
	Popconfirm
} from 'antd';

class Orders extends CrudLayout {
    constructor(props) {
		super(props);
		this.schema = OrdersSchema;
		this.state = { // render vars:
			filters_layout: ['search','date_range']
		};
        this.model = {
			name: 'order',
			singular: 'order',
			plural: 'orders',
			label: 'Ordenes'
		};
        this.table_columns = [
			{
            	title: 'Fecha',
            	dataIndex: 'date_in',
				key: 'date_in',
				sorter: true
			}, 
			{
            	title: 'Vehiculo',
            	dataIndex: 'vehicle',
            	key: 'vehicle'
			},
			{
            	title: 'Placas',
            	dataIndex: 'plates',
            	key: 'plates'
			},
			{
            	title: 'Tiempo',
            	dataIndex: 'minutes_payed',
            	key: 'minutes_payed'
			},
			{
            	title: 'Total',
            	dataIndex: 'total',
            	key: 'total'
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

export default Orders;