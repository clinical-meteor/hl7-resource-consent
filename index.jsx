
import ConsentsPage from './client/ConsentsPage';
import ConsentTable from './client/ConsentTable';
import ProvenancesTable from './client/ProvenancesTable';
import DocumentReferencesTable from './client/DocumentReferencesTable';
import { Consent, Consents, ConsentSchema } from './lib/Consents';

// let consent = require('../data/consent-example-smartonfhir.json');
// console.log('consent', consent)

var DynamicRoutes = [{
  'name': 'ConsentIdPage',
  'path': '/Consent/:consentId',
  'component': ConsentsPage,
  'requireAuth': true
}, {
  'name': 'ConsentPage',
  'path': '/consents',
  'component': ConsentsPage,
  'requireAuth': true
}];

// var DynamicRoutes = [];

var SidebarElements = [{
  'primaryText': 'Consents',
  'to': '/consents',
  'href': '/consents'
}];

var AdminSidebarElements = [{
  'primaryText': 'Consents',
  'to': '/consents',
  'href': '/consents'
}];

export { 
  AdminSidebarElements,
  SidebarElements, 
  DynamicRoutes, 

  ConsentsPage,
  ConsentTable,

  ProvenancesTable,
  DocumentReferencesTable
};


