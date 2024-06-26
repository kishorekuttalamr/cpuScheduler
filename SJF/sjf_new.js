let row = 2;
let table = document.getElementById("scheduling-table");

function addRow() {
    let arrTime = document.getElementById("arrival-time-sjf").value;
    let burTime = document.getElementById("burst-time-sjf").value;
    if (arrTime == "" || burTime == "") {
        alert("Please enter all the fields");
    }
    else if (Number(arrTime) < 0 || Number(burTime) < 0) {
        alert("Please only enter positive integers");
        return;
    }
    else if (Math.floor(Number(arrTime)) != Number(arrTime) || Math.floor(Number(burTime)) != Number(burTime)) {
        alert("Please only enter positive integers");
        return;
    }
    else {

        let dynRow = table.insertRow(row);

        let C1 = dynRow.insertCell(0);
        let C2 = dynRow.insertCell(1);
        let C3 = dynRow.insertCell(2);
        let C4 = dynRow.insertCell(3);
        let C5 = dynRow.insertCell(4);
        let C6 = dynRow.insertCell(5);
        let C7 = dynRow.insertCell(6);

        C1.innerHTML = `P${row - 1}`;
        C2.innerHTML = arrTime;
        C3.innerHTML = burTime;
        C4.innerHTML = "";
        C5.innerHTML = "";
        C6.innerHTML = "";
        C7.innerHTML = "";

        row += 1;

        document.getElementById("burst-time-sjf").value = "";
        document.getElementById("arrival-time-sjf").value = "";
    }
}

function delRow() {
    if (row == 2) {
        alert("Cannot delete anymore rows");
    }
    else {
        table.deleteRow(row - 1);
        row -= 1;
    }
}

function getArrivalTimeArray() {

    let AT = []

    for (let i = 2; i < row; i++) {

        AT.push(Number(table.rows[i].cells[1].innerHTML));
    }

    return AT;
}

function getBurstTimeArray() {

    let BT = []

    for (let i = 2; i < row; i++) {

        BT.push(Number(table.rows[i].cells[2].innerHTML));
    }

    return BT;
}

function display(n, WT, TAT, CT, RT, proNo) {

    for (let i = 0; i < n; i++) {

        let rowNo = proNo[i] + 1;

        table.rows[rowNo].cells[3].innerHTML = CT[i];
        table.rows[rowNo].cells[4].innerHTML = TAT[i];
        table.rows[rowNo].cells[5].innerHTML = RT[i];
        table.rows[rowNo].cells[6].innerHTML = WT[i];

    }
}

function calculateAverages(n, CT, TAT, WT, RT) {

    let avgCT = 0, avgTAT = 0, avgRT = 0, avgWT = 0;

    avgCT = CT / n;
    avgTAT = TAT / n;
    avgRT = RT / n;
    avgWT = WT / n;

    console.log('hi2');
    document.getElementById("avg-comp-time-sjf").textContent = avgCT.toPrecision(3);
    document.getElementById("avg-turn-time-sjf").textContent = avgTAT.toPrecision(3);
    document.getElementById("avg-resp-time-sjf").textContent = avgRT.toPrecision(3);
    document.getElementById("avg-wt-time-sjf").textContent = avgWT.toPrecision(3);
}

//let psrow = 1;
let pstable = document.getElementById("process-schedule");
let psDynRow1 = pstable.insertRow(1);
let psDynRow2 = pstable.insertRow(2);
let cellCount = 0;
let prevCompletionTime=0;
let psCell1;
let psCell2;

function createProcessSchedule(index, CT, AT){
    
    //let psCell1 = psDynRow1.insertCell(cellCount);
    //let psCell2 = psDynRow2.insertCell(cellCount);

    let PNO = index + 1;

    if(prevCompletionTime < AT){

        psCell1 = psDynRow1.insertCell(cellCount);
        psCell2 = psDynRow2.insertCell(cellCount);

        psCell1.innerHTML = `IDLE`;
        psCell2.innerHTML = AT;

        cellCount += 1;

        psCell1 = psDynRow1.insertCell(cellCount);
        psCell2 = psDynRow2.insertCell(cellCount);
        
        psCell1.innerHTML = `P${PNO}`;
        psCell2.innerHTML = CT;

        prevCompletionTime = CT;
        cellCount += 1;
        
    }else{

        psCell1 = psDynRow1.insertCell(cellCount);
        psCell2 = psDynRow2.insertCell(cellCount);
        
        psCell1.innerHTML = `P${PNO}`;
        psCell2.innerHTML = CT;

        prevCompletionTime = CT;
        cellCount += 1;
    }

    // let psCell1 = psDynRow1.insertCell(cellCount);
    // let psCell2 = psDynRow2.insertCell(cellCount);

    // psCell1.innerHTML = `P${PNO}`;
    // psCell2.innerHTML = CT;

    //cellCount += 1;
}

function executeSJF() {

    //SJF Algorithm

    console.log('Hi');
    let NoOfProcess = row - 2;
    let arrivalTime = getArrivalTimeArray();
    let burstTime = getBurstTimeArray();

    let avg_turnaround_time, avg_waiting_time, avg_response_time, cpu_utilisation, total_turnaround_time = 0, total_waiting_time = 0, total_response_time = 0, total_idle_time = 0, total_completion_time = 0;
    
    let is_completed = new Array (NoOfProcess);
    let start_time = new Array (NoOfProcess);
    let completion_time = new Array (NoOfProcess);
    let turnaround_time = new Array (NoOfProcess);
    let waiting_time = new Array (NoOfProcess);
    let response_time = new Array (NoOfProcess);

    for(let i = 0; i < NoOfProcess; i++){

        is_completed[i] = 0;
    }

    let processNo = new Array (NoOfProcess);

    for(i = 0; i < NoOfProcess; i++){

        processNo[i] = i+1;
    }

    let current_time = 0, completed = 0, prev = 0;
    
    while(completed != NoOfProcess) {
        let idx = -1, mn = 10000000;//Infinity
        
        for(let i = 0; i < NoOfProcess; i++) {
            
            if(arrivalTime[i] <= current_time && is_completed[i] == 0) {
                
                if(burstTime[i] < mn) {
                    
                    mn = burstTime[i];
                    idx = i;
                }

                if(burstTime[i] == mn) {
                    
                    if(arrivalTime[i] < arrivalTime[idx]) {
                        mn = burstTime[i];
                        idx = i;
                    }
                }
            }
        }

        if(idx != -1) {
            
            start_time[idx] = current_time;
            completion_time[idx] = start_time[idx] + burstTime[idx];
            turnaround_time[idx] = completion_time[idx] - arrivalTime[idx];
            waiting_time[idx] = turnaround_time[idx] - burstTime[idx];
            response_time[idx] = start_time[idx] - arrivalTime[idx];
            
            total_completion_time += completion_time[idx];
            total_turnaround_time += turnaround_time[idx];
            total_waiting_time += waiting_time[idx];
            total_response_time += response_time[idx];
            //total_idle_time += start_time[idx] - prev;

            is_completed[idx] = 1;
            completed++;
            current_time = completion_time[idx];
            prev = current_time;

            createProcessSchedule(idx, completion_time[idx], arrivalTime[idx]);
        }
        else {
            current_time++;
        }
        
    }

    display(NoOfProcess, waiting_time, turnaround_time, completion_time, response_time, processNo);
    calculateAverages(NoOfProcess, total_completion_time, total_turnaround_time, total_waiting_time, total_response_time);
}
