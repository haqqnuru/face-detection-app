import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation';
import Logo from './components/logo';
import ImageLinkForm from './components/imageLinkForm';
import Rank from './components/rank';
import { RandomGradientBackground } from './components/extra';
import FaceRecognision from './components/faceRecognition';
import SignIn from './components/signIn';
import Register from './components/register';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

// Called when a user logs in or registers.
  loadUser = (data) => {
    // Save user data to localStorage and capitalize the first letter of name
    const capitalizeName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    this.setState({
      user: {
        ...data,
        name: capitalizeName
      }
    });
  };
  
//Runs once when the component is mounted
  componentDidMount() {
    const isSignedIn = localStorage.getItem('isSignedIn');
    const route = localStorage.getItem('route') || 'signin';
    const user = JSON.parse(localStorage.getItem('user')) || null;
  
    if (isSignedIn && user) {
      this.setState({ isSignedIn: true, route, user });
    } else {
      this.setState({ isSignedIn: false, route: 'signin', user: null });
    }
  }
  
 // calculates the face location and coordinates
  calculateFaceLocations = (data) => {
    const regions = data?.outputs?.[0]?.data?.regions;
    if (!regions || regions.length === 0) {
      console.error("No face regions found");
      return [];
    }
    const image = document.getElementById('inputimage');
    if (!image) return [];
  
    const width = image.width;
    const height = image.height;
  
    return regions.map((region) => {
      const boundingBox = region.region_info.bounding_box;
  
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        width: (boundingBox.right_col - boundingBox.left_col) * width,
        height: (boundingBox.bottom_row - boundingBox.top_row) * height
      };
    });
  };
  
  // displays the faceboxes
  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes });
  };

  // handles the pictures fields 
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  // this helps detect the faces when pictue is submited
 onButtonSubmit = () => {
  if (!this.state.input) {
    console.log("No image URL provided");
    return;
  }

  this.setState({ 
    imageUrl: this.state.input,
    boxes: [] // Clear previous boxes
  });

  fetch('http://localhost:3000/image', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: this.state.input,
      id: this.state.user.id
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log("API Response:", data);
    
    if (data.clarifaiResponse) {
      const boxes = this.calculateFaceLocations(data.clarifaiResponse);
      console.log("Calculated boxes:", boxes);
      this.displayFaceBoxes(boxes);

      if (data.entries !== undefined) {
        const updatedUser = {
          ...this.state.user,
          entries: data.entries
        };
        
        this.setState({ user: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } else {
      console.log("No face regions found in response");
    }
  })
  .catch(err => {
    console.error("Detection Error:", err);
    this.setState({ 
      boxes: [],
      imageUrl: this.state.input // Still show the image even if detection fails
    });
  });
};
  
  // this function handles navigation between different pages
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false, route: 'signin' });
      localStorage.removeItem('isSignedIn'); // Clear localStorage on signout
      localStorage.removeItem('route');
    } else if (route === 'home') {
      this.setState({ isSignedIn: true, route: 'home' });
      localStorage.setItem('isSignedIn', true);
      localStorage.setItem('route', 'home');
    } else {
      this.setState({ route: route });
      localStorage.setItem('route', route);
    }
  };

  render() {
    const { isSignedIn, imageUrl, boxes, route } = this.state;

    return (
      <div>
        <RandomGradientBackground />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home' ? (
          <div>
            <Logo />
            {this.state.user && this.state.user.name && (
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
)}
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognision boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;