
import React from 'react';



class SignIn extends React.Component {
  constructor(props){
    super(props)
    this.state = {
       signInEmail: '',
      signInPassword: ''
        
    }
}

// on email change function
onEmailChange = (event) => {
  this.setState({signInEmail: event.target.value})
}

// on password change
onPasswordChange = (event) => {
  this.setState({signInPassword: event.target.value})
}

// on submit function
onSubmitSignIn = () => {
  fetch('http://localhost:3000/signin', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword
    })
  })
  .then(response => response.json())
  .then(user => {
    if (user.id) {
      this.props.loadUser(user);
      this.props.onRouteChange('home');
    } else {
      alert("Invalid credentials. Please try again.");
    }
  })
  .catch(err => {
    console.error("Error signing in:", err);
    alert("Error signing in.");
  });
}


  render(){
      return ( 
<article className="mw6 center br3 pa3 pa4-ns mv3 ba b--black-50 shadow-5">
        <main className="pa4 black-80">
  <div className="measure">
    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
      {/* input email */}
      <div className="mt3">
        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
        <input onChange={this.onEmailChange}
        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
        type="email" name="email-address"  id="email-address"/>
      </div>
        {/* input password */}
      <div className="mv3">
        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
        <input onChange={this.onPasswordChange}
        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
        type="password" name="password"  id="password"/>
      </div>
    </fieldset>
    {/* login */}
    <div className="">
      <input onClick={this.onSubmitSignIn}
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
      type="submit" value="Sign in"/>
    </div>
    {/* register */}
    <div className="lh-copy mt3">
      <a onClick={() => this.props.onRouteChange('register')} href="#0" 
      className="f6 link dim black db">Register</a>
    </div>
  </div>
</main>
</article>
     );
}
 }
export default SignIn;