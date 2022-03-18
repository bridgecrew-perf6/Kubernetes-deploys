To get an overview of a particular namespaces resources or pods, we can run the following:

kubectl get pods --namespace <INSERT_NAMESPACE_HERE>
For example, we may wish to investigate the staging namespace:

kubectl get pods --namespace staging
To get an interactive running shell to a container, we can run the following:

kubectl exec --stdin --tty <POD_NAME> -- /bin/bash
For example, we may wish to connect to the db shell for our particular db type using django:

kubectl exec --stdin --tty <POD_NAME> -- python manage.py dbshell