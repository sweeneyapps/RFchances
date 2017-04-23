
var sortedWorkers = [];
var working = [];
var jobs = [];
var genID = 0;
var timer;
var running = false;
var jobPerSec = 10;
const MAX_STEP = 30;
const LOOP_MS = 1000;

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
    var newStep = Math.floor(Math.random() * MAX_STEP) + 1;
    return {
        step: newStep
    }
}

function addYourself() {
    var worker = createWorker();
    worker.yourself = true;
    sortedWorkers.push(worker);
    sortWorkers();
    renderYourTrustScore(worker.score);
}

function addWorker(num) {
    for (var i = 0; i < num; i++) {
        sortedWorkers.push(createWorker());
    }
    sortWorkers();
    render();
}

function removeWorker(num) {
    for (var i= 0; i < num; i++) {
        var index = Math.floor(Math.random() * sortedWorkers.length);

        if (sortedWorkers[index].yourself) {
            if (sortedWorkers.length == 1) {
                render();
                return;
            }
            i--;
            continue;
        } else {
            sortedWorkers.splice(index, 1);
        }
    }  
    render();
}

function sortWorkers() {
    sortedWorkers = sortedWorkers.sort(function(a,b) {
        return a.score - b.score;
    });
}

function assignJob() {
    if ( jobs.length == 0) return "done"; // no job
    if ( sortedWorkers.length == 0) return "done"; // no more worker
    var worker = sortedWorkers.pop();
    worker.job = jobs.pop();
    worker.jobCount += 1;
    worker.working = true;
    working.push(worker);
}

function assignAllJobs() {
    var howmanyJobs = jobs.length;
    for (var i = 0; i < howmanyJobs; i++) {
       if (assignJob() == "done") {
           return;
       }
    }
}

function autoAssignJob(num) {
    for(var i = 0; i < num; i++) {
        jobs.push(createJob());
    }
    assignAllJobs();
}

function clearAll() {
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
    var findSelf = function(item){
        return item.yourself;
    }

    var index = sortedWorkers.findIndex(findSelf);

    if (index == -1) {
        return working.find(findSelf);
    }

    var worker = sortedWorkers[index];
    worker.standing = sortedWorkers.length - index;
    return worker;
}

function renderYourTrustScore(score) {
    document.getElementById("rating").innerHTML = score;
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
    return `Your Chance: ${chance} <p> Percent of Workers working: ${percent}% </p>`;
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
        if (step < 1) {
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
    timer = setInterval(loop, LOOP_MS);
    running = true;
}

function stop() {
    clearInterval(timer);
    running = false;
}

function init() {
    addYourself(); // you just added yourself to the workforce.
    addWorker(100);
}

document.addEventListener("DOMContentLoaded", init); 