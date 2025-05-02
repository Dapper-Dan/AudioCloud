import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink, Redirect} from 'react-router-dom';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1, 
      email: "",
      password: "",
      display_name: "",
      age: "",
      gender: "",
      cover_photo: "",
      profile_photo: "",
      location: "",
    };
    
    this.handleSignup = this.handleSignup.bind(this);
    this.update = this.update.bind(this);
    this._next = this._next.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.loginDemoUser = this.loginDemoUser.bind(this);
  }
    
  handleSignup(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user[email]', this.state.email);
    formData.append('user[password]', this.state.password);
    formData.append('user[display_name]', this.state.display_name);
    formData.append('user[age]', this.state.age);
    formData.append('user[gender]', this.state.gender);
    this.props.signup(formData)
    setTimeout(() => {
      if (this.props.currentUser) this.props.changeShow()
    }, 300)
  }

  loginDemoUser() {
    this.props.login({email: "d@aol.com", password: "Dude1990!"});
  }

  handleLogin(e) {
    e.preventDefault();
    const {email, password} = this.state;
    this.props.login({email, password});
    setTimeout(() => {
      if (this.props.currentUser) this.props.changeShow()
    }, 300)

    if (this.state.step !== 3) this._next()
  }

  update(value) {
    return e => this.setState({ [value]: e.target.value });
  }
  
  _next(e) {
    if (e.currentTarget.id === "passwordSignup" && this.state.password.length < 6) return alert("Password must be at least 6 characters.");
    const { step } = this.state
    this.setState({
      step : step + 1
    })
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(event.target)) {
      this.props.changeShow()
    }
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.id === "lastPageLogin") {
        this.handleLogin(event)
      } else if (event.target.id === "lastPageSignUp") {
        this.handleSignup(event)
      } else {
        this._next()
      }
    }
  }

  render() {
    const {step} = this.state;
    const {email, password, display_name, age, gender } = this.state;
    const values = {email, password, display_name, age, gender};

    if (this.props.formType === "signup") {
      switch(step) {
        case 1: 
        return (
          <div className="signup-form-group">
            <p id="emailInput">Please enter your email address to sign up</p>
            <input
              className="signup-email-input" 
              placeholder="Your email address"
              type="text"
              onKeyDown={this.onKeyDown}
              onChange={this.update('email')}
              value={values.email}   
            />
            <button className="signup-form-button" type="button" onClick={ this._next }> Continue </button>
            <p id="or">or</p>
            <button className="demo-login-button" onClick={this.loginDemoUser}>Demo Login</button>
            <p id="thanks">Thanks for using my site! The information you provide will not be used for anything! There will be no ads, no email notifications, and no nonsense. </p>
          </div> 
        );
        case 2: 
        return (
          <div className="signup-form-group">
            <h1 id="createYourAccountHeader">Create your AudioCloud account</h1>
            <p id="signup-password">Choose a password</p>
            <form id="signup-password-form">
              <input
                className="signup-password-input"
                autoComplete="password"
                type="password"
                value={values.password}
                onKeyDown={this.onKeyDown}
                onChange={this.update('password')}
                placeholder="Your password"
              />
            </form>
            <p id="accept-cookies"> By signing up I accept the Terms of Use. I have read and understood the Privacy Policy and Cookies Policy.</p>
            <button id="passwordSignup" className="signup-form-button" type="button" onClick={ this._next }> Accept & continue </button>
          </div>
        );
        case 3: 
        return (
          <div className="signup-form-group">
            <h1 id="createYourAccountHeader">Create your AudioCloud account</h1>
            <p id="signup-age">Tell us your age</p>
            <input
              className="signup-age-input"
              type="number"
              value={values.age}
              onKeyDown={this.onKeyDown}
              onChange={this.update('age')}
            />
            <p id="signup-gender">Gender</p>
            <select className="signup-gender-select" onChange={ this.update('gender') } defaultValue='' >
              <option disabled value="">Indicate your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
            <button className="signup-form-button" type="button" onClick={ this._next }> Continue </button>
          </div>
        );
        case 4: 
        return (
          <div className="signup-form-group">
            <h1 id="tellUsAboutYourselfHeader">Tell us a bit about yourself</h1>
            <p id="signup-displayName">Choose your display name</p>
            <input
              id="lastPageSignUp"
              className="signup-displayName-input"
              type="text"
              onKeyDown={this.onKeyDown}
              value={values.display_name}
              onChange={this.update('display_name')}
            />
            <p id="signup-display"> Your display name can be anything you like. Your name or artist name are good choices.</p>
            <NavLink id="signup-navLink" to="/discover">
              <button className="signup-form-button" onClick={ this.handleSignup }> Get started </button>
            </NavLink>
            {this.props.currentUser ? <Redirect to="/discover" /> : ""}
          </div>
        );
      }
    } else if (this.props.formType === "login") {
      switch(step) {
        case 1: 
        return (
          <div className="signup-form-group">
            <p id="login-email">Please enter your email to login</p>
            <input
              className="signup-email-input" 
              placeholder="Your email address"
              type="text"
              onKeyDown={this.onKeyDown}
              onChange={this.update('email')}
              value={values.email}   
            />
            <button className="signup-form-button" onClick={ this._next }> Continue </button>
            <p id="or">or</p>
            <button className="demo-login-button" onClick={this.loginDemoUser}>Demo Login</button>
            <p id="thanks">Thanks for using my site! The information you provide will not be used for anything! There will be no ads, no email notifications, and no nonsense. </p>
          </div>
        );
        case 2:
        return (
          <div className="signup-form-group">
            <p id="login-password">Please enter your password</p>
            <form id="login-password-form">
              <input
                id="lastPageLogin"
                className="signup-password-input"
                autoComplete="password"
                type="password"
                onKeyDown={this.onKeyDown}
                value={values.password}
                onChange={this.update('password')} 
                placeholder="Your password"
              />
            </form>
            <button className="signup-form-button" onClick={ this.handleLogin }> Sign in </button>
          </div>
        );
        case 3:
        if (this.props.currentUser) {
          return ( <Redirect to="/discover"/> )
        } else {
          return (
            <div className="signup-form-group">
              <p id="login-password">Please enter your password</p>
              <form id="login-password-form">
                <input
                  id="lastPageLogin"
                  className="signup-password-input"
                  autoComplete="password"
                  type="password"
                  onKeyDown={this.onKeyDown}
                  value={values.password}
                  onChange={this.update('password')} 
                  placeholder="Your password"
                />
              </form>
              <p>{this.props.errors[0]}</p>
              <button type="submit" className="signup-form-button" onClick={ this.handleLogin }> Sign in </button>
            </div>
          );
        }
      }
    }
  }
}

export default SignupForm;