import commander from "commander";
import dotenv from 'dotenv';
dotenv.config();

import { gql, GraphQLClient } from 'graphql-request';

import { Command } from 'commander';
const program = new Command();

program
    .usage('[options]')
    .option('-i, --issueId <issueId>', 'Issue Id')
    .option('-u, --userId <userId>', 'New User')
    .parse(process.argv);

const options = program.opts();

const graphQLClient = new GraphQLClient('https://api.linear.app/graphql', {
    headers: {
        contentType: 'application/json',
        authorization: 'Bearer ' + process.env.TOKEN_API,
    },
});

async function assignTicket() {
    const mutation = gql`mutation AssignIssue($id: String!, $userId: String!, $teamId: String!, $projectId: String!) {
        issueUpdate(
            id: $id,
            input: { 
                assigneeId: $userId, 
                teamId: $teamId, 
                projectId: $projectId 
            }
        ) {
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
        id: options.issueId,
        userId: options.userId
    }
    console.log(variables)
    const data = await graphQLClient.request(mutation, variables);
    console.log(data);
    return data;
}

 async function launchScript() {
     await assignTicket();
 }

launchScript()
    .then(_ => {
        console.log("Script ended");
        process.exit();
    })
    .catch(e => {
        console.log("Script failed: " + e);
        process.exit();
    });
