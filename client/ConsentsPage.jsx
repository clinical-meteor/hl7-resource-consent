import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';
import { GlassCard, Glass, VerticalCanvas, FullPageCanvas } from 'meteor/clinical:glass-ui';

import ConsentDetail from './ConsentDetail';
import ConsentTable from './ConsentTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';

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
      currentConsent: null
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

  render() {
    console.log('React.version: ' + React.version);
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
                   <ConsentDetail id='newConsent' />
                 </Tab>
                 <Tab className="consentListTab" label='Consents' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <ConsentTable showBarcodes={true} />
                 </Tab>
                 <Tab className="consentDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <ConsentDetail id='consentDetails' currentConsent={this.data.currentConsent} />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(ConsentsPage.prototype, ReactMeteorData);

export default ConsentsPage;