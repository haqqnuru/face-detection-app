import React from 'react';


class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
       name: '',
      email: '',
      password: ''
        
    }
}

// deals name input of the register
onNameChange = (event) => {
  this.setState({name: event.target.value})
}

// deals email input of the register
onEmailChange = (event) => {
  this.setState({email: event.target.value})
}

// deals password input of the register
onPasswordChange = (event) => {
  this.setState({password: event.target.value})
}


// on submit
onSubmitRegister = () => {
  fetch('http://localhost:3000/register', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: this.state.email,
      password: this.state.password,
      name: this.state.name
    })
  })
    .then(response => response.json())
    .then(user => {
      if (user) {
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      }
    })
}

render () {
    return ( 
        <article className="mw6 center br3 pa3 pa4-ns mv3 ba b--black-50 shadow-5">
                <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              {/* name input */}
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input onChange={this.onNameChange}
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="text" name="name"  id="name"/>
              </div>
                {/* email input */}
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input onChange={this.onEmailChange}
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="email" name="email-address"  id="email-address"/>
              </div>
              {/* password input */}
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input onChange={this.onPasswordChange}
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="password" name="password"  id="password"/>
              </div>
            </fieldset>
            {/* submit buttom */}
            <div className="">
              <input onClick={this.onSubmitRegister}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
              type="submit" value="Register"/>
            </div>
          </div>
        </main>
        </article>
             );
        }}
 
export default Register;