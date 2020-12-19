import React  from 'react';
import UserShowView from "./UserShowView";
import MyProfile from "./MyProfile";

class UserShow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            id: parseInt(this.props.match.params.id),
            myProfile: null,
            user: []
        }
    }

    componentDidMount() {

        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/users/" +  this.state.id

        fetch(url)
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

        this.fetchActualUser()
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
                    if(result.id === this.state.id) {
                        this.setState({
                            myProfile: true
                        })
                    } else {
                        this.setState({
                            myProfile: false
                        })
                    }
                })
            .catch(error => {
                console.log(error)
            })
    }



    render() {
        const user = this.state.user
        return (

            <div>
                {this.state.myProfile ? <MyProfile/> : <UserShowView user={user}/>}
            </div>
        );

    }
}

export default UserShow;
