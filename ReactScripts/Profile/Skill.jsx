/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Table, Dropdown, Input, Icon, Button } from 'semantic-ui-react'
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import './css/style.css';
const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))


const skillLevels = [
    {
        key: 0,
        text: 'Basic',
        value: 'basic'
    },
    {
        key: 1,
        text: 'Intermediate',
        value: 'intermediate'
    },
    {
        key: 2,
        text: 'Expert',
        value: 'expert'
    }
]
export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editSkill: '',
            newName: '',
            newLevel:'',
            hideError: true,
            showEdit: false,
            selectedSkill: '',
            selectedLevel: '',
            skills: [
            ]
        }
        this.newEditSkill = '';
        this.handleAddNew = this.handleAddNew.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.handleSkill = this.handleSkill.bind(this);
        this.handleLevel = this.handleLevel.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.cancelEdit = this.cancelEdit.bind(this)
        this.handleEditName = this.handleEditName.bind(this)
        this.handleEditLevel = this.handleEditLevel.bind(this)
        this.update = this.update.bind(this)
    }
    

    canAddSkill(newSkill) {
        var canAdd = true;

        this.state.skills.forEach(skill => {
            if (skill.name.toLowerCase() === newSkill.toLowerCase()) {
                ////
                ////
                canAdd = false;
            }
        });

        return canAdd;
    }

    componentWillReceiveProps(props) {
        if (props.skillData) {

            this.setState({
                skills: props.skillData
            })
        }
    }

    handleAddNew() {
        const id = ObjectId();
        if (this.canAddSkill(this.state.selectedSkill)) {
            this.state.skills.push({
                id: id,
                key: id,
                name: this.state.selectedSkill,
                level: this.state.selectedLevel
            })
            this.setState({
                skills: this.state.skills
            }, function () {
                this.props.updateProfileData({ skills: this.state.skills })
                this.closeEdit();
            })

        } else {
            this.setState({
                hideError: false,
            })
        }


    }

    showEdit() {
        this.setState({
            showEdit: true
        })
    }
    closeEdit() {
        this.setState({
            showEdit: false,

            selectedSkill: '',
            selectedLevel: '',
            hideError: true
        })
    }

    handleEdit(skill) {
        this.setState({
            editSkill: skill.id,
            newName: skill.name,
            newLevel: skill.level
        })
    }
    cancelEdit()
    {
        this.setState({
            editSkill:''
        })
    }
    handleDelete(id) {
        ////
        const filtered = this.state.skills.filter(lang => {
            if (lang.id != id) {
                return lang;
            }
        })
        this.setState({
            skills: filtered
        }, function () {
            this.props.updateProfileData({ skills: this.state.skills })
        })
    }

    handleEditName(event,data)
    {
        //
        this.setState({
            newName: data.value
        })
    }
    handleEditLevel(event,data)
    {
        //
        this.setState({
            newLevel: data.value
        })
    }
    update(e)
    {
        e.preventDefault();
        //
        //
        this.state.skills.map((lang) => {
            if(lang.id === this.state.editSkill)
            {
                lang.name = this.state.newName;
                lang.level = this.state.newLevel;
                
            }
        })
        //
        this.setState({
            skills: this.state.skills,
            editSkill:'',
            newName:'',
            newLevel:''
        }, function(){
            this.props.updateProfileData({"skills": this.state.skills})
        })
    }

    displayEditRow(skill) {
     
       
        return (
            <Table.Row key={skill.id}>
                <Table.Cell>
                <Input maxLength='15' value={this.state.newName} onChange={this.handleEditName} ></Input>
                </Table.Cell>
                <Table.Cell>
                <Dropdown 
                onChange={this.handleEditLevel}
                    placeholder='Skill Level'
                    selection
                    options={skillLevels}
                    value={this.state.newLevel}
                />
                </Table.Cell>
                <Table.Cell >
                    <Button basic color='blue' onClick={ this.update }>
                        Update
                    </Button>
                    <Button basic color='red' onClick={ this.cancelEdit }>
                        Cancel    </Button>
                </Table.Cell>
            </Table.Row>
        )
    }
    displayRow(skill) {
        return (
            <Table.Row key={skill.id}>
                <Table.Cell>{skill.name}</Table.Cell>
                <Table.Cell>{skill.level}</Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                    <Icon name='edit' onClick={ () => this.handleEdit(skill)} />
                    <Icon name='close' onClick={ () => this.handleDelete(skill.id) } />
                </Table.Cell>
            </Table.Row>
        )
    }
    displayTable() {
        return (<Table singleLine style={{ marginTop: '1rem', width: '100%' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{ width: '33%' }}>Skill</Table.HeaderCell>
                    <Table.HeaderCell style={{ width: '33%' }}>Level</Table.HeaderCell>
                    <Table.HeaderCell style={{ width: '33%', textAlign: 'right' }}>
                        <button
                            type="button"
                            className="ui   teal button"
                            onClick={this.showEdit}
                        >
                            <Icon name='plus' />
                                    Add New
                                  </button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    this.state.skills.map((skill) => {
                        if(this.state.editSkill === skill.id)
                        {
                            return this.displayEditRow(skill)
                        }else{
                            return this.displayRow(skill)
                        }
                        
                    })
                }

            </Table.Body>
        </Table>
        )
    }

    handleSkill(event, data) {
        this.setState({
            selectedSkill: data.value
        })
        if (!this.canAddSkill(data.value)) {
            this.setState({
                hideError: false
            })
        } else {
            this.setState({
                hideError: true
            })
        }


    }
    handleLevel(event, data) {
        this.setState({
            selectedLevel: data.value
        })
    }
    displayEdit() {
        return (
            <div className="row" style={{ paddingBottom: '1rem' }}>
                <Input maxLength='15' value={this.state.selectedSkill} placeholder="Add Skill" style={{ marginRight: '1rem' }} onChange={this.handleSkill}></Input>
                <Dropdown style={{ margin: '0', marginRight: '1rem' }}
                    placeholder='Skill Level'
                    selection
                    options={skillLevels}
                    value={this.state.selectedLevel}
                    onChange={this.handleLevel}
                />
                <button disabled={this.state.selectedSkill.length === 0 || this.state.selectedLevel.length === 0}
                    type="button" className="ui   teal button"
                    onClick={this.handleAddNew}>Add</button>
                <button type="button" className="ui   gray button" onClick={this.closeEdit}>Cancel</button>
                <br />
                <p hidden={this.state.hideError} style={{ margin: '0', color: 'red' }}>You have already added this skill.</p>
            </div>
        );
    }




    render() {
        return (
            <div style={{ width: '100%', padding: '1rem' }}>
                {(this.state.showEdit) ? this.displayEdit() : null}
                {this.displayTable()}
            </div>
        )

    }
}
