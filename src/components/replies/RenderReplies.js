import React  from 'react';
import {Link} from "react-router-dom";
import User from "../users/User";
import TimeAgo from "timeago-react";

class RenderReplies extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            idFather: this.props.idFather,
            type: this.props.type,
            replies: [],
            upVotedReplies: [],
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.replies) !== JSON.stringify(prevState.replies)){
            if(nextProps.replies)
                return({
                replies: nextProps.replies
            })
            else
                return []
        }
        return null;
    }

/*
    componentWillReceiveProps(props) {
        if(props.replies) {
            this.setState({
                ...this.state,
                replies: props.replies
            })
        }
    }
*/
    componentDidMount() {

        this.fetchCommentOrReply()
    }

    fetchCommentOrReply() {

        let url
        if(this.state.type === "comment")
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" +  this.state.idFather + "/replies"
        else
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" +  this.state.idFather + "/replies"

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

    like(id, i) {
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
                this.addUpVotedReply(data, i)

            }).catch(error => {
            console.log(error)
        })
    }

    dislike(id, i) {
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
            .then(() => this.deleteUpVotedReply(i))
            .catch(error => {
                console.log(error)
            })
    }

    deleteUpVotedReply(i) {
        let copyUpVoted = this.state.upVotedReplies;
        let copyReply = this.state.replies;
        let index = -1;
        for (let k = 0; i <= copyReply.length; ++k) {
            if (copyUpVoted[k].id === copyReply[i].id) {
                index = k;
                break;
            }
        }
        if (index > -1) {
            copyUpVoted.splice(index, 1);
            copyReply[i].points -= 1;

        }
        this.setState({
            upVotedReplies: copyUpVoted,
            contributions: copyReply
        })
    }

    addUpVotedReply(data, i) {
        if (!data.hasOwnProperty("code")) {
            let copyUpVoted = this.state.upVotedReplies.slice();
            copyUpVoted.push(data);
            let copyReply = this.state.replies;
            copyReply[i] = data;
            this.setState({
                upVotedReplies: copyUpVoted,
                contributions: copyReply
            })
        }
    }

    checkIfLiked(e) {
        let copyUpvoted = this.state.upVotedReplies;
        for (let i = 0; i < copyUpvoted.length; ++i) {
            if (copyUpvoted[i].id === e.id) return true;
        }
        return false;
    }

    render() {
        //en comptes de fer link en botto "Reply", aver si amb redirect a la path funcionaria.
        let renderReplies = this.state.replies.map((e,i) => {
            return (
                <div style={{marginBottom: '10px'}}>
                    <small>
                        <small style={{marginRight: '6px'}}>
                            {this.checkIfLiked(e) ?
                                (<a href="#" onClick={() => this.dislike(e.id, i, 1)}>▼</a>) :
                                (<a href="#" onClick={() => this.like(e.id, i, 1)}>▲</a>)
                            }

                        </small>
                        {e.points} points by
                        <Link to={'/users/' + e.user_id}>
                            <User user_id={e.user_id}/>
                        </Link>
                        created&nbsp;
                        <TimeAgo datetime={e.created_at} locale='en_US'/>
                    </small>
                    <div className="pad-comment">
                        {e.content} <br />
                        <small>
                            <Link to={'/replies/'+ e.id }>
                                Reply
                            </Link>
                        </small>
                        <div style={{marginLeft: '22px'}}>
                            <RenderReplies idFather={e.id} type="reply"/>
                        </div>
                    </div>
                </div>

            )
        })
        return (
            renderReplies
        )
    }
}

export default RenderReplies;
