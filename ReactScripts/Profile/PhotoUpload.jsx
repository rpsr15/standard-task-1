/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Image, Input, Button } from 'semantic-ui-react'
import placeholder from '../../../../images/placeholder-square.png'
const defaultImage = "https://mpenny.co.za/wp-content/uploads/2014/10/placeholder-square-500x500-200x200.jpg";
export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUpload: '',
            hideButton: true
        }
        this.showButton = this.showButton.bind(this);
        this.hideButton = this.hideButton.bind(this);
        this.handleUpload = this.handleUpload.bind(this);

        this.handleClick = this.handleClick.bind(this);
    };
    showButton()
    {
        this.setState({
            hideButton: false
        })
    }
    hideButton()
    {
        this.setState({
            hideButton: true
        })
    }

    handleClick(e) {
        var file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            this.showButton();
            this.setState({
                imgUpload: reader.result
            })
          
        };
        reader.onerror = function (error) {
            //console.log('Error: ', error);
        }
    }

    handleUpload()
    {
        if(this.state.imgUpload.length > 0)
        {
            this.props.updateProfileData({profilePhoto: this.state.imgUpload});
            this.hideButton();
        }
    }

    componentWillReceiveProps(props)
    {
        console.log("component wi;ll receive props",props.imageData)
        if(props.imageData)
        {
            this.setState({
                imgUpload: props.imageData
            })
        }
       
    }
   
    render() {

        return (<div className="ui grid" style={{ width: '100%' }}>
            <div className="row" style={{ width: '100%' }}>
                <div className='column' style={{ width: '50%', textAlign:'center' }}>



                    <input id='fileinput' type='file' style={{ display: 'none' }}
                        accept=".png,.jpg"
                        onChange={this.handleClick}

                    />

                    <label htmlFor='fileinput'>
                      
                        <img src={(this.state.imgUpload.length > 0)? this.state.imgUpload:placeholder} className="ui medium image"


                            style={{
                                width: '30rem',
                                height:'10rem',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderRadius:'50%',
                                marginBottom:'9px'

                            }} />
                    </label>
                    <button style={{display: this.state.hideButton? 'none': ''}} type="button" className="ui  floated teal button" onClick={this.handleUpload}>Upload</button>

                </div>

            </div>

        </div>);


    }
}
