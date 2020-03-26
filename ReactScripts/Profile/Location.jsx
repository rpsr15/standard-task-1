import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Dropdown, Input } from 'semantic-ui-react';
const countries =
    Object.keys(Countries).map((country, index) => {
        return { 'key': index, 'text': country, 'value': country };
    })

export class Address extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            cities: {},
            edit: false,
            selectedCountry: '',
            city: '',
            numberStreet: '',
            street: '',
            suburb: '',
            postcode: ''
        }

        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.hideEdit = this.hideEdit.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleNumber = this.handleNumber.bind(this);
        this.handleSuburb = this.handleSuburb.bind(this);
        this.handlePostCode = this.handlePostCode.bind(this);
        this.handleStreet = this.handleStreet.bind(this);
        this.save = this.save.bind(this);

    }
    showEdit() {
        this.setState({
            edit: true
        })
    }
    hideEdit() {
        this.setState({
            edit: false
        })
    }
    handleCountryChange(data, event) {

        const cities = Countries[event.value].map((city, index) => {
            return { key: index, text: city, value: city }
        })

        this.setState({
            selectedCountry: event.value,
            cities: cities
        })
    }

    handleCityChange(data, event) {
        this.setState({
            city: event.value
        })

    }

    handlePostCode(data, event) {
        this.setState({
            postcode: event.value
        })
    }
    save()
    {
        this.props.saveProfileData({"address":{
            city: this.state.city,
            country: this.state.selectedCountry,
            number: this.state.numberStreet,
            street: this.state.street,
            postCode: this.state.postcode,
            suburb: this.state.suburb
        }})
        this.hideEdit();

    }

    componentWillReceiveProps(props) {

        var cities = null;
        if(props.addressData.country.length > 0){
         cities = Countries[props.addressData.country].map((city, index) => {
            return { key: index, text: city, value: city }
        })

        }
        this.setState({
            selectedCountry: props.addressData.country
            , city: props.addressData.city
            , numberStreet: props.addressData.number
            , postcode: props.addressData.postCode
            , street: props.addressData.street,
            suburb: props.addressData.suburb,
            cities: cities? cities: {}

        })
    }
    handleNumber(data,event)
    {
        this.setState({
            numberStreet: event.value
        })

    }
    handleStreet(data,event)
    {
        this.setState({
            street: event.value
        })
    }
    handleSuburb(data,event)
    {
        this.setState({
            suburb: event.value
        })
    }

    renderEdit() {
        {console.log(this.state.city)}
        return (
            <React.Fragment>
                <div className='row' style={{}}>
                    <div style={{ width: '20%', margin: '9px', }}>
                        <label>Number</label> <br />
                        <Input maxLength="3" value={this.state.numberStreet} onChange={this.handleNumber} placeholder='Unit No'></Input>
                    </div>

                    <div style={{ width: '50%', margin: '9px', }}>
                        <label>Street</label> <br />
                        <Input maxLength="20" value={this.state.street} onChange={this.handleStreet} style={{ width: '100%' }} placeholder='Street name'></Input>
                    </div>

                    <div style={{ width: '20%', margin: '9px' }}>
                        <label>Suburb</label> <br />
                        <Input maxLength="20" value={this.state.suburb} onChange={this.handleSuburb} placeholder='Enter Suburb'></Input>
                    </div>
                </div>

                <div className='row' style={{}}>
                    <div style={{ width: '35%', margin: '9px' }}>
                        <label>Country</label> <br />
                        <Dropdown style={{ width: '18rem', margin: '10px' }}
                            placeholder='Select your country'
                            fluid
                            search
                            selection
                            options={countries}
                            onChange={this.handleCountryChange}
                            value={this.state.selectedCountry}
                        />
                    </div>

                    <div style={{ width: '35%', margin: '9px' }}>
                        <label>City</label> <br />
                        <Dropdown style={{ width: '18rem', margin: '10px' }}
                            placeholder='Select your country'
                            fluid
                            search
                            selection
                            options={this.state.cities}
                            onChange={this.handleCityChange}

                            
                            value={this.state.city}
                        />
                    </div>

                    <div style={{ width: '20%', margin: '9px', }}>
                        <label>Post Code</label> <br />
                        <Input maxLength="6" placeholder='Enter Suburb' onChange={this.handlePostCode} value={this.state.postcode}></Input>
                    </div>
                </div>
                <div className="row" style={{ marginLeft: '9px' }}>
                    <button type="button" className="ui right floated teal button" onClick={this.save}>Save</button>
                    <button type="button" className="ui right floated gray button" onClick={this.hideEdit}>Cancel</button>

                </div>
            </React.Fragment>
        )
    }

    renderDisplay() {
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
        <p>Address: { this.state.numberStreet + ' ' + this.state.street +' ' + this.state.suburb}</p>
        <p>City: {this.state.city}</p>
        <p>Country: {this.state.selectedCountry}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.showEdit}>Edit</button>
                </div>
            </div>
        )
    }

    render() {
        return (
            this.state.edit ? this.renderEdit() : this.renderDisplay()
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        const countries =
            Object.keys(Countries).map((country, index) => {
                return { 'key': index, 'text': country, 'value': country };
            })
        this.state = {
            countries: countries,
            selectedCountry: this.props.nationalityData ? this.props.nationalityData : ''
        }

        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event, data) {
        this.setState({
            selectedCountry: data.value
        })
        this.props.saveProfileData({ nationality: data.value })
        //Todo: update to backend and deal with result
    }

    componentWillReceiveProps(props) {


        this.setState({
            selectedCountry: props.nationalityData
        })
    }

    render() {
        //console.log("nationality data", this.state.countries[0]);
        return (
            <div style={{ width: '100%' }}>
                <Dropdown style={{ width: '18rem', margin: '10px' }}
                    placeholder='Select your nationality'
                    fluid
                    search
                    selection
                    value={this.state.selectedCountry}
                    options={this.state.countries}
                    onChange={this.handleChange}
                />
            </div>
        );

    }
}