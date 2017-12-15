import React from 'react'
import fetch from 'unfetch'

const apiProgramFeed   = 'https://websvc.liberty.edu/LeadsAPI_REST/api/program_types'
const localProgramFeed = '/assets/programs_fallback.json'
const leadSubmitUrl    = 'https://websvc.liberty.edu/LeadsAPI_REST/api/Leads'
const apiPasscode      = 'dlp2liberty'
const acodeUndergrad   = 'D85351'
const acodeGrad        = 'D85352'
const testMode         = false

class App extends React.Component {


    // Construct.
    constructor(props) {
        super(props);

        this.state = {
            degree: null,
            category: null,
            subject: null,
            acode: null,
            result: {
                status: null,
                errors: []
            },
            widgetFeed: {}
        }
    }


    // Programs from Liberty Data API.
    componentWillMount() {
        this.fetchProgramData()
    }


    // Fetch Program Data.
    fetchProgramData = async () => {

        // Remote: Fetch from API from Liberty.
        const response = await fetch(apiProgramFeed)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText)     
                }
                return response.json()
            })
            .then((results) => {
                if (!results) {
                    return false
                }

                this.setupPrograms(results)
                return true
            })
            .catch((error) => {
                return false
            })

        // Fallback: Fetch Local
        if (!response) {
            fetch(localProgramFeed)
                .then((response) => response.json())
                .then((results) => {
                    this.setupPrograms(results)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    
    // Build Programs Logic
    setupPrograms = (programs) => {

        const widgetFeed = {
            degrees: [],
        };

        const availableDegrees = [...new Set(
            programs.map((p) => p.DegreeLevel)
        )];

        availableDegrees.forEach(degree => {
        
            const degreeEntity = {
                name: degree,
                categories: [],
            }
          
            const availableCategories = [...new Set(
                programs
                    .filter((p) => p.DegreeLevel === degree)
                    .map((p) => p.Degree)
            )];

            availableCategories.forEach(category => {
          
                const categoryEntity = {
                    name: category
                }
            
                const availableSubjects = [...new Set(
                    programs
                        .filter((p) => p.DegreeLevel === degree && p.Degree === category)
                        .map((p) => ({
                            code: p.ProgramCode,
                            name: p.ProgramDisplay,
                            level: p.Level
                        }
                    ))
                )];
            
                categoryEntity.subjects = availableSubjects.map((subject) => ({ code: subject.code, name: subject.name, level: subject.level }));
                degreeEntity.categories.push(categoryEntity);
            });

            widgetFeed.degrees.push(degreeEntity);
        });
        
        this.setState({widgetFeed});
    }


    // Widget Select Change
    handleWidgetChange = (e) => {
    
        // Widget Defaults.    
        let widgetInputs = {
            degree: null,
            category: null, 
            subject: null,  
            acode: null,  
        }
        widgetInputs[e.target.name] = e.target.value ? e.target.value : null
                
        // Subject Select.
        if (e.target.name === 'subject') {
            delete widgetInputs['degree']
            delete widgetInputs['category']
            delete widgetInputs['acode']

            if (e.target.value) {
                const dataLevel = e.target.options[e.target.selectedIndex].getAttribute('data-level')
                widgetInputs.acode = dataLevel === 'Undergraduate' ? acodeUndergrad : acodeGrad
            }
        }
        
        // Category Select.
        if (e.target.name === 'category') {
            delete widgetInputs['degree']
            this.subject.value = 0;
        }

        // Degree Select.
        if (e.target.name === 'degree') {
            this.category.value = 0;
            this.subject.value = 0;
        }
        
        // Set State.
        this.setState(widgetInputs)
    }

    
    // Form Submit
    handleFormSubmit = (e) => {

        e.preventDefault()
        
        let failedValidation = false;
        
        // Check Required Fields.
        document.querySelectorAll('input[required]').forEach(function(input) {
                      
          if (!input.value) {
                input.classList.add('is-invalid')
                failedValidation = true
            }
        })

        // Return if Required Field is Empty.
        if (failedValidation) {
            return false
        }

        // Loading
        document.getElementById('widget-form').classList.add('is-loading')

        // Submit Form
        fetch(leadSubmitUrl, {
          method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "lead": {
                    "Acode": this.state.acode,
                    "FirstName": this.firstname.value,
                    "LastName": this.lastname.value,
                    "TestLead": testMode,
                    "source_url": window.location.href,
                    "PredictRetrieved": true,
                    "PredictSkipped": true,
                    "PredictAssessed": true,
                    "ContactPreference": {
                        "ContactMethodTypeID": 1,
                        "ContactTimeframeTypeID": this.contactTimeframeTypeID.value,
                        "ContactTimezoneTypeID": 6
                    },
                    "delayProcessingMinutes": 1
                },
                "phones": [
                    {
                        "PhoneNumber": this.phone.value,
                        "PhoneType": 1
                    },
                ],
                "leadEmail": this.email.value,
                "passcode": apiPasscode,
                "programTypeCode": this.state.subject,
          })
        })
        .then((response) => response.json())
        .then((results) => {

            // Filter Errors.
            let errors = [];

            if (results.Errors) {
                results.Errors.forEach(function(error) {
                    if (error.trim()) {
                        errors.push(error)
                    }
                })
            }

            // Set State.
            this.setState({
                result : {
                    status: results.Message === 'Accepted' ? 'Accepted' : 'Failed',
                    errors: errors ? errors : []
                }
            })

            // Remove Loading
            document.getElementById('widget-form').classList.remove('is-loading')
            
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    
    // Render: Options
    renderSelectOptions = (name) => {

        const { widgetFeed } = this.state;
        let options          = '';
      
        // Return if no degrees.
        if (!widgetFeed.degrees) {
          return (
            <select>
                <option value="">Loading....</option>
            </select>
          )
        }
        
        // Switch Select Options.
        switch (name) {
        
            case 'degree': 

                const degrees = widgetFeed.degrees;
                
                return (
                    <select name="degree" ref={(input) => this.degree = input} onChange={(e) => this.handleWidgetChange(e)} required>
                        <option value="0">What degree type would you like?</option>
                        {degrees.map((degree, index) => <option key={index + 1} value={index + 1}>{degree.name}</option>)}
                    </select>
                )
                
            case 'category':
           
                if (this.state.degree && this.state.degree !== '0') {
                    const categories = widgetFeed.degrees[this.state.degree - 1].categories 
                    options = categories.map((category, index) => <option key={index + 1} value={index + 1}>{category.name}</option>)
                }
                
                return (
                    <select name="category" ref={(input) => this.category = input} onChange={(e) => this.handleWidgetChange(e)} required>
                        <option value="0">What would you like to study?</option>
                        {options}
                    </select>
                )
                
           case 'subject':
              
                if (this.state.category && this.state.category !== '0') {
                    const subjects = widgetFeed.degrees[this.state.degree - 1].categories[this.state.category - 1].subjects 
                    options = subjects.map((subject) => <option key={subject.code} data-level={subject.level} value={subject.code}>{subject.name}</option>)
                }
                
                return (
                    <select name="subject" ref={(input) => this.subject = input} onChange={(e) => this.handleWidgetChange(e)} required>
                        <option value="0">Select a specialization?</option>
                        {options}
                    </select>
                )
    
           default: 
              return;
        }
    }
    
    
    // Render: Message
    renderMessage = () => {

        if (this.state.result.status === 'Accepted') {

            // Accepted Message & Class
            document.getElementById('widget-form').classList.add('is-success')

            return (
                <div className="message">
                    <p>Thank you for your interest in Liberty University Online! A representative from our school will be in contact with you soon. Have a great day!</p>
                </div>
            )

        } else if (this.state.result.status === 'Failed') {

            // Failed Message
            return (
                <div className="message">
                    <p>Error sending the form, please try submitting again.</p>
                    <ul>
                        {this.state.result.errors.map((error, index) => <li key={index}>{error}</li>)}
                    </ul>
                </div>
            )
        }
    }


    // Render: Markup
    render() {
        return (
            <form id="widget-form" method="post" onSubmit={(e) => this.handleFormSubmit(e)}>
                <button className="link-close js-toggle" data-bodyclass="is-widget-active"></button>
                {this.renderMessage()}
                <div className="widget-form-content">
                    <h2>Request Information</h2>
                    {this.renderSelectOptions('degree')}
                    {this.renderSelectOptions('category')}
                    {this.renderSelectOptions('subject')}
                    <div className="input-columns">
                        <input ref={(input) => this.firstname = input} type="text" placeholder="First Name" required />
                        <input ref={(input) => this.lastname = input} type="text" placeholder="Last Name" required />
                    </div>
                    <input ref={(input) => this.email = input} type="email" placeholder="Email Address" required />
                    <input ref={(input) => this.phone = input} type="tel" placeholder="Phone" required/>
                    <select ref={(input) => this.contactTimeframeTypeID = input}>
                        <option value="">Preferred time to contact</option>
                        <option value="8">8am - 12pm</option>
                        <option value="9">12pm - 5pm</option>
                        <option value="10">5pm - 9pm</option>
                    </select>
                    <span className="text-input-description">Based on area code</span>
                    <input type="submit" className="btn btn-primary" value="Send" />
                    <p className="text-small text-center">By submitting contact information through this form, I agree that Liberty University and its affiliates may call and/or text me about its offerings by any phone number I have provided and may provide in the future, including any wireless number, using automated technology.</p>
                    <p className="text-small text-center">Your information is secure. View our <a className="js-toggle" data-bodyclass="is-modal-active" data-modal="privacy">privacy policy.</a></p>
                </div>
            </form>
        );
    }
}

export default App;
