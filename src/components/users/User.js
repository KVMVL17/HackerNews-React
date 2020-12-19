import React  from 'react';

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            id: this.props.user_id,
            username: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.user_id !== prevProps.user_id) {
            this.fetchUser(this.props.user_id)
        }
    }

    componentDidMount() {
        this.fetchUser(this.state.id)
    }

    fetchUser(id) {
        let url = "https://asw-hackernews-kaai12.herokuapp.com/api/users/" +  id

        fetch(url)
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        username: result.username
                    })
                })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <span>
                &nbsp;{this.state.username}&nbsp;
            </span>
        );
    }
}

export default User;
