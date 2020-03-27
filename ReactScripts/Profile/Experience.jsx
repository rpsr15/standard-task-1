/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { Table, Button, Icon, Input, Checkbox } from 'semantic-ui-react';
import {
    DateInput
} from 'semantic-ui-calendar-react';

const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editCompany:'',
            isCurrentPosition: false,
            showError: false,
            showEdit: false,
            experiences: [

            ],
            newExperience: {
                id:'',
                company: '',
                position: '',
                responsibilities: '',
                start: (new Date()),
                end: (new Date())
            },
            editedExperience:{
                id:'',
                company: '',
                position: '',
                responsibilities: '',
                start: (new Date()),
                end: (new Date())
            }
        }
        this.handleAddNew = this.handleAddNew.bind(this);
        this.closeNew = this.closeNew.bind(this);
        this.displayRow = this.displayRow.bind(this);
        this.displayEditRow = this.displayEditRow.bind(this);
        this.handleNewCompany = this.handleNewCompany.bind(this)
        this.handleNewResponsiblity = this.handleNewResponsiblity.bind(this)
        this.handleNewPosition = this.handleNewPosition.bind(this)
        this.handleEndDateChange = this.handleEndDateChange.bind(this)
        this.handleStartDateChange = this.handleStartDateChange.bind(this)
        this.handleCheckBox = this.handleCheckBox.bind(this)
        this.getDateString = this.getDateString.bind(this)

    }

    getDateString(date)
    {
        const dateVal = new Date(date)
        var result =  dateVal.getDate()+"/"+(dateVal.getMonth()+1)+"/"+dateVal.getFullYear()
        if(result == '1/1/1900')
        {
            const date = new Date()
            result = ''
        }
        return result
    }
    handleAddNew() {
       
        if(this.state.newExperience.company === '' || this.state.newExperience.position === '' )
        {
            this.setState({ showError: true})
        }
        else{
            var experiences = this.state.experiences
            var newExperience = this.state.newExperience
            if (this.state.isCurrentPosition) {

                newExperience.end = new Date('01/01/1900')
            }
            
            
            newExperience.id  = ObjectId();
           
            experiences.push(newExperience);
            this.props.updateProfileData({experience: experiences})
            
            this.setState({
                experiences: experiences,
                showEdit: false,
                showError: false,
                newExperience: {
                    id:'',
                    company: '',
                    position: '',
                    responsibilities: '',
                    start: (new Date()),
                    end: (new Date())
                }
            })
        }

            
        
    }


    closeNew() {
        this.setState({
            showError: false,
            showEdit: false,
            newExperience: {
                company: '',
                position: '',
                responsibilities: '',
                start: (new Date()),
                end: (new Date())
            }
        })
    }


    displayRow(experience) {
        ////
        var startDate = null;
        var endDate = null;
        if (experience.start) {

            startDate = new Date(experience.start);
        }
        var endDateString = ''
        if (experience.end) {
            endDate = new Date(experience.end);
            endDateString = endDate.getDate() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getFullYear();
            if(endDateString === '1/1/1900')
            {
                endDateString = 'current position'
            }

        }
        //////
        return (<Table.Row key={experience.id} >
            <Table.Cell style={{ margin:'0',maxWidth:'2rem',overflowWrap:'break-word', wordWrap:'break-word', hyphens:'auto'}} > {experience.company} </Table.Cell>
            <Table.Cell style={{ margin:'0',maxWidth:'2rem',overflowWrap:'break-word', wordWrap:'break-word', hyphens:'auto'}}>{experience.position}</Table.Cell>
            <Table.Cell style={{ margin:'0',maxWidth:'2rem',overflowWrap:'break-word', wordWrap:'break-word', hyphens:'auto'}}>{experience.responsibilities}</Table.Cell>
            <Table.Cell >{startDate ? (startDate.getDate() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getFullYear()) : ''}</Table.Cell>
            <Table.Cell >{endDateString}</Table.Cell>
            <Table.Cell style={{  textAlign:'right'}}>
                <Icon name='edit' onClick={ () => {
                    this.setState({
                        editCompany: experience.id,
                        editedExperience: $.extend( true, {}, experience )
                    })
                }} />
                <Icon name='close' onClick={() => {
                    var filtered = this.state.experiences.filter((exp) => {
                        if (exp.company != experience.company) {
                            return exp
                        }
                    })
                    this.setState({
                        experiences: filtered
                    }, function () {
                        this.props.updateProfileData({ experience: this.state.experiences });
                    })
                }} />
            </Table.Cell>
        </Table.Row>)
    }
    displayEditRow(experience) {
        return ( 
            <Table.Row  key={experience.id}>
                <Table.Cell colSpan='5'>
{  this.displayEditARow(experience)}
                </Table.Cell>
            </Table.Row>
        )
    }
    displayTable() {
        return (<Table  style={{ marginTop: '1rem',}} >
            <Table.Header>
                <Table.Row >
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Position</Table.HeaderCell>
                    <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                    <Table.HeaderCell>Start</Table.HeaderCell>
                    <Table.HeaderCell>End</Table.HeaderCell>
                    <Table.HeaderCell>
                        <button
                            type="button"
                            className="ui   teal button"
                            onClick={() => { this.setState({ showEdit: true }) }}
                        >
                            <Icon name='plus' />
                                Add New
                              </button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {this.state.experiences.map((experience) => {
                    if(this.state.editCompany === experience.id)
                    {
                        return this.displayEditRow(experience);

                    }
                    else{

                        return this.displayRow(experience);
                    }
                })}

            </Table.Body>
        </Table>
        )
    }

    handleNewCompany(event, data) {
        const newExp = this.state.newExperience;
        newExp.company = data.value
        this.setState({
            newExperience: newExp
        })
    }

    handleNewPosition(event, data) {
        const newExp = this.state.newExperience;
        newExp.position = data.value
        this.setState({
            newExperience: newExp
        })
    }

    handleNewResponsiblity(event, data) {
        const newExp = this.state.newExperience;
        newExp.responsibilities = data.value;
        this.setState({
            newExperience: newExp
        })
    }

    handleStartDateChange(event, data) {
        const newExp = this.state.newExperience;
        var dateParts = data.value.split("/");

// month is 0-based, that's why we need dataParts[1] - 1
var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        newExp.start = dateObject;
        this.setState({
            newExperience: newExp
        })
    }
    handleEndDateChange(event, data) {
        const newExp = this.state.newExperience;
        var dateParts = data.value.split("/");

        // month is 0-based, that's why we need dataParts[1] - 1
        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                newExp.end = dateObject;
        this.setState({
            newExperience: newExp
        })
    }

    handleCheckBox() {
        this.setState({
            isCurrentPosition: !this.state.isCurrentPosition
        })
    }

    componentWillReceiveProps(props) {
        //
        if(props.experienceData)
        {
            if(props.experienceData.length > 0)
            {
               props.experienceData.map((exp) => {
                   if(exp.start != null)
                   {
                   
                    exp.start = new Date(exp.start)
                   }else{
                    exp.start= new Date('01/01/1900')
                   }
                   if(exp.end != null)
                   {
           
                    exp.end = new Date(exp.end)
                   }else{
                    exp.end = new Date('01/01/1900')
                   }

               })

               this.setState({
                experiences: props.experienceData
            })
            }
        }
        
    }

    displayEditARow() {
       
        //
        return (

            <div className='ui grid' style={{ width: '100%' }}>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column' style={{ width: '50%' }}>

                        <label>Company</label><br />
                        <Input maxLength='40' value={this.state.editedExperience.company} onChange={(event,data) => {
                            var editedExperience = this.state.editedExperience
                            editedExperience.company = data.value
                            this.setState({
                                editedExperience: editedExperience
                            })
                        }} style={{ width: '100%' }} placeholder="company"></Input>
                    </div>
                    <div className='column' style={{ width: '50%' }}>
                        <label>Position:</label><br />
                        <Input value={this.state.editedExperience.position} onChange={(event,data) => {
                            var editedExperience = this.state.editedExperience
                            editedExperience.position = data.value
                            this.setState({
                                editedExperience: editedExperience
                            })
                        }} maxLength='40' style={{ width: '100%' }} placeholder="Position"></Input>
                    </div>
                </div>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column' style={{ width: '50%' }}>
                        <label>Start Date:</label>
                        <DateInput
                            dateFormat="DD/MM/YYYY"
                            name="date"
                            placeholder="Date"
                            value={ this.getDateString(this.state.editedExperience.start) }
                            onChange={(event,data) => {
                                var dateParts = data.value.split("/");
                                var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                                const newExp = this.state.editedExperience;
                                newExp.start = date;
                                this.setState({
                                    editedExperience: newExp
                                })
                            }}
                            closable
                        />
                    </div>
                    <div className='column' style={{ width: '50%' }}>
                        <label>End Date:</label>
                        <DateInput
                            minDate={this.getDateString(this.state.editedExperience.start)}
                            disabled={this.state.isCurrentPosition}
                            dateFormat="DD/MM/YYYY"
                            name="date"
                            placeholder="Date"
                            value={    this.getDateString(this.state.editedExperience.end) }
                            onChange={(event,data) => {
                                var dateParts = data.value.split("/");
                                var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                                const newExp = this.state.editedExperience;
                                newExp.end = date;
                                this.setState({
                                    editedExperience: newExp
                                })
                            }}
                            closable
                        />
                        <Checkbox checked={this.state.isCurrentPosition} onClick={this.handleCheckBox} label='This is my current position' />
                    </div>
                </div>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column'>

                        <label>Responsibilities:</label>
                        <Input value={this.state.editedExperience.responsibilities} onChange={(event,data) => {
                            var editedExperience = this.state.editedExperience
                            editedExperience.responsibilities = data.value
                            this.setState({
                                editedExperience: editedExperience
                            })
                        }} maxLength='100' style={{ width: '100%' }} placeholder="Responsiblities"></Input>
                    </div>
                </div>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column'>

                        <button type="button" className="ui left floated teal button" onClick={()=> {

                            var experiences = this.state.experiences
                            var toEdit = experiences.find( (expr) => {return expr.id == this.state.editCompany});
                            toEdit.company = this.state.editedExperience.company;
                            toEdit.position = this.state.editedExperience.position;
                            toEdit.responsibilities = this.state.editedExperience.responsibilities;
                            toEdit.start = this.state.editedExperience.start;
                            if(this.state.isCurrentPosition == true)
                            {
                                toEdit.end = new Date('01/01/1900')
                            }else{
                                toEdit.end = this.state.editedExperience.end;
                            }
                            
                            this.setState({
                                editCompany:'',
                                isCurrentPosition: false,
                                experiences: experiences,
                                editedExperience:{
                                    id:'',
                                    company: '',
                                    position: '',
                                    responsibilities: '',
                                    start: (new Date()),
                                    end: (new Date())
                                }
                            }, function(){

                                this.props.updateProfileData({ experience: this.state.experiences})
                            })
                            //
                        }}>Update</button>
                        <button type="button" className="ui left floated gray button" onClick={() => {
                            this.setState({
                                editCompany: '',
                                editedExperience:{
                                    id:'',
                                    company: '',
                                    position: '',
                                    responsibilities: '',
                                    start: (new Date()),
                                    end: (new Date())
                                }
                            })
                        }}>Cancel</button>
                        <p hidden={!this.state.showError} style={{ color: 'red' }}>Please add Company , position and dates </p>
                    </div>
                </div>


            </div>

        );
    }
    displayEdit() {
        return (

            <div className='ui grid' style={{ width: '100%' }}>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column' style={{ width: '50%' }}>

                        <label>Company</label><br />
                        <Input maxLength='40' value={this.state.newExperience.company} onChange={this.handleNewCompany} style={{ width: '100%' }} placeholder="company"></Input>
                    </div>
                    <div className='column' style={{ width: '50%' }}>
                        <label>Position:</label><br />
                        <Input value={this.state.newExperience.position} onChange={this.handleNewPosition} maxLength='40' style={{ width: '100%' }} placeholder="Position"></Input>
                    </div>
                </div>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column' style={{ width: '50%' }}>
                        <label>Start Date:</label>
                        <DateInput
                            dateFormat="DD/MM/YYYY"
                            name="date"
                            placeholder="Date"
                            value={  this.getDateString(this.state.newExperience.start) }
                            onChange={this.handleStartDateChange}
                            closable
                        />
                    </div>
                    <div className='column' style={{ width: '50%' }}>
                        <label>End Date:</label>
                        <DateInput
                            minDate={this.getDateString(this.state.newExperience.start)}
                            disabled={this.state.isCurrentPosition}
                            dateFormat="DD/MM/YYYY"
                            name="date"
                            placeholder="Date"
                            value={this.state.newExperience.end.getDate()+"/"+(this.state.newExperience.end.getMonth()+1)+"/"+this.state.newExperience.end.getFullYear()}
                            onChange={this.handleEndDateChange}
                            closable
                        />
                        <Checkbox checked={this.state.isCurrentPosition} onClick={this.handleCheckBox} label='This is my current position' />
                    </div>
                </div>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column'>

                        <label>Responsibilities:</label>
                        <Input value={this.state.newExperience.responsibilities} onChange={this.handleNewResponsiblity} maxLength='100' style={{ width: '100%' }} placeholder="Responsiblities"></Input>
                    </div>
                </div>
                <div className='row' style={{ width: '100%' }}>
                    <div className='column'>

                        <button type="button" className="ui left floated teal button" onClick={this.handleAddNew}>Add</button>
                        <button type="button" className="ui left floated gray button" onClick={this.closeNew}>Cancel</button>
                        <p hidden={!this.state.showError} style={{ color: 'red' }}>Please add Company , position and dates </p>
                    </div>
                </div>


            </div>

        );
    }




    render() {
        return (
            <div style={{ padding: '1rem', width:'100%' }}>
                {(this.state.showEdit) ? this.displayEdit() : null}
                {this.displayTable()}
            </div>
        )

    }

}
