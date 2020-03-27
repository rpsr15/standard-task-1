import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        //
        this.state = {
            value: (this.props.status.status != '') ? this.props.status.status : ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, data)
    {
        
        this.setState({
            value: data.value
        }, function(){
            this.props.saveProfileData({jobSeekingStatus:{status:data.value, availableDate:null}})
        })

       
    }

    componentWillReceiveProps(props)
    {
        //
        if(props.status)
        {
            this.setState({
                value:props.status.status
            })
        }
    }


    render() {
        return (
            <div style={{padding:'9px'}}>
                <p>Current Staus</p>
             
                        <Checkbox
                            radio
                            label='Actively looking for a job'
                            name='checkboxRadioGroup'
                            value = '0'
                            checked={this.state.value === '0'}
                            onChange={this.handleChange}
                            onClick={this.handleChange}
                        />
                        <br/>
                        <Checkbox
                            radio
                            label='Not looking for a job at the moment'
                            name='checkboxRadioGroup'
                            value='1'
                            checked={this.state.value === '1'}
                            onChange={this.handleChange}
                        />
                        <br/>
                        <Checkbox
                            radio
                            label='Currently employed but open to offers'
                            name='checkboxRadioGroup'
                            value='2'
                            checked={this.state.value === '2'}
                            onChange={this.handleChange}
                        />
                        <br/>
                        <Checkbox
                            radio
                            label='Will be available on a later date'
                            name='checkboxRadioGroup'
                            value='3'
                            checked={this.state.value === '3'}
                            onChange={this.handleChange}
                        />
                        <br/>
             
            </div>
        );
    }
}