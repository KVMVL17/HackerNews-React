import React  from 'react';
import {Link} from "react-router-dom";
import User from "../users/User";
import TimeAgo from 'timeago-react';


class ContribIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            contributions: [],
            myApiKey: localStorage.getItem('token'),
            myID: -1,
            upVotedContributions: [],
            user_id: this.props.match.params.id
        }
    }

    componentDidMount() {
        this.fetchActualUser()
        this.fetchContributions()
        this.fetchUpvoted()
    }

    fetchActualUser() {

        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/myprofile"

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        myApiKey: localStorage.getItem('token'),
                        myID: result.id
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    fetchContributions() {
        let url, type;

        if (this.props.location.pathname === "/upvoted/contributions") {
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/upvoted"
            type = 0
        } else url = "https://asw-hackernews-kaai12.herokuapp.com/api" + ((this.props.location.pathname === "/") ? "/contributions" : this.props.location.pathname)

        if (type === 0) {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': localStorage.getItem('token')
                },
                body: null
            };

            fetch(url,requestOptions)
                .then(response => response.json())
                .then(
                    (result) => {
                        this.setState({
                            contributions: result
                        })
                    })
                .catch(error => {
                    console.log(error)
                })
        } else {
            fetch(url)
                .then(response => response.json())
                .then(
                    (result) => {
                        this.setState({
                            contributions: result
                        })
                    })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    fetchUpvoted() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        let urlVoted = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/upvoted/"
        fetch(urlVoted, requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        upVotedContributions: result

                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    deleteContrib(id){
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + id;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        fetch(url, requestOptions)
            .then(() => {
                this.componentDidMount()
            }).catch(error => {
            console.log(error)
        })
    }

    like(id) {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + id + "/likes";
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                //this.addUpVotedContribution(data, i)
                this.componentDidMount()

            }).catch(error => {
            console.log(error)
        })

    }

    dislike(id) {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + id + "/likes"
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        fetch(url, requestOptions)
            .then(() => {
            })
            .then(() => {
                this.componentDidMount()
            })
            .catch(error => {
                console.log(error)
            })
        this.componentDidMount()
    }

    checkIfLiked(e) {
        let copyUpvoted = this.state.upVotedContributions;
        for (let i = 0; i < copyUpvoted.length; ++i) {
            if (copyUpvoted[i].id === e.id) return true;
        }
        return false;
    }

    checkIfIsMine(contrib_user_id) {
        if (this.state.myID !== -1) {
            return this.state.myID == contrib_user_id
        }
        return false
    }

    render() {
        let contributions = this.state.contributions.map((e, i) => {
            return (
                <li style={{marginBottom: '6px'}} key={i}>
                    <div className="url-link">
                        <small style={{marginRight: '6px'}}>
                            {this.checkIfLiked(e) ?
                                (<a href="#" onClick={() => this.dislike(e.id,  1)}>▼</a>) :
                                (<a href="#" onClick={() => this.like(e.id,  1)}>▲</a>)
                            }
                        </small>
                        {e.url ? (
                            <a href={e.url}>{e.title}
                                <small style={{marginLeft: '3px'}}> ({e.url})</small>
                            </a>
                        ) : (
                            <Link to={'/contributions/' + e.id}>{e.title} </Link>
                        )}
                    </div>
                    <div>
                        <small className="leftmar">
                            {e.points} points by
                            {this.checkIfIsMine(e.user_id) ? (
                                    <React.Fragment>
                                        <Link to={'/myProfile'}>
                                            <User user_id={e.user_id}/>
                                        </Link>
                                        <TimeAgo datetime={e.created_at} locale='en_US'/>
                                        &nbsp;|&nbsp;
                                        <Link to={'/contributions/' + e.id}>
                                            comments
                                        </Link>
                                        &nbsp;|&nbsp;
                                        <Link to={'/contributions/' + e.id + '/edit'}>edit</Link>&nbsp;|&nbsp;
                                        <a href="#" onClick={() => this.deleteContrib(e.id)}>delete</a>
                                    </React.Fragment>
                                ) :
                                <React.Fragment>
                                    <Link to={'/users/' + e.user_id}>
                                        <User user_id={e.user_id}/>
                                    </Link>
                                    <TimeAgo datetime={e.created_at} locale='en_US'/>
                                    &nbsp;|&nbsp;
                                    <Link to={'/contributions/' + e.id}>
                                        comments
                                    </Link>
                                </React.Fragment>
                            }
                        </small>
                    </div>
                </li>
            )
        })
        return (
            <div className="content">
                <ol className="inline gap">
                    {
                        contributions
                    }
                </ol>
            </div>
        );
    }
}

export default ContribIndex;
