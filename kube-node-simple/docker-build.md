# Build and pushy docker image for kubernetes

Start with building the custom image for kubernetes
Example:
` docker build -t useraccount/imagename .

Build of this project

docker build -t danpjohnson/nodeapp

Next we need to login to push it to docker

docker login

username: 
password

Login successful

docker push useraccount/imagename:latest

To check its successful
https://hub.docker.com/repository/docker/useraccount/imagename
