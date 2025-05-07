import React from 'react';
import SongPartContainer from './song_part_container'
import LoadingModal from '../loading_modal.jsx';

class SongList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true
      }

      this.props.getBunchSongs();
    }

    shouldComponentUpdate(nextProps) {
      if (nextProps.songs === undefined) {
        return false
      } else {
        return true
      }
    }

    componentDidMount() {
      this.setState({loading: false})
    }

    render(){
      if (this.state.loading) {
        return (<LoadingModal />)
      } else {
        let songs = Object.values(this.props.songs).slice(0,12)

        return(
          <div className="songList"> 
            <ul>
              {songs.map((song) => (
                <li key={song.id} className="song-box">
                  <SongPartContainer song={song} />
                </li>
              ))}
            </ul>
          </div>
        );
      }
    }
}

export default SongList;