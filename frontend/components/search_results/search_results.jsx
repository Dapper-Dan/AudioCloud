import React from 'react';
import UserNavBarContainer from '../nav_bar/user_nav_bar_container';
import NavBarContainer from '../nav_bar/nav_bar_container';
import {Link} from 'react-router-dom';
import SongPartContainer from '../song/song_part_container';

export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            showTracks: false,
            showUsers: false,
            showEverything: true
        };

        this.props.getBunchSongs();
        this.changeShow = this.changeShow.bind(this);
    }

    componentDidMount() {
        this.setState({searchInput: this.props.location.searchInput})
    }

    componentDidUpdate() {
        if(!this.props) {
            this.props.fetchUsers()
            this.props.getBunchSongs()
        }
    }

    changeShow(e) {
        switch(e.target.className) {
            case "everythingButton": 
                return this.setState({showEverything: true, showTracks: false, showUsers: false})
            case "tracksButton":
                return this.setState({showTracks: true, showEverything: false, showUsers: false})
            case "usersButton":
                return this.setState({showTracks: false, showEverything: false, showUsers: true})
        }
    }

    render() {
        let searchInput
        let filteredSongs
        let filteredUsers
        if (this.props.match.params.searchInput) {
            searchInput = this.props.match.params.searchInput
            if (this.props.songs) {
                let songs = Object.values(this.props.songs);
                filteredSongs = songs.filter(
                    songItem => {
                        let songName = songItem.title.toLowerCase()
                        let username = songItem.display_name.toLowerCase()
                        let genre = songItem.genre.toLowerCase()
                        if (username.indexOf(searchInput.toLowerCase()) > -1) return songItem
                        if (songName.indexOf(searchInput.toLowerCase()) > -1) return songItem;
                        if (genre.indexOf(searchInput.toLowerCase()) > -1) return songItem;
                    }
                )
            }

            if (this.props.users) {
                let users = Object.values(this.props.users) 
                filteredUsers = users.filter(
                    userItem => {
                        let username = userItem.display_name.toLowerCase()
                        return username.indexOf(searchInput.toLowerCase()) > -1
                    }
                )
            }  
        } 

        let optionsEverythingArray
        if (filteredSongs) {
            optionsEverythingArray = (
                <ul className="optionsArray">
                    {filteredUsers.map((user, i) => 
                        <li key={i}>
                            <div className="filteredUsers">
                                <img id="profilePic"  src={user.profilePicUrl} /> 
                                <div className="filteredUserInfo">
                                    <Link to={`/${user.display_name}`}>
                                        <h3 className="discoverUserPart">{user.display_name}</h3>
                                    </Link>
                                    <h1>{user.first_name} {user.last_name}</h1>
                                    <h1>{user.city} {user.country}</h1>
                                </div>
                            </div>
                        </li>
                    )}
                    {filteredSongs.map((song, i) => (
                        <li key={i}>
                            <SongPartContainer song={song} profile={true} searchResults={true}/>
                        </li>
                    ))}
                </ul>
            );
        } else {
            optionsEverythingArray = ""
        }

        let optionsTracksArray
        if (filteredSongs) {
            optionsTracksArray =  (
                <ul className="optionsArray">
                    {filteredSongs.map((song, i) => (
                        <li key={i}>
                            <SongPartContainer song={song} profile={true} searchResults={true}/>
                        </li>

                    ))}
                </ul>
            );
        } else {
            optionsTracksArray = ""
        }

        let optionsUsersArray
        if (filteredUsers) {
            optionsUsersArray =  (
                <ul className="optionsArray">
                    {filteredUsers.map((user, i) => 
                        <li key={i}>
                            <div className="filteredUsers">
                                <img id="profilePic"  src={user.profilePicUrl} /> 
                                <div className="filteredUserInfo">
                                    <Link to={`/${user.display_name}`}>
                                        <h3 className="discoverUserPart">{user.display_name}</h3>
                                    </Link>
                                    <h1>{user.first_name} {user.last_name}</h1>
                                    <h1>{user.city} {user.country}</h1>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            );
        } else {
            optionsUsersArray = ""
        }

        let everythingStyle
        this.state.showEverything ? everythingStyle = "greenResultsTab" : everythingStyle = "resultsTab"

        let usersStyle
        this.state.showUsers ? usersStyle = "greenResultsTab" : usersStyle = "resultsTab"

        let tracksStyle
        this.state.showTracks ? tracksStyle = "greenResultsTab" : tracksStyle = "resultsTab"
       
        return (
            <>
            <div className="nav_bar_background" ></div>
            <div className="nav-con">
                {this.props.currentUser ? <UserNavBarContainer/> : <NavBarContainer/>}
            </div>
            <div className="outtermost" >
                <div className="searchHeader">{`Search results for "${searchInput}"`}</div>
                <div className="mainSearchSplit flex-column flex-md-row">
                    <div className="searchLeftSideBar d-flex flex-row flex-md-column">
                        <h3 className="everythingButton" id={everythingStyle} onClick={this.changeShow}><img id="profileIcon" src={window.searchButton}/>Everything</h3>
                        <h3 className="usersButton" id={usersStyle} onClick={this.changeShow}><img id="profileIcon" src={window.profileIcon}/>Users</h3>
                        <h3 className="tracksButton" id={tracksStyle} onClick={this.changeShow}><img id="trackIcon" src={window.trackIcon}/>Tracks</h3>
                    </div>
                    <div className="searchResultsMain">
                        {filteredSongs && filteredUsers && this.state.showEverything ? <h3 id="foundHeader">{`Found ${filteredUsers.length} people, ${filteredSongs.length} tracks`}</h3> : "" }
                        {filteredUsers && this.state.showUsers ? <h3 id="foundHeader">{`Found ${filteredUsers.length} people`}</h3> : "" }
                        {filteredSongs && this.state.showTracks ? <h3 id="foundHeader">{`Found ${filteredSongs.length} tracks`}</h3> : "" }
                        {this.state.showEverything ? optionsEverythingArray : ""}
                        {this.state.showTracks ? optionsTracksArray : ""}
                        {this.state.showUsers ? optionsUsersArray : ""}
                    </div>
                </div>
            </div>
            </>
        );
    }
}
