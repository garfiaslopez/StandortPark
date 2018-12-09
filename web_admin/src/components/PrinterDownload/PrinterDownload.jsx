import React, { Component, Fragment } from 'react';
import { FetchXHR } from '../../helpers/generals';
import ReactToPrint from 'react-to-print';
import ReactPDF from '@react-pdf/renderer';

import styles from './Styles';

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

// for local data use PROPS:
// for alldata use STATE:

class PrinterDownload extends Component {
    constructor(props) {
        super(props);
        console.log("ON PRINTER DOWNLOAD");
        console.log(props);

        this.state = {
            'mode': 'filtered', // 'alldata'
            'loading': false
        };

        this.onClickDownload = this.onClickDownload.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    // GET DATA
	getData() {
		this.setState({
			loading_data: true,
		});
		const url = process.env.REACT_APP_API_URL + '/' + this.props.model.plural;
        const POSTDATA = {
            limit: 10000,
			page: 1
        }
        if (this.props.aditionalPostData) {
			Object.keys(this.props.aditionalPostData).forEach(({key, value}) => {
				POSTDATA[key] = value;
			});
        }
        FetchXHR(url, 'POST', POSTDATA).then((response) => {
            if (response.json.success) {
                this.setState({
					table_data: response.json.data.docs.map((el, index)=>({
						...el,
						key: index
					})),
					total_docs: response.json.data.total,
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

    onClickDownload() {
        // const styles = StyleSheet.create({
        //     page: {
        //         flexDirection: 'row',
        //         backgroundColor: '#E4E4E4'
        //     },
        //     section: {
        //         margin: 10,
        //         padding: 10,
        //         flexGrow: 1
        //     }
        // });
        // const MyDocument = () => (
        //     <Document>
        //         <Page size="A4" style={styles.page}>
        //             <View style={styles.section}>
        //                 <this.tableToPrint />
        //             </View>
        //         </Page>
        //     </Document>
        // );

        ReactPDF.render(<this.tableToPrint />, `${__dirname}/example.pdf`);
    }

    onClickPrint() {

    }

    render() {
        let alert = <div></div>;
        return (
            <Fragment>
                <Modal
                    width="80%"
                    style={styles.modalContainer}
                    visible={true}
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
                            key="download" 
                            type="primary" 
                            loading={this.state.loading}
                            onClick={this.onClickDownload}
                        >
                            Descargar
                        </Button>,
                        <ReactToPrint
                            trigger={() => (
                                <Button 
                                    key="printer" 
                                    type="primary" 
                                    loading={this.state.loading}
                                    onClick={this.onClickPrint}
                                > 
                                    Imprimir
                                </Button>
                            )}
                            content={() => this.tableToPrint}
                        />
                    ]}
                    >
                    <Fragment>
                        {alert}
                        <div style={styles.overflow_container}>
                            <div 
                                style={styles.table_container}
                                ref={el => (this.tableToPrint = el)}
                            >
                                <Table
                                    size="small"
                                    width="210mm"
                                    bodyStyle={styles.table_layout}
                                    style={styles.table_layout}
                                    columns={this.props.table_columns}
                                    dataSource={this.state.table_data}
                                    loading={this.state.loading_data}
                                    pagination={false}
                                    locale={{
                                        filterTitle: 'Filtro',
                                        filterConfirm: 'Ok',
                                        filterReset: 'Reset',
                                        emptyText: 'Sin Datos'
                                    }}
                                />
                            </div>
                        </div>
                    </Fragment>
                </Modal>
            </Fragment>
        );
    }
}

export default PrinterDownload;