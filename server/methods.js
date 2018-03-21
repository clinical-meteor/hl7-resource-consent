var consentCategories = [{
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "42-CFR-2",
  display: "42 CFR Part 2 Form of written consent"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "ACD",
  display: "advance directive"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "CRIC",
  display: "common rule informed consent"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "DNR",
  display: "do not resuscitate"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "EMRGONLY",
  display: "emergency only"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "Illinois-Minor-Procedure",
  display: "Illinois Consent by Minors to Medical Procedures"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HCD",
  display: "health care directive"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Auth",
  display: "HIPAA Authorization"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-NPP",
  display: "HIPAA Notice of Privacy Practices"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Restrictions",
  display: "HIPAA Restrictions"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Research",
  display: "HIPAA Research Authorization"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Self-Pay",
  display: "HIPAA Self-Pay Restriction"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "MDHHS-5515",
  display: "Michigan MDHHS-5515 Consent to Share Behavioral Health Information for Care Coordination Purposes"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "NYSSIPP",
  display: "New York State Surgical and Invasive Procedure Protocol"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "NPP",
  display: "notice of privacy practices"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "POLST",
  display: "POLST"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "RESEARCH",
  display: "research information access"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "RSDID",
  display: "de-identified information access"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "RSREID",
  display: "re-identifiable information access"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "SSA-827",
  display: "Authorization to Disclose Information to the Social Security Administration"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-0484",
  display: "Revocation for Release of Individually-Identifiable Health Information"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-0485",
  display: "Request for and Authorization to Release Protected Health Information to eHealth Exchange"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-5345",
  display: "Request for and Authorization to Release Medical Records or Health Information"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-5345a",
  display: "Individuals' Request for a Copy of Their Own Health Information "
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-5345a-MHV",
  display: "Individualâ€™s Request for a Copy of their own health information from MyHealtheVet"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-10116",
  display: "Revocation of Authorization for Use and Release of Individually Identifiable Health Information for Veterans Health Administration Research"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-21-4142",
  display: "Authorization and Consent to Release Information to the Department of Veterans Affairs (VA)"
}]




Meteor.methods({
    initializeConsents(){
      console.log('Initialize Consents...')

      var newConsent = {
          "resourceType": "Consent",
          "id": "consent-example-smartonfhir",
          "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: consent-example-smartonfhir</p><p><b>status</b>: active</p><p><b>patient</b>: <a>Patient/xcda</a></p><p><b>period</b>: 23/06/2016 5:02:33 PM --&gt; 23/06/2016 5:32:33 PM</p><p><b>dateTime</b>: 23/06/2016 5:02:33 PM</p><p><b>consentingParty</b>: <a>RelatedPerson/peter</a></p><p><b>organization</b>: <a>Organization/example</a></p><p><b>policyRule</b>: <a>http://hl7.org/fhir/ConsentPolicy/opt-in</a></p><h3>Excepts</h3><table><tr><td>-</td><td><b>Type</b></td><td><b>Action</b></td><td><b>Class</b></td></tr><tr><td>*</td><td>permit</td><td>Access <span>(Details : {http://hl7.org/fhir/consentaction code 'access' = 'Access)</span></td><td>MedicationRequest (Details: http://hl7.org/fhir/resource-types code MedicationRequest = 'MedicationRequest', stated as 'null')</td></tr></table></div>"
          },
          "status": "active",
          "patient": {
            "reference": "Patient/01-544382",
            "display": "Jane Doe"
          },
          "period": {
            "start": "2016-06-23T17:02:33+10:00",
            "end": "2016-06-23T17:32:33+10:00"
          },
          "dateTime": "2016-06-23T17:02:33+10:00",
          "consentingParty": [
            {
              "reference": "RelatedPerson/jane",
              "display": "Jane Doe"
            }
          ],
          "category": [],
          "organization": [
            {
              "reference": "Organization/example",
              "display": "All Saint's Hospital"
            }
          ],
          "policyRule": "http://hl7.org/fhir/ConsentPolicy/opt-in",
          "except": []
        };

      var newException = {
          "type": "permit",
          "action": [
            {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/consentaction",
                  "code": "access"
                }
              ]
            }
          ],
          "class": [
            {
              "system": "http://hl7.org/fhir/resource-types",
              "code": "MedicationRequest"
            }
          ]
        }

        newConsent.except.push(newException)
        var consentId = Consents.insert(newConsent);
        console.log('Initialized ' + consentId)

        newConsent.patient = {
          reference: "Patient/01-567390",
          display: "Alice Doe"
        }
        newConsent.organinzation = {
          display: "St. James Infirmary"
        }
        newException.class = [{
          system: "http://hl7.org/fhir/resource-types",
          code: "Observation"
        }]
        newConsent.consentingParty = [{
          reference: "Patient/01-567390",
          display: "Alice Doe"
        }]
        newConsent.category = [{
          code: "42 CFR Part 2",
          display: "42 CFR Part 2 Form of written consent"
        }]

        newConsent.except.push(newException)


        var patients = [];
        var numberPatients = 50;
        for (let index = 0; index < numberPatients; index++) {
            patients.push({
              display: faker.name.findName(),
              reference: "Patient/" + Random._id
          })              
        }

        var organizations = [];
        var seedOrgs = [{
          reference: "Organization/" + Random._id,
          display: "All Saint's Hospital"
        }, {
          reference: "Organization/" + Random._id,
          display: "St. James Infirmiry"
        }, {
          reference: "Organization/" + Random._id,
          display: "Rainbow's End Retirement Home"
        }, {
          reference: "Organization/" + Random._id,
          display: "Blue Lagoon Geothermal Spa"
        }, {
          reference: "Organization/" + Random._id,
          display: "Hokkaido Noboribetsu Onsen"
        }]
        
        organizations.push(seedOrgs[0])
        organizations.push(seedOrgs[0])
        organizations.push(seedOrgs[0])
        organizations.push(seedOrgs[1])
        organizations.push(seedOrgs[1])
        organizations.push(seedOrgs[1])
        organizations.push(seedOrgs[2])
        organizations.push(seedOrgs[3])
        organizations.push(seedOrgs[4])



        var resourceTypes = [
          "AllergyIntolerance",
          "CarePlan",
          "CareTeam",
          "Device",
          "Condition",
          "Goal",
          "MedicationStatement",
          "Observation",
          "Procedure",
          "RiskAssessment"
        ]

        var numPatients = 50;
        for (let index = 0; index < numPatients; index++) {  

          newConsent.patient = Random.choice(patients)

          newConsent.organization = [];
          newConsent.organization.push(Random.choice(organizations))

          var randomInt = Random.cardinal(5);
          newException.class = [];
          for (let j = 0; j < randomInt; j++) {            
            newException.class.push({
              system: "http://hl7.org/fhir/resource-types",
              code: Random.choice(resourceTypes)
            });
          }
          newConsent.except.push(newException);

          newConsent.consentingParty = [ newConsent.patient ]
          newConsent.category.push(Random.choice(consentCategories));

          var consentId = Consents.insert(newConsent);
          console.log('Initialized ' + consentId)          
        }

    }
})