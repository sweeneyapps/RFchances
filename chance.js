
var workers = [];
var sortedWorkers = [];
var working = [];
var jobs = [];
var yourChance;

function createWorker() {

    var newScore = Math.random() * 100;

    return {
        score: newScore,
        working: false,
        job: null,
        yourself: false
    }
}

function createJob() {

    var newStep = Math.floor(Math.random() * 20) + 1;
    return {
        steps: newStep
    }
}

function create50Jobs() {
    for (var i = 0; i < 50; i++) {
        jobs.push(createJob());
    }
}

function create100Workers() {
    for (var i = 0; i < 100; i++) {
        workers.push(createWorker());
    }
}

function addYourself() {
    var worker = createWorker();
    worker.yourself = true;
    workers.push(worker);
    sortWorkers();
    render();
}

function findYourRating() {
    var index = sortedWorkers.findIndex(function(el) {
        return el.yourself;
    });

    if (index == -1) {
        return "You are Working!";
    }

    var yourRating = sortedWorkers.length - index;
    return `Will be assigned at next ${yourRating} job(s)`;
}

function addWorker() {
    workers.push(createWorker());
    sortWorkers();
    render();
}

function addJob() {
    jobs.push(createJob());
    render();
}

function sortWorkers() {
    sortedWorkers = workers.sort(function(a,b) {
        return a.score - b.score;
    });
}

function assignJob() {
    if ( jobs.length == 0) return; // no job
    if ( sortedWorkers.length == 0) return; // no more worker
    var worker = sortedWorkers.pop();
    worker.working = true;
    worker.job = jobs.pop();
    working.push(worker);
    render();
}

function assignAllJobs() {
    var howmanyJobs = jobs.length;
    for (var i = 0; i < howmanyJobs; i++) {
        assignJob();
    }
}

function reset() {
    workers = [];
    sortedWorkers = [];
    working = [];
    jobs = [];

    addYourself();  // You are always online
    render();
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

function renderData() {

    var data = getData();
    return `Job Available: ${data.jobs} | Worker Online: ${data.workers} | Working: ${data.working}`
}

function renderStat() {
    var data = getData();
    var chance = findYourRating();
    var percent = Math.floor((data.working / data.workers) * 100);
    if (isNaN(percent)) {
        percent = 0;
    }
    return `Your Chance: ${chance} | Percent of Workers working: ${percent}%`;
}

function render() {
       document.getElementById('jobinfo').innerHTML = renderData();
       document.getElementById('stat').innerHTML = renderStat();
}

function init() {
    addJob();
    addJob();
    addJob();
    addJob();
    addJob(); // 5 jobs ready
    addWorker();
    addWorker();
    addWorker(); // 3 workers ready

    addYourself(); // you just added yourself to the workforce.
    render();
}


document.addEventListener("DOMContentLoaded", init); 