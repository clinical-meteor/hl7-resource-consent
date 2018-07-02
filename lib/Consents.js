import { BaseModel } from 'meteor/clinical:base-model';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { BaseSchema, DomainResourceSchema } from 'meteor/clinical:hl7-resource-datatypes';


// create the object using our BaseModel
Consent = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Consent.prototype._collection = Consents;


// Create a persistent data store for addresses to be stored.
// HL7.Resources.Consents = new Mongo.Collection('HL7.Resources.Consents');
Consents = new Mongo.Collection('Consents');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Consents._transform = function (document) {
  return new Consent(document);
};



ConsentSchema = new SimpleSchema([
  BaseSchema,
  DomainResourceSchema,
  {
  "resourceType" : {
    type: String,
    defaultValue: "Consent"
  },
  "identifier" : { 
    optional: true,
    type: IdentifierSchema
  }, 
  "status" : {
    optional: true,
    type: Code
  }, 
  "category" : {
    optional: true,
    type: [ CodeableConceptSchema ]
  }, 
  "patient" : { 
    optional: true,
    type: ReferenceSchema
  }, 
  "period" : { 
    optional: true,
    type: PeriodSchema 
  }, 
  "dateTime" : {
    optional: true,
    type: Date
  }, 
  "consentingParty" : {
    optional: true,
    type: [ ReferenceSchema ]
  }, 
  "actor.$.role" : {
    optional: true,
    type: CodeableConceptSchema 
  }, 
  "actor.$.reference" : {
    optional: true,
    type: ReferenceSchema 
  },
  "action" : {
    optional: true,
    type: [ CodeableConceptSchema ]
  }, 
  "organization" : {
    optional: true,
    type: [ ReferenceSchema ]
  },   
  "sourceAttachment" : {
    optional: true,
    type: AttachmentSchema 
  },
  "sourceIdentifier" : {
    optional: true,
    type: IdentifierSchema 
  },
  "sourceReference" : {
    optional: true,
    type: ReferenceSchema 
  },
  "policy.$.authority" : {
    optional: true,
    type: String
  }, 
  "policy.$.uri" : {
    optional: true,
    type: String
  }, 
  "policyRule" : {
    optional: true,
    type: String
  }, 
  "securityLabel" : {
    optional: true,
    type: [ CodingSchema ]
  }, 
  "purpose" : {
    optional: true,
    type: [ CodingSchema ]
  }, 
  "dataPeriod" : {
    optional: true,
    type: PeriodSchema 
  }, 
  "data.$.meaning" : {
    optional: true,
    type: Code
  }, 
  "data.$.reference" : {
    optional: true,
    type: ReferenceSchema 
  },
  "except.$.type" : {
    optional: true,
    type: Code
  }, 
  "except.$.period" : {
    optional: true,
    type: PeriodSchema 
  }, 
  "except.$.actor.$.role" : {
    optional: true,
    type: CodeableConceptSchema 
  }, 
  "except.$.actor.$.reference" : {
    optional: true,
    type: ReferenceSchema 
  },
  "except.$.action" : {
    optional: true,
    type: [ CodeableConceptSchema ]
  }, 
  "except.$.securityLabel" : {
    optional: true,
    type: [ CodingSchema ]
  }, 
  "except.$.purpose" : {
    optional: true,
    type: [ CodingSchema ]
  }, 
  "except.$.class" : {
    optional: true,
    type: [ CodingSchema ]
  }, 
  "except.$.code" : {
    optional: true,
    type: [ CodingSchema ]
  }, 
  "except.$.dataPeriod" : {
    optional: true,
    type: PeriodSchema 
  }, 
  "except.$.data.$.meaning" : {
    optional: true,
    type: Code
  }, 
  "except.$.data.$.reference" : {
    optional: true,
    type: ReferenceSchema 
  } 
}]);
Consents.attachSchema(ConsentSchema);


Consent.prototype.toFhir = function(){
  console.log('Consent.toFhir()');



  return EJSON.stringify(this.name);
}



/**
 * @summary Search the Consents collection for a specific Meteor.userId().
 * @memberOf Consents
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let consents = Consents.findMrn('12345').fetch();
 * ```
 */

Consents.fetchBundle = function (query, parameters, callback) {
  process.env.TRACE && console.log("Consents.fetchBundle()");  
  var consentArray = Consents.find(query, parameters, callback).map(function(consent){
    consent.id = consent._id;
    delete consent._document;
    return consent;
  });

  // console.log("consentArray", consentArray);

  var result = Bundle.generate(consentArray);

  // console.log("result", result.entry[0]);

  return result;
};


/**
 * @summary This function takes a FHIR resource and prepares it for storage in Mongo.
 * @memberOf Consents
 * @name toMongo
 * @version 1.6.0
 * @returns { Consent }
 * @example
 * ```js
 *  let consents = Consents.toMongo('12345').fetch();
 * ```
 */

