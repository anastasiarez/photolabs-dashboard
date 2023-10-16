import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";

import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: 10
  },
  {
    id: 2,
    label: "Total Topics",
    value: 4
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: "Allison Saeng"
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: "Lukas Souza"
  }
];

class Dashboard extends Component {
  state = {
    loading: false,
    focused: null,
    photos: [],
    topics: []
  };

  componentDidMount() {

    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));


    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused !== null
    });
    
    if (this.state.loading) {
      return <Loading />;
    }
    
    console.log(this.state);
    
    const panels = (this.state.focused
      ? data.filter(panel => this.state.focused === panel.id)
      : data
      ).map(panel => (
        <Panel
        key={panel.id}
        id={panel.id}
        label={panel.label}
        value={panel.value}
        onClick={() => this.handlePanelClick(panel.id)}
        />
        ));
        
        return <main className={dashboardClasses}>{panels}</main>;
      }
      
  handlePanelClick = (panelId) => {
    // Toggle between focused and unfocused views
    this.setState((prevState) => ({
      focused: prevState.focused === panelId ? null : panelId
    }));
  };
}

export default Dashboard;


