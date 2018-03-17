import { CardActions, CardText } from 'material-ui/Card';
import { get, has, set } from 'lodash';
// import { insertConsent, removeConsentById, updateConsent } from '/imports/ui/workflows/consents/methods';
// import { insertConsent, removeConsentById, updateConsent } from 'meteor/clinical:hl7-resource-consent';
import { insertConsent, removeConsentById, updateConsent } from 'meteor/clinical:hl7-resource-consent';


import { Bert } from 'meteor/themeteorchef:bert';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';

import { Consents } from '../../lib/Consents';
import { Session } from 'meteor/session';


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

export default class ConsentDetail extends React.Component {
  getMeteorData() {
    let data = {
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

  render() {
    return (
      <div id={this.props.id} className="consentDetail">
        <CardText>
          <TextField
            id='nameInput'
            ref='name'
            name='name'
            floatingLabelText='name'
            value={ get(this, 'data.consent.name[0].text', '')}
            onChange={ this.changeState.bind(this, 'name')}
            fullWidth
            /><br/>
          <TextField
            id='genderInput'
            ref='gender'
            name='gender'
            floatingLabelText='gender'
            hintText='male | female | other | indeterminate | unknown'
            value={ get(this, 'data.consent.gender', '')}
            onChange={ this.changeState.bind(this, 'gender')}
            fullWidth
            /><br/>
          <TextField
            id='birthdateInput'
            ref='birthdate'
            name='birthdate'
            floatingLabelText='birthdate'
            hintText='YYYY-MM-DD'
            value={ get(this, 'data.consent.birthDate', '')}
            onChange={ this.changeState.bind(this, 'birthDate')}
            fullWidth
            /><br/>
          <TextField
            id='photoInput'
            ref='photo'
            name='photo'
            floatingLabelText='photo'
            value={ get(this, 'data.consent.photo[0].url', '')}
            onChange={ this.changeState.bind(this, 'photo')}
            floatingLabelFixed={false}
            fullWidth
            /><br/>
          <TextField
            id='mrnInput'
            ref='mrn'
            name='mrn'
            floatingLabelText='medical record number'
            value={ get(this, 'data.consent.identifier[0].value', '')}
            onChange={ this.changeState.bind(this, 'mrn')}
            fullWidth
            /><br/>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.consentId) }
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
