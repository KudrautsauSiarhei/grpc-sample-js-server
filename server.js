const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('proto/GreetingService.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const greetingPackage = grpcObject.com.example.grpc;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const greeting = (call, callback) => {
    const response = {
        greeting: `Hello from js server, ${call.request.name}`,
    };

    console.log(response);
    callback(null, response);
};

const greetings = async (call) => {
    for (let i = 0; i < 5; i++) {
        await delay(500);
        const response = {
            greeting: `Hello from js server, ${call.request.name} ${i}`,
        };
        console.log(response);
        call.write(response);
    }
    call.end();
};

const endlessGreetings = async (call) => {
    let i = 0;
    while (!call.cancelled) {
        i++;
        await delay(500);
        const response = {
            greeting: `Hello from js server, ${call.request.name} ${i}`,
        };
        console.log(response);
        call.write(response);
    }
    call.end();
};


const server = new grpc.Server();
server.bind('0.0.0.0:8081', grpc.ServerCredentials.createInsecure());

server.addService(greetingPackage.GreetingService.service, {
    greeting,
    greetings,
    endlessGreetings,
});
server.start();
