import React from 'react';
import {Redirect} from 'react-router-dom';

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            loading: true,
            filteredOptions: [],
            activeOption: 0,
            showOptions: false,
            redirect: false
        }

        this.props.fetchUsers();
        this.props.getBunchSongs();
        this.searchUpdate = this.searchUpdate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.songs === undefined) {
            return false
        } else {
            return true
        }
    }

    componentDidUpdate() {
        if (this.state.redirect) {
            this.setState({redirect: false})
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
        this.setState( {loading: false})
    }

    searchUpdate(e) {
        const searchInput = e.currentTarget.value
        let songs = Object.values(this.props.songs);
        let users = Object.values(this.props.users);
        const filteredOptions = songs.filter(
            songItem => {
                let songName = songItem.title.toLowerCase()
                return songName.indexOf(searchInput.toLowerCase()) > -1
            }).concat(users.filter(
                userItem => {
                let userName = userItem.display_name.toLowerCase()
                return userName.indexOf(searchInput.toLowerCase()) > -1
                }
            )
        );

       this.setState({
           searchInput,
           filteredOptions,
           showOptions: true
       })
    }

    onClick(e) {
        if (e.currentTarget.id === 'customOption' || e.currentTarget.className === "search-button") {
            this.setState({
                showOptions: false,
                searchInput: this.state.searchInput,
                redirect: true
              });
        } else {
            this.setState({
            showOptions: false,
            searchInput: e.currentTarget.innerText,
            redirect: true
            });
        }
    }

    componentWillUnmount() {
        this.setState({redirect: false})
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(event) {
        let getUl = document.querySelectorAll('ul.options')
        if(getUl[0]) {
        if (!getUl || !getUl[0].contains(event.target)) {
            this.setState({ showOptions: false })
            document.removeEventListener('click', this.handleClickOutside, true);
        }}
    }

    onKeyDown(e) {
        const { activeOption, filteredOptions } = this.state;
        if (e.key === 'Enter') {
            if (!activeOption) {
                this.setState({
                    showOptions: false,
                    searchInput: e.currentTarget.value,
                    redirect: true
                  });
            }

            this.setState({
                showOptions: false,
                searchInput: filteredOptions[activeOption].title ? filteredOptions[activeOption].title : (filteredOptions[activeOption].display_name),
                redirect: true
              });
       
        } else if (e.keyCode === 38) {
            if (activeOption === -1) {
                return;
            }
            this.setState({ activeOption: activeOption - 1 });
        } else if (e.keyCode === 40) {
            if (activeOption - 1 === filteredOptions.length) {
                return;
            }
            this.setState({ activeOption: activeOption + 1 });
        } 
    }

    onMouseOver(e) {
        const { activeOption, filteredOptions } = this.state; 
        for(let i = 0; i < filteredOptions.length; i++) {
            if (Object.values(filteredOptions[i]).includes(e.currentTarget.innerText)) {
                this.setState({
                    activeOption: i
                })
                return
            }

            this.setState({activeOption: null})
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: `/search_results/${this.state.searchInput}`,
                searchInput: this.state.searchInput,
            }}/>
        }
        
        if (this.state.loading) {
            return (<p>loading...</p>)
        } else {
            let optionList;
            if (this.state.showOptions && this.state.searchInput ) {
                optionList = (
                    <div className="options-drop">
                        <ul className="options">
                            <li className='option-active' id="customOption" key="searchInputOption" onKeyDown={this.onKeyDown} onClick={this.onClick} onMouseOver={this.onMouseOver}>Search for "{this.state.searchInput}"</li>
                            {this.state.filteredOptions.map((optionName, index) => {
                                if (optionName.title) {
                                    optionName = optionName.title
                                } else {
                                    optionName = optionName.display_name
                                }

                                let className;
                                if (index === this.state.activeOption) {
                                    className = 'option-active';
                                }
                                return (
                                    <li className={className} key={optionName} onKeyDown={this.onKeyDown} onClick={this.onClick} onMouseOver={this.onMouseOver}>
                                        {optionName}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }

            return (  
                <>
                <div className="searchBarContainer">
                    <input className="searchBar" placeholder="Search for music or podcasts" type="text" value={this.state.searchInput} onChange={this.searchUpdate} onKeyDown={this.onKeyDown} onMouseOver={this.onMouseOver}/>
                    <button className="search-button" onClick={this.onClick}> <img src={window.searchButton} width="15px" /> </button> 
                    {optionList}
                </div>
                </>
            );
        }
    }
}