Consents.toMongo = function (originalConsent) {
  var mongoRecord;
  process.env.TRACE && console.log("Consents.toMongo()");  

  if (originalConsent.identifier) {
    originalConsent.identifier.forEach(function(identifier){
      if (identifier.period) {
        if (identifier.period.start) {
          var startArray = identifier.period.start.split('-');
          identifier.period.start = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
        if (identifier.period.end) {
          var endArray = identifier.period.end.split('-');
          identifier.period.end = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
      }
    });
  }

  return originalConsent;
};



/**
 * @summary This function takes a DTSU2 resource and returns it as STU3.  i.e. it converts from v1.0.2 to v3.0.0
 * @name toMongo
 * @version 3.0.0
 * @returns { Consent }
 * @example
 * ```js
 * ```
 */
Consents.toStu3 = function(consentJson){
  if(consentJson){

    // quick cast from string to boolean
    if(typeof consentJson.birthDate === "string"){
      consentJson.birthDate = new Date(consentJson.birthDate);
    }

    // quick cast from string to boolean
    if(consentJson.deceasedBoolean){
      consentJson.deceasedBoolean = (consentJson.deceasedBoolean == "true") ? true : false;
    }

    // STU3 only has a single entry for family name; not an array
    if(consentJson.name && consentJson.name[0] && consentJson.name[0].family && consentJson.name[0].family[0] ){
      consentJson.name[0].family = consentJson.name[0].family[0];      
    }

    // make sure the full name is filled out
    if(consentJson.name && consentJson.name[0] && consentJson.name[0].family && !consentJson.name[0].text ){
      consentJson.name[0].text = consentJson.name[0].given[0] + ' ' + consentJson.name[0].family;      
    }
  }
  return consentJson;
}


/**
 * @summary Similar to toMongo(), this function prepares a FHIR record for storage in the Mongo database.  The difference being, that this assumes there is already an existing record.
 * @memberOf Consents
 * @name prepForUpdate
 * @version 1.6.0
 * @returns { Object }
 * @example
 * ```js
 *  let consents = Consents.findMrn('12345').fetch();
 * ```
 */

Consents.prepForUpdate = function (consent) {
  process.env.TRACE && console.log("Consents.prepForUpdate()");  

  if (consent.name && consent.name[0]) {
    //console.log("consent.name", consent.name);

    consent.name.forEach(function(name){
      name.resourceType = "HumanName";
    });
  }

  if (consent.telecom && consent.telecom[0]) {
    //console.log("consent.telecom", consent.telecom);
    consent.telecom.forEach(function(telecom){
      telecom.resourceType = "ContactPoint";
    });
  }

  if (consent.address && consent.address[0]) {
    //console.log("consent.address", consent.address);
    consent.address.forEach(function(address){
      address.resourceType = "Address";
    });
  }

  if (consent.contact && consent.contact[0]) {
    //console.log("consent.contact", consent.contact);

    consent.contact.forEach(function(contact){
      if (contact.name) {
        contact.name.resourceType = "HumanName";
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          telecom.resourceType = "ContactPoint";
        });
      }

    });
  }

  return consent;
};


/**
 * @summary Scrubbing the consent; make sure it conforms to v1.6.0
 * @memberOf Consents
 * @name scrub
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let consents = Consents.findMrn('12345').fetch();
 * ```
 */

Consents.prepForFhirTransfer = function (consent) {
  process.env.TRACE && console.log("Consents.prepForFhirTransfer()");  


  // FHIR has complicated and unusual rules about dates in order
  // to support situations where a family member might report on a consent's
  // date of birth, but not know the year of birth; and the other way around
  if (consent.birthDate) {
    consent.birthDate = moment(consent.birthDate).format("YYYY-MM-DD");
  }


  if (consent.name && consent.name[0]) {
    //console.log("consent.name", consent.name);

    consent.name.forEach(function(name){
      delete name.resourceType;
    });
  }

  if (consent.telecom && consent.telecom[0]) {
    //console.log("consent.telecom", consent.telecom);
    consent.telecom.forEach(function(telecom){
      delete telecom.resourceType;
    });
  }

  if (consent.address && consent.address[0]) {
    //console.log("consent.address", consent.address);
    consent.address.forEach(function(address){
      delete address.resourceType;
    });
  }

  if (consent.contact && consent.contact[0]) {
    //console.log("consent.contact", consent.contact);

    consent.contact.forEach(function(contact){

      console.log("contact", contact);


      if (contact.name && contact.name.resourceType) {
        //console.log("consent.contact.name", contact.name);
        delete contact.name.resourceType;
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          delete telecom.resourceType;
        });
      }

    });
  }

  //console.log("Consents.prepForBundle()", consent);

  return consent;
};



export { Consent, Consents, ConsentSchema };
