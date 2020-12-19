import React from 'react'

class CommentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data.id,
            type: this.props.type,
            content: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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
    }

    doPost() {

        let url

        if(this.state.type === 'contribution')
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + this.state.id + "/comments"
        else if(this.state.type === 'comment')
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/comments/" + this.state.id + "/replies"
        else
            url = "https://asw-hackernews-kaai12.herokuapp.com/api/replies/" + this.state.id


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
                this.setState({
                    id: data
                })
            })
    }

    render() {
        return (
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
        )
    }
}

export default CommentForm
