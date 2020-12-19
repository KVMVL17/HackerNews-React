import React  from 'react';
import {Link} from "react-router-dom";
import RenderComments from "../comments/RenderComments";
import TimeAgo from "timeago-react";
import User from "../users/User";

class ContribShow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            id: this.props.match.params.id,
            contribution: [],
            comments: [],
            content: "",
            upVotedContributions: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {

        this.fetchContribution()
        this.fetchComments()

    }

    fetchContribution() {
        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" +  this.state.id

        fetch(url)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        contribution: result,
                    })
                })
            .catch(error => {
                console.log(error)
            })

        let urlUpVoted = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/upvoted"
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: null
        };

        fetch(urlUpVoted,requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        upVotedContributions : result
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    fetchComments() {

        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" +  this.state.id + "/comments"

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

        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + this.state.id + "/comments"

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
                let new_comments = this.state.comments.concat(data)
                this.setState({
                    comments: new_comments
                })
                console.log(data)
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        //TODO: Bucle infinito al hacer delete
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.componentDidMount()
        }
    }

    render() {
        const contribution = this.state.contribution;
        return (
            <div className="content">
                <div style={{marginTop: '15px', marginBottom: '20px'}} className="leftmar">
                    <div className="inline">
                        <small>{
                            this.checkIfLiked(contribution) ?
                                    (<a href="#" onClick={() => this.dislike(contribution.id,1)}>▼</a>) :
                                    (<a href="#" onClick={() => this.like(contribution.id, 1)}>▲</a>)

                        }</small>
                        <a style={{marginLeft: '8px'}} className="esl" href={contribution.url}>{contribution.title} </a>
                            { contribution.url?(
                                    <small style={{marginLeft: '3px'}}>
                                        <a href={contribution.url}>
                                            ({contribution.url})
                                        </a>
                                    </small>
                            ): <React.Fragment/>}
                    </div>
                    <div className="leftmar">
                        <small style={{marginLeft: '3px'}}>
                            {contribution.points} points by
                            <Link to={'/users/' + contribution.user_id}>
                                <User user_id={contribution.user_id}/>
                            </Link>
                            created&nbsp;
                            <TimeAgo datetime={contribution.created_at} locale='en_US'/>
                        </small>
                        <p style={{marginTop: '7px', marginLeft: '6px'}}>{contribution.text}</p>
                    </div>
                    <div className="content">
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
                </div>
                <div style={{marginLeft: '15px', marginBottom: '15px'}}>
                    <RenderComments idFather={this.state.id} type={"contribution"} comments={this.state.comments}/>
                </div>
            </div>
        );
    }
}

export default ContribShow;
