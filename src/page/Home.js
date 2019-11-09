import React, { Component } from "react";
import axios from "axios";
import Users from "../components/Users";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 10,
      error: false,
      hasMore: true,
      isLoading: false,
      users: []
    };

    /* UNCOMMENT THIS FOR INFINITE SCROLL */
    window.onscroll = async () => {
      const {
        loadUser,
        state: { isLoading, hasMore, error }
      } = this;

      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadUser()
      }
    };
  }

  componentDidMount() {
    if (localStorage.getItem("data") === null) {
      this.loadUser();
    } else {
      const dataFromLocalStorage = JSON.parse(localStorage.getItem("data"));
      this.setState({
        users: dataFromLocalStorage
      });
    }
  }

  loadUser = async () => {
    const { users, amount } = this.state;
    this.setState({
      isLoading: true
    });
    let res = await axios.get(
      `https://randomuser.me/api/?results=${amount}`
    );

    // if (performance.navigation.type == 1) {
    //   console.info( "This page is reloaded" );
    //    res = await axios.get(`https://randomuser.me/api/?results=${selectedValue}`);

    // } else {
    //   console.log(true)
    // }

    const dataUser = res.data.results.map(data => ({
      id: data.cell,
      firstName: data.name.first,
      lastName: data.name.last,
      age: data.dob.age,
      city: data.location.city,
      state: data.location.state,
      postalCode: data.location.postcode,
      image: data.picture.large
    }));
    if (res.status !== 200) {
      this.setState({
        error: true
      });
    } else {
      localStorage.setItem("data", JSON.stringify(dataUser))
      this.setState({
        hasMore: this.state.users.length < 100,
        isLoading: false,
        users: [...users, ...dataUser]
      });
    }
  };

  loadMore = () => {
    this.loadUser();
  };

  sortAZ = () => {
    const userSorted = this.state.users.sort((a, b) => {
      var nameA = a.city.toUpperCase(); // ignore upper and lowercase
      var nameB = b.city.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    
    localStorage.setItem("data", JSON.stringify(userSorted))
    this.setState({
      users: userSorted
    });
  };

  render() {
    const { error, hasMore, isLoading, users } = this.state;
    //check for Navigation Timing API support

    return (
      <div>
        <Navbar />
        <div className="container">
          <button className="mt-5 btn btn-success" onClick={this.sortAZ}>
            SORT A-Z
          </button>
          <div className="row">
            {users.map(user => (
              <Users key={user.id} {...user} />
            ))}
            <hr />
            {error && <div style={{ color: "#900" }}>{error}</div>}
            {!hasMore && <div>You did it! You reached the end!</div>}
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <div
              className="btn btn-primary btn-lg btn-block mt-4"
              onClick={this.loadMore}
            >
              Loadmore
            </div>
          )}
        </div>
      </div>
    );
  }
}
