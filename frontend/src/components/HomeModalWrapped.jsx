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
        padding: '30px 60px',
        backgroundColor: '#04394C',
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
                <div style={getModalStyle()} className="home">
                    <img src="img/logo_big.svg" style={{float: 'left', marginRight: 30, marginTop: 30}} width={500} />
                    <div>
                        <h1>Journee</h1>
                        <h2>Trust in timber</h2>
                        <h3><span className="blue">$227B</span> GLOBAL TIMBER<br /><span className="blue">$30B</span> ILLEGAL</h3>
                        <h3><span className="blue">TIMBER</span> IS ONE OF THE MOST<br /><span className="pink">SUSTAINABLE BUILDING</span> MATERIALS</h3>
                        <h3><span className="pink">AUSTRALIA</span>, EU, <span className="blue">USA</span> & CANADA REQUIRE VERIFICATION</h3>
                        <h3><span className="pink">DNA TIMBER <strong>VERIFIED</strong></span> ON <span className="blue">EOS</span> BLOCKCHAIN TO IMPROVE<br />ON CERTIFICATIONS LIKE DOUBLEHELIX AND <span className="blue">FSC</span></h3>
                    </div>
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
