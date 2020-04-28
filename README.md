# Image Edge detection using ACO

Image Edge detection using ACO is a software program that provides a web-based implementation of an adapted Ant System algorithm proposed by [Liu and Fang (2015)](https://www.sciencedirect.com/science/article/abs/pii/S0030401815003946). With some enhancements to the process, it is able to process perfectly most images - from clear to noisy.
It has an accessible interface and is easy to use.

The online version is hosted by GitHub Pages and can be found [here](https://alecsiv.github.io/image-edge-detection-aco/).

## General information

The main source code of the system lives under the `src` folder. However, the compiled scripts by webpack are under the `docs` folder. To inspect the written source code, please review the files under `src`.

The main files are:

- `app.js`
- `app.scss`
- `index.html`

## Rendering project in browser locally

There are two ways of rendering this project in the web browser:

1. Open up compiled HTML file
2. Run using NPM

To open up the compiled HTMl file, simply navigate to the `docs` folder of the project and open `index.html` with the preffered browser.

To run the project using NPM, please follow the instructions below:

### NPM set up

The project uses the standard node package manager - [NPM](https://www.npmjs.com/). Therefore NPM must be set up on the working machine to run the local server (please see [NPM Get Started](https://www.npmjs.com/get-npm)).

Assuming NPM is installed, navigate to the root folder of the project in the comand line interface and run:

```bash
npm install
```

### Running Local Server

To run the local server, navigate to the project's root folder and execute the start command:

```bash
npm run start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

---
Developed with ❤️ by Alexander Ivanov (B614581)
