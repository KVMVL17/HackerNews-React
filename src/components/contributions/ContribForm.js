import React from 'react'

class ContribForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "",
            title: "",
            url: "",
            text: ""
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

        const url = "https://asw-hackernews-kaai12.herokuapp.com/api/contributions"
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
                console.log(data)
                if(!data.status)
                    this.props.history.push('/contributions/' + data.id)
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
                <div style={{color: "red", marginLeft: '34px', marginTop: '10px'}}>
                    {this.state.error}
                </div>
                <form>
                    <div className="field" style={{marginBottom: '15px', marginTop: '15px'}}>
                        <label>
                            Title:
                            <input id="textfield" type="text" name="title" value={this.state.title} onChange={
                                this.handleChange} />
                        </label>
                    </div>
                    <div className="field" style={{marginBottom: '15px'}}>
                        <label>
                            URL:
                            <input id="textfield" type="text" name="url" value={this.state.url} onChange={
                                this.handleChange} />
                        </label>
                    </div>
                    <div className="field" style={{marginBottom: '15px'}}>
                        <label>
                            Text:
                            <textarea name="text" className="bottomMar" rows="6" cols="60" value={this.state.text} onChange={
                                this.handleChange} />
                        </label>
                    </div>
                    <div style={{marginLeft: '40px'}} className="actions">
                        <input type="submit" value="Submit" onClick={this.handleSubmit}/>
                    </div>
                </form>

            </div>
        )
    }
}

export default ContribForm
