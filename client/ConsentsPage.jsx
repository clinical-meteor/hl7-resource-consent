import { FlatButton, CardText, CardTitle, Dialog, Tab, Tabs, TextField, SelectField, MenuItem } from 'material-ui';
import { GlassCard, Glass, FullPageCanvas } from 'meteor/clinical:glass-ui';

import ConsentDetail from './ConsentDetail';
import ConsentTable from './ConsentTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { get } from 'lodash';

import { Session } from 'meteor/session';
import { Col, Row, Table } from 'react-bootstrap';

let defaultConsent = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('consentFormData', defaultConsent);
Session.setDefault('consentSearchFilter', '');
Session.setDefault('consentDialogOpen', false);
Session.setDefault('selectedConsentId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class ConsentsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('consentPageTabIndex'),
      consent: defaultConsent,
      consentSearchFilter: '',
      currentConsent: null,
      dialogOpen: Session.get('consentDialogOpen'), 
      selectedConsentId: Session.get('selectedConsentId'),
      selectedConsent: false,
    };

    if (Session.get('consentFormData')) {
      data.consent = Session.get('consentFormData');
    }
    if (Session.get('consentSearchFilter')) {
      data.consentSearchFilter = Session.get('consentSearchFilter');
    }
    if (Session.get("selectedConsent")) {
      data.currentConsent = Session.get("selectedConsent");
    }

    if (Session.get('selectedConsentId')){
      data.selectedConsentId = Consents.findOne({_id: Session.get('selectedConsentId')});
    } else {
      data.selectedConsentId = false;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("ConsentsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('consentPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedConsent', false);
    Session.set('consentUpsert', false);
  }
  handleClose(){
    Session.set('consentDialogOpen', false);
  }

  render() {
    console.log('React.version: ' + React.version);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Search"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];

    
    return (
      <div id="consentsPage">
        <FullPageCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="Consents"
            />
            <CardText>
              <Tabs id='consentsPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newConsentTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   <ConsentDetail 
                   id='newConsent' 
                   fhirVersion={ this.data.fhirVersion }
                   consent={ this.data.selectedConsent }
                   consentId={ this.data.selectedConsentId } />       
                 </Tab>
                 <Tab className="consentListTab" label='Consents' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <ConsentTable 
                    showBarcodes={true} 
                    noDataMessagePadding={100}
                    />
                 </Tab>
                 <Tab className="consentDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <ConsentDetail 
                    id='consentDetails' 
                    fhirVersion={ this.data.fhirVersion }
                    consent={ this.data.selectedConsent }
                    consentId={ this.data.selectedConsentId } />                     
                    />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
          <Dialog
            title="Search Consent Records"
            actions={actions}
            modal={false}
            open={this.data.dialogOpen}
            onRequestClose={this.handleClose}
          >
            <Row>
              <Col md={6}>
                <TextField
                  id='givenNameInput'
                  ref='givenName'
                  name='givenName'
                  floatingLabelText='Given Name'
                  hintText='Jane'
                  // value={ get(this, 'data.consent.name[0].text', '')}
                  // onChange={ this.changeState.bind(this, 'name')}
                  floatingLabelFixed={true}
                  fullWidth
                  /><br/>
              </Col>
              <Col md={6}>
                <TextField
                  id='familyNameInput'
                  ref='familyName'
                  name='familyName'
                  floatingLabelText='Family Name'
                  hintText='Doe'
                  // value={ get(this, 'data.consent.name[0].text', '')}
                  // onChange={ this.changeState.bind(this, 'name')}
                  floatingLabelFixed={true}
                  fullWidth
                  /><br/>

              </Col>
            </Row>
            <SelectField
                floatingLabelText="Category"
                value={0}
                // onChange={this.changeSelectedCategory.bind(this)}
                fullWidth={true}
              >
                <MenuItem value={0} primaryText="" />
                <MenuItem value={1} primaryText="OAuth 2.0" />
                <MenuItem value={2} primaryText="Illinois Consent by Minors to Medical Procedures" />
                <MenuItem value={3} primaryText="42 CFR Part 2 Form of Written Consent" />
                <MenuItem value={4} primaryText="Common rule informed consent" />
                <MenuItem value={5} primaryText="Do Not Resuscitate" />
                <MenuItem value={6} primaryText="HIPAA Authorization" />
                <MenuItem value={7} primaryText="HIPAA Notice of Privacy Practices" />
                <MenuItem value={8} primaryText="HIPAA Restrictions" />
                <MenuItem value={9} primaryText="HIPAA Research Authorization" />
                {/* <MenuItem value={10} primaryText="HIPAA Self-Pay Restriction" />
                <MenuItem value={11} primaryText="Research Information Access" />
                <MenuItem value={12} primaryText="Authorization to Disclose Information to the Social Security Administration" />
                <MenuItem value={13} primaryText="Authorization and Consent to Release Information to the Department of Veterans Affairs (VA)" /> */}
                
              </SelectField>
        </Dialog>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(ConsentsPage.prototype, ReactMeteorData);

export default ConsentsPage;