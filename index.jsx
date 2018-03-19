
import ConsentsPage from './client/ConsentsPage';
import ConsentTable from './client/ConsentTable';
import { Consent, Consents, ConsentSchema } from './lib/Consents';

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

export { 
  SidebarElements, 
  DynamicRoutes, 

  ConsentsPage,
  ConsentTable
};


