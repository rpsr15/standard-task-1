/* Social media JSX */
import React, { Component } from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Form, Popup, Button, Icon, ButtonGroup, Input } from 'semantic-ui-react';
import './css/style.css';


export default class SocialMediaLinkedAccount extends Component {
    constructor(props) {
       
        super(props);
        //console.log("inside",this.props.linkedAccounts);
        this.state = {
            showEditSection: false,
            linkedinUrl: this.props.linkedAccounts.linkedIn,
            githubUrl: this.props.linkedAccounts.github,
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.onLinkedInClick = this.onLinkedInClick.bind(this);
        this.handleLinkedChange = this.handleLinkedChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.saveContact = this.saveContact.bind(this);
        this.onGithubClick = this.onGithubClick.bind(this);
        this.windowOpen = this.windowOpen.bind(this);

    }
    handleEmailChange(evt) { this.setState({ email: evt.target.value }); }

    componentDidMount() {
        //console.log("component did mount");
        $('.ui.button.social-media')
            .popup();
    }
    openEdit() {
        this.setState({
            showEditSection: true
        })
    }

    saveContact()
    {
        
        this.props.saveProfileData({ linkedAccounts: { linkedIn: this.state.linkedinUrl, github: this.state.githubUrl}});
        this.setState({
            showEditSection: false
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

   windowOpen(url) {
        if (!url.match(/^https?:\/\//i)) {
            url = 'http://' + url;
        }
        return window.open(url, "_blank");
    }
    onLinkedInClick(event, data) {
            event.preventDefault();
           //window.open(this.state.linkedinUrl, "_blank");
            this.windowOpen(this.state.linkedinUrl);
 

        return false;
    }
    onGithubClick(event, data) {
        event.preventDefault();
        window.open(this.state.githubUrl, "_blank");


    return false;
}

    handleLinkedChange(event) {
        //console.log(event.target.value);
        this.setState({
            linkedinUrl: event.target.value
        })
    }
    handleGithubChange(event) {
        //console.log(event.target.value);
        this.setState({
            githubUrl: event.target.value
        })
    }

    renderDisplay() {
        return (
            <div className='Demo' style={{ width: '100%' }}>

                <Button style={{ width: '12rem', margin: '10px', backgroundColor: '#0e76a8', color: 'white', maring: '0rem' }}
                    disabled={this.state.linkedinUrl === ''}
                    onClick={this.onLinkedInClick}
                >
                    <Icon style={{ color: 'white' }} name='linkedin'
                    />
                    LinkedIn
                    </Button>

                <Button style={{ width: '12rem', margin: '10px', backgroundColor: 'black', color: 'white' }}
                    disabled={this.state.githubUrl === ''}
                    onClick={this.onGithubClick}
                >
                    <Icon style={{ color: 'white' }} name='github' />
                    GitHub
                    </Button>
                <Button style={{ position: 'absolute', right: '0', margin: '10px', maringRight: '10px', backgroundColor: '#1d2e3e', color: 'white' }}
                    onClick={this.openEdit}
                >
                    Edit
                    </Button>

            </div>
        );
    }
    validateUrl(url) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (url.match(regex) ) {
            return true
        } else {
            return false;
        }
    }


    renderEdit() {

        return (
            <div className='ui sixteen wide column'>

                <label
                >LinkedIn</label><br />


                <input
                style={(this.validateUrl(this.state.linkedinUrl) ^ this.state.linkedinUrl == 0 ) ? {}:{borderColor:'red'}}
                    placeholder='Enter your linkedin url'
                    value={this.state.linkedinUrl}
                    onChange={this.handleLinkedChange}
                    maxLength='160'
                ></input>

                <br />
                <label >Github</label><br />
                <input
                    style={(this.validateUrl(this.state.githubUrl)^ this.state.githubUrl == 0 ) ? {}:{borderColor:'red'}}
                    placeholder='Enter your github url'
                    value={this.state.githubUrl}
                    onChange={this.handleGithubChange}
                    maxLength='160'
                ></input>
                <br/>
                <br />
               
                   
                <button
                disabled={!(
                    ( this.state.linkedinUrl.length === 0 && this.validateUrl(this.state.githubUrl))
                    || ( this.validateUrl(this.state.linkedinUrl) && this.state.githubUrl.length === 0)
                    || ( this.validateUrl(this.state.linkedinUrl) && this.validateUrl(this.state.githubUrl))
                )}
                type="button" className="ui teal button" onClick={this.saveContact} id={this.state.githubUrl + this.state.linkedinUrl}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )

    }

    componentWillReceiveProps(props)
    {
        this.setState({
            linkedinUrl: props.linkedAccounts.linkedIn,
            githubUrl: props.linkedAccounts.github
        })
    
    }
    render() {
       
        
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        );

    }

}