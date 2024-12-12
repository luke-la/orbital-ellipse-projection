# Orbital Ellipse Projection
A program that generates a reactive orthographic projection of a specified orbital ellipse.

## Description
Unique orbits may be defined using six orbital elements, known as Keplerian elements. This website generates an approximate orthographic projection of an orbital ellipse as viewed from above based on those elements.

It features an interactive app where the user may input variables in range to view their effect on the shape and position of the ellipse. These controls also include several display options, such as reference planes and connecting lines to improve the readability of the display.

Below the web app is a breakdown and explanation of the math used to generate the projection and how that is then converted into a shape that may be displayed on an HTML canvas element.

## Getting Started
### Dependencies
This project uses Vue.js via CDN, so it doesn't require installation of Vue CLI.

For development purposes you may change the CLN reference in the head of index.html from:
```
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
```
to:
```
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

### Using the Program
The easiest way to view the site is via [Github Pages](https://luke-la.github.io/orbital-ellipse-projection/).

Alternately, you may follow these steps to run it locally: 
1. Download a .ZIP file of the repo
2. Extract the files to a folder you will be able to easily find
3. Open index.html in your favorite web browser (On Windows: open the browser and press `Ctrl+O` or double click on the file from your file explorer)

## Contributions
Contributions are welcome if they improve existing functionality, but are not being requested given the limited size and complexity of the project.

## Version History
* 0.1
  * Initial Release

## License
THis project is Licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgements
Existing Orbital Projection tools used as reference:
* [Orbital Mechanics](https://orbitalmechanics.info/)
* [NASA - Custom Orbit Visualization](https://ssd.jpl.nasa.gov/tools/orbit_diagram.html)

Other Resources for constants and formulas:
* [Wikipedia - Orbital Elements](https://en.wikipedia.org/wiki/Orbital_elements)
* [Wikipedia - True Anomaly](https://en.wikipedia.org/wiki/True_anomaly)
* [Stack Overflow - Point on an Ellipse](https://stackoverflow.com/questions/14863188/moving-a-point-along-ellipse)