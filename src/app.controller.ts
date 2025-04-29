import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
const crypto = require('crypto');
import * as puppeteer from 'puppeteer';
import { Response } from 'express';

const HOTELBEDS_BASE_URL = "https://api.test.hotelbeds.com";
const HOTELBEDS_CLIENT_ID = "531c46fc346c6729b9e9094f65abef70";
const HOTELBEDS_CLIENT_SECRET = "1e83c000f3";
// const HOTELBEDS_CLIENT_ID = "e8519893a3aad3e0b659d7bfa14e049d";
// const HOTELBEDS_CLIENT_SECRET = "71871f2386";

//vonage
import { Auth } from '@vonage/auth';
// import { Vonage } from '@vonage/server-sdk';
const { Vonage } = require('@vonage/server-sdk');
import { MediaMode } from '@vonage/video';
import { Video } from '@vonage/video';
import * as OpenTok from 'opentok';

// Replace with your actual API Key, Application ID, and the path to your private key file
// const apiKey = 'fdea1466';
const applicationId = 'c683ca6b-bb16-4b68-af2f-d8caedfd36e1';
const privateKeyPath = './private.key'; // Update this with the actual path

// const OpenTok = require('opentok');

// Replace with your actual Vonage Video API credentials
const apiKey = 'fdea1466';
const apiSecret = 'yRBYJH35uSjBPxF0';

@Controller()
export class AppController {

  private opentok: OpenTok;

  constructor(private readonly appService: AppService) {
    this.opentok = new OpenTok(
      apiKey,
      apiSecret
    );
  }

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

  @Get('/CreateVonageSession')
  async CreateVonageSession() {
    const credentials = new Auth({
      applicationId: applicationId,
      privateKey: privateKeyPath,
    });

    const vonage = new Vonage(credentials);
    try {
      const response = await vonage.video.createSession({
        mediaMode: MediaMode.ROUTED, // Or MediaMode.RELAYED
      });
      console.log('Vonage Session created successfully:');
      console.log('Session ID:', response);

      const options = {
        role: "moderator",
        expireTime: ((new Date().getTime() / 1000) + 7) * 24 * 60 * 60, // in one week
        data: "name=Johnny",
        initialLayoutClassList: ["focus"]
      }
      const token = vonage.video.generateClientToken(response.sessionId, options);
      return { sessionID: response.sessionId, token: token };
    } catch (error: any) {
      console.error('Error creating Vonage Session:', error);
      console.error(error);
    }
  }

  @Post('downloadPdf')
  async downloadPdf(@Body('html') html: string, @Res() res: Response) {

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      headerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; padding: 10px;">
          <span class="title">My Custom Header</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; padding: 10px;">
          <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '50px', // space for header
        bottom: '50px', // space for footer
        right: '50px', 
        left: '50px'
      },
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).send('Failed to generate PDF');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.end(pdfBuffer);
  }

}
