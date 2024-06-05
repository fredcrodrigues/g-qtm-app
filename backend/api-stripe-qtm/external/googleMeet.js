const { SpacesServiceClient } = require("@google-apps/meet").v2
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const { auth } = require('google-auth-library');

class CreateScheduledMeetingUseCase {
    
    authClient
    credentials_path
    token_path
    scopes
    
    constructor() {
        this.scopes = ['https://www.googleapis.com/auth/meetings.space.created']
        this.credentials_path = path.join(process.cwd(), "credential.json")
        this.token_path = path.join(process.cwd(), "token.json")
        this.authorize().then(client => this.authClient=client)
    }
    
    async loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(this.token_path);
            const credentials = JSON.parse(content);
            return auth.fromJSON(credentials);
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    
    async saveCredentials(client) {
        const content = await fs.readFile(this.credentials_path);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(this.token_path, payload);
    }
    
    async authorize() {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: this.scopes,
            keyfilePath: this.credentials_path,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }
    
    async execute(requestId) {        
        const meetClient = new SpacesServiceClient({
            authClient: this.authClient
        });
        
        // Construct request
        const request = {
            name: "atendimento"
        };
        
        // Run request
        const response = await meetClient.createSpace(request);
        
        return { status: "success", meetingUrl: response[0].meetingUri}
    }

    errorHandling(error) {
        return { status: "error" }
    }
}

const createScheduledMeeting = new CreateScheduledMeetingUseCase();
module.exports = createScheduledMeeting