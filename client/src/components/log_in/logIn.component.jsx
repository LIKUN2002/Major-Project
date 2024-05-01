import React from "react";
import styles from "./logIn.module.css";
import axios from "axios";
import ErrorAlert from "./../../ErrorAlert";
import { UserAuth } from "./../../userContext";

class LogIn extends React.Component {
  static contextType = UserAuth;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isWorker: false,
      error: null,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password, isWorker } = this.state;

    if (email && password) {
      const endpoint = isWorker ? "/login/worker" : "/login/customer";

      axios
        .post(endpoint, { email, password })
        .then((res) => {
          const user = res.data.usr;
          const token = res.data.token;
          const userType = isWorker ? "worker" : "customer";
          this.context.login(user._id, user.name, token, userType);
          alert("Successfully signed in");
          this.props.history.push('/best_services');
        })
        .catch((err) => {
          const error = err.response ? err.response.data : "Something went wrong";
          this.setState({ error });
        });
    }
  };

  render() {
    const { isWorker, error } = this.state;
    const { isWorker: isUserWorker, isCustomer: isUserCustomer } = this.context;

    if (isUserWorker || isUserCustomer) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <h1>User Already Logged in</h1>
        </div>
      );
    }

    return (
      <div className={styles.parent_div}>
        <div className={styles.button_div}>
          <button className={styles.google_btn}>SIGN IN WITH GOOGLE</button>{" "}
          or
          <button className={styles.facebook_btn}>SIGN IN WITH FACEBOOK</button>
        </div>

        <div className={styles.form_div}>
          <div className={styles.form_div_inner}>
            {error && <ErrorAlert ErrorMessage={error} />}
            <h2 className={styles.form_h2}>SIGN IN</h2>

            <form onSubmit={this.handleSubmit} className={styles.form_component}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                onChange={this.handleChange}
                value={this.state.email}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.handleChange}
                value={this.state.password}
                required
              />

              <div className="d-flex justify-content-center align-items-center">
                <input
                  style={{ height: "20px", width: "20px" }}
                  type="checkbox"
                  name="isWorker"
                  id="isWorker"
                  checked={isWorker}
                  onChange={() => this.setState({ isWorker: !isWorker })}
                />
                <label htmlFor="isWorker" style={{ color: "white", padding: "10px" }}>
                  Company Worker
                </label>
              </div>

              <button className={styles.signin_btn}>Sign In</button>
            </form>

            <h4 className={styles.form_h4}>
              New User?{" "}
              <a href="#test" className={styles.form_link}>
                Sign Up Here
              </a>
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

export default LogIn;
