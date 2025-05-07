import { connect } from "react-redux";
import { getSong, like, unlike, getSongs, getBunchSongs } from "../../actions/song_actions";
import SongPart from "./song_part";

const mSTP = state => ({
  songs: state.entities.songs.songs,
  state: state,
  currentUser: state.session.currentUser,
  currentSong: state.session.currentSong,
  isPlaying: state.session.isPlaying
});

const mDTP = (dispatch) => ({
  getSong: (songId) => dispatch(getSong(songId)),
  like: (data) => dispatch(like(data)),
  unlike: (data) => dispatch(unlike(data)),
  getSongs: (display_name) => dispatch(getSongs(display_name)),
  getBunchSongs: () => dispatch(getBunchSongs())
});

export default connect(mSTP, mDTP)(SongPart);
