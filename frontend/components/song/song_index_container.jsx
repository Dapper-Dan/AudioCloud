import { connect } from "react-redux";
import { getSongs } from "../../actions/song_actions";
import SongList from "./song_index";


const mSTP = state => ({
  songs: state.entities.songs
});

const mDTP = (dispatch) => ({
  getSongs: () => dispatch(getSongs())
});

export default connect(mSTP, mDTP)(SongList);