import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { Dropdown } from 'semantic-ui-react';
import {
    DateInput
} from 'semantic-ui-calendar-react';

const visaStatusOptions = [
    { key: 0, value: 'Citizen', text: 'Citizen' },
    { key: 1, value: 'Work Visa', text: 'Work Visa' },
    { key: 2, value: 'Student Visa', text: 'Student Visa' },
    { key: 3, value: 'Permanent Resident', text: 'Permanent Resident' },
];

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedStatus: this.props.visaStatus ? this.props.visaStatus : '',
            date: this.props.visaExpiryDate ? this.props.visaExpiryDate : (new Date()).toLocaleDateString()
        }
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.changed = this.changed.bind(this);
        this.showDate = this.showDate.bind(this);
    }

    changed()
    {
        if(this.props.visaExpiryDate != null) {
            const date = new Date(this.props.visaExpiryDate);
            const dateString = date.getDate()+"/"+ (date.getMonth()+1)+"/"+date.getFullYear();
            //
            if(dateString !== this.state.date)
            {
                 //
                return true;
            }
            
        }
        if(this.props.visaStatus !== this.state.selectedStatus)
        {   
            return true;

        }
        return false;
    }

    handleChange(event, data) {
        ////
        this.setState({
            selectedStatus: data.value
        })
    }

    handleDateChange(event, data) {
        //
        this.setState({
            date: data.value
        })
    }

    componentWillReceiveProps(props)
    {
        if(props.visaExpiryDate != null) {
        const date = new Date(props.visaExpiryDate);
        const dateString = date.getDate()+"/"+ (date.getMonth()+1)+"/"+date.getFullYear();
        this.setState({
            selectedStatus: props.visaStatus ? props.visaStatus : '',
            date:  dateString
        })
    }
    }
    save()
    {
        const from = this.state.date.split("/")
        const date = new Date(from[2], from[1] - 1, from[0]);
        this.props.saveProfileData({visaStatus: this.state.selectedStatus,
            visaExpiryDate: date
        })
    }

    showDate()
    {
       if(this.state.selectedStatus.toLowerCase() === 'work visa' || this.state.selectedStatus.toLowerCase() === 'student visa')
       {
           return true;
       }
       else{
           return false;
       }
    }

    render() {
        return (<div style={{ width: '100%' }}>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'right-aligned', paddingTop:'9px' }}>
                <div style={{marginRight:'9px'}}>
                    <label>Visa type</label>
                    <br />
                    <Dropdown style={{ width: '18rem', margin: '0em 0em 0em' }}
                        placeholder='Select your visa status'
                        selection
                        value={this.state.selectedStatus}
                        options={visaStatusOptions}
                        onChange={this.handleChange}
                        closeOnChange

                    />
                </div>

                <div style={{marginRight:'9px', display: ( ( this.showDate() )?'':'none')}}>
                    <label>Visa expiry date</label>
                    <br />
                    <DateInput
                    dateFormat="DD/MM/YYYY"
                        name="date"
                        placeholder="Date"
                        value={this.state.date}
                        onChange={this.handleDateChange}
                        closable
                    />
                </div>

                <div>
                    <br />
                <button style={{ display: (this.changed())?'':'none'}} type="button" className="ui right floated teal button" onClick={this.save}>Save</button>
                </div>
            </div>
            <br />


        </div>)
    }
}