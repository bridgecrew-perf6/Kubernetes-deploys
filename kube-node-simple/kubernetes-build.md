# Kubernetes build

## prerequisites
- Built a custom docker image for Kubernetes

Create a deployment.yaml that links to custom image  `image: danpjohnson/nodeapp:latest`

Create a service.yaml
- Entry point for the app with a load balancer


## Local deployment
- [install minikube requirement](https://minikube.sigs.k8s.io/docs/start/)

### First check minikube is up and running

` minikube status`
if the response is 
`
	type: Control Plane
	host: Stopped
	kubelet: Stopped
	apiserver: Stopped
	kubeconfig: Stopped
`
You will likely encounter an error: The connection to the server 127.0.0.1:56914 was refused - did you specify the right host or port?

To solve this type `minikube start` now you should see

`type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured`

### Second check make sure we have a clean environment

` kubectl get pods` you should see 'No resources found in default namespace.'

` kubectl get deployments `
you should see 'No resources found in default namespace.'

`kubectl get svc` you should see something similar to this
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   2m18s


### run the yaml files
run the following command 
`kubectl apply -f deployment.yaml`

then check that the deployment is up and running.

`kubectl get deployment` it can take some to be created. Once created

`kubectl apply -f service.yaml` it can take some to be created. Once created

Check everything is up and running

`kubectl get svc` you should see something like
NAME         TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP      10.96.0.1        <none>        443/TCP   8m42s


### open up service and run it in the terminal
`minikube service nodeapp-service` it should now open and run in the browser. If it doesnt then copy the url from the terminal table

🏃  Starting tunnel for service nodeapp-service.
|-----------|-----------------|-------------|------------------------|
| NAMESPACE |      NAME       | TARGET PORT |          URL           |
|-----------|-----------------|-------------|------------------------|
| default   | nodeapp-service |             | http://127.0.0.1:58298 |
|-----------|-----------------|-------------|------------------------|