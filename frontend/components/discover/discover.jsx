import React from 'react';
import UserNavBarContainer from '../nav_bar/user_nav_bar_container';
import NavBarContainer from '../nav_bar/nav_bar_container';
import {Link} from 'react-router-dom';
import SongPartContainer from '../song/song_part_container';
import Slider from 'react-slick';
import LoadingModal from '../loading_modal.jsx';


export default class Discover extends React.Component {
    constructor(props) {
        super(props);
      
        this.props.getBunchSongs();
        this.props.fetchUsers();
        this.getTrendingGenre = this.getTrendingGenre.bind(this);
        this.quickSort = this.quickSort.bind(this);
    }

    quickSort(songs) {
        if (songs.length < 2) return songs;
       
        let pivot = songs[0];
        let lesserArray = [];
        let greaterArray = [];
        
        for (let i = 1; i < songs.length; i++) {
          if (Object.keys(songs[i].likes).length > Object.keys(pivot.likes).length) {
            greaterArray.push(songs[i]);
          } else {
            lesserArray.push(songs[i]);
          }
        }
      
        return this.quickSort(greaterArray).concat(pivot, this.quickSort(lesserArray));
    }

    getTrendingGenre(songs, genre) {
       let genreTracks = Object.values(songs).filter((song) => song.genre === genre)
       let trendingGenreTracks = this.quickSort(genreTracks)

       return trendingGenreTracks;
    }

    getRecentUsers(users) {
        let recentUsers = Object.values(users).sort((a, b) => {
            if (new Date(a.created_at).valueOf() > new Date(b.created_at).valueOf()) return -1
            if (new Date(a.created_at).valueOf() < new Date(b.created_at).valueOf()) return 1
            if (new Date(a.created_at).valueOf() === new Date(b.created_at).valueOf()) return 0
        })

        return recentUsers;
    }

    render() {
        let trendingSongs
        let trendingEDM
        let trendingJazz
        let trendingHipHop
        let recentUsers
        if (!this.props.songs) {
            return (<LoadingModal />)
        } else {
           trendingSongs = this.quickSort(Object.values(this.props.songs))  
           trendingEDM = this.getTrendingGenre(this.props.songs, "Dance & EDM")
           trendingJazz = this.getTrendingGenre(this.props.songs, "Jazz")
           trendingHipHop = this.getTrendingGenre(this.props.songs, "Hip-Hop")
        }

        if (!this.props.users) {
            return (<LoadingModal />)
        } else {
            recentUsers = this.getRecentUsers(this.props.users)
        }

        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: <button className="slick-prev">Previous</button>,
            nextArrow: <button className="slick-next">Next</button>,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                }
            ]
        };
        
        return(
            <>
            <div className="nav_bar_background" ></div>
            <div className="nav-con"  >
                {this.props.currentUser ? <UserNavBarContainer /> : <NavBarContainer /> }
            </div>
            <div className="outtermost" >
                <div className="discover2blocks">
                    <div className="scroll-playlists">
                        <h3>AudioCloud: Trending</h3>
                        <p>Up-and-coming tracks on AudioCloud</p>
                        <Slider {...settings} className="discover-slider">
                            {trendingSongs.map((song, index) => (
                                <div key={index}>
                                    <SongPartContainer song={song} />
                                </div>
                            ))}
                        </Slider>

                        <h3>Electric Dreams</h3>
                        <p>The latest and hottest EDM</p>
                        <Slider {...settings} className="discover-slider">
                            {trendingEDM.map((song, index) => (
                                <div key={index}>
                                    <SongPartContainer song={song} />
                                </div>
                            ))}
                        </Slider>

                        <h3>Next Set</h3>
                        <p>New talented artists to follow</p>
                        <Slider {...settings} className="discover-slider">
                            {recentUsers.map((user, index) => (
                                <div key={index}>
                                    <div className="discoverNewUsersBox">
                                        <Link to={`/${user.display_name}`}>
                                            <img id="profilePic" src={user.profilePicUrl} /> 
                                            <h1 className="discoverUserPart">{user.display_name}</h1>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                        <h3>Scooby Dooby Doo Bop</h3>
                        <p>Fresh smooth jazz</p>
                        <Slider {...settings} className="discover-slider">
                            {trendingJazz.map((song, index) => (
                                <div key={index}>
                                    <SongPartContainer song={song} />
                                </div>
                            ))}
                        </Slider>

                        <h3>Hip Hoppotamus</h3>
                        <p>The hottest and hippest hip-hop</p>
                        <Slider {...settings} className="discover-slider">
                            {trendingHipHop.map((song, index) => (
                                <div key={index}>
                                    <SongPartContainer song={song} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

