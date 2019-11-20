export default function TestExtension(eventBus) {
        console.log('test extension loaded!');
}

TestExtension.$inject = [
    'eventBus'
];
