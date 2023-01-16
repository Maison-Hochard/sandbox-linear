import commander from "commander";
import dotenv from 'dotenv';
dotenv.config();

import { gql, GraphQLClient } from 'graphql-request';

import { Command } from 'commander';
const program = new Command();

program
    .usage('[options]')
    .option('-t, --title <title>', 'Title of the ticket')
    .option('-d, --description <description>', 'Description of the ticket')
    .parse(process.argv);

const options = program.opts();

const graphQLClient = new GraphQLClient('https://api.linear.app/graphql', {
    headers: {
        contentType: 'application/json',
        authorization: 'Bearer ' + process.env.TOKEN_API,
    },
});

async function createTicket() {
    const mutation = gql`mutation IssueCreate($teamId: String!, $projectId: String!, $title: String!, $description: String!) {
        issueCreate(input: { teamId: $teamId, projectId: $projectId, title: $title, description: $description }) {
            success
            issue {
                id
                title
            }
        }
    }`;
    const variables = {
        teamId: process.env.TEAM_ID,
        projectId: process.env.PROJECT_ID,
        title: options.title,
        description: options.description,
    }
    const data = await graphQLClient.request(mutation, variables);
    console.log(data);
    return data;
}

 async function launchScript() {
     await createTicket();
 }

launchScript()
    .then(_ => {
        console.log("Script ended");
        ;
        process.exit();
    })
    .catch(e => {
        console.log("Script failed: " + e);
        process.exit();
    });
