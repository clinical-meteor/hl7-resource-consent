import { FlatButton, RaisedButton, Avatar } from 'material-ui';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui';
import Checkbox from 'material-ui/Checkbox';

export class ConsentTable extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px'
        },
        cell: {
          paddingTop: '16px'
        }
      },
      selected: [],
      consents: []
    };

    let query = {};
    if(this.props.patient){
      query['patient.display'] = this.props.patient;
    }

    if(this.props.query){
      query = this.props.query;
    }

    let options = {};
    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    // data.consents = [];
    data.consents = Consents.find(query, options).map(function(document){
      let result = {
        _id: document._id,
        dateTime: moment(get(document, 'dateTime', null)).format("YYYY-MM-DD"),
        status: get(document, 'status', ''),
        patientReference: get(document, 'patient.display', ''),
        consentingParty: get(document, 'consentingParty[0].display', ''),
        organization: get(document, 'organization.display', ''),
        policyRule: get(document, 'policyRule', ''),
        exceptType: get(document, 'except[0].type', ''),
        exceptAction: get(document, 'except[0].action[0].text', ''),
        exceptClass: get(document, 'except[0].class', ''),
        start: get(document, 'period.start', ''),
        end: get(document, 'period.end', ''),
        category: get(document, 'category[0].text', '')
      };

      var exceptions;
      if(get(document, 'except.0.class')){
        result.exceptClass = "";
        document.except[0].class.forEach(function(exception){   
          if(result.exceptClass == ''){
            result.exceptClass = exception.code;
          }  else {
            result.exceptClass = result.exceptClass + ' - ' + exception.code;
          }      
        });
      }
      return result;
    });

    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

    // console.log("ConsentTable[data]", data);
    return data;
  }
  rowClick(id){
    Session.set('consentsUpsert', false);
    Session.set('selectedConsent', id);
    Session.set('consentPageTabIndex', 2);
  }
  handleRevoke(id){
    console.log('handleRevoke')
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.consents.length === 0){
      // don't try to simplifiy the double negative in this expression
      // it's handling a boolean property, and also serving up instructions/help/warning
      // it's klunky to reason through; but it's not hurting anything
      if(!(this.props.noDataMessage === false)){
        footer = <TableNoData noDataPadding={ this.props.noDataMessagePadding } />
      }
    } else {
      for (var i = 0; i < this.data.consents.length; i++) {
        tableRows.push(
          <tr key={i} className="consentRow" style={{cursor: "pointer"}}>
            <td className='selected'  style={{minWidth: '100px', paddingTop: '16px'}}><Checkbox /></td>
            <td className='identifier barcode' style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.consents[i]._id }</td>
  
            <td className='date' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.consents[i].dateTime }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={this.data.style.cell}>{this.data.consents[i].status}</td>
            <td className='patientReference' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={this.data.style.cell} >{this.data.consents[i].patientReference }</td>
            {/* <td className='consentingParty' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={this.data.style.cell} >{this.data.consents[i].consentingParty}</td> */}
            <td className='organization' style={this.data.style.cell} >{this.data.consents[i].organization}</td>
            {/* <td className='policyRule' style={this.data.style.cell} >{this.data.consents[i].policyRule}</td> */}
            <td className='exceptType' style={this.data.style.cell} >{this.data.consents[i].exceptType}</td>
            {/* <td className='exceptAction' style={this.data.style.cell} >{this.data.consents[i].exceptAction}</td> */}
            <td className='exceptClass' style={this.data.style.cell} >{this.data.consents[i].exceptClass}</td>
            <td className='category' style={this.data.style.cell} >{this.data.consents[i].category}</td>
            <td className='revoke'>
              <FlatButton label="Revoke" onClick={this.handleRevoke.bind(this)} />
            </td>
          </tr>
        );
      }  
    }

    return(
      <div>
        <Table id='consentsTable' hover >
        <thead>
          <tr>
            <th className='selected'>Selected</th>
            <th className='identifier'>Identifier</th>
            <th className='name' style={{minWidth: '100px'}}>Date</th>
            <th className='status'>Status</th>
            <th className='patientReference'>Patient</th>
            {/* <th className='consentingParty' >consenting party</th> */}
            <th className='organization' >Organization</th>
            {/* <th className='rule' >rule</th> */}
            <th className='type' >Type</th>
            {/* <th className='action' >action</th> */}
            <th className='class' >Class</th>
            <th className='category' >Category</th>
            <th className='revoke' >Revoke</th>
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
      { footer }
      </div>
    );
  }
}


ReactMixin(ConsentTable.prototype, ReactMeteorData);
export default ConsentTable;