export default function TestExtension2(eventBus) {
        console.log('test extension 2 loaded!');
}

TestExtension2.$inject = [
    'eventBus'
];
