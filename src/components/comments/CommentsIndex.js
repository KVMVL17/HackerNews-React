import React from 'react'
import {Link} from "react-router-dom";
import User from "../users/User";
import TimeAgo from "timeago-react";

class CommentsIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: this.props.match.params.id,
            comments: [],
            myID: -1,
            upvotedComments: []
        }
        this.updateUpvotedComments = this.updateUpvotedComments.bind(this)
    }

    componentDidMount() {
        this.fetchActualUser()
        let url
        let type
        if (this.state.user_id === undefined) {
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/upvoted"
            type = 0
        }
        else {
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/users/" + this.state.user_id
            type = 1
        }

        if (type === 1) {
            fetch(url)
                .then(response => response.json())
                .then(
                    (result) => {
                        this.setState({
                            comments: result
                        })
                    })
                .catch(error => {
                    console.log(error)
                })
        } else {
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
                            comments: result
                        })
                    })
                .catch(error => {
                    console.log(error)
                })
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        let urlVoted = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/upvoted/"
        fetch(urlVoted, requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        upvotedComments: result
                    })
                })
            .catch(error => {
                console.log(error)
            })
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
                        myID: result.id
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    deleteComment(id){
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" + id;
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

    like(id, i) {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" + id + "/likes";
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
                this.addUpVotedComment(data, i)

            }).catch(error => {
            console.log(error)
        })
    }

    dislike(id, i) {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" + id + "/likes"
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
                this.deleteUpVotedComment(i)
                if (this.props.location.pathname === "/upvoted/comments") this.updateUpvotedComments()
            })
            .catch(error => {
                console.log(error)
            })
    }

    updateUpvotedComments() {
        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/upvoted"
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
                    console.log(result)
                    this.setState({
                        comments: result
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }


    deleteUpVotedComment(i) {
        let copyUpVoted = this.state.upvotedComments;
        let copyComment = this.state.comments;
        let index = -1;
        for (let k = 0; i <= copyComment.length; ++k) {
            if (copyUpVoted[k].id === copyComment[i].id) {
                index = k;
                break;
            }
        }
        console.log(index)
        if (index > -1) {
            copyUpVoted.splice(index, 1);
            copyComment[i].points -= 1;

        }
        this.setState({
            upvotedComments: copyUpVoted,
            comments: copyComment
        })
    }

    addUpVotedComment(data, i) {
        if (!data.hasOwnProperty("code")) {
            let copyUpVoted = this.state.upvotedComments.slice();
            copyUpVoted.push(data);
            let copyComment = this.state.comments;
            copyComment[i] = data;
            this.setState({
                upvotedComments: copyUpVoted,
                comments: copyComment
            })
        }
    }

    checkIfLiked(e) {
        let copyUpvoted = this.state.upvotedComments;
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
        let comments = this.state.comments.map((e, i) => {
            return (
                <li style={{marginBottom: '10px'}} key={i}>
                    <div className="url-link">
                        <small style={{marginRight: '6px'}}>
                            {this.checkIfLiked(e) ?
                                (<a href="#" onClick={() => this.dislike(e.id, i, 1)}>▼</a>) :
                                (<a href="#" onClick={() => this.like(e.id, i, 1)}>▲</a>)
                            }
                        </small>
                        <Link to={'/comments/' + e.id}>{e.content} </Link>
                    </div>
                    <div>
                        <small className="leftmar">
                            {e.points} by
                            <Link to={'/users/' + e.user_id}>
                                <User user_id={e.user_id}/>
                            </Link>
                            &nbsp;
                            <TimeAgo datetime={e.created_at} locale='en_US'/>
                            &nbsp;|&nbsp;
                            <Link to={'/comments/' + e.id}>
                                replies
                            </Link>
                            {this.checkIfIsMine(e.user_id) ?
                                <React.Fragment>
                                    &nbsp;|&nbsp;
                                    <Link to={'/comments/'+ e.id + '/edit'}>edit</Link>&nbsp;|&nbsp;
                                    <a href="#" onClick={() => this.deleteComment(e.id)}>delete</a>
                                </React.Fragment> : null
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
                        comments
                    }

                </ol>
            </div>
        );
    }
}

export default CommentsIndex
