var axios = require('axios');
var stringify = require('json-stringify-safe');
var express = require('express');
var app = express();
var util = require('util');
var port = 3005;
var moment=require('moment')
async function jenkinsAllInOne(){
    return axios.get('http://192.168.30.72:8080/api/json?tree=jobs[color,name,url,healthReport[*],lastBuild[description,id,url,timestamp,result,bilding,duration],lastSuccessfulBuild[description,id,url,timestamp,result,bilding,duration],lastFailedBuild[description,id,url,timestamp,result,bilding,duration]]')
  }

async function sonarAllInOne(){
    return axios.get('http://192.168.30.72:9000/api/components/search_projects?')
}
async function jenkinsProjectSpecific(job){
    return axios.get(`http://192.168.30.72:8080/job/${job}/api/json`)
}
async function sonarProjectSpecific(job){
    return axios.get(`http://192.168.30.72:9000/api/measures/search?projectKeys=${job}&metricKeys=bugs,reliability_rating,vulnerabilities,security_rating,code_smells,sqale_rating,duplicated_lines_density,coverage`)
}
async function gitlabAllProjects(){
    return axios.get('http://192.168.30.72:9095/api/v4/projects/?private_token=7RQ3oWEYszLVB1xyaUJk')
}
async function gitlabProjectSpecific(id){
    return axios.get(`http://192.168.30.72:9095/api/v4/projects/${id}?private_token=7RQ3oWEYszLVB1xyaUJk`)
}
async function jenkinsLastBuild(job){
    return axios.get(`http://192.168.30.72:8080/job/${job}/lastBuild/api/json?tree=result,description,id,url,timestamp,result,bilding,duration`)
}
var gitmap =[]
app.get('/jenkinsAllInOne', async (req,res) => {
    try {
        var allJenkinsProjectName=[]
        var allSonarProjectName=[]
        var allGitlabProjectName=[]
        var job={}
        var sonar={}
        var t1=[]
        var main={}
        var arr=[]
        var t2=[]
        var list = await jenkinsAllInOne();
        for(key in list.data.jobs){
            for(key2 in list.data.jobs[key]){
                if(key2==='name'){
                    allJenkinsProjectName.push(list.data.jobs[key][key2])
                }
            }
        }
        var sonar = await sonarAllInOne();
        for(key in sonar.data.components){
            for(key2 in sonar.data.components[key]){
                if(key2==='name'){
                    allSonarProjectName.push(sonar.data.components[key][key2])
                }
            }
        }
        var gitlab = await gitlabAllProjects();
        for (var i = 0; i < list.data.length; i++) {
          var sample={}
          sample['id']=list.data[i].id;
          sample['name']=list.data[i].name;
          sample['created_at']=list.data[i].created_at;
          sample['last_activity']=list.data[i].last_activity_at;
          sample['visibility']=list.data[i].visibility;
          sample['ssh_url_to_repo']=list.data[i].ssh_url_to_repo;
          sample['http_url_to_repo']=list.data[i].http_url_to_repo;
          arr.push(sample)
        }
        for(key in gitlab.data){
            for(key2 in gitlab.data[key]){
                if(key2==='name'){
                    allGitlabProjectName.push(gitlab.data[key][key2])
                }
                if(key2==='id'){
                    gitmap.push(gitlab.data[key][key2])
                }
            }
        }
        for(key in allJenkinsProjectName){
            for(key2 in allSonarProjectName){
                for(key3 in allGitlabProjectName){
                    if(allJenkinsProjectName[key]===allSonarProjectName[key2] && allJenkinsProjectName[key]===allGitlabProjectName[key3] ){
                        var temp=[]
                        var l={}
                        try {
                            job = await jenkinsProjectSpecific(allJenkinsProjectName[key])
                            var sub={}
                            var sub1={}
                            var s1={}
                            for(i in job.data){
                                if(i==='name'){
                                    sub['name']=job.data[i];
                                }
                                if(i==='url'){
                                    sub['url']=job.data[i];
                                }
                                if(i==='color'){
                                    sub['color']=job.data[i];
                                }
                                if(i==='healthReport'){
                                    sub['healthRport']=job.data[i];
                                }
                                try { 
                                    s1 = await jenkinsLastBuild(allJenkinsProjectName[key])
                                }
                                catch(e){
                                    console.log(e.stack)
                                    res.status(500).send({error: e.message})
                                }
                                var lastBuild={}
                                if(i==='lastBuild'){
                                    for(j in job.data.lastBuild){
                                        if(j==='number'){
                                            lastBuild['number']=job.data[i][j]
                                        }
                                        if(j==='url'){
                                            lastBuild['url']=job.data[i][j]
                                        }
                                    }
                                sub['lastBuild']=s1.data
                                }
                                console.log(start)
                                var lastCompletedBuild={}
                                if(i==='lastCompletedBuild'){
                                    for(j in job.data[i]){
                                        if(j==='number'){
                                            lastCompletedBuild['number']=job.data[i][j]
                                        }
                                        if(j==='url'){
                                            lastCompletedBuild['url']=job.data[i][j]
                                        }
                                    }
                                    sub['lastCompletedBuild']=lastCompletedBuild;
                                }
                                var lastFailedBuild={}
                                if(i==='lastFailedBuild'){
                                    for(j in job.data[i]){
                                        if(j==='number'){
                                            lastFailedBuild['number']=job.data[i][j]
                                        }
                                        if(j==='url'){
                                            lastFailedBuild['url']=job.data[i][j]
                                        }
                                    }
                                    sub['lastFailedBuild']=lastFailedBuild;
                                }
                                var lastStableBuild={}
                                if(i==='lastStableBuild'){
                                    for(j in job.data[i]){
                                        if(j==='number'){
                                            lastStableBuild['number']=job.data[i][j]
                                        }
                                        if(j==='url'){
                                            lastStableBuild['url']=job.data[i][j]
                                        }
                                    }
                                    sub['lastStableBuild']=lastStableBuild;
                                }
                                var lastSuccessfulBuild={}
                                if(i==='lastSuccessfulBuild'){
                                    for(j in job.data[i]){
                                        if(j==='number'){
                                            lastSuccessfulBuild['number']=job.data[i][j]
                                        }
                                        if(j==='url'){
                                            lastSuccessfulBuild['url']=job.data[i][j]
                                        }
                                    }
                                    sub['lastSuccessfulBuild']=lastSuccessfulBuild;
                                }
                            }
                            sub1['jenkins']=sub;
                            temp.push(sub1);
                        }
                        catch(e){
                            console.log(e.stack)
                            res.status(500).send({error: e.message})
                        }
                        try {
                            sonar = await sonarProjectSpecific(allSonarProjectName[key2])
                            var ramp=[];
                            var sub1={}
                            for(i in sonar.data.measures){
                                ramp.push(sonar.data.measures[i])
                            }
                            var sub2={}
                            for(i in ramp){
                                var metric = ramp[i].metric;
                                var bugs = ramp[i].value;
                                sub2[metric]=bugs
                            }
                            sub1['sonar']=sub2
                            temp.push(sub1)     
                        }
                        catch(e){
                            console.log(e.stack)
                            res.status(500).send({error: e.message})
                        }
                        try {
                            var sub1={}
                            var ramp2=[];
                            var sample={}
                            var git1 = await gitlabProjectSpecific(gitmap[key3]);
                            for (i in git1.data) {
                                if(i==='id'){
                                    sample['id']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                if(i==='name'){
                                    sample['name']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                if(i==='created_at'){
                                    sample['created_at']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                if(i==='last_activity'){
                                    sample['last_activity']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                if(i==='visibility'){
                                    sample['visibility']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                if(i==='ssh_url_to_repo'){
                                    sample['ssh_url_to_repo']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                if(i==='http_url_to_repo'){
                                    sample['http_url_to_repo']=git1.data[i];
                                    ramp2.push(git1.data[i]);
                                }
                                sub1['gitlab']=sample
                            }
                            temp.push(sub1)
                            //l[allJenkinsProjectName[key]]=temp
                        }
                        catch(e){
                            console.log(e.stack)
                            res.status(500).send({error: e.message})
                        }
                        t1.push(temp)
                       // t1.push(t2)
                       // l[allJenkinsProjectName[key]]=t1
                    }
                    else{
                        //console.log("1", allJenkinsProjectName[key],"2",allSonarProjectName[key2],"3",allGitlabProjectName[key3])
                    }
                }
            }
        }
        //main1.push(main)
        //t2.push(t1)
       // main['data']=t1
        res.send(t1)
        }
        catch(e){
            console.log(e.stack)
            res.status(500).send({error: e.message})
        }
    })
    var date = new Date(1550581186068);
    console.log(date.toString())
    var ms = date.getMilliseconds()
    ms = ms+9352
    var d1 = date.setMilliseconds(ms);
    var last = new Date(d1)
    console.log(last.toString())
module.exports = app;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))