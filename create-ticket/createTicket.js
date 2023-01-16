require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss');
require('dotenv').config();

const commander = require("commander");
const axios = require('axios');

commander
    .version("1.0.0")
    .usage('[options]')
    .option('-d, --demo <string>', 'exemple option')
    .parse(process.argv);

const program = commander.opts();
 async function createTicket() {
     const mutation = `mutation IssueCreate {
        issueCreate(
            input: {
                title: "Morgan First Ticket"
                description: "More detailed error report in markdown"
                teamId: "34b08c67-0366-4cc0-8a32-07d481c045f1"
                projectId: "548059c8-d867-45bc-b2ab-785ac97a2535"
            }
        ) {
            success
                issue {
                    id
                    title
                    description
                }
        }
     }`;
     const options = {
        method: 'POST',
        url: 'https://api.linear.app/graphql',
        headers: {
            'content-type': 'application/json',
            'Authorize': `Bearer ${process.env.LINEAR_TOKEN_API_KEY}`
        },
        data: {query: mutation}
     };
     await axios(options)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log("Error: ", error);
        });
 }

createTicket()
    .then(_ => {
        console.log("Script ended");;
        process.exit();
    })
    .catch(e => {
        console.log("Script failed: " + e);
        process.exit();
    });