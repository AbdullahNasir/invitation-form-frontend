import React, { Component } from "react";
import EmailInput from "../email-input/email-input";
import axios from "axios";

import "./invitation-form.css";

class InvitationForm extends Component {
  invitationTypes = {
    SINGLE: "single",
    BULK: "bulk"
  };
  state = {
    invitationType: this.invitationTypes.SINGLE,
    inputCount: 3,
    emails: ["", "", ""],
    isValidForm: true
  };

  // should be moved to a util file
  validateEmail(email) {
    const re = /^\S+@\S+$/;
    return re.test(email);
  }

  renderForm() {
    if (this.state.invitationType === this.invitationTypes.SINGLE) {
      return this.renderInputFields();
    }
    if (this.state.invitationType === this.invitationTypes.BULK) {
      return this.renderTextArea();
    }
  }

  renderInputFields() {
    return [<h3>Email addresses</h3>].concat(
      [...Array(this.state.inputCount).keys()].map(index => (
        <div className="row">
          <div className="col-11">
            <EmailInput
              onChange={this.handleEmailChange}
              key={index}
              index={index}
              value={this.state.emails[index]}
            ></EmailInput>
          </div>
          <div className="col-1">
            <button
              onClick={() => this.removeInputField(index)}
              type="button"
              className="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      ))
    );
  }

  renderTextArea() {
    return (
      <React.Fragment>
        <h3>Enter multiple email addresses seperated by commas</h3>
        <textarea
          onChange={this.handleBulkEmailChange}
          className="form-control"
          rows="5"
        >
          {this.state.emails.join(",")}
        </textarea>
      </React.Fragment>
    );
  }

  handleBulkEmailChange = event => {
    const emails = event.target.value.split(",");
    this.setState({
      emails
    });
  };

  handleEmailChange = (index, email) => {
    let emails = this.state.emails;
    emails[index] = email;
    this.setState({
      emails
    });
  };

  removeInputField = index => {
    let emails = this.state.emails;
    emails.splice(index, 1);
    this.setState({
      emails,
      inputCount: this.state.inputCount - 1
    });
  };

  addAnotherInputField = event => {
    let emails = this.state.emails;
    emails.push("");
    this.setState({
      inputCount: this.state.inputCount + 1,
      emails
    });
  };

  switchToBulk = event => {
    this.setState({
      invitationType: this.invitationTypes.BULK,
      isValidForm: false,
      emails: []
    });
  };

  switchToSingle = event => {
    this.setState({
      invitationType: this.invitationTypes.SINGLE,
      inputCount: 3,
      emails: ["", "", ""],
      isValidForm: true
    });
  };

  removeEmptyInputFields() {
    let emails = this.state.emails;
    emails = emails.filter(email => email.length > 0);
    this.setState({
      emails: emails,
      inputCount: emails.length
    });
    return emails;
  }

  sendInvites = async event => {
    let emails = this.state.emails;
    if (this.state.invitationType === this.invitationTypes.SINGLE) {
      emails = this.removeEmptyInputFields();
    }

    let message = "";
    try {
      const response = await axios.post(
        `http://localhost:4000/api/invitations/bulk`,
        {
          emails
        }
      );

      message = response.data.data.map(invitationDetail => {
        return `${invitationDetail.email} - ${invitationDetail.reason ||
          "Invitation sent"} \n`;
      });

      this.setState({
        invitationType: this.invitationTypes.SINGLE,
        inputCount: 3,
        emails: ["", "", ""],
        isValidForm: true
      });
    } catch (error) {
      message = error.response.data.message;
    }

    alert(message);
  };

  validateForm = event => {
    const emails = this.state.emails;
    let isValidForm = true;

    for (let i = 0; i < emails.length; i++) {
      if (!emails[i].length) {
        // not invalidating the form because the field might
        // untouched according the to 2nd last point of the
        // acceptance criteria it is possible for a user
        // to submit the form without entering anything in the textbox
        continue;
      }
      if (!this.validateEmail(emails[i])) {
        isValidForm = false;
        break;
      }
    }
    return isValidForm;
  };

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-6 form-container">
            <form>{this.renderForm()}</form>
            <div className="mb-2">
              <a href="#" onClick={this.addAnotherInputField}>
                add another
              </a>{" "}
              or{" "}
              {this.state.invitationType === this.invitationTypes.SINGLE ? (
                <a href="#" onClick={this.switchToBulk}>
                  add many at once
                </a>
              ) : (
                <a href="#" onClick={this.switchToSingle}>
                  add single
                </a>
              )}
            </div>

            <button
              type="button"
              disabled={!this.validateForm()}
              className="btn btn-secondary"
              onClick={this.sendInvites}
            >
              Send Invites
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InvitationForm;
