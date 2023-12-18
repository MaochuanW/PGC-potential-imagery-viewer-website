# PGC-potential-imagery-viewer-website
## Introduction

This github repo consists of the Polar Geospatial Center imagery mosaic viewer, an advanced web-based tool designed to offer an immersive and interactive experience in exploring the Antarctic, Arctic, and the World region. This application is a significant contribution to the field of geospatial science, providing high-resolution satellite imagery and a suite of interactive tools to enhance the understanding of one of the most remote and fascinating regions on Earth.

## Repository Overview

This GitHub repository houses a versatile web application tailored for exploring imagery across three key regions: Antarctica, the Arctic, and the world at large. Developed with HTML, CSS, and JavaScript, the application integrates the ArcGIS API for JavaScript, enabling detailed map rendering and interactive capabilities. As an initiative of the Polar Geospatial Center, this project is a demonstration to PGC's commitment to enhancing the accessibility of polar geospatial data. It serves as a valuable resource for users eager to explore the nuances of imagery available from PGC, including aspects like resolution, area coverage, and regional specifics.

### Repository Structure

- **Libs Folder**: Contains the essential `keycloak.js` script, it is used for user authentication, granting access to proprietary data within the website. Users would need to register a PGC account and have funding awards from NSF-OPP and NASA in order to access the proprietary data (Panchromatic and Multispectral imagery mosaic layers).

- **Pics Folder**: A repository of visual elements, including fonts and images, utilized in the viewers to showcase various locations around the globe.

- **Scripts and HTML Files**: The core of the application is structured into four HTML files and five JavaScript files, each linked to one another. Every region (Antarctica, Arctic, World) is represented with its unique HTML and JavaScript file, alongside a general landing page. The `constest.js` file represents an ongoing effort to streamline the repository, aiming to consolidate the functionality of all three viewers into a single HTML and JavaScript file. This approach is driven by the realization that while each viewer shares fundamental features, they differ in aspects like layering and additional functionalities.

### Customizability and Expansion

The viewer's architecture, grounded in the ArcGIS JavaScript API, opens up lots of possibilities for customization. The API's extensive range of functions allows for the continuous enhancement and adaptation of the viewer, catering to diverse user needs and preferences.


## Project goals
The primary goal of this project is to develop an interactive web application for viewing and managing geospatial imagery and data. The application aims to provide users with tools to explore different layers of geographic information, including topographic maps, satellite imagery, and other relevant geospatial data.

## Functional Specification

### Overview

The PGC Antarctic Imagery Viewer is built using modern web technologies, integrating with mapping capabilities provided by the ArcGIS API for JavaScript. It is designed to be user-friendly, responsive, and feature-rich, providing to a wide range of users from scientific researchers to educational professionals and polar enthusiasts.

### Key Features

1. **Interactive Map Viewer**: The main component of this web application is an interactive map viewer, leveraging the ArcGIS API for JavaScript. This feature allows users to dynamically explore various layers of satellite imagery, providing insights into the world landscape. Users can zoom in for detailed views or pan across different regions to gain a broader perspective.

2. **Layer Management**: The application offers a robust layer management system. Users can toggle between different map layers, including detailed imagery mosaics, topographic maps, and various labeled layers. This functionality is crucial for users who require specific types of data, such as geological features, ice movements, or research station locations.

3. **User Authentication and Access Control**: Security and data integrity are important. The application integrates with Keycloak for user authentication, ensuring that access to licensed data layers is controlled and secure. This feature is particularly important for maintaining the integrity of sensitive data and ensuring that only authorized users have access to specific datasets.

4. **Zoom to Popular Places**: This feature provides users with a quick and easy way to navigate to predefined locations of interest within the viewer's region. These locations include major research stations, notable geographical landmarks, and other points of interest, making the tool more accessible and user-friendly.

5. **Measurement Tools**: The application includes advanced measurement tools that allow users to calculate distances and areas directly on the map. This feature is invaluable for planning, research, and educational purposes, providing users with the ability to obtain precise measurements of geographical features.

6. **Shareable Map Extents**: Users can share their current map view with others through a generated URL. This feature captures the map's state, including zoom level and location, facilitating collaboration and sharing of information.

7. **Responsive Design**: The application is designed to be fully responsive, ensuring a seamless user experience across various devices and screen sizes. This feature is crucial for accessibility and usability, allowing users to access the tool from desktop computers, laptops, tablets, and smartphones.

8. **Help and Information Section**: A comprehensive help section is available, providing users with guidance on common issues, detailed credits, and additional resources. This section is designed to support users in navigating and utilizing the application effectively.

## User Description

The PGC Antarctic Imagery Viewer is designed for a diverse user base, including:

- **Researchers**: Scientists and academics conducting research in various fields such as climatology, geology, and biology, who require detailed and accurate geographical data of the Antarctic region.

- **Educators**: Teachers and educational professionals seeking interactive tools to engage students in learning about Antarctic geography, environmental science, and polar research.

- **Polar Enthusiasts**: Individuals with a strong interest in polar regions, remote sensing technology, and geographic information systems, who desire a platform to explore and learn about Antarctica.

## Building the viewer from Scratch

### Prerequisites

Before starting, ensure you have the following:

- A modern web browser (Chrome, Firefox, Safari recommended).
- A text editor or Integrated Development Environment (IDE) like Visual Studio Code for code editing.
- Basic knowledge of HTML, CSS, and JavaScript.

### Steps to Build

1. **Clone the Repository**: Use `git clone` to clone the repository to your local machine. This will create a copy of the project files on your computer.

2. **Install Dependencies**: Navigate to the project directory. While this project primarily relies on CDN-hosted libraries, ensure all local dependencies (if any) are installed.

3. **Configure Keycloak**: Set up Keycloak for user authentication. This involves running a Keycloak server and configuring it to work with the application. Ensure that the server is running and accessible before proceeding.

4. **Launch the Application**: Open the `index.html` file in a web browser. This should load the landing page user of the viewer application.

5. **Explore and Test Features**: Interact with the various features of the map viewer. Test the layer toggling, zoom functionalities, measurement tools, and other interactive elements to ensure they are working as expected.

6. **Debugging and Development**: Use the browser's developer tools for debugging and further development. These tools can help you inspect elements, test different styles, and debug JavaScript code.

## IDE and Packages

- **Recommended IDE**: Visual Studio Code is recommended due to its extensive support for web technologies. It offers features like syntax highlighting, code completion, and a built-in terminal, which are beneficial for web development.

- **Packages and API**: The application uses ESRI’s ArcGIS API for JavaScript, accessed directly from ESRI’s content distribution network (CDN). The specific version used is 4.26, as referenced in the HTML file:

  ```html
  <link
    rel="stylesheet"
    href="https://js.arcgis.com/4.26/esri/themes/light/main.css"
  />
  <script src="https://js.arcgis.com/4.26/"></script>