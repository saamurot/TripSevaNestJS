import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
const crypto = require('crypto');

const HOTELBEDS_BASE_URL = "https://api.test.hotelbeds.com";
const HOTELBEDS_CLIENT_ID = "531c46fc346c6729b9e9094f65abef70";
const HOTELBEDS_CLIENT_SECRET = "1e83c000f3";
// const HOTELBEDS_CLIENT_ID = "e8519893a3aad3e0b659d7bfa14e049d";
// const HOTELBEDS_CLIENT_SECRET = "71871f2386";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/GetHotelBedSignature')
  async GetHotelBedSignature() {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
    const hash = crypto.createHash('sha256');
    hash.update(signatureString);
    return { signature: hash.digest('hex'), timestamp: timestamp };
  }

  @Get('/GetDestinations')
  async GetDestinations() {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
      const hash = crypto.createHash('sha256');
      hash.update(signatureString);
      const signature = hash.digest('hex');
      console.log("signature", signature);
      // return { signature: hash.digest('hex'), timestamp: timestamp };

      const myHeaders = new Headers();
      myHeaders.append("Api-key", HOTELBEDS_CLIENT_ID);
      myHeaders.append("X-Signature", signature);
      myHeaders.append("Accept", "application/json");
      // Remove the Accept-Encoding header!
      // myHeaders.append("Accept-Encoding", "gzip");

      let requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${HOTELBEDS_BASE_URL}/hotel-content-api/1.0/locations/destinations?fields=all&countryCodes=IN&language=ENG&from=1&to=361&useSecondaryLanguage=false`,
        requestOptions
      );
      // console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/GetHotels')
  async GetHotels(@Query('destinationCode') destinationCode: any, @Query('from') from: any, @Query('to') to: any) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
      const hash = crypto.createHash('sha256');
      hash.update(signatureString);
      const signature = hash.digest('hex');
      console.log("signature", signature);
      // return { signature: hash.digest('hex'), timestamp: timestamp };

      const myHeaders = new Headers();
      myHeaders.append("Api-key", HOTELBEDS_CLIENT_ID);
      myHeaders.append("X-Signature", signature);
      myHeaders.append("Accept", "application/json");
      // Remove the Accept-Encoding header!
      // myHeaders.append("Accept-Encoding", "gzip");

      let requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${HOTELBEDS_BASE_URL}/hotel-content-api/1.0/hotels?fields=all&destinationCode=${destinationCode}&language=ENG&from=${from}&to=${to}&useSecondaryLanguage=false`,
        requestOptions
      );
      // console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/GetHotelDetails')
  async GetHotelDetails(@Query('hotelCode') hotelCode: any) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
      const hash = crypto.createHash('sha256');
      hash.update(signatureString);
      const signature = hash.digest('hex');
      console.log("signature", signature);
      // return { signature: hash.digest('hex'), timestamp: timestamp };

      const myHeaders = new Headers();
      myHeaders.append("Api-key", HOTELBEDS_CLIENT_ID);
      myHeaders.append("X-Signature", signature);
      myHeaders.append("Accept", "application/json");
      // Remove the Accept-Encoding header!
      // myHeaders.append("Accept-Encoding", "gzip");

      let requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${HOTELBEDS_BASE_URL}/hotel-content-api/1.0/hotels/${hotelCode}/details?language=ENG&useSecondaryLanguage=False`,
        requestOptions
      );
      // console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
