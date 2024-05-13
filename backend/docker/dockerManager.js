const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

class DockerManager {
    constructor(config) {
        this.docker = new Docker();
        this.image = config.image || "image_name:latest";
    }

    /**
     * Creates a Docker volume with the specified name and size if it doesn't exist.
     * @param {string} volumeName - The name of the volume to create.
     * @param {int} size - The size of the volume in GB.
     * @returns {Promise<Object>} A promise that resolves with the created volume object if successful or with the existing volume object if it already exists, or rejects with an error if an error occurs.
     */
    createVolume(volumeName, size) {
        return new Promise((resolve, reject) => {
            // Check if the volume already exists
            this.docker.getVolume(volumeName).inspect((error, data) => {
                if (error && error.statusCode !== 404) {
                    // Reject the promise if an error occurred while checking for the volume
                    reject(error);
                    return;
                }
                if (data) {
                    console.log("Volume already exists");
                    // Resolve with the existing volume object if the volume already exists
                    resolve(data);
                } else {
                    // Create the volume if it doesn't exist
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
                }
            });
        });
    }


    runContainer(scriptName, path, content, volumeName) {
        return new Promise((resolve, reject) => {
            const containerOptions = {
                Image: this.image,
                Cmd: [`${scriptName}_tester.py`, `${scriptName}_suggested.py`, content],
                AttachStdout: true,
                AttachStderr: true,
                HostConfig:{
                    Binds:  [
                        `${process.cwd()}/${path}:/app/python_scripts`,
                        `${volumeName}:/app/exec`
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

                        // Remove the container after it's done
                        container.remove((error, data) => {
                            if (error) {
                                console.error('Error removing container:', error);
                            }
                        });
    
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
