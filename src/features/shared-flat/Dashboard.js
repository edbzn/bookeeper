import moment from "moment";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { LineChart, Line } from "recharts";
import { pathOr, path } from "ramda";
import { bindActionCreators } from "redux";
import { StickyContainer, Sticky } from "react-sticky";
import {
  WingBlank,
  WhiteSpace,
  Card,
  Tabs,
  ActionSheet,
  Button,
} from "antd-mobile";
import { connect } from "react-redux";
import * as actions from "./redux/actions";

export class Dashboard extends Component {
  static propTypes = {
    sharedFlat: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    Promise.all([
      this.props.actions.getDetail(),
      this.props.actions.getEvents(),
      this.props.actions.getJoinRequests(),
    ]);
  }

  onTabChange = (tab, index) => {
    console.log(tab, index);
    this.props.actions.toggleTab(index);
  };

  renderTabBar(props) {
    return (
      <Sticky>
        {({ style }) => (
          <div style={{ ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        )}
      </Sticky>
    );
  }

  renderCharts() {
    const tabs = [
      { title: "Activity" },
      { title: "Expenses" },
      { title: "Members" },
    ];

    const { events } = this.props.sharedFlat;

    return (
      <StickyContainer>
        <Tabs
          tabs={tabs}
          renderTabBar={this.renderTabBar}
          onChange={this.onTabChange}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "150px",
              backgroundColor: "#fff",
            }}>
            <LineChart width={300} height={100} data={events}>
              <Line
                type="monotone"
                dataKey="monthlyActivityAverage"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "150px",
              backgroundColor: "#fff",
            }}>
            Content of second tab
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "150px",
              backgroundColor: "#fff",
            }}>
            Content of thirb tab
          </div>
        </Tabs>
      </StickyContainer>
    );
  }

  renderEvents() {
    return this.props.sharedFlat.events.map((event, i) => (
      // eslint-disable-next-line no-underscore-dangle
      <div key={event._id}>
        {i > 0 ? <WhiteSpace /> : null}
        <Card>
          <Card.Body>
            <div className="event-thumbnail">
              <img
                src={event.createdBy.picture}
                alt={`${event.createdBy.name} event`}
              />
            </div>
            <span>
              by <strong>{event.createdBy.name}</strong>
            </span>
            <small>{moment(event.createdAt).fromNow()}</small>
          </Card.Body>
        </Card>
      </div>
    ));
  }

  renderJoinRequests() {
    return this.props.sharedFlat.joinRequests.map((joinRequest, i) => (
      // eslint-disable-next-line no-underscore-dangle
      <div key={joinRequest._id}>
        {i > 0 ? <WhiteSpace /> : null}
        <Card>
          <Card.Body>{JSON.stringify(joinRequest)}</Card.Body>
        </Card>
      </div>
    ));
  }

  renderResidents() {
    return this.props.sharedFlat.data.residents.map((resident, i) => (
      // eslint-disable-next-line no-underscore-dangle
      <div key={resident._id}>
        {i > 0 ? <WhiteSpace /> : null}
        <Card>
          <Card.Body>{JSON.stringify(resident)}</Card.Body>
        </Card>
      </div>
    ));
  }

  renderActionSheet() {
    const renderActions = () =>
      this.props.sharedFlat.actions.map(action => ({
        icon: <img src={action.img} alt={action.title} style={{ width: 36 }} />,
        title: action.title,
      }));

    ActionSheet.showShareActionSheetWithOptions({
      options: renderActions(),
      message: "Tell something to your roommates",
      cancelButtonText: "cancel",
    });
  }

  renderTabs() {
    const { activeTabIndex } = this.props.sharedFlat;
    switch (activeTabIndex) {
      case 0:
        return (
          <section className="event-list-wrapper">
            {this.renderEvents()}
          </section>
        );
      case 1:
        return <section />;
      case 2:
        return (
          <div>
            <section>{this.renderResidents()}</section>
            <section>{this.renderJoinRequests()}</section>
          </div>
        );

      default:
        return <section />;
    }
  }

  render() {
    const name = pathOr("Loading", ["sharedFlat", "data", "name"], this.props);
    const countResidents = path(
      ["sharedFlat", "data", "countResidents"],
      this.props,
    );
    return (
      <div>
        <div className="shared-flat-dashboard">
          <header>
            <WingBlank>
              {name} <span>{`${countResidents} resident`}</span>
            </WingBlank>
          </header>
          <WingBlank size="md" className="main">
            <WhiteSpace size="md" />
            <div className="main">{this.renderCharts()}</div>
            <WhiteSpace />
            {this.renderTabs()}
          </WingBlank>
        </div>
        <WhiteSpace />
        <WingBlank size="md" className="main">
          <Button
            type="primary"
            className="action-button"
            onClick={() => this.renderActionSheet()}>
            Notify
          </Button>
        </WingBlank>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    sharedFlat: state.sharedFlat,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
