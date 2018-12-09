import React, { Component, Fragment } from 'react';
import styles from './Styles';
import moment from 'moment';
import PropTypes from 'prop-types';
import { 
	Layout, 
	Menu, 
	Icon, 
	Divider, 
	Avatar,
	Dropdown,
	Button
} from 'antd';
import Menus from './Menu';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: true,
			selectedMenu: '0',
		};
	}

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	}
	onSelectMenu = (index) => {
		this.setState({ selectedMenu: index });
	}

	handleMenuClick = (e) => {
		if (e.key === "logout") {
			localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE);
			localStorage.removeItem('user');
			localStorage.removeItem('userToken');
			this.props.history.push('/login');
		}
	}

	getSelectedMenu = () => {
		const MenuCategories = Menus;
		if (this.state.selectedMenu) {
			let indices = this.state.selectedMenu.split('.');
			if (MenuCategories[indices[0]].sub_menus) {
				if (MenuCategories[indices[0]].sub_menus.length > 0) {
					return MenuCategories[indices[0]].sub_menus[indices[1]];
				}
			}
			return MenuCategories[indices[0]];
		}
		return 'StandortPark';
	}

	render() {
		const MenuCategories = Menus;
		let selectedMenu = this.getSelectedMenu();
		const menu = (
			<Menu onClick={this.handleMenuClick}>
				<Menu.Item key="logout"><Icon type="logout" />Cerrar Sesión</Menu.Item>
			</Menu>
		);

		let sessionInfo = <div></div>;
		if (!this.state.collapsed) {
			sessionInfo = (
				<Fragment>
					<Divider style={styles.divider}>Sesión</Divider>
				</Fragment>
			);
		}

		let menuCat = MenuCategories.map((m, k) => {
			if (!m.sub_menus) {
				return (
					<Menu.Item 
						key={k}
						onClick={() => {this.onSelectMenu(k.toString())}}
					>
						<Icon type={m.icon} />
						<span>{m.name}</span>
					</Menu.Item>
				);
			} else {
				let submenus = m.sub_menus.map((sm, ik) => (
					<Menu.Item
						key={k + '.' + ik}
						onClick={() => {this.onSelectMenu(k + '.' + ik)}}
					>
						<Icon type={sm.icon} />
						<span>{sm.name}</span>
					</Menu.Item>
				));
				return (
					<SubMenu
						key={k}
						title={<span><Icon type={m.icon} /><span>{m.name}</span></span>}
					>
						{submenus}
					</SubMenu>
				);
			}
		});
		let contentStyle = styles.content;
		if (selectedMenu.name === 'Ordenar') {
			contentStyle = styles.content_map;
		}
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Sider
					collapsible
					collapsed={this.state.collapsed}
					onCollapse={this.onCollapse}
				>
					<img
						src={process.env.REACT_APP_CDN + '/images/MainLogo.png'}
						style={styles.mainLogo}
						alt="enterpriseImage"
					/>
					<Divider style={styles.divider}>Menu</Divider>
					<Menu theme="dark" defaultSelectedKeys={['0']} mode="inline">
						{menuCat}
						<Menu.Item 
							key={10}
							onClick={() => {
								localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE);
								localStorage.removeItem('user');
								localStorage.removeItem('userToken');
								this.props.history.push('/login');
							}}
						>
							<Icon type={'logout'} />
							<span>Cerrar Sesión</span>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Header 
						style={styles.header}
					>
						{selectedMenu.name}
						<Dropdown 
							overlay={menu}
							placement="bottomRight"
						>
							<Avatar 
								style={styles.avatar}
								icon="user"
								size="large"
							/>
						</Dropdown>
					</Header>
					<Content style={contentStyle}>
						<selectedMenu.component {...this.props} />
					</Content>

				</Layout>
			</Layout>
		);
	}
}

export default Home;
