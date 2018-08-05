import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import QrReader from 'react-qr-reader'

const styles = {

};


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        marginLeft: -150,
        marginTop: -150,
        width: 300,
        height: 300,
        background: '#fff',
        //transform: `translate(-${top}%, -${left}%)`,
    };
}

class QrModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {};

        this.handleScan = this.handleScan.bind(this)
    }

    handleClose = () => {
        this.props.onClose(null);
    };

    handleScan(data){
        if (data) {
            this.props.onClose('a13r98has2r');
            //this.props.onClose(data);
            //this.setState({
            //    result: data,
            //})
        }
    }

    handleError(err){
        console.error(err)
    }

    render() {
        const { onClose, classes, ...other } = this.props;

        return (
            <Modal onClose={this.handleClose} {...other}>
                <div style={getModalStyle()}>
                    <QrReader
                        delay={300}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{ width: '100%' }}
                    />
                </div>
            </Modal>
        );
    }
}

QrModal.propTypes = {
    onClose: PropTypes.func,
};

const QrModalWrapped = withStyles(styles)(QrModal);

export default QrModalWrapped;
