import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER} from "../actions/session_actions.js";
import { RECEIVE_SONG} from "../actions/song_actions";

const _nullSession = {
  id: null,
  isPlaying: false,
  currentSong: null
};

const sessionReducer = (state = _nullSession, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return Object.assign({}, state, { currentUser: action.user });
    case LOGOUT_CURRENT_USER:
      return _nullSession;
    case RECEIVE_SONG:
      return Object.assign({}, state, { currentSong: action.song });
    case 'SET_IS_PLAYING':
      return Object.assign({}, state, { isPlaying: action.isPlaying });
    default:
      return state;
  }
};

export default sessionReducer;