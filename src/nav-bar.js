import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setAdditionalView, setSearchForm, showSidebar } from './actions';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Divider from 'material-ui/Divider';

export default class NavBar extends Component {
    constructor(props) {
	super(props);
	this.state = {length: 0};
    }
    componentWillReceiveProps(nextProps) {
	if (nextProps.path_manager && !this.length_listener) {
 	    this.length_listener = google.maps.event.addListener(nextProps.path_manager, 'length_changed', () => {
		this.setState({ length: nextProps.path_manager.get('length') || 0 });
            });
	}
    }
    handleNewWalk() {
	this.props.openWalkEditor({id: '', date: '', title: '', comment: ''});
    }
    resetCities() {
	this.props.setSearchForm({cities: ''});
    }
    setRadius(r) {
	this.props.setSearchForm({radius: r});
    }
    handleShow() {
	this.props.showSidebar(true);
    }    
    render() {   
        return (
	    <AppBar
 		title="walklog"
		onLeftIconButtonTouchTap={this.handleShow.bind(this)}
		iconElementRight={
		    <IconMenu
                        iconButtonElement={
                            <IconButton><MoreVertIcon /></IconButton>
		        }
		    >
		    <MenuItem primaryText="new walk..."  onTouchTap={this.handleNewWalk.bind(this)} disabled={this.props.selected_path == null}/>
		    <MenuItem primaryText="path" rightIcon={<ArrowDropRight />}
                        menuItems={[
                            <MenuItem primaryText="edit" onTouchTap={() => this.props.path_manager.set('editable', true)} disabled={! this.props.selected_path} />,
                            <MenuItem primaryText="delete" onTouchTap={() => this.props.path_manager.deletePath() }  disabled={! this.props.selected_path} />,
                            <MenuItem primaryText="clear" onTouchTap={() => this.props.path_manager.deleteAll() } />,
                            <MenuItem primaryText="export/import..." onTouchTap={() => this.props.openIOModal()} />,
                        ]}

		    />
 		    <MenuItem primaryText="geo" rightIcon={<ArrowDropRight />}
	  	    menuItems={[
			<MenuItem onTouchTap={ () => this.props.openGeocodeModal()} primaryText="geocode..." />,
			<MenuItem onTouchTap={() => this.props.setCurrentPosition()} primaryText="geolocation" />
		    ]} />
	 	    { this.props.filter == 'cities' ? 			   
                      <MenuItem onTouchTap={this.resetCities.bind(this)} primaryText="reset cities" /> : null }
                    { this.props.filter == "neighborhood" ?
		      <MenuItem primaryText="neighborhood"  rightIcon={<ArrowDropRight />}
		      menuItems={[
			  <MenuItem onTouchTap={this.setRadius.bind(this, 1000)}  primaryText="radius: 1km" />,
			  <MenuItem onTouchTap={this.setRadius.bind(this, 500)}  primaryText="radius: 500m" />,
			  <MenuItem onTouchTap={this.setRadius.bind(this, 250)}  primaryText="radius: 250m" />,
			  <MenuItem onTouchTap={this.setRadius.bind(this, 100)}  primaryText="radius: 100m" />			  
		      ]} /> : null }
		    <Divider />
		    <MenuItem primaryText={`Length: ${this.state.length.toFixed(1)}km`} disabled={true}/>
		    </IconMenu>
	    }
		/>
        );
    }
}

function mapStateToProps(state) {
    return {
	filter: state.main.search_form.filter,
	openWalkEditor: state.main.component_procs.openWalkEditor,
	openIOModal: state.main.component_procs.openIOModal,
	openGeocodeModal: state.main.component_procs.openGeocodeModal,
	setCurrentPosition: state.main.component_procs.setCurrentPosition,
	path_manager: state.main.path_manager,
	selected_path: state.main.selected_path,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setAdditionalView, setSearchForm, showSidebar }, dispatch);    
 }

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

/*
            <nav className="navbar navbar-default navbar-static-top" id="nav" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-content" aria-expanded="false">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                 <a className="navbar-brand" href="/">walklog</a>
                </div>
                <div className="collapse navbar-collapse" id="navbar-content">
                    <ul className="nav navbar-nav">
                    <li className="dropdown">
                        <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                            Path
                            <b className="caret"></b>
                        </a>
                        <ul className="dropdown-menu">
                            <li className={this.props.selected_path == null ? 'disabled' : ''}><a onClick={this.handleNewWalk.bind(this)}  href="javascript:void(0)">new walk...</a></li>
                            <li role="separator" className="divider"></li>
                            <li><a onClick={() => this.props.path_manager.set('editable', true)} href="javascript:void(0)">edit</a></li>
                            <li><a onClick={() => this.props.path_manager.deletePath() } href="javascript:void(0)">delete</a></li>
                            <li><a onClick={() => this.props.path_manager.deleteAll() } href="javascript:void(0)">clear</a></li>
                            <li><a onClick={() => this.props.openIOModal()} href="javascript:void(0)" >export/import...</a></li>
                            <li role="separator" className="divider"></li>
                <li className="dropdown-header">Length: {this.state.length.toFixed(1)}km</li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                            Geo
            <b className="caret"></b>
            </a>
            <ul className="dropdown-menu">
		<li><a onClick={ () => this.props.openGeocodeModal()} href="javascript:void(0)">geocode...</a></li>
		<li><a onClick={() => this.props.setCurrentPosition()} href="javascript:void(0)">geolocation</a></li>
            </ul>
		</li>
	    { this.props.filter == 'cities' ? (
		<li className="dropdown">
		<a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
		Cities
		<b className="caret"></b>
		</a>
		<ul className="dropdown-menu">
		<li><a onClick={this.resetCities.bind(this)}  href="javascript:void(0)">reset</a></li>
		</ul>
		</li>) : null }
	    { this.props.filter == 'neighborhood' ?
              (<li className="dropdown">
		  <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
		  Neighborhood
		  <b className="caret"></b>
		  </a>
		  <ul className="dropdown-menu">
		  <li><a onClick={this.setRadius.bind(this, 1000)}  href="javascript:void(0)">radius: 1km</a></li>
		  <li><a onClick={this.setRadius.bind(this, 500)}  href="javascript:void(0)">radius: 500m</a></li>
		  <li><a onClick={this.setRadius.bind(this, 250)}  href="javascript:void(0)">radius: 250m</a></li>
		  <li><a onClick={this.setRadius.bind(this, 100)}  href="javascript:void(0)">radius: 100m</a></li>
		  </ul>
		  </li>) : null }
            <li className="dropdown">
            <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
            View
            <b className="caret"></b>
            </a>
            <ul className="dropdown-menu">
		<li className={this.props.selected_path == null ? 'disabled' : ''}><a onClick={ () => this.props.setAdditionalView('elevation') } href="javascript:void(0)">with elevation</a></li>
		<li className={this.props.selected_path == null ? 'disabled' : ''}><a onClick={ () => this.props.setAdditionalView('panorama')} href="javascript:void(0)" >with street view</a></li>
		<li><a onClick={ () => this.props.setAdditionalView(null) } href="javascript:void(0)" >map only</a></li>
            </ul>
            </li>
            </ul>
            </div>
            </nav>
*/