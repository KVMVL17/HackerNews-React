import React  from 'react';
import {Link} from "react-router-dom";
import RenderReplies from "./RenderReplies";
import TimeAgo from "timeago-react";
import User from "../users/User";

class ReplyShow extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            error: null,
            id: this.props.match.params.id,
            reply: [],
            replies: [],
            upVotedReplies : []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.fetchReply(this.state.id)
        this.fetchReplies(this.state.id)
        this.fetchUpVotedReplies()
    }

    fetchReply(idrep) {
        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" +  idrep

        fetch(url)
            .then(response => response.json())
            .then(
                (result) => {
                    console.log(result)
                    this.setState({
                        reply: result,
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    fetchReplies(idrep) {
        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" +  idrep + "/replies"

        fetch(url)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        replies: result
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    fetchUpVotedReplies() {
        let urlUpVoterdReplies = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/upvoted"
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        fetch(urlUpVoterdReplies, requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    console.log(result)
                    this.setState({
                        upVotedReplies: result

                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    handleChange(event) {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event)  {
        event.preventDefault()
        this.doPost()
        this.setState({
                content: ""
            }
        )
    }

    doPost() {

        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" + this.state.id
        console.log(url)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: JSON.stringify(this.state)
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                let new_replies = this.state.replies.concat(data)
                this.setState({
                    replies: new_replies
                })
                console.log(data)
            })
    }

    like(id) {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" + id + "/likes";
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
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" + id + "/likes"
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
        let copyUpvoted = this.state.upVotedReplies;
        for (let i = 0; i < copyUpvoted.length; ++i) {
            if (copyUpvoted[i].id === e.id) return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchReply(this.props.match.params.id)
            this.fetchReplies(this.props.match.params.id)
            this.fetchUpVotedReplies()
        }
    }

    render() {
        const reply = this.state.reply;
        return (
            <div className="content">
                <div style={{marginTop: '15px', marginBottom: '20px'}} className="leftmar">
                    <div className="inline">
                        <small>
                            {this.checkIfLiked(reply) ?
                            (<a href="#" onClick={() => this.dislike(reply.id,  1)}>▼</a>) :
                            (<a href="#" onClick={() => this.like(reply.id,  1)}>▲</a>)
                        }</small>
                        <span style={{marginLeft: '8px'}}>{reply.content}</span>
                    </div>
                    <div style={{marginLeft: '20px'}}  className="leftmar">
                        <small>
                            {reply.points} points by
                            <Link to={'/users/' + reply.user_id}>
                                <User user_id={reply.user_id}/>
                            </Link>
                            created&nbsp;
                            <TimeAgo datetime={reply.created_at} locale='en_US'/>
                        </small>
                    </div>
                    <div style={{marginTop: '15px'}} className="content">
                        <form>
                            <div className="leftmar">
                        <textarea className="bottomMar" rows="6" cols="60" name="content" value={this.state.content}
                                  onChange={this.handleChange}/>
                            </div>
                            <div style={{marginLeft: '15px'}} className="actions">
                                <input className="bottomMar" type="submit" value="add comment"
                                       onClick={this.handleSubmit}/>
                            </div>
                        </form>
                    </div>
                    <div style={{marginLeft: '15px', marginBottom: '15px'}}>
                        <RenderReplies idFather={this.state.id} type={"replies"} replies={this.state.replies}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReplyShow;
