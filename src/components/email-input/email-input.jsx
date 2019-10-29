import React, { Component } from "react";
import "./email-input.css";

class EmailInput extends Component {
  state = { invalidEmail: false };

  validateEmail(email) {
    const re = /^\S+@\S+$/;
    return re.test(email);
  }

  handleOnChange = event => {
    const email = event.target.value;
    this.props.onChange(this.props.index, email);

    if (!email.length) {
      this.setState({ invalidEmail: false });
      return;
    }
    if (!this.validateEmail(email)) {
      this.setState({ invalidEmail: true });
      return;
    }

    this.setState({ invalidEmail: false });
  };

  render() {
    return (
      <div className="mb-4">
        <input
          className="form-control"
          onChange={this.handleOnChange}
          data-index={this.props.index}
          type="email"
          value={this.props.value}
        />
        {this.state.invalidEmail ? (
          <p className="validation-error">Invalid email</p>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default EmailInput;
