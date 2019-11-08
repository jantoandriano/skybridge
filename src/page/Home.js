import React, { Component } from "react";
import axios from "axios";
import Users from "../components/Users";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 10,
      error: false,
      hasMore: true,
      isLoading: false,
      users: []
    };

    // Binds our scroll event handler
    window.onscroll = () => {
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
        loadUser();
      }
    };
  }
  componentDidMount() {
    this.loadUser();
  }

  loadUser = async () => {
    const { count, users } = this.state;
    this.setState({
      isLoading: !this.state.isLoading
    });
    let res = await axios.get(`https://randomuser.me/api/?results=${count}`);
    const dataUser = res.data.results.map(data => ({
      id: data.cell,
      firstName: data.name.first,
      lastName: data.name.last,
      age: data.dob.age,
      city: data.location.city,
      state: data.location.state,
      postalCode: data.location.postcode,
      image: data.picture.medium
    }));
    this.setState({
      isLoading: !this.state.isLoading,
      users: [...users, ...dataUser]
    });
  };

  loadMore = () => {
    this.setState(
      prevState => ({
        count: prevState.count++
      }),
      this.loadUser
    );
  };

  render() {
    const { error, hasMore, isLoading, users } = this.state;
    return (
      <div>
        <div className="container">
          <div className="row">
            {users.map(user => (
              <div className="col pt-5">
                <Users key={user.id} {...user} />
              </div>
            ))}
            <hr />
            {error && <div style={{ color: "#900" }}>{error}</div>}
            {!hasMore && <div>You did it! You reached the end!</div>}
          </div>
          {isLoading && <h1>Loading...</h1>}
        </div>
      </div>
    );
  }
}
