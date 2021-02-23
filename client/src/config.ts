// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'n5r6fr54g4'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-alny3s17.eu.auth0.com',            // Auth0 domain
  clientId: 'i8kmOnKfmea5d4nHG03zGI2ED0dSiYTG',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
