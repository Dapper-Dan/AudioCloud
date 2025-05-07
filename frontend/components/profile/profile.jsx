import React from 'react';
import SongPartContainer from '../song/song_part_container';
import NavBarContainer from '../nav_bar/nav_bar_container';
import SongNavBarContainer from '../nav_bar/song_nav_bar_container';
import UserNavBarContainer from '../nav_bar/user_nav_bar_container';
import LoadingModal from '../loading_modal.jsx';

class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showConfirmCover: false,
        showConfirmProfile: false,
        showPicOption: false,
        picOption: '',
        loading: true,
        showEditModal: false,
        display_name: "",
        city: "",
        country: "",
        first_name: "",
        last_name: ""
      }

      this.props.getSongs(this.props.match.params.display_name);
      this.props.fetchUserInfo(this.props.match.params.display_name);
      if (this.props.state.session.currentUser) {
        this.props.fetchUser(this.props.state.session.currentUser.id);
      }

      this.change = this.change.bind(this)
      this.update = this.update.bind(this)
      this.uploadProfileImage = this.uploadProfileImage.bind(this)
      this.showProfileUploadInput = this.showProfileUploadInput.bind(this)
      this.cancelUpload = this.cancelUpload.bind(this)
      this.uploadCoverImage = this.uploadCoverImage.bind(this)
      this.handleUserClick = this.handleUserClick.bind(this)
      this.change = this.change.bind(this)
      this.closeModal = this.closeModal.bind(this)
      this.handleClickOutside = this.handleClickOutside.bind(this);
      this.submitChanges = this.submitChanges.bind(this)
    }
  
    componentDidMount() {
      if (this.props.profileUser && this.props.profileUser.city) {
        this.setState({city: this.props.profileUser.city})
      }
      this.setState({
        loading: false,
      })
      this.props.fetchUserInfo(this.props.match.params.display_name);
    }

    handleClickOutside(event) {
       let editModal = document.getElementById('editModal')
        if ((!editModal) || (editModal && this.state.showEditModal && event.target.className === 'userEditFormBackground')) {
          this.setState({ showEditModal: false })
        }
    }

    closeModal () {
      this.setState({showEditModal: false})
    }

    componentDidUpdate() {
      if (this.props.state.entities.users.profile_user && this.props.state.entities.users.profile_user.display_name !== this.props.match.params.display_name) {
        this.props.fetchUserInfo(this.props.match.params.display_name);
        this.props.getSongs(this.props.match.params.display_name)
      }
    }

    update(value) {
      return e => {
        this[value] = e.target.files[0]
        let file = e.target.files[0]
        if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif") {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onloadend = () => {
            this.setState({ [value]: fileReader.result })
          }
          if (value === "cover_pic") {
            this.setState({showConfirmCover: true})
          } else {
            this.setState({showConfirmProfile: true})
          }
          this.setState({showPicOption: true})
        } else {
          alert("Invalid file type. Valid types are JPEG, PNG, and GIF.")
        }
      }
    }

    change(value) {
      return e => this.setState({ [value]: e.target.value });
    }

    handleUserClick() {
      this.setState({showEditModal: true})
    }

    submitChanges(e) {
      e.preventDefault()
      const formData = new FormData();
      formData.append('user[city]', this.state.city);
      if (this.state.country) formData.append('user[country]', this.state.country);
      if (this.state.first_name) formData.append('user[first_name]', this.state.first_name);
      if (this.state.last_name) formData.append('user[last_name]', this.state.last_name);
      if (this.state.display_name) formData.append('user[display_name]', this.state.display_name);
      this.props.editUser({form: formData, user: this.props.currentUser, songs: this.props.songs})
      if (this.state.display_name) history.pushState({}, "", `/${this.state.display_name}`)
      this.closeModal()
    }

    showProfileUploadInput() {
      let input = document.getElementById("profile-pic-input")
      input.click()
    }

    showCoverUploadInput() {
      let input = document.getElementById("cover-pic-input")
      input.click()
    }

    uploadProfileImage(e) {
      e.preventDefault()
      let confirmButton = document.getElementById("profile-confirm")
      confirmButton.innerHTML = "Uploading..."
      const formData = new FormData();
      formData.append('user[profile_photo]', this.profile_pic);
      this.props.editUser({form: formData, user: this.props.currentUser, songs: this.props.songs})
      .then(() => this.setState({
        showConfirmProfile: false,
        showConfirmCover: false,
        showPicOption: false
      }))
    }

    uploadCoverImage(e) {
      e.preventDefault()
      let confirmButton = document.getElementById("cover-confirm")
      confirmButton.innerHTML = "Uploading..."
      const formData = new FormData();
      formData.append('user[cover_photo]', this.cover_pic);
      this.props.editUser({form: formData, user: this.props.currentUser, songs: this.props.songs})
      .then(() => this.setState({
        showConfirmCover: false,
        showConfirmProfile: false,
        showPicOption: false
      }))
    }

    cancelUpload() {
      let targetCover = document.getElementById("cover-pic-input")
      let targetProfile = document.getElementById("profile-pic-input")
      targetCover.value = null
      targetProfile.value = null
      this.setState({
        showConfirmCover: false, 
        showPicOption: false,
        showConfirmProfile: false,
      })
    }

    render(){
      if (this.state.showEditModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      if(this.state.loading) return (<LoadingModal />);
        let songs
        if (this.props.state.entities.songs.songs) {
          songs = Object.values(this.props.state.entities.songs.songs).sort((a, b) => {
            if (new Date(a.music.record.created_at).valueOf() > new Date(b.music.record.created_at).valueOf()) return -1
            if (new Date(a.music.record.created_at).valueOf() < new Date(b.music.record.created_at).valueOf()) return 1
            if (new Date(a.music.record.created_at).valueOf() === new Date(b.music.record.created_at).valueOf()) return 0
          })
        }

        let renderSongs
        if (songs && songs.length > 0) {
          renderSongs = (
            <ul>
              {songs.map((song, i) => ( 
                <li key={i} className="song-box" >
                  <SongPartContainer song={song} profile={true} />   
                </li>
              ))}
            </ul>
          );
        } else {
          renderSongs = (
            <div className="profileNoSongs" >
              <p>Listening to music is fun but so is sharing. Upload some tunes today!</p>
            </div>
          );
        }

        let user
        if (this.props.profileUser) {
          user = this.props.profileUser
        } else {
          user = ""
        }
        
        let currentUserProfile
        if (this.props.currentUser && this.props.sessionUser) {
          if (this.props.currentUser.id === user.id) currentUserProfile = true;
        }

        let profPic
        if (this.profile_pic && this.state.showPicOption) {
          profPic = this.state.profile_pic
        } else {
          profPic = user.profilePicUrl
        }

        let coverPic
        if (this.cover_pic && this.state.showPicOption) {
          coverPic = this.state.cover_pic
        } else if (user.coverPicUrl) {
          coverPic = user.coverPicUrl
        } else {
          coverPic = window.cover
        }

        let profilePictureUpload
        if (currentUserProfile) {  
          profilePictureUpload = (
            <>
            <input
            id="profile-pic-input"
            type="file"
            onChange={this.update('profile_pic')}
            style={{display:'none'}}
            />

            {!this.state.showConfirmProfile ? 
            (<button className="profille-pic-upload-button" onClick={this.showProfileUploadInput}>Upload image</button>) : (
            <>
            <div className="profile-pic-cancelConfirm">
              <button onClick={this.cancelUpload}>Cancel</button>
              <button id="profile-confirm" onClick={this.uploadProfileImage}>Confirm</button>
            </div>
            </>)
            }
            </>
          );
        }

        let coverPictureUpload
        if (currentUserProfile) {  
          coverPictureUpload = (
            <>
            <input
            id="cover-pic-input"
            type="file"
            onChange={this.update('cover_pic')}
            style={{display:'none'}}
            />

            {!this.state.showConfirmCover ? 
            (<button className="cover-pic-upload-button" onClick={this.showCoverUploadInput}>Upload image</button>) : (
            <>
            <div className="cover-pic-cancelConfirm">
              <button onClick={this.cancelUpload}>Cancel</button>
              <button id="cover-confirm" onClick={this.uploadCoverImage}>Confirm</button>
            </div>
            </>)
            }
            </>
          );
        }

        let userEditButton
        if (currentUserProfile) {
          userEditButton = (
              <button id="userEditButton" onClick={this.handleUserClick}>Edit Profile</button>
          );
        }

        let location
        if (this.props.profileUser) {
          if (this.props.profileUser.city && this.props.profileUser.country) {
            location = `${this.props.profileUser.city}, ${this.props.profileUser.country}`
          } else if (this.props.profileUser.city) {
            location = `${this.props.profileUser.city}`
          } else if (this.props.profileUser.country) {
            location = `${this.props.profileUser.country}`
          } else {
            location = ""
          }
        }

        let name
        if (this.props.profileUser) {
          if (this.props.profileUser.first_name && this.props.profileUser.last_name) {
            name = `${this.props.profileUser.first_name} ${this.props.profileUser.last_name}`
          } else if (this.props.first_name) {
            name = this.props.profileUser.first_name 
          } else if (this.props.profileUser.last_name) {
            name = this.props.profileUser.last_name
          } else {
            name = ""
          }
        }

        let values
        if (this.props && this.props.profileUser) {
          let {country, city, first_name, last_name} = this.props.profileUser
          values = {country, city, first_name, last_name}
        } else {
          values = {}
        }

        let userEditModal 
        if (this.props.currentUser) {
        userEditModal = (
          <>
          <div className="userEditFormBackground" id="editModal" onClick={this.handleClickOutside}>
            <div className="userEditForm">
              <div className="userEditHeader">Edit your profile</div>
              <div className="userEditWrapper">
                <div className="picUploadBox">
                  {this.props.currentUser ? <img src={this.props.currentUser.profilePicUrl} width="250px" height="250px" ></img> : ""}
                </div>
                <div className="userEditInfoBox">
                  <h3 className='font-weight-bold'>Display name</h3>
                  <input 
                        className="displayNameInput"
                        placeholder={this.props.currentUser.display_name}
                        type="text"
                        onChange={this.change('display_name')}
                        value={this.state.display_name} 
                  /> 
                  <div className="locationWrapper">
                    <div className="locationCityWrapper">
                      <h3 className='font-weight-bold'>City</h3>
                      <input 
                        className="cityInput"
                        placeholder={this.props.currentUser.city}
                        type="text"
                        onChange={this.change('city')}
                        defaultValue={values.city}
                      />
                    </div> 
                    <div className="locationCountryWrapper">
                      <h3 className='font-weight-bold'>Country</h3>
                      <input 
                        className="countryInput"
                        placeholder={this.props.currentUser.country}
                        type="text"
                        onChange={this.change('country')}
                        defaultValue={values.country} 
                      />
                    </div> 
                  </div>
                  <div className="nameWrapper">
                    <div className="firstNameWrapper" >
                      <h3 className='font-weight-bold'>First name</h3>
                      <input 
                        className="firstNameInput"
                        placeholder={this.props.currentUser.first_name}
                        type="text"
                        onChange={this.change('first_name')}
                        defaultValue={values.first_name} 
                      />
                    </div> 
                    <div className="lastNameWrapper">
                      <h3 className='font-weight-bold'>Last name</h3>
                      <input 
                        className="lastNameInput"
                        placeholder={this.props.currentUser.last_name}
                        type="text"
                        onChange={this.change('last_name')}
                        defaultValue={values.last_name} 
                      />
                    </div> 
                  </div>
                  <button className="songFormCancelButton" onClick={this.closeModal}>Cancel</button>
                  <button className="songFormButton" onClick={this.submitChanges}>Save changes</button>
                </div>
              </div>
            </div>
          </div> 
          </>
        )}
    
        return(
          <>
          {this.state.showEditModal ? userEditModal : ""}
          <div className="nav_bar_background" ></div>
          <div className="nav-con" >
            { this.props.sessionUser ? <UserNavBarContainer /> : <NavBarContainer /> }
          </div>
          <div className="outtermost" > 
            <div className={`cover ${currentUserProfile ? "current-user-cover" : ""}`} >
              <img src={coverPic} className="cover-photo" width="1200px" />
              <div className="profile-box" >
                {user.profilePicUrl ? (
                <img src={profPic} className="profile-photo" />
                ):(
                <img src={window.profile} className="profile-photo" />
                )}    
                <div className="info-basic">
                  <a className="nameplate" > {user.display_name} </a>
                  {name ? <a className="nameplate" id="realName" > {name} </a> : ""}
                  {location ? <a className="location-plate" > {location} </a> : "" }
                </div>
              </div>
              {coverPictureUpload}
            </div> 
            {profilePictureUpload}
            {currentUserProfile ? userEditButton : ""}
            <SongNavBarContainer /> 
            <p id="recent">Recent</p>
            <div className="profile-songs">
              {renderSongs}
            </div> 
            <div className="endOfContentFooter"></div>
          </div>
          </>
        );
    }
}

export default Profile;