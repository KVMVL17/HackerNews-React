import {Link} from "react-router-dom";
import React from "react";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            api: false,
            user: []
        }
        localStorage.setItem('token', 'Kq3Bs4dEBkTxdUvlSk7faw')
        this.changeApiKey = this.changeApiKey.bind(this)
    }

    changeApiKey(e) {
        if(this.state.api)
            localStorage.setItem('token', 'Kq3Bs4dEBkTxdUvlSk7faw')
        else
            localStorage.setItem('token', '-ExnIm9fIjM-Za8sfP7RYg')

        const neg_api = !this.state.api

        this.setState({
            api: neg_api
        })
        this.componentDidMount()
    }

    componentDidMount() {
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
                        user: result
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }


    render() {
        return (
            <div className="header">
                <img src="https://www.linkpicture.com/q/y18.gif" alt="logo"/>
                <div className="links">
                    <Link to={'/contributions'}><h1> Hacker News | </h1></Link>
                    <Link to={'/newest'}> new | </Link>
                    <Link to={'/ask'}>ask | </Link>
                    <Link to={'/comments/users/'+this.state.user.id}>threads | </Link>
                    <Link to={'/submit'}>submit</Link> |
                    api-key: {localStorage.getItem('token')}
                    <button className="change" onClick={this.changeApiKey}>change</button>
                    <Link className="right" to={'/myProfile'}> {this.state.user.username}({this.state.user.karma})</Link>
                </div>
            </div>
        )
    }
}

export default Header
