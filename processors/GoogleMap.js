//import { throws } from "assert";
const fetch = require("node-fetch");

class GoogleMap {

    constructor(config) {
        this.MAPAPI_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        this.config = config;
    };

    async httpGet(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    };

    async getGeoCoordinates(human_readable_location) {
        const location = encodeURIComponent(human_readable_location);
        const request = `${this.MAPAPI_URL}${location}&key=${this.config.key}`;
        console.log(request);
        var text = await this.httpGet(request);
        var json = JSON.parse(text);
        try {
            return json.results[0].geometry.location;
        } catch (ex) {
            return null;
        }
    }
}

module.exports = GoogleMap;
