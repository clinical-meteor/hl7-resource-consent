
import ConsentsPage from './client/ConsentsPage';
import ConsentTable from './client/ConsentTable';
import { Consent, Consents, ConsentSchema } from './lib/Consents';

// let consent = require('../data/consent-example-smartonfhir.json');
// console.log('consent', consent)

var DynamicRoutes = [{
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
  ConsentTable
};


