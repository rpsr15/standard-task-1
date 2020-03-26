/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { Table, Dropdown, Input, Icon, Button } from 'semantic-ui-react'
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import './css/style.css';
import { lang, relativeTimeThreshold } from 'moment';


const languageLevels = [
    {
        key: 0,
        text: 'Basic',
        value: 'basic'
    },
    {
        key: 1,
        text: 'Conversational',
        value: 'conversational'
    },
    {
        key: 2,
        text: 'Fluent',
        value: 'fluent'
    },
    {
        key: 3,
        text: 'Native/Bilingual',
        value: 'native/bilingual'
    }
]

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editLanguage: '',
            newName: '',
            newLevel:'',
            hideError: true,
            showEdit: false,
            selectedLanguage: '',
            selectedLevel: '',
            languages: [
            ]
        }
        this.newEditLanguage = '';
        this.handleAddNew = this.handleAddNew.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.handleLanguage = this.handleLanguage.bind(this);
        this.handleLevel = this.handleLevel.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.cancelEdit = this.cancelEdit.bind(this)
        this.handleEditName = this.handleEditName.bind(this)
        this.handleEditLevel = this.handleEditLevel.bind(this)
        this.update = this.update.bind(this)
    }
    

    canAddLanguage(newLanguage) {
        var canAdd = true;

        this.state.languages.forEach(language => {
            if (language.name.toLowerCase() === newLanguage.toLowerCase()) {
                //console.log("comparing "+ language.name + " to"+ newLanguage)
                //console.log("returning false")
                canAdd = false;
            }
        });

        return canAdd;
    }

    componentWillReceiveProps(props) {
        if (props.languageData) {

            this.setState({
                languages: props.languageData
            })
        }
    }

    handleAddNew() {

        if (this.canAddLanguage(this.state.selectedLanguage)) {
            this.state.languages.push({
                key: this.state.selectedLanguage,
                name: this.state.selectedLanguage,
                level: this.state.selectedLevel
            })
            this.setState({
                languages: this.state.languages
            }, function () {
                this.props.updateProfileData({ languages: this.state.languages })
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

            selectedLanguage: '',
            selectedLevel: '',
            hideError: true
        })
    }

    handleEdit(name,level) {
        this.setState({
            editLanguage: name,
            newName: name,
            newLevel: level
        })
    }
    cancelEdit()
    {
        this.setState({
            editLanguage:''
        })
    }
    handleDelete(name) {
        //console.log("handle delelte", name )
        const filtered = this.state.languages.filter(lang => {
            if (lang.name != name) {
                return lang;
            }
        })
        this.setState({
            languages: filtered
        }, function () {
            this.props.updateProfileData({ languages: this.state.languages })
        })
    }

    handleEditName(event,data)
    {
        console.log(data.value)
        this.setState({
            newName: data.value
        })
    }
    handleEditLevel(event,data)
    {
        console.log(data.value)
        this.setState({
            newLevel: data.value
        })
    }
    update(e)
    {
        e.preventDefault();
        console.log("upafsdf")
        console.log('before',this.state.languages)
        this.state.languages.map((lang) => {
            if(lang.name === this.state.editLanguage)
            {
                lang.name = this.state.newName;
                lang.level = this.state.newLevel;
                
            }
        })
        console.log("after",this.state.languages)
        this.setState({
            languages: this.state.languages,
            editLanguage:'',
            newName:'',
            newLevel:''
        }, function(){
            this.props.updateProfileData({"languages": this.state.languages})
        })
    }

    displayEditRow(language) {
     
       
        return (
            <Table.Row key={language.name}>
                <Table.Cell>
                <Input  maxLength='18' value={this.state.newName} onChange={this.handleEditName} placeholder={language.name}></Input>
                </Table.Cell>
                <Table.Cell>
                <Dropdown 
                onChange={this.handleEditLevel}
                    placeholder='Language Level'
                    selection
                    options={languageLevels}
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
    displayRow(language) {
        return (
            <Table.Row key={language.name}>
                <Table.Cell>{language.name}</Table.Cell>
                <Table.Cell>{language.level}</Table.Cell>
                <Table.Cell style={{ textAlign: 'right' }}>
                    <Icon name='edit' onClick={ () => this.handleEdit(language.name, language.level)} />
                    <Icon name='close' onClick={ () => this.handleDelete(language.name) } />
                </Table.Cell>
            </Table.Row>
        )
    }
    displayTable() {
        return (<Table singleLine style={{ marginTop: '1rem', width: '100%' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{ width: '33%' }}>Language</Table.HeaderCell>
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
                    this.state.languages.map((language) => {
                        if(this.state.editLanguage === language.name)
                        {
                            return this.displayEditRow(language)
                        }else{
                            return this.displayRow(language)
                        }
                        
                    })
                }

            </Table.Body>
        </Table>
        )
    }

    handleLanguage(event, data) {
        this.setState({
            selectedLanguage: data.value
        })
        if (!this.canAddLanguage(data.value)) {
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
                <Input maxLength='15' value={this.state.selectedLanguage} placeholder="Add Language" style={{ marginRight: '1rem' }} onChange={this.handleLanguage}></Input>
                <Dropdown style={{ margin: '0', marginRight: '1rem' }}
                    placeholder='Language Level'
                    selection
                    options={languageLevels}
                    value={this.state.selectedLevel}
                    onChange={this.handleLevel}
                />
                <button disabled={this.state.selectedLanguage.length === 0 || this.state.selectedLevel.length === 0}
                    type="button" className="ui   teal button"
                    onClick={this.handleAddNew}>Add</button>
                <button type="button" className="ui   gray button" onClick={this.closeEdit}>Cancel</button>
                <br />
                <p hidden={this.state.hideError} style={{ margin: '0', color: 'red' }}>You have already added this language.</p>
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