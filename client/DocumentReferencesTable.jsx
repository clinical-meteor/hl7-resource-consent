// import { Card, CardActions, CardMedia, CardText, CardTitle } from 'material-ui/Card';
// import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

// import React from 'react';
// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
// import { Table } from 'react-bootstrap';

// import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
// import { get } from 'lodash';

// export class DocumentReferencesTable extends React.Component {

//   getMeteorData() {
//     let data = {
//       style: {
//         text: Glass.darkroom()
//       },
//       selected: [],
//       documentReferences: DocumentReferences.find().fetch()
//     }

//     if(process.env.NODE_ENV === "test") console.log("DocumentReferencesTable[data]", data);
//     return data;
//   };


//   rowClick(id){
//     Session.set('documentReferencesUpsert', false);
//     Session.set('selectedocumentReferenceId', id);
//     Session.set('documentReferencePageTabIndex', 2);
//   };
//   renderIdentifierHeader(hideIdentifier){
//     if (!hideIdentifier) {
//       return (
//         <th className="identifier">identifier</th>
//       );
//     }
//   }
//   renderIdentifier(hideIdentifier, documentReferences ){
//     if (!hideIdentifier) {      
//       return (
//         <td className='identifier'>{ get(documentReferences, 'identifier[0].value') }</td>       
//       );
//     }
//   }
//   render () {
//     let tableRows = [];
//     for (var i = 0; i < this.data.documentReferences.length; i++) {
//       tableRows.push(
//         <tr key={i} className="documentReferenceRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.documentReferences[i]._id)} >
//           <td className='id'>{ get(this.data.documentReferences[i], 'id') }</td>
//           { this.renderIdentifier(this.props.hideIdentifier, get(this.data.documentReferences[i], 'identifier[0].value')) }
//           <td className='docStatus'>{ get(this.data.documentReferences[i], 'docStatus') }</td>
//           <td className='status'>{ get(this.data.documentReferences[i], 'status') }</td>
//           {/* <td className='content'>{get(this.data.documentReferences[i], 'content[0].attachment') }</td>
//           <td className='creation'>{ moment(get(this.data.documentReferences[i], 'content[0].creation')).format("YYYY-MM-DD") }</td> */}
//         </tr>
//       );
//     }

//     return(
//       <Table id='DocumentReferencesTable' hover >
//         <thead>
//           <tr>
//             <th className='id'>id</th>
//             { this.renderIdentifierHeader(this.props.hideIdentifier) }
//             <th className='docStatus'>Doc Status</th>
//             <th className='status'>Status</th>
//             {/* <th className='creation'>Creation</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           { tableRows }
//         </tbody>
//       </Table>
//     );
//   }
// }


// ReactMixin(DocumentReferencesTable.prototype, ReactMeteorData);
// export default DocumentReferencesTable;