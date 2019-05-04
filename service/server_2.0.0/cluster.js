const express = require('express');
const app = express();
const PORT = 4000;
const cluster = require('service/server_2.0.0/cluster');
// const numCPU = require('os').cpus().length;

const os = require('os');
const childProcess = require('child_process');
function exec (command) {
    return childProcess.execSync(command, {encoding: 'utf8'});
}
let amount;
const platform = os.platform();
if (platform === 'linux') {
    const output = exec('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l');
    amount = parseInt(output.trim(), 10)
} else if (platform === 'darwin') {
    const output = exec('sysctl -n hw.physicalcpu_max');
    amount = parseInt(output.trim(), 10)
} else if (platform === 'windows') {
    const output = exec('WMIC CPU Get NumberOfCores');
    amount = output.split(os.EOL)
        .map(function parse (line) { return parseInt(line) })
        .filter(function numbers (value) { return !isNaN(value) })
        .reduce(function add (sum, number) { return sum + number }, 0)
} else {
    const cores = os.cpus().filter(function (cpu, index) {
        const hasHyperthreading = cpu.model.includes('Intel');
        const isOdd = index % 2 === 1;
        return !hasHyperthreading || isOdd
    });
    amount = cores.length
}
const numCPU =amount;



if (cluster.isMaster) {
    console.log(`Master ${process.id} is running`);
    for (let i = 0; i < numCPU; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    });
    //
    // let numReqs = 0;
    // setInterval(() => {
    //     console.log(`numReqs = ${numReqs}`);
    // }, 1000);
    //
    // // 计算请求数目
    // function messageHandler(msg) {
    //     if (msg.cmd && msg.cmd === 'notifyRequest') {
    //         numReqs += 1;
    //     }
    // }

    // for (const id in cluster.workers) {
    //     cluster.workers[id].on('message', messageHandler);
    // }



} else {
    console.log(`Woker ${process.pid} started`);

    const iterations = 1000000000;
    console.time('Function #' + process.pid);
    for (let i = 0; i < iterations; i++) {
        let test = 0;
    }
    console.timeEnd('Function #' + process.pid);



    app.get('/cluster', (req, res) => {
        let worker = cluster.worker.id;
        res.send(`Running on worker with id = ${worker}`);
        // process.send({ cmd: 'notifyRequest' });
    });
    app.listen(PORT, () => {
        console.log('Your node is running on port 3000');
    });
}