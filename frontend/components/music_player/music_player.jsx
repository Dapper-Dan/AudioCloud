import React from 'react';

class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songTime: "0:00",
            currentTime: 0,
            mouseDown: false,
            playing: false,
            volume: .5,
            showVolume: false,
            currentSongDisplayName: "",
            queue: null,
            listener: false,
            queueIndex: 0,
            repeat: false,
            shuffle: false
        }
      
        this.props.getBunchSongs();
        this.play = this.play.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.getCurrentTime = this.getCurrentTime.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.drag = this.drag.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.likeSong = this.likeSong.bind(this);
        this.nextQueue = this.nextQueue.bind(this);
        this.prevQueue = this.prevQueue.bind(this);
        this.repeatQueue = this.repeatQueue.bind(this);
        this.shuffleQueue = this.shuffleQueue.bind(this);
        
    }

    play() {
        let audioEle = document.getElementById('myAudio')
        if (audioEle.paused) {
          audioEle.play()
          this.setState({playing: true})
        } else if (!audioEle.paused) {
          audioEle.pause()
          this.setState({playing: false})
        }
    }

    handleMouseDown(e) {
        e.preventDefault()
        e.persist()
        this.setState({mouseDown: true})
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('mousemove', this.drag);
        this.setTime = e.pageX;
        this.drag(e)
    }

    handleMouseUp(e) {
        this.setState({mouseDown: false})
        document.removeEventListener('mousemove', this.drag)
        document.removeEventListener('mouseup', this.handleMouseUp)
        let song = document.getElementById('myAudio')
        let progressLine = document.querySelector('.song-bar')
        let divAdjust = e.pageX - progressLine.offsetLeft  
        let newTime = Math.floor((divAdjust / progressLine.offsetWidth) * song.duration);
        song.currentTime = newTime
    }

    drag(e) {
        let progressLine = document.querySelector('.song-bar');
        let divAdjust = e.pageX - progressLine.offsetLeft;  
        let newWidth = Math.floor((divAdjust / progressLine.offsetWidth) * 100);
  
        if (this.state.mouseDown) {
            this.setState({ currentTime: newWidth })
            document.querySelector('.song-progress-bar').style.width = `${newWidth}%`
        }
    }

    getCurrentTime() {
        let song = document.getElementById('myAudio')
        let unformattedTime = song.currentTime
        let minutes = Math.floor(unformattedTime / 60 )
        let seconds 
        Math.floor(unformattedTime % 60) > 9 ? seconds = Math.floor(unformattedTime % 60) : seconds = "0" + Math.floor(unformattedTime % 60)
        let formattedTime = minutes + ":" + seconds
        this.setState({ songTime: formattedTime })
        this.updateProgress()
        if (song.paused) {
            this.setState({playing: false})
        } else {
            this.setState({playing: true})
        }
    }

    updateProgress() {
        let song = document.getElementById('myAudio');
        let currentTime = song.currentTime;
        let endTime = song.duration;
        if (!this.state.mouseDown) {
            this.setState({currentTime: (currentTime / endTime) * 100})
        }
    }

    changeVolume(e) {
       this.setState({volume: e.target.value });
       let song = document.getElementById('myAudio');
       song.volume = this.state.volume
    }

    handleMouseOver() {
        this.setState({showVolume: true})
    }

    handleMouseLeave() {
        this.setState({showVolume: false})
    }

    likeSong() {
        let song = this.props.currentSong;
        let song_id = song.id;
        let user_id;
        if (this.props.currentUser) user_id = this.props.currentUser.id
        let likeId
        if (song.likes.length > 0) likeId = song.likes[0].id
        let like = { song_id, user_id } 
        song.likes[user_id] ? this.props.unlike({like, song, likeId}) : this.props.like({like, song, likeId})
        this.props.getSongs(song.display_name)
        this.props.getSong(song_id)
        this.props.getBunchSongs()
    }

    nextQueue() {
        this.setState({queueIndex: this.state.queueIndex += 1})
        this.props.getSong(this.state.queue[this.state.queueIndex].id)
    }

    prevQueue() {
        this.setState({queueIndex: this.state.queueIndex -= 1})
        this.props.getSong(this.state.queue[this.state.queueIndex].id)
    }

    repeatQueue() {
        this.setState({repeat: !this.state.repeat})
    }

    shuffleQueue() {
        this.setState({shuffle: !this.state.shuffle})
    }

    componentDidUpdate() {
        let songDisplayName
        if (this.props.currentSong) {
            songDisplayName = this.props.currentSong.display_name
            if (songDisplayName && this.state.currentSongDisplayName !== songDisplayName) this.setState({currentSongDisplayName: songDisplayName})
        }

        if (!this.state.queue || songDisplayName && this.state.currentSongDisplayName !== songDisplayName) {
            let queueSongs
            if (this.props.state.entities.songs.all_songs) queueSongs = Object.values(this.props.state.entities.songs.all_songs)
            let queueOrder
            if (queueSongs && this.props.currentSong) {
                this.setState({queueIndex: 0})
                let userSongs = queueSongs.filter((song) => song.display_name === this.props.currentSong.display_name)
                let currentSongId
                if (this.props.currentSong.id) currentSongId = userSongs.findIndex(obj => obj.id === this.props.currentSong.id)
                userSongs.unshift(userSongs.splice(currentSongId, 1)[0])
                let otherSongs = queueSongs.filter((song) => song.display_name !== this.props.currentSong.display_name)
                queueOrder = userSongs.concat(otherSongs)
                this.setState({queue: queueOrder})
            }
        }

        if (!this.state.listener && document.getElementById('myAudio')) {
            let song = document.getElementById('myAudio')
            this.setState({listener: true})
            song.addEventListener('ended', () => {
                if (this.state.repeat) {
                    return this.props.getSong(this.state.queue[this.state.queueIndex].id).then(song.play());
                }

                if (this.state.shuffle) {
                    return this.props.getSong(this.state.queue[Math.floor(Math.random() * this.state.queue.length)].id).then(song.play());
                }
                this.setState({queueIndex: this.state.queueIndex += 1})
                this.props.getSong(this.state.queue[this.state.queueIndex].id).then(song.play())
            })
        }
    }

    render() { 
        let song
        let artist_name
        let song_title
        let song_pic
        if (this.props.state.session.currentSong){
        song = this.props.state.session.currentSong.songUrl
        artist_name = this.props.state.session.currentSong.display_name
        song_title = this.props.state.session.currentSong.title
        song_pic = this.props.state.session.currentSong.pictureUrl || window.songGradient
        } else {
            song = ""
        }

        let playPause
        if (this.state.playing) {
            playPause = window.pause
        } else {
            playPause = window.play
        }

        let volumeRange = (
            <div id="volRangeContainer" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} style={!this.state.showVolume ? {visibility: "hidden"} : {visibility: "visible"}}>
                <input type="range" onChange={(e) => {this.changeVolume(e)}} id="vol" name="vol" min="0" max="1" step=".05" value={this.state.volume}  ></input>
            </div>
        );

        if (document.getElementById("vol")) {
            let slider =  document.getElementById("vol")
            slider.style.background = 'linear-gradient(to right, #1DB954 0%, #1DB954 ' + (slider.value-slider.min)/(slider.max-slider.min)*100 + '%, #fff ' + (slider.value-slider.min)/(slider.max-slider.min)*100 + '%, white 100%)'
        }

        if (document.getElementById("vol")) {
        document.getElementById("vol").oninput = function() {
            this.style.background = 'linear-gradient(to right, #1DB954 0%, #1DB954 ' + (this.value-this.min)/(this.max-this.min)*100 + '%, #fff ' + (this.value-this.min)/(this.max-this.min)*100 + '%, white 100%)'
          };
        }

        let likeButtonStyle
        let songs = this.props.state.entities.songs;
       
        if (this.props.currentUser && this.props.currentSong && songs.songs) {
            if (songs.songs[this.props.currentSong.id] && songs.songs[this.props.currentSong.id].likes[this.props.currentUser.id]) {
                likeButtonStyle = "greenButton"
            } else {
                likeButtonStyle = "heart"
            }
        }

        let repeatButton
        let shuffleButton
        if (this.state.repeat) {
            repeatButton = "greenButton";
        } else if (this.state.shuffle) {
            shuffleButton = "greenButton";
        } else {
            repeatButton = "";
            shuffleButton = "";
        }

        if (!song) {
            return <div></div>
        } else {
            let songTime = this.props.state.session.currentSong.duration
            let minutes = Math.floor(songTime / 60 )
            let seconds 
            Math.floor(songTime % 60) > 9 ? seconds = Math.floor(songTime % 60) : seconds = "0" + Math.floor(songTime % 60)
            let endTime = minutes + ":" + seconds

            return (
                <>
                <div className="media-player-container">
                    <div className="song-progress-bar-container"> 
                        <div className="button-container">
                            <img onClick={this.prevQueue} src={window.back} width="21px"/>
                            <button className="play-button" data-playing="false" role="switch" aria-checked="false" onClick={this.play}>
                                <img src={playPause} width="21px"/>
                            </button>
                            <img onClick={this.nextQueue} src={window.next} width="21px"/>
                            <img id={shuffleButton} onClick={this.shuffleQueue} src={window.shuffle} width="23px"/>
                            <img id={repeatButton} onClick={this.repeatQueue} src={window.repeat} width="23px"/>
                        </div>
                        <div className="current-time">
                            {this.state.songTime}
                        </div>
                        <div className="song-bar" >
                            <div className="song-progress-bar" style={{width:`${this.state.currentTime}%`}}>
                            </div>
                            <div className="bar-dot" onMouseDown={this.handleMouseDown}>
                            </div>
                        </div> 
                        <div className="end-time">
                            {endTime}
                        </div>
                        <img src={window.audio} className="audioButton" width="21px" onMouseOver={this.handleMouseOver} />
                        {volumeRange}
                        <div className="artist-info" >
                            <img className="song-pic" src={song_pic} width="40px" height="40px"/>
                            <div className="artist-small-info">
                                <p className="artist-name">{artist_name}</p>
                                <p className="song-title">{song_title}</p>
                            </div>
                            <img src={window.heart} onClick={this.likeSong} className="heartMedia" id={likeButtonStyle} width="15px" />
                        </div> 
                    </div>
                    <audio id="myAudio" autoPlay={true} hidden={true} src={song} onTimeUpdate={ () => { this.getCurrentTime()} }  />
                </div>
                </>
            );
        }
    }
}

export default MusicPlayer;