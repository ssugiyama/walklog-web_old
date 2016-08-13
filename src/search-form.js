import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { setSearchForm, search} from './actions';
import { push } from 'react-router-redux'
import {browserHistory} from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const order_options  = [
    { label: 'newest first', value: 'newest_first' },
    { label: 'oldest first', value: 'oldest_first' },    
    { label: 'longest first', value: 'longest_first' },
    { label: 'shortest first', value: 'shortest_first' },
    { label: 'northernmost first', value: 'northernmost_first' },
    { label: 'southernmostest first', value: 'southernmost_first' },
    { label: 'easternmost first', value: 'easternmost_first' },
    { label: 'westernmost first', value: 'westernmost_first' },        
];

const order_options_hausdorff = [
    { label: 'nearest first', value: 'nearest_first' },    
];

class SearchForm extends Component {
    handleSubmit(e) {
	e.preventDefault();
	let keys = ['filter', 'year', 'month', 'order', 'limit'];
	switch (this.props.filter) {
	    case 'neighborhood':
		keys.push('radius', 'longitude', 'latitude');
		break;
	    case 'cities':
		keys.push('cities');
		break;
	    case 'crossing':
	    case 'hausdorff':
		keys.push('searchPath');
		break;
	}

	let query = {}
	keys.forEach(key => { query[key] = this.props[key] });
	this.props.push({
	    query
	});
    }
    handleSelectChange(name, e, index, value) {
	this.props.setSearchForm({[name]: value});
    }
    handleTextChange(name, e) {
	this.props.setSearchForm({[name]: e.target.value});
    }    
    componentDidMount() {
	if (this.props.do_search) {
	    this.props.search(this.props);
	}
    }
    componentDidUpdate() {
	if (this.props.do_search) {
	    this.props.search(this.props);
	}
    }
    searchDisabled() {
	if ((this.props.filter == 'hausdorff' || this.props.filter == 'crossing') && !this.props.searchPath) return true;
	else if (this.props.filter == 'cities' && !this.props.cities) return true;	
	else return false;
    }
    render() {   
	return (
	    <form className="form-horizontal" role="form" onSubmit={this.handleSubmit.bind(this)}>
		<input type="hidden" name="latitude" value="" />
		<input type="hidden" name="longitude" value="" />
		<input type="hidden" name="radius" value="" />
		<input type="hidden" name="cities" value=""  />
		<input type="hidden" name="searchPath" value=""  />
		<div>
		    <SelectField floatingLabelText="filter" value={this.props.filter} onChange={this.handleSelectChange.bind(this, 'filter')} fullWidth={true}>
			<MenuItem value="any" primaryText="any" />
			<MenuItem value="neighborhood" primaryText="Neighborhood" />
			<MenuItem value="cities" primaryText="Cities" />
			<MenuItem value="hausdorff" primaryText="Hausdorff" />
			<MenuItem value="crossing" primaryText="Crossing" />
		    </SelectField>
		</div>
		<div>
		    <SelectField floatingLabelText="month" floatingLabelFixed={true} value={this.props.month} onChange={this.handleSelectChange.bind(this, 'month')} style={{width: "50%"}}>
			<MenuItem value="" primaryText="-" />
			<MenuItem value="1" primaryText="Jan" />
			<MenuItem value="2" primaryText="Feb" />
			<MenuItem value="3" primaryText="Mar" />
			<MenuItem value="4" primaryText="Apr" />
			<MenuItem value="5" primaryText="May" />
			<MenuItem value="6" primaryText="Jun" />
			<MenuItem value="7" primaryText="Jul" />
			<MenuItem value="8" primaryText="Aug" />
			<MenuItem value="9" primaryText="Sep" />
			<MenuItem value="10" primaryText="Oct" />
			<MenuItem value="11" primaryText="Nov" />
			<MenuItem value="12" primaryText="Dec" />
		    </SelectField>
		    <SelectField floatingLabelText="year" floatingLabelFixed={true} value={this.props.year} onChange={this.handleSelectChange.bind(this, 'year')} style={{width: "50%"}}>
			<MenuItem value="" primaryText="-" />
			{this.props.years.map(function (y) {
			     return <MenuItem value={y} key={y} primaryText={y} />
			 })}
		    </SelectField>
		</div>
		<div>
		    <SelectField floatingLabelText="order" value={this.props.order} onChange={this.handleSelectChange.bind(this, 'order')} style={{width: "50%", verticalAlign: 'bottom'}}>
			{
			    (this.props.filter == 'hausdorff' ? order_options_hausdorff : order_options).map(option => 
				<MenuItem value={option.value} key={option.value} primaryText={option.label} />
			    )
			}
		    </SelectField>
		    <TextField floatingLabelText="limit" floatingLabelFixed={true} value={this.props.limit} onChange={this.handleTextChange.bind(this, 'limit')} style={{width: "50%"}} />
		</div>
		<div style={{textAlign: 'center'}}>
 	            <FlatButton label="search" primary={true} type="submit" icon={<SearchIcon />} />
                    <FlatButton type="reset" secondary={true} label="reset" />
		</div>
	    </form>
	);
    }
}


function mapStateToProps(state) {
    return Object.assign({}, state.main.search_form, { years: state.main.years, do_search: state.main.do_search });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setSearchForm, search, push}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);