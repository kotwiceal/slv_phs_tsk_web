# Description
`Flask` application presents a single page GUI interface to provide solving classical gravitational task 2D and 3D configuration with arbitrary count of bodies.

### Preparing to run project
1.  Install `Python` dependencies by means `poetry` package manager:

    ```properties
    poetry shell
    poetry update
    ```
2.  Install `JavaScript` frameworks by means `npm` package manager:

    ```properties
    cd src/static
    npm update
    npm run dev
    ```
3.  Launch the application:

    ```properties
    cd ../..
    python run.py
    ```