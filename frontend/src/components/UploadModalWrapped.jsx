import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import QrReader from 'react-qr-reader'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {

};


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        marginLeft: -300,
        marginTop: -150,
        width: 600,
        height: 300,
        background: '#fff',
        padding: 20,
        //transform: `translate(-${top}%, -${left}%)`,
    };
}

class UploadModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: 'a13r98has2r'
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleClose = () => {
        this.props.onClose(null);
    };

    handleUpload(event){
        event.preventDefault();

        if (event.target.dna) {
            this.props.onClose(event.target.dna.value);
        }
    }

    handleError(err){
        console.error(err)
    }

    render() {
        const { onClose, classes, ...other } = this.props;

        return (
            <Modal onClose={this.handleClose} {...other}>
                <form onSubmit={this.handleUpload} style={getModalStyle()}>
                    <TextField
                        multiline={true}
                        style={{color:'black', height:230}}
                        name="dna"
                        autoComplete="off"
                        label="DNA"
                        margin="normal"
                        value={this.state.value}
                        onChange={this.handleChange}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.formButton}
                        type="submit">
                        Upload
                    </Button>
                </form>
            </Modal>
        );
    }
}

UploadModal.propTypes = {
    onClose: PropTypes.func,
};

const UploadModalWrapped = withStyles(styles)(UploadModal);

export default UploadModalWrapped;
