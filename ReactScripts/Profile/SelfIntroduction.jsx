/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import {TextArea, Input} from 'semantic-ui-react'

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: this.props.summary,
            description: this.props.description
        }
    this.onSummaryChange = this.onSummaryChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onSave = this.onSave.bind(this);
    };

    onSave()
    {
        this.props.updateProfileData({summary:this.state.summary , description: this.state.description})
    }
    onSummaryChange(event, data){
        this.setState({
            summary: data.value
        })

    }
    
    onDescriptionChange(event, data)
    {
        this.setState({
            description: data.value
        })

    }

    componentWillReceiveProps(props)
    {
        this.setState({
            summary: props.summary ? props.summary :'',
            description: props.description
        })
    }
    render() {
        return (
            <div style={{padding:'9px',width:'100%'}}>
                <Input onChange={this.onSummaryChange} value={this.state.summary} maxLength="150" fluid focus placeholder='Please provide a short summary about yourself' style={{marginBottom: '8px'}}  />
                <p>Summary must be no more than 150 words</p>
                <TextArea
                onChange={this.onDescriptionChange} value={this.state.description}
                minLength="150" maxLength="600"   style={{marginBottom: '8px'}} rows={6} placeholder="Please tell us about any hobbies, additonal expertise, or anything else you'd lke to add" />
                <p>Description must be between 150-600  characters</p>
                <button type="button" className="ui right floated teal button" onClick={this.onSave}>Save</button>
            </div>
        )
       
    }
}



