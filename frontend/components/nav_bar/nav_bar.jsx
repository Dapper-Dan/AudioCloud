import React from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import LoginFormContainer from '../session/login_form_container.jsx';
import SignupFormContainer from '../session/signup_form_container.jsx';
import ReactDOM from 'react-dom';
import SearchBarContainer from '../search_bar/search_bar_container.jsx';



export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginForm: false,
            registerForm: false,
            showModal: false,
            showDropDown: false,
            redirect: false,
            logoutModal: false,
            isMobile: window.innerWidth < 768
        };

        this.loginModelShow = this.loginModelShow.bind(this);
        this.registerModelShow = this.registerModelShow.bind(this);
        this.changeShow = this.changeShow.bind(this);
        this.logout = this.logout.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        if(this.props.state && this.props.state.session.currentUser)  this.props.fetchUser(this.props.state.session.currentUser.id)
        document.addEventListener('click', this.handleClickOutside, true);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        if (this.state.redirect) {
            this.setState({redirect: false})
        }
    }

    changeShow() {
        this.setState({
            loginForm: false,
            registerForm: false,
            showModal: false
        });
    }

    loginModelShow() {
        this.setState( {
            loginForm : true,
            showModal: true                   
        })
    }
    
    registerModelShow() {
        this.setState( {
            registerForm : true,
            showModal: true                   
        })
    }

    logout() {
        this.props.logout()
        .then(() => this.setState({redirect: true}))
    }

    handleDropDown() {
        this.setState({showDropDown: true})
    }

    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.setState({ showDropDown: false })
        }
    }

    handleResize() {
        this.setState({
            isMobile: window.innerWidth < 768
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: "/",
            }}/>
        }

        if (this.state.showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
       
        let signShowModal = (
            <div className="modal-background">
                <div className="signModal">
                    { this.state.loginForm ?  <LoginFormContainer changeShow={this.changeShow} /> : '' }
                    { this.state.registerForm ?  <SignupFormContainer changeShow={this.changeShow} /> : '' }
                </div>
            </div>
        );
        
        let noModal = ""
        let sessionModal
        this.state.showModal ? (sessionModal = signShowModal) : (sessionModal = noModal);
        let user
        let dropDownOptions
        if (this.props.state && this.props.currentUser && this.state.showDropDown) {
            user = this.props.currentUser
            dropDownOptions = (
                <div className="dropDownOptions">
                    <ul id="dropDownOptionsList">
                        <li>
                            <Link to={`/${user.display_name}`} >
                                <img id="profileIcon" src={window.profileIcon}/>Profile
                            </Link>
                        </li>
                        <li>
                            <NavLink to={{
                                pathname: '/library',
                                libraryProps: {showLikes: true, showOverview: false, showTracks: false}
                            }} > <img id="heartIcon" src={window.heart}/> Likes </NavLink>
                            
                        </li>
                        <li>
                            <Link to={{
                                pathname: '/library',
                                libraryProps: {showTracks: true, showOverview: false, showLikes: false}
                            }} > <img id="trackIcon" src={window.trackIcon}/> Tracks </Link>
                        </li>
                            <li id="dropDownEnd">
                                <a onClick={this.logout} ><img id="signoutIcon" src={window.signoutIcon}/> Sign out</a>
                            </li>
                    </ul>
                </div>
            );
        }
        
        switch(this.props.navType) {
            case 'default':
            return (
                <>
                    <div className="nav_bar_background">
                        <div className="nav-con">
                            <div className="nav_bar">
                                {sessionModal}
                                <div className="nav_buttons_container" >
                                    <nav className="left_nav">
                                        <img src={window.greenLogo} width="184px" className="nav-logo d-none d-md-block"/>
                                        <NavLink to="/discover" className="home-button d-md-none" style={{ textDecoration: 'none' }}>   
                                            <img src={window.greenLogoMobile} className='nav-logo' width="184px"/>
                                        </NavLink>
                                        <NavLink to="/discover" className="home-button d-none d-md-block" style={{ textDecoration: 'none' }}>   
                                            Home
                                        </NavLink>
                                        <a className="library-button" onClick={ this.registerModelShow}>Library</a>
                                    </nav>
                                    {!this.state.isMobile && <SearchBarContainer/>}
                                    <nav className="right_nav">
                                        <button className="login-modal-button" onClick={ this.loginModelShow }> Sign in </button>
                                        <button className="signup-modal-button" onClick={ this.registerModelShow }> Create account</button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.isMobile && <SearchBarContainer/>}
                </>
            );

            case 'song':
            return (
                <div className="song_nav_bar">
                </div>
            )

            case 'user':
            return (
                <>
                <div className="nav_bar">
                    <div className="nav_buttons_container" >
                        <nav className="left_nav">
                            <img src={window.greenLogo} width="184px" className="nav-logo d-none d-md-block"/>
                            <NavLink to="/discover" className="home-button d-md-none" style={{ textDecoration: 'none' }}>   
                                <img src={window.greenLogoMobile} className='nav-logo' width="184px"/>
                            </NavLink>
                            <NavLink to="/discover" className="home-button d-none d-md-block" style={{ textDecoration: 'none' }}>   
                                Home
                            </NavLink>
                            <NavLink to="/library" className="library-button" style={{ textDecoration: 'none' }}>
                               Library
                            </NavLink>
                        </nav>
                        {!this.state.isMobile && <SearchBarContainer/>}
                        <nav className="right_nav">
                            <NavLink to="/upload" className="upload-button" style={{ textDecoration: 'none' }} >
                               Upload 
                            </NavLink>
                            <div className="profile-dropdown" onClick={this.handleDropDown}>
                                <img id="navProfileImg" src={this.props.currentUser ? this.props.currentUser.profilePicUrl : ""} />
                                <p id="dropdownUsername">{this.props.currentUser ? this.props.currentUser.display_name : ""}</p>
                                <img id="downArrow" src={window.downArrow} />
                               <div className="dropDownUlContainer">{dropDownOptions}</div>
                            </div>
                        </nav>
                    </div>
                </div>
                {this.state.isMobile && <SearchBarContainer/>}
                </>
            );
        } 
    }

}

