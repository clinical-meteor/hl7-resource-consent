import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';

//import { Consents } from '../../lib/Consents';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';


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
        consentingParty: get(document, 'consentingParty.0.display', ''),
        organization: get(document, 'organization.0.display', ''),
        policyRule: get(document, 'policyRule', ''),
        exceptType: get(document, 'except.0.type', ''),
        exceptAction: get(document, 'except.0.action.0.coding.0.code', ''),
        exceptClass: '',
        start: get(document, 'period.start', ''),
        end: get(document, 'period.end', '')
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
  render () {
    let tableRows = [];
    let footer;

    if(this.data.consents.length === 0){
      footer = <div style={{width: '100%', paddingTop: '120px', textAlign: 'center'}} >
        <h3>No data.</h3>
        <span>Are you sure you're logged in?</span>
      </div>
    } else {
      for (var i = 0; i < this.data.consents.length; i++) {
        tableRows.push(
          <tr key={i} className="consentRow" style={{cursor: "pointer"}}>
  
            <td className='date' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.consents[i].dateTime }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={this.data.style.cell}>{this.data.consents[i].status}</td>
            <td className='patientReference' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={this.data.style.cell} >{this.data.consents[i].patientReference }</td>
            <td className='consentingParty' onClick={ this.rowClick.bind('this', this.data.consents[i]._id)} style={this.data.style.cell} >{this.data.consents[i].consentingParty}</td>
            <td className='organization' style={this.data.style.cell} >{this.data.consents[i].organization}</td>
            {/* <td className='policyRule' style={this.data.style.cell} >{this.data.consents[i].policyRule}</td> */}
            <td className='exceptType' style={this.data.style.cell} >{this.data.consents[i].exceptType}</td>
            <td className='exceptAction' style={this.data.style.cell} >{this.data.consents[i].exceptAction}</td>
            <td className='exceptClass' style={this.data.style.cell} >{this.data.consents[i].exceptClass}</td>
          </tr>
        );
      }  
    }

    return(
      <div>
        <Table id='consentsTable' hover >
        <thead>
          <tr>
            <th className='name' style={{minWidth: '100px'}}>date</th>
            <th className='status'>status</th>
            <th className='patientReference'>patient</th>
            <th className='consentingParty' >consenting party</th>
            <th className='organization' >organization</th>
            {/* <th className='rule' >rule</th> */}
            <th className='type' >type</th>
            <th className='action' >action</th>
            <th className='class' >class</th>
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