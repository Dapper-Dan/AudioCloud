import React from 'react';
import { Link } from "react-router-dom";
import SignupFormContainer from '../session/signup_form_container.jsx';

class SongPart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentTime: 0,
        songTime: "0:00",
        loading: true,
        showSignUp: false,
        wasLastInteracted: false,
        isHovered: false
      }
      this.handleClick = this.handleClick.bind(this);
      this.play = this.play.bind(this);
      this.likeSong = this.likeSong.bind(this);
      this.changeShow = this.changeShow.bind(this);
      this.waveformClick = this.waveformClick.bind(this);
    }

    play() {
      let audioEle = document.getElementById('myAudio')
      this.setState({ wasLastInteracted: true })
      if (window.lastInteractedTile && window.lastInteractedTile !== this) {
        window.lastInteractedTile.setState({ wasLastInteracted: false })
      }
      window.lastInteractedTile = this

      if (this.props.currentSong && this.props.currentSong.id === this.props.song.id) {
        if (audioEle.paused) {
          audioEle.play()
        } else {
          audioEle.pause()
        }
      } else {
        this.props.getSong(this.props.song.id)
        setTimeout(() => audioEle.play(), 300)
      }
    }

    likeSong() {
      if (!this.props.currentUser) {
        this.setState({showSignUp: true})
        return
      }

      let song = this.props.song
      let song_id = this.props.song.id;
      let user_id 
      if (this.props.currentUser) user_id = this.props.currentUser.id
      let likeId
      if (this.props.song.likes.length > 0) likeId = this.props.song.likes[0].id
      let like = { song_id, user_id }  
      this.props.song.likes[user_id] ? this.props.unlike({like, song, likeId}) : this.props.like({like, song, likeId})
      this.props.getSongs(this.props.song.display_name)
      if (this.props.searchResults) this.props.getBunchSongs()
    }

    componentDidMount() {
      this.setState({loading: false})
    }

    handleClick() {
      this.play();
    }
  
    componentDidUpdate() {
      if (document.getElementById('myAudio') && this.props.state.session.currentSong && this.props.song && this.props.song.songUrl === this.props.state.session.currentSong.songUrl) { 
        let audioEle = document.getElementById('myAudio')
        audioEle.ontimeupdate = () => {
          this.setState({ currentTime: (audioEle.currentTime / audioEle.duration) * 100 })
          let unformattedTime = audioEle.currentTime
          let minutes = Math.floor(unformattedTime / 60 )
          let seconds 
          Math.floor(unformattedTime % 60) > 9 ? seconds = Math.floor(unformattedTime % 60) : seconds = "0" + Math.floor(unformattedTime % 60)
          let formattedTime = minutes + ":" + seconds
          this.setState({ songTime: formattedTime })
          if (audioEle.paused) {
            this.setState({playing: false})
          } else {
            this.setState({playing: true})
          }
        }
      }
    }

    calculateTime(song) {
      if (!song.music) return
      let createdDate = new Date(song.music.record.created_at)
      let now = new Date().getTime()
      if (createdDate < now) {
        var difference = now - createdDate;
      } 
      const days = Math.floor(difference / 1000 / 60 / (60 * 24))
      const hours = Math.floor(difference / (1000 * 60 * 60) - days * 24)
      const minutes = Math.floor(difference / (1000 * 60) - days * 24 * 60 - hours * (60))

      if (hours < 1) return `${minutes} minutes ago`
      if (days < 1) return `${hours} hours ago`
      if (days >= 1) return `${days} days ago`
    }

    getPausedPlay() {
      const audioEle = document.getElementById('myAudio');
      const isCurrentSong = this.props.currentSong && this.props.currentSong.songUrl === this.props.song.songUrl;
      
      if (!isCurrentSong) {
        return this.state.isHovered ? "play" : "";
      }
      
      if (audioEle && !audioEle.paused) {
        return (!this.state.wasLastInteracted && !this.state.isHovered) ? "" : "pause";
      }
      
      return "play";
    }

    changeShow() {
      this.setState({showSignUp: false})
    }

    waveformClick(e) {
      let waveFormContainer = e.currentTarget;
      let rect = waveFormContainer.getBoundingClientRect();
      let clickX = e.clientX - rect.left;
      let audioEle = document.getElementById('myAudio');
      audioEle.currentTime = Math.floor((clickX / rect.width) * audioEle.duration);
    }

    render() {
      if (!this.props.song || this.state.loading) {
        return (<p>loading...</p>)
      }

      if (this.state.showSignUp) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      let songProgressTime
      if (this.props.state.session.currentSong && this.props.song.songUrl !== this.props.state.session.currentSong.songUrl) { 
        songProgressTime = "0:00"
      } else {
        songProgressTime = this.state.songTime
      }
      
      const song = this.props.song
      let songTime = song.duration
      let endTimeMinutes = Math.floor(songTime / 60 )
      let endTimeSeconds 
      Math.floor(songTime % 60) > 9 ? endTimeSeconds = Math.floor(songTime % 60) : endTimeSeconds = "0" + Math.floor(songTime % 60)
      let endTime = endTimeMinutes + ":" + endTimeSeconds

      let totalLikes
      if (song.likes) {
        totalLikes = Object.keys(song.likes).length
      } else {
        totalLikes = ""
      }
     
      let likeButtonStyle
      if(this.props.currentUser) {
        if (song.likes && song.likes[this.props.currentUser.id]) {
          likeButtonStyle = "greenButton"
        }
      }
      
      let progressWaveForm
      if (this.props.state.session.currentSong && this.props.song.songUrl === this.props.state.session.currentSong.songUrl) {
        progressWaveForm = (
        <div className="progressWaveFormOverlay" style={{width:`${this.state.currentTime}%`}}>
        </div>
        )
      }

      let creationTime
      let songGenre
      if (this.props.song) {
        creationTime = this.calculateTime(this.props.song)
        songGenre = song.genre
      } else {
        creationTime = ""
        songGenre = ""
      }

      if (!this.props.profile) {
        return (
          <>
          <div className="songTile" 
               onMouseEnter={() => this.setState({ isHovered: true })}
               onMouseLeave={() => this.setState({ isHovered: false })}>
            {song.pictureUrl ? (
                <img src={song.pictureUrl} height="180px" width="180px"/>
                ) : (
                <img src={window.songGradient} height="180px" width="180px" /> 
            )}
            <a role="button" className={this.getPausedPlay()} onClick={this.handleClick}>Play</a>
            <h3 className="songTitle">{song.title}</h3> 
            <Link to={`/${song.display_name}`}>
              <h3 className="songUser">{song.display_name}</h3>
            </Link>
          </div>
          </> 
        );
      } else if(this.props.song) {
        return (
          <>
          {this.state.showSignUp ?
            <div className="modal-background">
              <div className="signModal">
                <SignupFormContainer changeShow={this.changeShow}/> 
              </div>
            </div>
            : ""
          }
          <div className="songProfileTile"
               onMouseEnter={() => this.setState({ isHovered: true })}
               onMouseLeave={() => this.setState({ isHovered: false })}>
            {song.pictureUrl ? (
                <img className="songProfileTileImg" src={song.pictureUrl} height="180px" width="180px"/>
            ) : (
                <img className="songProfileTileImg" src={window.songGradient} height="180px" width="180px" /> 
            )}
            <div className="songProfileTileContainer">
              <div className="profile-song-info">
                <div className="playNameContainer">
                  <a role="button" className={this.getPausedPlay()} onClick={this.handleClick}>Play</a>
                  <div className="profile-song-names-plate" >
                    <Link to={`/${song.display_name}`}>
                      <h3 className="songUser">{song.display_name}</h3>
                    </Link>
                    <h3 className="songTitle">{song.title}</h3> 
                  </div>
                </div>
                <div className="tagGenreContainer">
                  <div className="dateCreation">
                    {creationTime}
                  </div>
                  <div className="genreContainer">
                    {`# ${songGenre}`}
                  </div>
                </div>
              </div>
              <div className="waveFormContainer" onClick={this.waveformClick}style={{height: "84px"}} >
                <img className="waveFormImg" src={song.waveForm} />
                {progressWaveForm}
              </div>
              <div className="songProgressTimerContainer">
                <div className="songProgressTimer">
                  {songProgressTime}
                </div>
                <div className="songEndTimer">
                  {endTime}
                </div>
              </div>
              <a role="button" className="likeButton" id={likeButtonStyle} onClick={this.likeSong}><img src={window.heart} width="15px"></img>{totalLikes}</a>
            </div>
          </div>
          </>
        );
      }
    }
}

export default SongPart;

