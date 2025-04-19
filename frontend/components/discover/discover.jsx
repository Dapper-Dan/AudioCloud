import React from 'react';
import UserNavBarContainer from '../nav_bar/user_nav_bar_container';
import NavBarContainer from '../nav_bar/nav_bar_container';
import {Link} from 'react-router-dom';
import SongPartContainer from '../song/song_part_container';
import Carousel from 'react-bootstrap/Carousel';


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
            return (<p>loading...</p>)
        } else {
           trendingSongs = this.quickSort(Object.values(this.props.songs))  
           trendingEDM = this.getTrendingGenre(this.props.songs, "Dance & EDM")
           trendingJazz = this.getTrendingGenre(this.props.songs, "Jazz")
           trendingHipHop = this.getTrendingGenre(this.props.songs, "Hip-Hop")
        }

        if (!this.props.users) {
            return (<div>loading....</div>)
        } else {
            recentUsers = this.getRecentUsers(this.props.users)
        }
        
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
                        <Carousel controls={true} interval="9999999999" id="discoverCaro" wrap={false} >
                            <Carousel.Item>
                                {trendingSongs.slice(0, 5).map((song) => ( 
                                    <SongPartContainer song={song} />
                                ))}
                            </Carousel.Item>
                            <Carousel.Item>
                                {trendingSongs.slice(4, 9).map((song) => ( 
                                    <SongPartContainer song={song} />
                                ))}
                            </Carousel.Item>
                            {trendingSongs.length > 8 &&
                                <Carousel.Item>
                                    {trendingSongs.slice(8, 12).map((song) => ( 
                                        <SongPartContainer song={song} />
                                    ))}
                                </Carousel.Item>
                            }
                        </Carousel>
                        <h3>Electric Dreams</h3>
                        <p>The latest and hottest EDM</p>
                        <Carousel controls={true} interval="9999999999" id="discoverCaro" wrap={false} >
                            <Carousel.Item>
                                {trendingEDM.slice(0, 5).map((song) => ( 
                                    <SongPartContainer song={song} />
                                ))}
                            </Carousel.Item>
                            {trendingEDM.length > 4 &&
                                <Carousel.Item>
                                    {trendingEDM.slice(4, 9).map((song) => ( 
                                        <SongPartContainer song={song} />
            
                                    ))}
                                </Carousel.Item>
                            }
                        </Carousel>
                        <h3>Next Set</h3>
                        <p>New talented artists to follow</p>
                        <Carousel controls={true} interval="9999999999" id="discoverCaro" wrap={false} >
                            <Carousel.Item>
                                {recentUsers.slice(0, 5).map((user) => ( 
                                    <>
                                    <div className="discoverNewUsersBox">
                                        <img id="profilePic"  src={user.profilePicUrl} /> 
                                        <Link to={`/${user.display_name}`}>
                                            <h1 className="discoverUserPart">{user.display_name}</h1>
                                        </Link>
                                    </div>
                                    </>
                                ))}
                            </Carousel.Item>
                            {recentUsers.length > 4 &&
                                <Carousel.Item>
                                    {recentUsers.slice(4, 9).map((user, i) => ( 
                                        <>
                                        <div className="discoverNewUsersBox">
                                            <img id="profilePic"  src={user.profilePicUrl} /> 
                                            <Link to={`/${user.display_name}`}>
                                                <h1 className="discoverUserPart">{user.display_name}</h1>
                                            </Link>
                                        </div>
                                        </>
                                    ))}
                                </Carousel.Item>
                            }
                        </Carousel>
                        <h3>Scooby Dooby Doo Bop</h3>
                        <p>Fresh smooth jazz</p>
                        <Carousel controls={true} interval="9999999999" id="discoverCaro" wrap={false} >
                            <Carousel.Item>
                                {trendingJazz.slice(0, 5).map((song) => ( 
                                    <SongPartContainer song={song} />
                                ))}
                            </Carousel.Item>
                            {trendingJazz.length > 8 &&
                                <Carousel.Item>
                                    {trendingJazz.slice(4, 9).map((song) => ( 
                                        <SongPartContainer song={song} />
                                    ))}
                                </Carousel.Item>
                            }
                        </Carousel>
                        <h3>Hip Hoppotamus</h3>
                        <p>The hottest and hippest hip-hop</p>
                        <Carousel controls={true} interval="9999999999" id="discoverCaro" wrap={false} >
                            <Carousel.Item>
                                {trendingHipHop.slice(0, 5).map((song) => ( 
                                    <SongPartContainer song={song} />
                                ))}
                            </Carousel.Item>
                            {trendingHipHop.length > 4 &&
                                <Carousel.Item>
                                    {trendingHipHop.slice(4, 9).map((song) => ( 
                                        <SongPartContainer song={song} />
                                    ))}
                                </Carousel.Item>
                            }
                        </Carousel>
                    </div>
                    <div className="sideBar" >
                        <div className="sideBarCreatorContainer">
                            <p>Message from the creator:</p>
                            <img id="profilePic"  src={window.myPic} />
                            <p id="discoverThanks">Hope you're enjoying the site. If you would like to see more of my work or know more about me, check out my GitHub or LinkedIn.</p>   
                            <a className="signup-modal-button" id="discoverGitHub" href={"https://github.com/Dapper-Dan/AudioCloud"}>GitHub</a>
                            <a className="signup-modal-button" id="discoverLinked" href={"https://www.linkedin.com/in/daniel-r-lancaster/"}>LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

