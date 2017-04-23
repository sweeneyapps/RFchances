
var sortedWorkers = [];
var working = [];
var jobs = [];
var genID = 0;
var timer;
var running = false;
var jobPerSec = 10;
var maxStep = 30;
var allJobCount = {};

function createWorker() {

    var newScore = Math.random() * 100;

    return {
        id: genID++,
        score: newScore,
        job: null,
        jobCount: 0,
        standing: null,
        working: false,
        yourself: false
    }
}

function createJob() {
    var newStep = Math.floor(Math.random() * maxStep) + 1;
    return {
        step: newStep
    }
}

function addYourself() {
    var worker = createWorker();
    worker.yourself = true;
    sortedWorkers.push(worker);
    sortWorkers();
    render();
}

function addWorker() {
    sortedWorkers.push(createWorker());
    sortWorkers();
    render();
}

function add100Workers() {
    for (var i = 0; i < 100; i++) {
        sortedWorkers.push(createWorker());
    }
    sortWorkers();
    render();
}

function removeWorker() {
    var index = Math.floor(Math.random() * sortedWorkers.length);

    if (sortedWorkers[index].yourself) {
        if (sortedWorkers.length == 1) {
            return;
        }
        removeWorker(); // that's you! don't remove urself!
    } else {
        sortedWorkers.splice(index, 1);
        render();
    }
}

function addJob() {
    jobs.push(createJob());
    render();
}

function add100Jobs() {
    for(var i = 0; i < 100; i++){
        jobs.push(createJob());
    }
    render();
}

function sortWorkers() {
    sortedWorkers = sortedWorkers.sort(function(a,b) {
        return a.score - b.score;
    });
}

function assignJob() {
    if ( jobs.length == 0) return; // no job
    if ( sortedWorkers.length == 0) return; // no more worker
    var worker = sortedWorkers.pop();
    worker.job = jobs.pop();
    worker.jobCount += 1;
    worker.working = true;
    working.push(worker);
    render();
}

function assignAllJobs() {
    var howmanyJobs = jobs.length;
    for (var i = 0; i < howmanyJobs; i++) {
        assignJob();
    }
}

function autoAssignJob(num) {
    for(var i = 0; i < num; i++) {
        jobs.push(createJob());
    }
    assignAllJobs();
}

function reset() {
    sortedWorkers = [];
    working = [];
    jobs = [];

    addYourself();  // You are always online
    render();
}

function updateJobPerSec(event){
    jobPerSec = event.target.value;
}

function getData() {
    var jobsData = jobs.length;
    var workersData = sortedWorkers.length;
    var workingData = working.length; 
    return {
        jobs: jobsData,
        workers: workersData + workingData,
        working: workingData,
    }
}

function findYourSelf() {
    var index = sortedWorkers.findIndex(function(worker) {
        return worker.yourself;
    });

    if (index == -1) {
        return working.find(function(worker){
            return worker.yourself;
        });
    }

    var worker = sortedWorkers[index];
    worker.standing = sortedWorkers.length - index;
    return worker;
}

function renderYourJobCount() {
    var worker = findYourSelf();
    var jobCount = worker.jobCount;

    return `Your Job Count: ${jobCount}`;
}

function renderYourChance() {
    var worker = findYourSelf();

    if (worker.working) {
        return "You are Working!";
    }

    var yourRating = worker.standing;
    return `You will be assigned at next ${yourRating} job(s)`;
}

function renderData() {
    var data = getData();
    return `Job Available: ${data.jobs} | Worker Online: ${data.workers} | Working: ${data.working}`
}

function renderStat() {
    var data = getData();
    var chance = renderYourChance();
    var percent = Math.floor((data.working / data.workers) * 100);
    if (isNaN(percent)) {
        percent = 0;
    }
    return `Your Chance: ${chance} | Percent of Workers working: ${percent}%`;
}

function renderOverall() {
    var allJobCount = {};
    var html = "";

    var allWorkers = sortedWorkers.concat(working);
    for (var i = 0; i < allWorkers.length; i++) {
        var worker = allWorkers[i];
        var jobCount = worker.jobCount;
        if (allJobCount[jobCount] == null) {
            allJobCount[jobCount] = 0;
        }
        
        allJobCount[jobCount] += 1;
    }

    for (key in allJobCount) {
        var count = allJobCount[key];
        html += `<div style="text-align: right; width:30px; display:inline-block">${key}:</div><div class="graphBar" style="display: inline-block; color:blue; background-color:green; width:${count}px;">&nbsp;</div><br/>`;
    }


    return html;
}

function render() {
    document.getElementById('jobinfo').innerHTML = renderData();
    document.getElementById('stat').innerHTML = renderStat();
    document.getElementById('jobCount').innerHTML = renderYourJobCount();
    document.getElementById('overall').innerHTML = renderOverall();
}

function loop() {

    autoAssignJob(jobPerSec);

    for (var i = 0; i < working.length; i++) {
        var worker = working[i];
        var step = --worker.job.step;
        if (step == 0) {
            working.splice(i, 1);
            worker.working = false;
            sortedWorkers.push(worker);
        }
    }
    sortWorkers();
    render();
    console.log('loop');
}

function start() {
    if (running) return;
    timer = setInterval(loop, 1000);
    running = true;
}

function stop() {
    clearInterval(timer);
    running = false;
}

function init() {
    addYourself(); // you just added yourself to the workforce.
    add100Workers();
}

document.addEventListener("DOMContentLoaded", init); 