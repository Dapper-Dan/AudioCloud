import {RECEIVE_SONG_ERRORS, RECEIVE_SONG} from '../../actions/song_actions';

const songsErrorsReducer = (state = [], action) => {
    Object.freeze(state)
    switch (action.type) {
        case RECEIVE_SONG_ERRORS:
            return action.errors;
        case RECEIVE_SONG:
            return [];
        default:
            return state;
    }
}

export default songsErrorsReducer;