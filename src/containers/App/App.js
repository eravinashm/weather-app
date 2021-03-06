import React, { Component } from 'react';
import jquery from 'jquery';

// import logo from './logo.svg';
import './App.css';
import WeatherDataByCityId from '../../services/WeatherDataByCityIdService';
import WeatherDataByCityCountryService from '../../services/WeatherDataByCityCountryService';
import UserForm from '../../components/UserForm/UserForm';
import Form from '../../UI/Autocomplete/Form/Form';
import Autocomplete from '../../UI/Autocomplete/Autocomplete';
import cityListJson from '../../data/city.list.json';
import SimpleCard from '../../components/SimpleCard/SimpleCard';
import { Header, Footer } from '../../components/Header/Header';
const WeatherImage = require("../../assets/weather.gif");

class App extends Component {
  state = {
    weatherData: null,
    completeCityList: [],
    hasError: false,
    cityName: ''
  }

  componentDidMount(){
    this.autocomplete();
  }

  fetchResponseData = async (searchParams) => {
    let weatherData = await WeatherDataByCityCountryService(searchParams);
    if(weatherData !== null){
      this.setState({weatherData, hasError: false});
    }else
      this.setState({hasError: true});
  }
 
  formData = cityName => {
    console.log(" cityName ", cityName)
    let countryCode = '';
    this.state.completeCityList.map(singleObject => {
      if(cityName === singleObject.name){
        countryCode = singleObject.country;
      }
    })
    let searchParams = {...this.state.searchParams};
    searchParams.cityName = cityName;
    searchParams.countryCode = countryCode;
    this.setState({cityName});
    // console.log("cityName = "+cityName+", countryCode = "+countryCode);        
    if(countryCode !== '')
      this.fetchResponseData(searchParams);    
  }

  autocomplete = () => {
      /*An array containing all the country names in the world:*/
//    let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    let cityList = [];
    jquery.getJSON('city.list.json', (response) => {
      response.map(singleObject => {
        cityList.push(singleObject.name);
      })
      this.setState({completeCityList: response});
    });
    Autocomplete(document.getElementById("cityName"), cityList);
  }

render() {
    // let weatherData = this.state.weatherData;
    // if(weatherData.city !== undefined)
    //   console.log(weatherData.city)
    // data = weatherData;
    let recentSearchesData = [];
    if(JSON.parse(localStorage.getItem("weatherData")))
      recentSearchesData = [ ...JSON.parse(localStorage.getItem("weatherData"))];        

    if(this.state.weatherData !== null){
      recentSearchesData.unshift(this.state.weatherData);      
      localStorage.setItem("weatherData", JSON.stringify(recentSearchesData));
    } 
      
    return (
      <React.Fragment>
        <Header />
        <div className="app-main">
        <p className="app-weather-info-heading">Search your city weather information</p>
        <Form formData={this.formData} />  
        {
          this.state.hasError ? 
          <h1>For Cityname: {this.state.cityName} is not in records. Please select a valid cityname from dropdown list.</h1>:
          recentSearchesData.length > 0 ?
          <React.Fragment>
          <h2 className="recent-heading">Recent Searches</h2>
          <div className="recent-searches">
          {recentSearchesData.map(weather => (
              <SimpleCard 
                cityName={weather.name}
                humidity={weather.main.humidity}
                pressure={weather.main.pressure}
                temperature={weather.main.temp}
              />
            ))
          } 
          </div>
          </React.Fragment>: <img src={WeatherImage} alt=""/>
        }      
        </div>
        <Footer />
      </React.Fragment>
    );
  }

}

export default App;
//        <UserForm userFormData={this.userFormData}/>
