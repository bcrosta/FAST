import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header/header'
import fire from '../Fire/fire'
import './review.css'
import {addToUserList} from '../Utilities/utilities'
//by default, using styles from ./login.css

export class WriteReview extends React.Component {
  constructor(props) {
    super(props);
    this.submit_review = this.submit_review.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {loaded: false};
  }

  componentDidMount(){
    const { history } = this.props;
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user});
        var listing_id = this.props.location.search.substring(4);
        fire.database().ref().once('value', snapshot => {
          var transaction_list = snapshot.child("Users/" + user.uid + "/Completed_Transactions").val().split(",");

          // Make sure we have access to the review
          if(transaction_list.indexOf(listing_id) === -1) {
            history.push("/transaction_history");
            alert("You cannot write a review for a listing you haven't completed");
          }
          this.setState({listingID: listing_id, loaded: true});
        });
      }
      else {
        this.setState({user: null});
        history.push("/");
      }
    });
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value});
  }

  submit_review() {
    const Review_Title = this.state.title;
    const Review_Rating = this.state.rating;
    const Review_Content = this.state.review;
    const Listing_ID = this.state.listingID;
    const User_ID = this.state.user.uid;

    var Review_ID;
    var Transaction_Date;

    if(!this.fieldsFilled()){
      return;
    }

    const { history } = this.props;
    fire.database().ref().once('value', snapshot => {
      // Make sure the review ID does not exist yet
      var next_id = snapshot.child("Constants/Next_Review_ID").val();
      var idExists = snapshot.child("Review/" + next_id).exists();
      const Seller_ID = snapshot.child("Listing/" + Listing_ID + "/Seller_ID").val();
      const Buyer_ID = snapshot.child("Listing/" + Listing_ID + "/Buyer_ID").val();
      var Seller = snapshot.child("Listing/" + Listing_ID + "/Seller_ID").val() === User_ID;
      var Is_Seller = Seller ? "Seller" : "Buyer";
      while(idExists) {
        next_id += 1;
        idExists = snapshot.child("Review/" + next_id).exists();
      }
      Review_ID = next_id;
      fire.database().ref().child("Constants/Next_Review_ID").set(next_id + 1);

      // Check if this review is by the seller or buyer
      var Reviewed_User = Seller ? Buyer_ID : Seller_ID;
      Transaction_Date = snapshot.child("Listing/" + Listing_ID + "/Transaction_Date").val();

      var Reviewer_Name = snapshot.child("Users/" + User_ID + "/Name").val();
      var Seller_Name = snapshot.child("Users/" + Seller_ID + "/Name").val();
      fire.database().ref().child("Review/" + next_id).set({Review_Title, Review_Rating, Review_Content, Review_ID, Is_Seller, Transaction_Date, Listing_ID, Reviewer_Name, Seller_Name});

      // Add to reviewee's review list
      Seller ? addToUserList(Buyer_ID, next_id, "Reviews") : addToUserList(Seller_ID, next_id, "Reviews");
      Seller ? fire.database().ref().child("Listing/" + Listing_ID + "/Buyer_Reviewed").set(true) : fire.database().ref().child("Listing/" + Listing_ID + "/Seller_Reviewed").set(true);

      // Add to the listing's review ID
      Seller ? fire.database().ref().child("Listing/" + Listing_ID + "/Buyer_Review_ID").set(next_id) :
                  fire.database().ref().child("Listing/" + Listing_ID + "/Seller_Review_ID").set(next_id);

      var sumOfReviews = snapshot.child("Users/" + Reviewed_User + "/Sum_Of_Reviews").val() + parseInt(Review_Rating);
      var totalReviews = snapshot.child("Users/" + Reviewed_User + "/Reviews").val().split(",");
      // Filter the list to remove any empty items in the list
      totalReviews = totalReviews.filter(function (el) {
        return el !== "";
      });
      totalReviews.push("" + next_id);
      fire.database().ref().child("Users/" + Reviewed_User + "/Sum_Of_Reviews").set(sumOfReviews);
      fire.database().ref().child("Users/" + Reviewed_User + "/Average_Review").set(sumOfReviews / totalReviews.length);
    });
  }

  fieldsFilled(){
    const Review_Title = this.state.title;
    const Review_Rating = this.state.rating;
    const Review_Content = this.state.review;

    //Ensure that user has entered some title, alert otherwise
    if(Review_Title === undefined || Review_Title.length < 1){
      alert("Please add a title.");
      return false;
    }
     //Ensure that user has entered some review rating, alert otherwise
    if(Review_Rating === undefined || Review_Rating.length < 1 || Review_Rating < 1 || Review_Rating > 5){
      alert("Rating must be between 1 and 5.");
      return false;
    }
    //Ensure that user has entered some review content, alert otherwise
    if(Review_Content === undefined || Review_Content.length < 1){
      alert("Please add review content");
      return false;
    }
    //All fields filled
    return true;
  }

  render() {

    return(
      <div className="center">
        <Header />
        <form className="listing-form" autoComplete="off">
        <div>

        {this.state.loaded ?
          <div className="content-box">
            <h3 id="create-review-title" className="basic-title">Write review</h3>

            <input onChange={this.handleChange} id="review-title" type="text" className="review-input" name="title" placeholder="Title" maxLength="20" required/> <br />

            <input onChange={this.handleChange} id="review-rating" type="number" min="1" max="5" className="review-input" name="rating" maxLength="1" placeholder="Rating 1-5" required/> <br /><br />

            <textarea onChange={this.handleChange}  name="review" id="review-content" maxLength="200" placeholder="Review content..."/> <br />

            <br />
            <Link to="/home"><button onClick={this.submit_review} className="basic-button" id="create-review-button">Post review</button></Link> <br />
          </div>
          :
          null}
        </div>
        </form>
      </div>
    );
  }
}
