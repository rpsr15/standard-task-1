/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { Table, Button, Icon, Input, Checkbox } from 'semantic-ui-react';
import {
    DateInput
} from 'semantic-ui-calendar-react';


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
                start: null,
                end: null
            },
            editedExperience:{
                id:'',
                company: '',
                position: '',
                responsibilities: '',
                start: null,
                end: null
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

    }

    handleAddNew() {
        
        if(this.state.newExperience.company === '' || this.state.newExperience.position === '' || this.state.newExperience.start === null || ( this.state.newExperience.end === null && !this.state.isCurrentPosition))
        {
            this.setState({ showError: true})
        }
        else{
            var experiences = this.state.experiences
            var newExperience = this.state.newExperience
            if (newExperience.end === null) {

                newExperience.end = new Date('01/01/1900')
            }
            const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
            
            newExperience.id  = ObjectId();
            experiences.push(newExperience);
            this.setState({
                experiences: experiences,
                showEdit: false,
                showError: false,
                newExperience: {
                    id:'',
                    company: '',
                    position: '',
                    responsibilities: '',
                    start: null,
                    end: null
                }
            }, function () {
                ////console.log("updating profile", this.state.experiences)
                this.props.updateProfileData({ experience: this.state.experiences })
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
                start: null,
                end: null
            }
        })
    }


    displayRow(experience) {
        ////console.log(experience)
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
        //////console.log("endstring",endDateString)
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
            <Table.Row >
                <Table.Cell colspan='5'>
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
        var dateParts = data.value.split("/");
        var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        const newExp = this.state.newExperience;
        newExp.start = date;
        this.setState({
            newExperience: newExp
        })
    }
    handleEndDateChange(event, data) {
        const newExp = this.state.newExperience;
        var dateParts = data.value.split("/");
        var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        newExp.end = date
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
        //console.log(props)
        this.setState({
            experiences: props.experienceData
        })
    }

    displayEditARow() {
       
        //console.log((new Date(this.state.editedExperience.end)).getFullYear() == '1900');
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
                            value={ (new Date(this.state.editedExperience.start))}
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
                            disabled={this.state.isCurrentPosition}
                            dateFormat="DD/MM/YYYY"
                            name="date"
                            placeholder="Date"
                            value={  (  (new Date(this.state.editedExperience.end)).getFullYear() == '1900' )? (new Date()): (new Date(this.state.editedExperience.end))}
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
                            toEdit.end = this.state.editedExperience.end;
                            this.setState({
                                editCompany:'',
                                experiences: experiences,
                                editedExperience:{
                                    id:'',
                                    company: '',
                                    position: '',
                                    responsibilities: '',
                                    start: null,
                                    end: null
                                }
                            }, function(){

                                this.props.updateProfileData({ experience: this.state.experiences})
                            })
                            //console.log("to edit", toEdit)
                        }}>Update</button>
                        <button type="button" className="ui left floated gray button" onClick={() => {
                            this.setState({
                                editCompany: '',
                                editedExperience:{
                                    id:'',
                                    company: '',
                                    position: '',
                                    responsibilities: '',
                                    start: null,
                                    end: null
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
                            value={this.state.newExperience.start}
                            onChange={this.handleStartDateChange}
                            closable
                        />
                    </div>
                    <div className='column' style={{ width: '50%' }}>
                        <label>End Date:</label>
                        <DateInput
                            disabled={this.state.isCurrentPosition}
                            dateFormat="DD/MM/YYYY"
                            name="date"
                            placeholder="Date"
                            value={this.state.newExperience.end}
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
