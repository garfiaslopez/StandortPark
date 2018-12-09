import React, { Fragment } from 'react'
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {

    constructor(props) {
        super(props);
        console.log("constructor");
        console.log(props);
        this.state = {
            displayColorPicker: false,
            color_hex: props.value
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
        console.log(nextProps);
        if (nextProps.value) {
            this.setState({
                color_hex: nextProps.value
            });
        }
    }
    
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.props.onClose(this.state.color_hex);
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color) => {
        this.setState({ 
            color_hex: color.hex
        });
    };

    render() {
        const styles = {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: this.state.color_hex,
            },
            swatch: {
                marginTop: '15px',
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '10',
                left: '-5%'
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '-50px',
            }
        };

        return (
            <div>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color } />
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker 
                        color={ this.state.color_hex } 
                        onChange={ this.handleChange } 
                    />
                </div> : null }
            </div>
        );
    }
}

export default ColorPicker;