var axios = require('axios');
var stringify = require('json-stringify-safe');
var express = require('express');
var app = express();
var util = require('util');
var fs = require('fs');
var port = 3005;

async function kubernetesStatus(){
    return axios.get('http://10.136.57.21:8080/api/v1/nodes')
}

async function jenkinsStatus(){
    return axios.get('http://192.168.30.72:8080/api/json?tree=jobs[name,url]')
}

async function sonarStatus(){
    return axios.get('http://192.168.30.72:9000/api/components/search_projects?')
}

async function docker_private_registry_Status(){
    return axios.get('http://admin:admin@192.168.30.72:5000/v2/_catalog')
}

app.get('/kubernetesStatus', async (req,res) => {
    var kuberesult=[];
    try {
        const node = await kubernetesStatus();
        for(i in node.data.items){
            for(j in node.data.items[i]){
                for(k in node.data.items[i][j]){
                    if(k==='name'){
                        console.log(node.data.items[i][j][k])
                    }
                }
            }
        }
    res.status(200).send(kuberesult)
    }
    catch(e){
        console.log(e.stack)
        res.status(404).send({error: 'Kubernetes cluster is not running'})
    }
})

app.get('/jenkinsStatus', async (req,res) => {
    try {
        var allJenkinsProjectName=[];
        var node = await jenkinsStatus();
        for(key in node.data.jobs){
            for(key2 in node.data.jobs[key]){
                if(key2==='name'){
                    allJenkinsProjectName.push(node.data.jobs[key][key2])
                }
            }
        }
    res.status(200).send(allJenkinsProjectName)
    }
    catch(e){
      console.log(e.stack)
      res.status(404).send({error: 'Jenkins is not running'})
    }
})

app.get('/sonarStatus', async (req,res) => {
    try {
        var allSonarProjectName=[]
        const sonar = await sonarStatus();
        for(key in sonar.data.components){
            for(key2 in sonar.data.components[key]){
                if(key2==='name'){
                    allSonarProjectName.push(sonar.data.components[key][key2])
                }
            }
        }
    res.status(200).send(allSonarProjectName)
    }
    catch(e){
        console.log(e.stack)
        res.status(404).send({error: 'Sonarqube is not running'})
    }
})

app.get('/docker_private_registry_Status', async (req,res) => {
    try {
      const result = await docker_private_registry_Status();
      res.status(200).send(result.data)
    }
    catch(e){
      console.log(e.stack)
      res.status(404).send({error: 'Private Registry is not running'})
    }
})

module.exports = app;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))