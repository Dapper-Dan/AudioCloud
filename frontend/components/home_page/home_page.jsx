import React from 'react';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import Carousel from 'react-bootstrap/Carousel';
import SongIndexContainer from '../song/song_index_container';
import SearchBarContainer from '../search_bar/search_bar_container';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginForm: false,
      registerForm: false,
      showModal: false
    }

    this.loginModelShow = this.loginModelShow.bind(this);
    this.registerModelShow = this.registerModelShow.bind(this);
    this.changeShow = this.changeShow.bind(this);
  }
    

  loginModelShow() {
    this.setState({
      loginForm : true,
      showModal: true                   
    });
  }


  registerModelShow() {
    this.setState( {
      registerForm : true,
      showModal: true                   
    });
  }


  changeShow() {
    this.setState({
      loginForm: false,
      registerForm: false,
      showModal: false
    });
  }

  render() {
    if (this.state.showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    let showModal = (
    <div className="modal-background">
      <div className="signModal">
        {this.state.loginForm ?  <LoginFormContainer changeShow={this.changeShow}/> : ''}
        {this.state.registerForm ?  <SignupFormContainer changeShow={this.changeShow}/> : ''}
      </div>
    </div>
    );

    let noModal = "";
    let sessionModal;
    this.state.showModal ? (sessionModal = showModal) : (sessionModal = noModal);

    return (
      <>
      <div className="outtermost mainLanding">
        {sessionModal}
        <div className="frontHero">
          <div className="transLogo">
            <img src={window.transLogo} width="105px" className="transWhite"/>
          </div>
          <div className="caro-container">  
            <Carousel interval="4000" controls={false} className="caroMain">
              <Carousel.Item>
                <img className="landing-slide" src={window.landing1} alt="First slide"/>
              </Carousel.Item>
              <Carousel.Item id="gitHub">
                <img className="landing-slide" src={window.landing2} alt="Third slide"/>
                <a className="signup-modal-button" id="gitHubLink" href={"https://github.com/Dapper-Dan/AudioCloud"}>GitHub</a>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="buttonsDiv" >
            <button className="login-modal-button" onClick={this.loginModelShow}>Sign in</button>
            <button className="signup-modal-button" onClick={this.registerModelShow}>Create account</button>
          </div>
        </div>
        <div className="mainSearch flex-column flex-md-row">
          <SearchBarContainer/>
          <p>or</p>
          <button className="homePageUploadButton" onClick={this.registerModelShow}>UPLOAD YOUR OWN TRACK</button>
        </div>
        <SongIndexContainer/>
        <div className="outtermost" id="break">
          <p>Happy to announce that we are now mobile and tablet friendly!</p>
          <img src={window.mobile}></img>
        </div>
        <div className="homePageThanks">
          <img id="micro" src={window.microphone}></img>
          <button className="signup-modal-button" onClick={this.registerModelShow}>Create account</button>
        </div>
        <div className="homePageFooter">
          <div id="links">
            <a href={"https://github.com/Dapper-Dan/AudioCloud"}>GitHub</a>
            <a href={"https://www.linkedin.com/in/daniel-r-lancaster/"}>LinkedIn</a>
          </div>
          Created by Daniel Lancaster
        </div>
      </div>    
      </>
    ); 
  }
}

export default HomePage;
