import React from 'react';
import { Nav, NavLink } from 'react-bootstrap';
import { Link } from "react-router-dom";
import UserNavBarContainer from '../nav_bar/user_nav_bar_container'

class SongForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        title: "",
        display_name: "",
        songURL: "",
        genre: "",
        tags: [],
        description: "",
        songImage: null,
        music: null,
        duration: null,
        waveForm: null,
        step: 1,
        pictureSamp: null
      }
      // this.props.getUser()


      this.handleSubmit = this.handleSubmit.bind(this);
      this.update = this.update.bind(this);
      this.showUploadInput = this.showUploadInput.bind(this)
      this.handleMusicUpload = this.handleMusicUpload.bind(this)
      this.handlePictureUpload = this.handlePictureUpload.bind(this)
      this.draw = this.draw.bind(this)
      this._next = this._next.bind(this);
      this.handleCancel = this.handleCancel.bind(this)
      this.onKeyDown = this.onKeyDown.bind(this)
    }

    update(value) {
      return e => this.setState({ [value]: e.target.value });
    }

    handleSubmit(e) {
      e.preventDefault();
      let submitButton = document.getElementById('songFormSubmitButton')
      submitButton.innerHTML = "Uploading song..."
      const formData = new FormData();
      if (this.state.songImage) formData.append('song[songImage]', this.state.songImage);
      formData.append('song[title]', this.state.title);
      formData.append('song[genre]', this.state.genre);
      formData.append('song[duration]', this.state.duration);
      formData.append('song[display_name]', this.props.currentUser.display_name);
      formData.append('song[music]', this.state.music);
      formData.append('song[waveForm]', this.state.waveForm);
      this.props.action(formData)
      .then(() => this._next())
    }

    _next() {
      const { step } = this.state
          this.setState({
              step : step + 1
          })
    }

    onKeyDown(event) {
   
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.handleSubmit(event)
      }
    }



    handleCancel() {
      this.setState({step: 1})
    }



    handleMusicUpload(e) {
      const track = document.createElement('audio');
      const reader = new FileReader()
      reader.onloadend = () => { 
        track.src = reader.result;
      }
      reader.readAsDataURL(e.target.files[0])
      track.addEventListener('loadedmetadata', () => {
        this.setState({ duration: track.duration});
      })
                       
      this.setState({ music: e.target.files[0] }); 
     
      let audioContext = new (window.AudioContext || window.webkitAudioContext)()
      e.target.files[0].arrayBuffer()
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          // this.draw(this.normalizeData(this.filterData(audioBuffer)))
          // this.sampleArray = this.normalizeData(this.filterData(audioBuffer))
          this.setState({ waveForm: this.draw(this.normalizeData(this.filterData(audioBuffer))) })
        })
      
      this._next()
    }

    filterData(audioBuffer) {
      const rawData = audioBuffer.getChannelData(0);
      const samples = 200;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum = sum + Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }
      return filteredData
    }


    normalizeData(filteredData) {
      const multiplier = Math.pow(Math.max(...filteredData), -1);
      return filteredData.map(n => n * multiplier);
    }

    draw(normalizedData) { 
      const canvas = document.createElement('canvas');
      canvas.width = 680
      canvas.height = 80
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 680, 80)
   
      ctx.fillStyle = "transparent"
      ctx.fillRect(0, 0, 680, 80)
      
     
       
      for (let i = 0; i < normalizedData.length; i++) {
         let height = normalizedData[i]
         ctx.fillStyle = "grey"
         ctx.fillRect(i * 3.5, 40, 2.3, height * -40)
         ctx.fillRect(i * 3.5, 40, 2.3, height * 40)
      }

      ctx.strokeStyle = "#ededed"
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(680, 40);
      ctx.stroke();
     
      return canvas.toDataURL('image/png', 1.0)
    }

    handlePictureUpload(e) {
      this.setState({ songImage: e.target.files[0] });

      let file = e.target.files[0]
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        this.setState({ pictureSamp: fileReader.result })
      }
     
    }

    showUploadInput() {
      let input = document.getElementById("music-file-input")
      input.click()
    }

    // handleDrop() {

    // }







    render() {
        const {title} = this.state
        
        const values = {title};
        
        const genres = ["Classical", "Country", "Dance & EDM", "Disco", "Jazz", "Hip-Hop", "Indie", "Metal", "Latin", "R&B", "Rock", "World"]
        const {step} = this.state;

      switch(step) {

        case 1:
        
        return (
        <>
          <div className="nav_bar_background" ></div>

          <div className="nav-con" >
              <UserNavBarContainer /> 
          </div>

          <div className="outtermost"> 

            <div className="songFormBackGround">
           

            <div className="songUpload-form" >

              {/* <div className="fileUploadForm"> */}
            
                <h1> Drag and drop your tracks & albums here </h1>

                <button className="fileUploadButton" onClick={this.showUploadInput}> or choose files to upload </button>
                
                <input
                  id="music-file-input"
                  type="file"
                  style={{display:'none'}}
                  onChange={this.handleMusicUpload}
                />
              </div>
            </div> 
          </div>
        </>
        )

        case 2:
        return ( 
        <>
        <div className="nav_bar_background" ></div>

        <div className="nav-con" >
            <UserNavBarContainer /> 
        </div>

        <div className="outtermost" > 
          <div className="songFormBackGround" >

          

          <div className="songUpload-form" id="songInfo" >

            <div className="picUploadBox">
             

              {this.state.pictureSamp ? <img src={this.state.pictureSamp} id="samplePic" width="250px" height="250px"/> : <img src={window.songGradient} id="samplePic" width="250px" height="250px"/>}
              
              <label htmlFor="pic-file-input" className="picUploadButton">Upload Image</label>
              <input
                id="pic-file-input"
                type="file"
                onChange={this.handlePictureUpload}
                style={{display:'none'}}
              
              />
            </div>

            
            <div className="songUploadInfo" onKeyDown={this.onKeyDown} >
              <h3>Title</h3>
              <input 
                className="nameInput"
                placeholder="Enter track title"
                type="text"
                onChange={this.update('title')}
                value={values.title} 
              />   


              <h3>Genre</h3>
              <select className="songFormGenre" onChange={ this.update('genre') } defaultValue='' >
                <option disabled value="">None</option>
                {genres.map((genre, index) => (
                  <option key={index} value={genre}> {genre} </option>
                ))}
              </select>

              <h3>Title</h3>
              <textarea 
                className="descriptionInput"
                rows="6"
                cols="60"
                placeholder="Describe your track"
                onChange={this.update('description')}
                value={values.description} 
              />

              <div className="songFormButtonContainer">
              
                <button className="songFormCancelButton" onClick={this.handleCancel}> Cancel </button>
                <button id="songFormSubmitButton" className="songFormButton" onClick={this.handleSubmit}>  Submit Song </button>
              </div>
            </div>

            
            </div>
          </div>
        </div>
        </>
        )

        case 3:
        return (
          <>
          <div className="nav_bar_background" ></div>

          <div className="nav-con" >
              <UserNavBarContainer /> 
          </div>

          <div className="outtermost"> 
  
  
            <div className="songUpload-form" >
              <p id="songUploadSuccess">Song successfully uploaded</p>
              <Link to={`/${this.props.currentUser.display_name}`} >
                Go to your tracks
              </Link>
            </div>
          </div>
        </>
        )
      }
    }
}

export default SongForm;