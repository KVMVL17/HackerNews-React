import React  from 'react';
import {Link} from "react-router-dom";
import User from "../users/User";
import TimeAgo from "timeago-react";

class CommentEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "",
            parent: [],
            content: "",
            comment: [],
            contribution: [],
            contribution_id: -1,
            id: this.props.match.params.id
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" + this.state.id

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    comment: data,
                    contribution_id: data.contribution_id,
                    content: data.content,
                })
                console.log(this.state.contribution_id);
            })
            .catch(error => console.log(error))

        this.fetchContribution();
    }

    fetchContribution(){
        if(this.state.contribution_id !== -1){
            const url2 = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" +  this.state.contribution_id

            fetch(url2)
                .then(response => response.json())
                .then(
                    (result) => {
                        this.setState({
                            contribution: result
                        })
                    })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleChange(event) {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.doPost()

    }

    doPost() {

        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" + this.state.id
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': localStorage.getItem('token')
            },
            body: JSON.stringify(this.state)
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status === "error") {
                    this.setState({
                        error: data.message
                    })
                }
                else
                    this.props.history.push('/comments/' + this.state.id)
            })
            .catch(error => console.log(error))

    }

    render() {

        return(
            <div className="content">
                <h3 style={{marginLeft: '20px', marginBottom: '0px'}}>Editing a comment</h3>
                <div style={{color: "red", marginLeft: '15px', marginBottom: '10px'}}>
                    {this.state.error}
                </div>
                <div style={{marginLeft: '10px'}}>
                    <small style={{marginLeft: '14px'}}>
                        {this.state.comment.points} points by
                        <Link to={'/users/' + this.state.comment.user_id}>
                            <User user_id={this.state.comment.user_id}/>
                        </Link>
                        created&nbsp;
                        <TimeAgo datetime={this.state.comment.created_at} locale='en_US'/>
                        <Link to={'/contributions/' + this.state.contribution_id}>
                            &nbsp;on:&nbsp;{this.state.contribution_id}&nbsp;
                        </Link>
                    </small>
                    <form style={{marginTop: '20px'}}>
                        <div className="leftmar">
                            <textarea className="bottomMar" rows="6" cols="60" name="content" value={this.state.content}
                                      onChange={this.handleChange}/>
                        </div>
                        <div style={{marginLeft: '15px'}} className="actions">
                            <input className="bottomMar" type="submit" value="update comment"
                                   onClick={this.handleSubmit}/>
                        </div>
                    </form>
                </div>
                <br/>
            </div>
        )
    }

}
export default CommentEdit;
