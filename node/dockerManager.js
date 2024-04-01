const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

class DockerManager {
    constructor(config) {
        this.docker = new Docker();
        this.image = config.image || "test_image";
    }

    buildImageAndRunContainer(scriptName) {
        return new Promise((resolve, reject) => {
            const buildOptions = {
                context: __dirname,
                src: ['Dockerfile', 'loader.py'], // Include loader script and python scripts folder
            };
    
            this.docker.buildImage(buildOptions, { t: this.image }, (error, stream) => {
                if (error) {
                    console.error('Error building Docker image: ', error);
                    reject(error); // Reject the Promise if there's an error
                    return;
                }
    
                // Handle build output
                stream.setEncoding('utf8');
                stream.on('data', (chunk) => {
                    console.log(chunk);
                });
                stream.on('end', () => {
                    console.log('Docker image build complete.');
    
                    // Once image is built, create and run the container
                    this.runContainer(scriptName)
                        .then(output => resolve(output)) // Resolve the Promise with the output
                        .catch(error => reject(error)); // Reject the Promise if there's an error
                });
            });
        });
    }
    

    runContainer(scriptName) {
        return new Promise((resolve, reject) => {
            const containerOptions = {
                Image: this.image,
                Cmd: [`${scriptName}.py`],
                AttachStdout: true,
                AttachStderr: true,
                Volumes: {
                    './python_scripts': {}
                },
                HostConfig:{
                    Binds:  [`${process.cwd()}/python_scripts:/app/python_scripts`]
                }
            };
    
            this.docker.createContainer(containerOptions, (error, container) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                container.attach({ stream: true, stdout: true, stderr: true }, (err, attach) => {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    container.start((error) => {
                        if (error) {
                            reject(error);
                            return;
                        }
    
                        let output = '';
    
                        // Collect output from stdout
                        container.modem.demuxStream(attach, process.stdout, process.stderr);
    
                        attach.on('data', (chunk) => {
                            output += chunk.toString();
                        });
    
                        container.wait((error, data) => {
                            if (error) {
                                reject(error);
                                return;
                            }
    
                            console.log('Container finished with exit code', data.StatusCode);
    
                            // Resolve the Promise with the output
                            resolve(output);
                        });
                    });
                });
            });
        });
    }
    
}

module.exports = DockerManager;
