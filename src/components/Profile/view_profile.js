import React, {Component} from 'react';
import './profile.css'
import './edit_profile'
import fire from '../Fire/fire'
import userImage from './userImage.png'
import LoadingImg from '../Home/circle-loading-gif.gif'

class ViewProfile extends Component {
      constructor(props) {
        super(props);
        this.state = {
          loaded: false,
          image: [],
          name: '',
          rating: '',
          tel: '',
          email: '',
          zipcode: '',
          city: ''
        };
      }

    componentWillUnmount() {
      this.firebaseRef.off();
    }

    // If the component gets mounted successfully, authenticate the user
    componentDidMount(){
      fire.auth().onAuthStateChanged((user) => {
        // If the user is detected, save it to the current state
        if(user) {
          this.setState({user});
          this.firebaseRef = fire.database().ref();
          this.firebaseRef.on('value', dataSnapshot => {
            let name = dataSnapshot.child("Users/" + user.uid + "/Name").val();
            let rating = dataSnapshot.child("Users/" + user.uid + "/Average_review").val();
            let image = dataSnapshot.child("Users/" + user.uid + "/User_Pic").val();
            let tel = dataSnapshot.child("Users/" + user.uid + "/Phone").val();
            let email = dataSnapshot.child("Users/" + user.uid + "/UCSD_Email").val();
            let zipcode = dataSnapshot.child("Users/" + user.uid + "/Zip").val();
            let city = dataSnapshot.child("Users/" + user.uid + "/City").val();

            this.setState({name});
            this.setState({rating});
            this.setState({image});
            this.setState({tel});
            this.setState({email});
            this.setState({zipcode});
            this.setState({city});
          });
        }
        // Otherwise set the current user to null
        else {
          this.setState({user: null});
          //localStorage.removeItem('user');
        }
        this.setState({loaded: true});
      });
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    render(){
        return(
              <div>
              {this.state.loaded ?
                <form className="profile-form">
                  <div className="profile-name">{this.state.name}</div>
                  <br />
                  {this.state.image ? 
                    <img className="profile-img" src = {this.state.image[this.state.image.length-1]} alt="Profile" />
                    : <img className="profile-img" src ={userImage} alt="Default Profile"/>
                  }
                  <br />
                  <hr/>
                  Overall Rating: {this.state.rating}
                  <br />
                  Tel: {this.state.tel}
                  <br />
                  UCSD Email: {this.state.email}
                  <br />
                  Zipcode: {this.state.zipcode}
                  <br />
                  City: {this.state.city}
                  <br />
                  <a className="profile-button" href='/edit_profile'>edit profile</a>
                </form>
              :<div><img className="loading-circle" src={LoadingImg} alt="Loading..."></img></div>}
            </div>
        );
    }
}

export default ViewProfile;
