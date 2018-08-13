import { get } from 'lodash';

import { Bert } from 'meteor/clinical:alert';
import { CardActions, CardText, Checkbox, RaisedButton, SelectField, MenuItem, TextField } from 'material-ui';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Consents } from '../lib/Consents';
import { Session } from 'meteor/session';

import { Col, Row, Table } from 'react-bootstrap';


let defaultConsent = {
  "resourceType" : "Consent",
  "name" : [{
    "text" : "",
    "resourceType" : "HumanName"
  }],
  "active" : true,
  "gender" : "",
  "birthDate" : '',
  "photo" : [{
    url: ""
  }],
  identifier: [{
    "use": "usual",
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v2/0203",
          "code": "MR"
        }
      ]
    },
    "value": ""
  }],
  "test" : false
};


Session.setDefault('consentUpsert', false);
Session.setDefault('selectedConsent', false);
Session.setDefault('selectedCategory', 0);

export default class ConsentDetail extends React.Component {
  getMeteorData() {
    let data = {
      selectedCategory: Session.get('selectedCategory'),
      consentId: false,
      consent: defaultConsent
    };

    if (Session.get('consentUpsert')) {
      data.consent = Session.get('consentUpsert');
    } else {
      if (Session.get('selectedConsent')) {
        data.consentId = Session.get('selectedConsent');
        console.log("selectedConsent", Session.get('selectedConsent'));

        let selectedConsent = Consents.findOne({_id: Session.get('selectedConsent')});
        console.log("selectedConsent", selectedConsent);

        if (selectedConsent) {
          data.consent = selectedConsent;

          if (typeof selectedConsent.birthDate === "object") {
            data.consent.birthDate = moment(selectedConsent.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.consent = defaultConsent;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("ConsentDetail[data]", data);
    return data;
  }
  changeSelectedCategory(event, value){
    console.log('changeSelectedCategory', event, value)
    Session.set('selectedCategory', value)
  }
  render() {

    let renderText;

    switch (this.data.selectedCategory) {
      case 0:
        renderText = <Table>
          <thead>
            <tr>
              <th className='selected'>selected</th>
              <th className='category' >category</th>
            </tr>
          </thead>
          <tbody>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Allergies</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>CarePlans</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Conditions</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Devices</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Family Member Histories</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Goals</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Immunizations</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Medication Statements</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Observations</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Patient Demographics</td>          
            </tr>
            <tr className="consentRow" style={{cursor: "pointer"}}>
              <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
              <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Procedures</td>          
            </tr>
          </tbody>
        </Table>
      break;
        case 4:
          renderText = <div>
              <p>I understand DNR means that if my heart stops beating or if I stop breathing, no medical procedure to restart breathing or heart functioning will be instituted.</p>
              <p>I understand this decision will not prevent me from obtaining other emergency medical care by prehospital emergency medical care personnel and/or medical care directed by a physician prior to my death.</p>
              <p>I understand I may revoke this directive at any time by destroying this form and removing any “DNR” medallions.</p>
              <p>I give permission for this information to be given to the prehospital emergency care personnel, doctors, nurses or other health personnel as necessary to implement this directive.</p>
              <p>I hereby agree to the “Do Not Resuscitate” (DNR) order.</p>
            </div>
        break;
      default:
        break;
    }


    return (
      <div id={this.props.id} className="consentDetail">
        <CardText>
          <Row>
            <Col md={6}>
              <TextField
                id='identifierInput'
                ref='identifier'
                name='identifier'
                className='barcode'
                floatingLabelText='Identifier'
                hintText={Random.id()}
                value={ get(this, 'data.consent.identifier[0].value', '')}
                onChange={ this.changeState.bind(this, 'mrn')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
              <TextField
                id='patientNameInput'
                ref='patientName'
                name='patientName'
                floatingLabelText='Patient Name'
                hintText='Jane Doe'
                // value={ get(this, 'data.consent.name[0].text', '')}
                // onChange={ this.changeState.bind(this, 'name')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
              <TextField
                id='organizationInput'
                ref='organization'
                name='organization'
                floatingLabelText='Organization'
                hintText='St. James Infirmiry'
                // value={ get(this, 'data.consent.name[0].text', '')}
                // onChange={ this.changeState.bind(this, 'name')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
              <TextField
                id='statusInput'
                ref='status'
                name='status'
                floatingLabelText='status'
                hintText='draft | proposed | active | rejected | inactive | entered-in-error'
                // value={ get(this, 'data.consent.gender', '')}
                // onChange={ this.changeState.bind(this, 'gender')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
              <TextField
                id='signedOnInput'
                ref='signedOn'
                name='signedOn'
                type='date'
                floatingLabelText='Signed On'
                // hintText='YYYY-MM-DD'
                // value={ get(this, 'data.consent.birthDate', '')}
                // onChange={ this.changeState.bind(this, 'birthDate')}
                floatingLabelFixed={true}
                fullWidth
                /><br/><br/>

              { this.determineButtons(this.data.consentId) }
            </Col>
            <Col md={6}>
              <SelectField
                floatingLabelText="Category"
                value={0}
                onChange={this.changeSelectedCategory.bind(this)}
                fullWidth={true}
              >
                <MenuItem value={0} primaryText="OAuth 2.0" />
                <MenuItem value={1} primaryText="Illinois Consent by Minors to Medical Procedures" />
                <MenuItem value={2} primaryText="42 CFR Part 2 Form of Written Consent" />
                <MenuItem value={3} primaryText="Common rule informed consent" />
                <MenuItem value={4} primaryText="Do Not Resuscitate" />
                <MenuItem value={5} primaryText="HIPAA Authorization" />
                <MenuItem value={6} primaryText="HIPAA Notice of Privacy Practices" />
                <MenuItem value={7} primaryText="HIPAA Restrictions" />
                <MenuItem value={8} primaryText="HIPAA Research Authorization" />
                <MenuItem value={9} primaryText="HIPAA Self-Pay Restriction" />
                <MenuItem value={10} primaryText="Research Information Access" />
                <MenuItem value={11} primaryText="Authorization to Disclose Information to the Social Security Administration" />
                <MenuItem value={12} primaryText="Authorization and Consent to Release Information to the Department of Veterans Affairs (VA)" />
              </SelectField>
              { renderText }
            </Col>
          </Row>
        </CardText>
        <CardActions>
        </CardActions>
      </div>
    );
  }
  determineButtons(consentId){
    if (consentId) {
      return (
        <div>
          <RaisedButton id='saveConsentButton' className='saveConsentButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveConsentButton'  className='saveConsentButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    let consentUpdate;

    if(process.env.TRACE) console.log("consentDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new consent
    if (Session.get('consentUpsert')) {
      consentUpdate = Session.get('consentUpsert');
    } else {
      consentUpdate = defaultConsent;
    }



    // if there's an existing consent, use them
    if (Session.get('selectedConsent')) {
      consentUpdate = this.data.consent;
    }

    switch (field) {
      case "name":
        consentUpdate.name[0].text = value;
        break;
      case "gender":
        consentUpdate.gender = value.toLowerCase();
        break;
      case "birthDate":
        consentUpdate.birthDate = value;
        break;
      case "photo":
        consentUpdate.photo[0].url = value;
        break;
      case "mrn":
        consentUpdate.identifier[0].value = value;
        break;
      default:

    }
    // consentUpdate[field] = value;
    process.env.TRACE && console.log("consentUpdate", consentUpdate);

    Session.set('consentUpsert', consentUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let consentUpdate = Session.get('consentUpsert', consentUpdate);


    if (consentUpdate.birthDate) {
      consentUpdate.birthDate = new Date(consentUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("consentUpdate", consentUpdate);

    if (Session.get('selectedConsent')) {
      if(process.env.NODE_ENV === "test") console.log("Updating consent...");

      delete consentUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      consentUpdate.resourceType = 'Consent';

      Consents.update({_id: Session.get('selectedConsent')}, {$set: consentUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Consents.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Consents", recordId: Session.get('selectedConsent')});
          // Session.set('consentUpdate', defaultConsent);
          Session.set('consentUpsert', false);
          Session.set('selectedConsent', false);
          Session.set('consentPageTabIndex', 1);
          Bert.alert('Consent added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new consent...", consentUpdate);

      Consents.insert(consentUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Consents.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Consents", recordId: result});
          Session.set('consentPageTabIndex', 1);
          Session.set('selectedConsent', false);
          Session.set('consentUpsert', false);
          Bert.alert('Consent added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('consentPageTabIndex', 1);
  }

  handleDeleteButton(){
    Consents.remove({_id: Session.get('selectedConsent')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Consents.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Consents", recordId: Session.get('selectedConsent')});
        // Session.set('consentUpdate', defaultConsent);
        Session.set('consentUpsert', false);
        Session.set('consentPageTabIndex', 1);
        Session.set('selectedConsent', false);
        Bert.alert('Consent removed!', 'success');
      }
    });
  }
}


ReactMixin(ConsentDetail.prototype, ReactMeteorData);
