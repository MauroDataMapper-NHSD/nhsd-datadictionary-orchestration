# nhsd-datadictionary-orchestration

Web front-end for the NHS Digital Orchestration dashboard.

## Installation

- Clone the `nhsd-datadictionary-orchestration` repo - ```git clone git@github.com:MauroDataMapper/nhsd-datadictionary-orchestration.git``` - note that branch `develop` is the most up-to-date
- `cd` into the `nhsd-datadictionary-orchestration` folder and run ```npm install --save --save-dev``` - this will install all dependencies
- If you need to install Angular CLI, then run `npm i @angular/cli`

### Run the application (in Dev mode)

- To start the application in Dev, run `ng serve` -> while you are still inside the `nhsd-datadictionary-orchestration` folder. This will compile the Angular code
- After the terminal finishes compiling,  open up your browser and navigate to  http://localhost:4201

### Build the application for production

- To 'export' the code for production, run `ng build --prod` - this will compile & minify the code, making it ready for production

## Requirements

Please use [NVM](https://github.com/nvm-sh/nvm) to manage the required node/npm dependencies.
