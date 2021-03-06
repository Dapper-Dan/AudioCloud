import { connect } from "react-redux";
import NavBar from './nav_bar';
import {fetchUser} from '../../actions/user_actions';

const mSTP = state => ({
  user: state.session.currentUser,
  navType: 'default'
});

const mDTP = (dispatch) => ({
  action: (song) => dispatch(createSong(song)),
  fetchUser: (user) => dispatch(fetchUser(user))
});

export default connect(mSTP, mDTP)(NavBar);
