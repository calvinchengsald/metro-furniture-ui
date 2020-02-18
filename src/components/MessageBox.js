import React, { Component } from 'react'
import { closeMessageAction  } from '../actions/messageActions';
import {connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class MessageBox extends Component {





    render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={this.props.closeMessageAction}>
                    <Modal.Header closeButton  >
                    <Modal.Title>{this.props.message_type}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.message}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.closeMessageAction}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
                
            </div>
        )
    }
}


MessageBox.propTypes = {
    closeMessageAction: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    show: state.messageReducer.show,
    message: state.messageReducer.message,
    message_type: state.messageReducer.message_type,
    onHide: closeMessageAction
});

export default connect(mapStateToProps, {closeMessageAction})(MessageBox);


