import commander from "commander";
import dotenv from 'dotenv';
dotenv.config();

import { gql, GraphQLClient } from 'graphql-request';

import { Command } from 'commander';
const program = new Command();

program
    .usage('[options]')
    .option('-n, --name <name>', 'Name of the Project')
    .option('-d, --description <description>', 'Description of the ticket')
    .parse(process.argv);

const options = program.opts();

const graphQLClient = new GraphQLClient('https://api.linear.app/graphql', {
    headers: {
        contentType: 'application/json',
        authorization: 'Bearer ' + process.env.TOKEN_API,
    },
});

async function createProject() {
    const mutation = gql`mutation CreateProject($name: String!, $description: String!, $teamId: [String!]!) {
        projectCreate( 
            input: {
                teamIds: $teamId,
                name: $name,
                description: $description,
                state: "started"
            }) {
            success
            project {
                id
                name
            }
        }
    }`;
    const variables = {
        teamId: process.env.TEAM_ID,
        name: options.name,
        description: options.description,
    }
    const data = await graphQLClient.request(mutation, variables);
    console.log(data);
    return data;
}

 async function launchScript() {
     await createProject();
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
