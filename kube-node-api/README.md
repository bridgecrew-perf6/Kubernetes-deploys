# Deploying a Node App to Google Cloud with Kubernetes

Read Docker-setup to build the image

## Kubernetes

### Google Cloud Platform (GCP)

Install the [Google Cloud SDK](https://cloud.google.com/sdk), run `gcloud init` to configure it, and then either pick an existing GCP project or create a new project to work with.

Set the project:

```sh
$ gcloud config set project <PROJECT_ID>
```

Install `kubectl`:

```sh
$ gcloud components install kubectl
```

### Kubernetes Cluster

Create a cluster on [Kubernetes Engine](https://console.cloud.google.com/kubernetes):

Can create in panel or programmtically

```sh
$ gcloud container clusters create node-cluster \
    --num-nodes=3 --zone europe-west1-b --machine-type g1-small
```

Connect the `kubectl` client to the cluster:

```sh
$ gcloud container clusters get-credentials node-cluster --zone europe-west1-b
```

### Docker

Build and push the image to the [Container Registry](https://cloud.google.com/container-registry/):

Can add your docker builds on google cloud. However, it is possible to pull ones from docker repo
```sh
$ gcloud auth configure-docker
$ docker build -t gcr.io/<PROJECT_ID>/server-cluster-ip-service:v0.0.1 .
$ docker push gcr.io/<PROJECT_ID>/server-cluster-ip-service:v0.0.1
```

### Secrets

Create the secret object:

```sh
$ kubectl apply -f ./kubernetes/secret.yaml
```

### Volume

Create a [Persistent Disk](https://cloud.google.com/persistent-disk/):

```sh
$ gcloud compute disks create pg-data-disk --size 5GB --zone europe-west1-b
```

Create the volume:

```sh
$ kubectl apply -f ./kubernetes/volume.yaml
```

Create the volume claim:

```sh
$ kubectl apply -f ./kubernetes/volume-claim.yaml
```

### Postgres Database

Create deployment:

```sh
$ kubectl create -f ./kubernetes/postgres-deployment.yaml
```

Create the service:

```sh
$ kubectl create -f ./kubernetes/postgres-service.yaml
```

Create the database:

```sh
$ kubectl get pods
$ kubectl exec <POD_NAME> --stdin --tty -- createdb -U sample todos
```

#### Node API backend

```sh
$ kubectl create -f ./kubernetes/node-deployment.yaml
```

Create the service:

```sh
$ kubectl create -f ./kubernetes/server-cluster-ip-service.yaml
```

Apply the migration and seed the database:

```sh
$ kubectl get pods
$ kubectl exec <POD_NAME> knex migrate:latest
$ kubectl exec <POD_NAME> knex seed:run
```

Grab the external IP:

```sh
$ kubectl get service node

NAME      TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
node      LoadBalancer   10.39.244.136   35.232.249.48   3000:30743/TCP   2m
```

Test it out:

1. [http://EXTERNAL_IP:3000](http://EXTERNAL_IP:3000)
1. [http://EXTERNAL_IP:3000/todos](http://EXTERNAL_IP:3000/todos)



#### Domain name HTTPS

You might need to install 

```sh
minikube addons enable ingress
```

Install cert dependency
```sh
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.0/cert-manager.yaml
```

Create the certificate
```sh
$ kubectl create -f ./kubernetes/certificate.yaml
```

Create the issuer
```sh
$ kubectl create -f ./kubernetes/issuer.yaml
```

Create ingress
```sh
$ kubectl create -f ./kubernetes/ingress-service.yaml
```

Create nginx svc 
```sh
$ kubectl create -f ./kubernetes/nginx-svc.yaml
```

#### Remove

Remove the resources once done:

```sh
$ kubectl delete -f ./kubernetes/certificate.yaml
$ kubectl delete -f ./kubernetes/ingress-service.yaml
$ kubectl delete -f ./kubernetes/issurer.yaml
$ kubectl delete -f ./kubernetes/nginx-svc.yaml

$ kubectl delete -f ./kubernetes/server-cluster-ip-service.yaml
$ kubectl delete -f ./kubernetes/node-deployment.yaml

$ kubectl delete -f ./kubernetes/secret.yaml

$ kubectl delete -f ./kubernetes/volume.yaml
$ kubectl delete -f ./kubernetes/volume-claim.yaml

$ kubectl delete -f ./kubernetes/postgres-deployment.yaml
$ kubectl delete -f ./kubernetes/postgres-service.yaml

$ gcloud container clusters delete node-cluster --zone europe-west1-b
$ gcloud compute disks delete pg-data-disk --zone europe-west1-b
$ gcloud container images delete gcr.io/<PROJECT_ID>/server-cluster-ip-service:v0.0.1
```
