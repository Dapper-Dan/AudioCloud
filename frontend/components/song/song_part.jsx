import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from "react-router-dom";
import ReactAudioPlayer from 'react-audio-player';
import { like } from '../../util/like_api_util';


class SongPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            songTime: "0:00",
          
        }
        
        this.handleClick = this.handleClick.bind(this)
        this.play = this.play.bind(this)
        this.likeSong = this.likeSong.bind(this)
        
        
      }


      play() {
        let audioEle = document.getElementById('myAudio')
        if (audioEle.paused) {
          audioEle.play()
        } else if (!audioEle.paused) {
          audioEle.pause()
        }
      }

      likeSong() {
      
        let song = this.props.song
        let song_id = this.props.song.id;
        let user_id = this.props.state.session.currentUser.id
        let likeId
        if (this.props.song.likes.length > 0) likeId = this.props.song.likes[0].id
        let like = { song_id, user_id, likeId }

        this.props.song.likes[user_id] ? this.props.unlike({like, song}) : this.props.like({like, song})
       
        this.props.getSongs(this.props.song.display_name)
       
      }




    handleClick() {
      const song = this.props.song
      this.props.getSong(song.id)
      setTimeout(this.play, 300)    
    }
  
    componentDidUpdate() {
      if (this.props.state.session.currentSong && this.props.song.songUrl === this.props.state.session.currentSong.songUrl) { 
        let audioEle = document.getElementById('myAudio')
        
        audioEle.ontimeupdate = () => {
          this.setState({ currentTime: (audioEle.currentTime / audioEle.duration) * 100 })
          let unformattedTime = audioEle.currentTime
          let minutes = Math.floor(unformattedTime / 60 )
          let seconds 
          Math.floor(unformattedTime % 60) > 9 ? seconds = Math.floor(unformattedTime % 60) : seconds = "0" + Math.floor(unformattedTime % 60)
          let formattedTime = minutes + ":" + seconds
          this.setState({ songTime: formattedTime })
        }
      } 
    }

    calculateTime(song) {
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
      if (days > 1) return `${days} days ago`
      
      
    }

    render() {
      
     
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
      if (song.likes && song.likes[this.props.currentUser.id]) {
        likeButtonStyle = "greenButton"
      }
      

      let progressWaveForm
      if (this.props.state.session.currentSong && this.props.song.songUrl === this.props.state.session.currentSong.songUrl) {
        progressWaveForm = (
        <div className="progressWaveFormContainer" style={{ width:`${this.state.currentTime}%` }}>
          <img className="progressWaveFormImg" src={song.waveForm} />
        </div>
        )
      }

      let creationTime
      let songGenre
      if (song) {
        creationTime = this.calculateTime(song)
        songGenre = song.genre
      } else {
        creationTime = ""
        songGenre = ""
      }

      
     
  
      if (!this.props.profile) {
        
        return (
        <>
          <div className="songTile">
              
          {song.pictureUrl ? (
              <img src={song.pictureUrl} height="180px" width="180px"/>
              ) : (
                <img src={window.songGradient} height="180px" width="180px" /> 
            
          )}

          <a role="button" className="play" onClick={this.handleClick}>Play</a>
          
            
          <h3 className="songTitle">{song.title}</h3> 
          

          <Link to={`/${song.display_name}`}>
            <h3 className="songUser">{song.display_name}</h3>
          </Link>


          </div>

          
        </>
    
          
        )
      } else {
        return (
          <>
          <div className="songProfileTile">
              
            {song.pictureUrl ? (
                <img src={song.pictureUrl} height="180px" width="180px"/>
            ) : (
                <img src={window.songGradient} height="180px" width="180px" /> 
              
            )}
            <div className="songProfileTileContainer">
              <div className="profile-song-info">
                <a role="button" className="play" onClick={this.handleClick}>Play</a>
                
                <div className="profile-song-names-plate" >
                  <Link to={`/${song.display_name}`}>
                    <h3 className="songUser">{song.display_name}</h3>
                  </Link>
                  <h3 className="songTitle">{song.title}</h3> 
                </div>

              </div>

              <div className="waveFormContainer" style={{height: "84px"}} >

                <img className="waveFormImg" src={song.waveForm}/>
                {progressWaveForm}

              </div>

              <div className="songProgressTimer">
                {songProgressTime}
              </div>
                
              <div className="songEndTimer">
                {endTime}
              </div>

              <div className="dateCreation">
                {creationTime}
              </div>

              <div className="genreContainer">
                {songGenre}
              </div>

              {/* <div className="waveFormContainer" style={{height: "100px"}} >

                <img className="waveFormImg" src={song.waveForm}/>
                {progressWaveForm}


              </div> */}
            
              
              <a role="button" className="likeButton" id={likeButtonStyle} onClick={this.likeSong}><img src={window.heart} width="15px"></img>{totalLikes}</a>

            </div>
            

          </div>

          
        </>
    
        )
      }


    }


}

export default SongPart;

