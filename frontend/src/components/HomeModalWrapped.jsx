import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {

};


function getModalStyle() {
    const top = 50;
    const left = 50;

    const width = 1200;
    const height = 640;

    return {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        marginLeft: width / -2,
        marginTop: height / -2,
        width: width,
        height: height,
        background: '#fff',
        padding: 20,
        //transform: `translate(-${top}%, -${left}%)`,
    };
}

class HomeModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: 'a13r98has2r'
        };
    }

    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { onClose, classes, ...other } = this.props;

        return (
            <Modal onClose={this.handleClose} {...other}>
                <div style={getModalStyle()}>
                    Some graphs and numbers
                </div>
            </Modal>
        );
    }
}

HomeModal.propTypes = {
    onClose: PropTypes.func,
};

const HomeModalWrapped = withStyles(styles)(HomeModal);

export default HomeModalWrapped;
