const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

class DockerManager {
    constructor(config) {
        this.docker = new Docker();
        this.image = config.image || "image_name";
    }


    buildImage() {
        return new Promise((resolve, reject) => {
            // Define build options
            const buildOptions = {
                context: __dirname, // Use current directory as context
                src: ['Dockerfile', 'loader.py'], // Include loader script and python scripts folder
            };

            // Build the Docker image
            this.docker.buildImage(buildOptions, { t: this.image }, (error, stream) => {
                if (error) {
                    console.error('Error building Docker image: ', error);
                    reject(error); // Reject the Promise if there's an error
                    return;
                }

                // Handle build output
                stream.setEncoding('utf8');
                stream.on('data', (chunk) => {
                    // console.log(chunk);
                });
                stream.on('end', () => {
                    console.log('Docker image build complete.');
                    resolve(); // Resolve the Promise when the build is complete
                });
            });
        });
    }

    /**
     * Creates a Docker volume with the specified name and size.
     * @param {string} volumeName - The name of the volume to create.
     * @param {int} size - The size of the volume in GB.
     * @returns {Promise<Object>} A promise that resolves with the created volume object if successful, or rejects with an error if an error occurs during volume creation.
     */
    createVolume(volumeName, size) {
        return new Promise((resolve, reject) => {
            const volumeOptions = {
                Name: volumeName,
                Driver: 'local',
                DriverOpts: {
                    'type': 'tmpfs',
                    'device': 'tmpfs',
                    'o': `size=${size}`
                }
            };
            this.docker.createVolume(volumeOptions, (error, volume) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                resolve(volume);
            });
        });
    }
    

    runContainer(scriptName, path, volumeName) {
        return new Promise((resolve, reject) => {
            const containerOptions = {
                Image: this.image,
                Cmd: [`${scriptName}`],
                AttachStdout: true,
                AttachStderr: true,
                HostConfig:{
                    Binds:  [
                        `${process.cwd()}/${path}:/app/python_scripts`,
                        `${volumeName}:/app`
                    ]
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
                            resolve({output: output, statusCode: data.StatusCode});
                        });
                    });
                });
            });
        });
    }
    
}

module.exports = DockerManager;
