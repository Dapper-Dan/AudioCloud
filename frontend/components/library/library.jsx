import React from 'react';
import UserNavBarContainer from '../nav_bar/user_nav_bar_container';
import {NavLink, Link} from 'react-router-dom';
import SongPartContainer from '../song/song_part_container';
import LoadingModal from '../loading_modal.jsx';

export default class Library extends React.Component {
    constructor(props) {
        super(props);
        this.props.getSongs(this.props.currentUser.display_name);
        this.props.fetchUserInfo(this.props.currentUser.display_name);
    }

    componentDidMount() {
        if (!this.props.users.profile_user) this.props.fetchUserInfo(this.props.currentUser.display_name)
    }

    render() {
        let songs
        if (this.props.state.entities.songs.songs) {
            songs = Object.values(this.props.state.entities.songs.songs)
        } else {
            return (<LoadingModal />)
        }

        if (songs && songs.length < 12) {
            while (songs.length < 12) {
                songs.push("")
            }
        }

        let placeHolder = <div className="libraryPlaceHolder"></div>
        let tracks = (
                <div className="libraryContainer">
                    <h3 id="libraryHeaders">Tracks</h3>
                    <ul>
                        {songs.map((song, i) => ( 
                            <li key={i} className="song-box" >
                                {song !== "" ? <SongPartContainer song={song}/> : placeHolder}
                            </li>
                        )).slice(0, 12)}
                    </ul>
                </div>
        );

        let likesArray 
        if(this.props.users.profile_user) likesArray = this.props.users.profile_user.likes
        
        let myLikes
        if (this.props.songs && likesArray) {
            myLikes = likesArray.map((like) => {
                return this.props.songs[like.song_id]
            })
        }

        if (myLikes && myLikes.length < 18) {
            while (myLikes.length < 18) {
                myLikes.push("")
            }
        }

        let likes
        if (myLikes) {
            likes = (
                <div className="libraryContainer">
                     <h3 id="libraryHeaders">Likes</h3>
                    <ul>
                        {myLikes.map((song, i) => ( 
                            <li key={i} className="song-box" >   
                                {song !== "" ? <SongPartContainer song={song}/> : placeHolder}
                            </li>
                        )).slice(0, 18)}
                    </ul>
                </div>  
            );
        }

        let overview
        if (myLikes && songs) {
            overview = (
                <div className="overviewLibrary">
                    {tracks}
                    {likes}
                </div>
            );
        }

        let libraryProps
        let renderLikes
        let renderTracks
        let overviewButtonStyle
        let likesButtonStyle
        let tracksButtonStyle

        if (this.props.location.libraryProps) {
            libraryProps = this.props.location.libraryProps
            if (libraryProps['showLikes']) {
                renderLikes = likes
                likesButtonStyle = "green"
            } else {
                renderLikes = ""
            }

            if (libraryProps['showTracks']) {
                renderTracks = tracks
                tracksButtonStyle = "green"
                
            } else {
                renderTracks = ""
            }
        }

        if (!renderLikes && !renderTracks) overviewButtonStyle = "green"
        
        return (
            <>
            <div className="nav_bar_background" ></div>
            <div className="nav-con">
                <UserNavBarContainer/>
            </div>
            <div className="outtermost" id="libraryOutter">
                <div className="libraryNav">
                    <NavLink to={{
                        pathname: '/library',
                        libraryProps: {showLikes: true, showOverview: false, showTracks: false}
                    }} className="library-likes-button" id={likesButtonStyle}>  Likes </NavLink>

                    <Link to={{
                        pathname: '/library',
                        libraryProps: {showTracks: true, showOverview: false, showLikes: false}
                    }} className="library-tracks-button" id={tracksButtonStyle}> Tracks </Link>       

                    <Link to={{
                        pathname: '/library',
                        libraryProps: {showTracks: false, showOverview: true, showLikes: false}
                    }} className="overview-button" id={overviewButtonStyle}>  Overview </Link>
                </div>
                {renderLikes}
                {renderTracks}
                {!renderLikes && !renderTracks ? overview : ""}
                <div className="endOfContentFooter"></div>
            </div>
            </>
        );
    }
}