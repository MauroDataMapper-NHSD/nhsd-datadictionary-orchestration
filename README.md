# nhsd-datadictionary-orchestration

Web front-end for the NHS England Orchestration dashboard.

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

## Configuration

### Application

The `src/environments/environment.ts` file can control various application settings:

* `apiEndpoint` - the URL to the Mauro API endpoint to communicate with.
* `mauroBaseUrl` - the URL to the Mauro Data Mapper instance to cross reference hyperlinks with.
* `themeName` - the name of the theme to use:
    * `'default'` - use Mauro color scheme.
    * `'nhs-digital'` - use NHS England color scheme.

### Environment Variables

The `custom-webpack.config.js` file includes optional environment variables to control the production build of this application. Environment variables can be used during a build pipeline e.g. creating a Docker image.

Environment variables available:

* `MDM_UI_THEME_NAME` - maps to the `themeName` setting in `environment.js`.

## MDM-Resources

We have a dependency on another repository ([mdm-resources](https://github.com/MauroDataMapper/mdm-resources)) which we develop.

The package.json file is configured to use the latest release of this module into the NPM registry,
however if you are developing mdm-resources alongside this application or you know there are changes which have not yet been released you will need to 
do the following

1. Clone the mdm-resources repository
2. Link the mdm-resources repository into your global npm
3. Link mdm-resources into mdm-ui

Once you have linked the mdm-resources repo into the global npm it will remain there until you unlink it,
you will have to re-build (`npm run build`) mdm-resources with each change for those changes to be picked up by this application,
however you dont have to re-link after the rebuild.

### Linking to mdm-resources

If you run `npm install` inside this repo you will have to re-run the final link step below to re-link mdm-resources into this application.

```shell
# Clone mdm-resources
$ git clone git@github.com:MauroDataMapper/mdm-resources.git

# Link mdm-resources to global npm
$ cd mdm-resources
$ npm install
$ npm run build
$ npm link

# Link mdm-resources into nhsd-datadictionary-orchestration
$ cd nhsd-datadictionary-orchestration
$ npm link @maurodatamapper/mdm-resources
```

### Unlinking from mdm-resources

This is surprisingly simple just run `npm install` or `npm ci`

### Useful Tool for Links

There is a useful npm package ([symlinked](https://www.npmjs.com/package/symlinked)) which can list what modules are linked into your repository.
This is helpful if you want to check if mdm-resources is currently linked to mdm-ui.
We recommend installing this globally with `npm i -g symlinked` then you can call it inside mdm-ui using `symlinked names`.
