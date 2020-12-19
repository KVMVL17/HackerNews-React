import React  from 'react';

class ContribEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "",
            title: "",
            url: "",
            text: "",
            id: this.props.match.params.id
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + this.state.id

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    title: data.title,
                    url: data.url,
                    text: data.text
                })
            })
            .catch(error => console.log(error))
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

        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions/" + this.state.id
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
                if(data.status === "ok")
                    this.props.history.push('/contributions/' + this.state.id)
                else
                    this.setState({
                        error: data.message
                    })
            })
            .catch(error => console.log(error))

    }

    render() {
        return (
            <div className="content">
                <h3 style={{marginLeft: '13px'}}>Editing a contribution</h3>
                <div style={{color: "red"}}>
                    {this.state.error}
                </div>
                <form>
                    <div className="field" style={{marginBottom: '15px', marginTop: '15px'}}>
                        <label>
                            Title:
                            <input style={{marginLeft: '6px'}} id="textfield" type="text" name="title" defaultValue={this.state.title} value={this.state.title} onChange={
                                this.handleChange} />
                        </label>
                    </div>
                    { this.state.url==="" ?
                        <React.Fragment>
                            <div> URL: </div>
                            <div className="field" style={{marginBottom: '15px'}}>
                                <label>
                                    Text:
                                    <textarea name="text" className="bottomMar" rows="6" cols="60" defaultValue={this.state.url} value={this.state.text} onChange={
                                        this.handleChange} />
                                </label>
                            </div>
                        </React.Fragment> :
                        <div className="field" style={{marginBottom: '15px'}}>
                            <label>
                                URL:
                                <a href={this.state.url}>&nbsp;&nbsp;{this.state.url} </a>
                            </label>
                        </div>
                    }
                    <div style={{marginLeft: '40px'}} className="actions">
                        <input type="submit" value="Update" onClick={this.handleSubmit}/>
                    </div>
                </form>

            </div>
        );
    }
}

export default ContribEdit;
